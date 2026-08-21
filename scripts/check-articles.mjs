#!/usr/bin/env node
/**
 * 文章上线前「全面体检」脚本
 *
 * 用途：在每篇文章发布/上线前，从【文字】与【格式排版】两个维度做一次全面检查，
 *       提前暴露常见问题，避免上线后出现排版错乱、标点混用、参考文献不换行等缺陷。
 *
 * 用法：
 *   node scripts/check-articles.mjs                 # 检查全部已发布文章（中英文）
 *   node scripts/check-articles.mjs path/to/file.md # 只检查指定文件（可传多个）
 *   node scripts/check-articles.mjs --strict        # 严格模式：存在任意 warning 也返回非 0
 *
 * 退出码：
 *   0  = 全部通过（仅提示级信息不算失败）
 *   1  = 存在 error 级问题（须修复）
 *   2  = 存在 warning 级问题且开启了 --strict
 *
 * 注意：本脚本只做静态文本检查，不替代 `npm run build`（构建/渲染层面的验证仍需执行）。
 *       体检维度与协作规范见 AGENT_OPS.md §「文章上线前全面体检」。
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const ARTICLES_DIR = join(REPO_ROOT, "src/content/articles");
const ARTICLES_EN_DIR = join(REPO_ROOT, "src/content/articles-en");
const PUBLIC_DIR = join(REPO_ROOT, "public");
const WORDLIST_PATH = join(__dirname, "check-wordlist.json");

// ---------------------------------------------------------------------------
// 常量与配置
// ---------------------------------------------------------------------------
const VALID_SECTIONS = ["insights", "ai", "tips", "books"];

/** 常见中英文混排：中文与 ASCII 之间应保留一个空格 */
const CJK = "\\u4e00-\\u9fff\\u3400-\\u4dbf\\uf900-\\ufaff";
const FULLWIDTH_PUNC = "\\uff00-\\uffef";
// 仅字母（不含数字）：中文排版规范中，中文与数字之间可不加空格，但中文与字母单词之间建议加空格
const ASCII_LETTER = "A-Za-z";

// ---------------------------------------------------------------------------
// 字词库（数据源：scripts/check-wordlist.json）
// ---------------------------------------------------------------------------
// 当前字词库如何获取：读取脚本同目录下的 check-wordlist.json 数据文件（唯一数据源），
// 不再硬编码在脚本里。要扩充错别字 / AI 味词 / 可读性阈值，只需编辑该 JSON 文件即可，
// 无需改动脚本逻辑。
let WORDLIST = { mistakes: [], aiCliches: [], readability: {} };
try {
  WORDLIST = JSON.parse(readFileSync(WORDLIST_PATH, "utf8"));
} catch (e) {
  console.error(`⚠️  无法读取字词库 ${WORDLIST_PATH}：${e.message}`);
  console.error("将使用内置最小词库继续，但建议检查该文件。");
}

// 兼容处理：把「错误写法」转成含正则的检查项
const COMMON_MISTAKES = (WORDLIST.mistakes || []).map(({ wrong, fix }) => ({
  re: new RegExp(wrong, "g"),
  word: wrong,
  fix: fix || "",
}));

/** AI 味 / 套话高频词（仅提示，供人工判断是否去除 AI 腔） */
const AI_CLICHES = WORDLIST.aiCliches || [];

/** 可读性评估阈值（来自 wordlist.readability） */
const READABILITY = {
  maxParagraphZhChars: (WORDLIST.readability && WORDLIST.readability.maxParagraphZhChars) || 400,
  minArticleZhChars: (WORDLIST.readability && WORDLIST.readability.minArticleZhChars) || 200,
  readingSpeedZh: (WORDLIST.readability && WORDLIST.readability.readingSpeedZh) || 400,
  readingSpeedEn: (WORDLIST.readability && WORDLIST.readability.readingSpeedEn) || 200,
};

// ---------------------------------------------------------------------------
// 工具函数
// ---------------------------------------------------------------------------
let errors = [];
let warnings = [];
let infos = [];

function err(msg, file) {
  errors.push({ file, msg });
}
function warn(msg, file) {
  warnings.push({ file, msg });
}
function info(msg, file) {
  infos.push({ file, msg });
}

function readFile(p) {
  try {
    return readFileSync(p, "utf8");
  } catch (e) {
    return null;
  }
}

/** 解析 frontmatter（YAML 前块），返回 { data, body, raw, hasFrontmatter } */
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: null, body: text, raw: text, hasFrontmatter: false };
  const dataRaw = m[1];
  const body = text.slice(m[0].length);
  const data = {};
  // 简易 YAML 解析：仅处理本仓库用到的标量 / 数组键值
  for (const line of dataRaw.split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1].trim();
    let val = kv[2].trim();
    if (val === "") continue;
    // 数组
    if (val.startsWith("[")) {
      try {
        data[key] = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        data[key] = val;
      }
    } else {
      // 去首尾引号
      data[key] = val.replace(/^["']|["']$/g, "").trim();
    }
  }
  return { data, body, raw: dataRaw, hasFrontmatter: true };
}

/** 收集代码块区间（``` 或 ~~~ 或 4 空格缩进块），返回行区间 [start, end] */
function collectCodeRegions(body) {
  const regions = [];
  const lines = body.split("\n");
  let inFence = false;
  let fenceStart = 0;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i];
    if (!inFence && /^\s*(```|~~~)/.test(t)) {
      inFence = true;
      fenceStart = i;
    } else if (inFence && /^\s*(```|~~~)/.test(t)) {
      inFence = false;
      regions.push([fenceStart, i]);
    }
  }
  // 未闭合的围栏
  return { regions, fenceClosed: !inFence };
}

function isInCode(regions, lineIdx) {
  return regions.some(([s, e]) => lineIdx >= s && lineIdx <= e);
}

/** 统计正文中的中文 / 英文 / 数字字符数（排除代码块与 frontmatter），并收集段落信息 */
function countChars(body, regions) {
  const lines = body.split("\n");
  let zh = 0, en = 0, num = 0;
  const enWord = (line) => (line.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []);
  let enWords = 0;
  const paragraphs = []; // { zhChars, enWords, text }
  let cur = { zhChars: 0, enWords: 0, text: [] };
  lines.forEach((line, i) => {
    if (isInCode(regions, i)) return;
    // 收集段落：空行或标题分隔一个段落
    if (line.trim() === "" || /^#{1,6}\s/.test(line) || /^\s*[-*]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
      if (cur.text.length) { paragraphs.push(cur); cur = { zhChars: 0, enWords: 0, text: [] }; }
      return;
    }
    zh += (line.match(new RegExp(`[${CJK}]`, "g")) || []).length;
    en += (line.match(/[A-Za-z]/g) || []).length;
    num += (line.match(/[0-9]/g) || []).length;
    enWords += enWord(line).length;
    cur.zhChars += (line.match(new RegExp(`[${CJK}]`, "g")) || []).length;
    cur.enWords += enWord(line).length;
    cur.text.push(line.trim());
  });
  if (cur.text.length) paragraphs.push(cur);
  return { zh, en, num, enWords, paragraphs };
}

// ---------------------------------------------------------------------------
// 检查项
// ---------------------------------------------------------------------------

/** 1. Frontmatter 完整性 + section 合法性 */
function checkFrontmatter({ data, raw, hasFrontmatter, file }) {
  if (!hasFrontmatter) {
    err("缺少 frontmatter（必须包含 title/date/tags/section 等元信息）", file);
    return;
  }
  const required = ["title", "date"];
  for (const k of required) {
    if (!data[k]) err(`frontmatter 缺少必填字段: ${k}`, file);
  }
  if (!data.section) warn("frontmatter 缺少 section（将默认 tips，建议显式声明）", file);
  else if (!VALID_SECTIONS.includes(data.section)) {
    err(`section 取值不合法: "${data.section}"，应为 ${VALID_SECTIONS.join(" / ")}`, file);
  }
  // 日期格式
  if (data.date && isNaN(Date.parse(String(data.date)))) {
    err(`date 无法解析为合法日期: "${data.date}"`, file);
  }
  // 双语 key 一致性提示
  for (const [zhK, enK] of [["title", "titleEn"], ["description", "descriptionEn"], ["tags", "tagsEn"]]) {
    if (data[zhK] && !data[enK]) info(`有 ${zhK} 但缺 ${enK}（若该语言页面可回退可不补）`, file);
  }
  // 中文/英文 title 含冒号但未用引号包裹 → YAML 可能解析异常
  // 基于原始 YAML 行判断是否带引号
  for (const line of (raw || "").split(/\r?\n/)) {
    const kv = line.match(/^(title|titleEn|description|descriptionEn):\s*(.*)$/);
    if (!kv) continue;
    const value = kv[2].trim();
    if (!value) continue;
    const hasColon = value.includes(":");
    const quoted = /^["']/.test(value) && /["']$/.test(value);
    if (hasColon && !quoted) {
      warn(`frontmatter 字段 ${kv[1]} 含冒号但未用引号包裹，YAML 可能解析异常：${value.slice(0, 50)}...`, file);
    }
  }
}

/** 2. Markdown 标题层级跳级 */
function checkHeadings(body, regions, file) {
  const lines = body.split("\n");
  const seen = [];
  lines.forEach((line, i) => {
    if (isInCode(regions, i)) return;
    const m = line.match(/^(#{1,6})\s+\S/);
    if (!m) return;
    const level = m[1].length;
    seen.push({ level, line: line.trim(), idx: i });
  });
  // 检查 H1 唯一性（正文标题多来自 frontmatter，无需强制 H1；仅当出现多个 H1 时提示）
  const h1 = seen.filter((h) => h.level === 1);
  if (h1.length > 1) info(`正文存在 ${h1.length} 个 H1 标题（建议只保留一个）`, file);
  // 检查跳级（如 H1 -> H3，中间没有 H2）
  for (let i = 1; i < seen.length; i++) {
    const prev = seen[i - 1];
    const cur = seen[i];
    if (cur.level > prev.level + 1) {
      warn(`标题层级跳级：第${prev.idx + 1}行 "${prev.line}" 之后直接出现更高层 "${cur.line}"`, file);
    }
  }
  // 标题末尾不应有标点
  for (const h of seen) {
    if (/[。，、；：？！,.;:?!]\s*$/.test(h.line.replace(/#+\s*/, ""))) {
      warn(`标题末尾不应带标点：${h.line}`, file);
    }
  }
}

/** 3. 中英文混排空格（仅字母单词与中文之间，中文与数字之间不加空格） */
function checkZhEnSpacing(body, regions, file) {
  // 仅中文文章做此检查（英文文章中的中日韩字符多为主权名词列举，不强制空格）
  if (file.includes("/articles-en/")) return;
  const lines = body.split("\n");
  lines.forEach((line, i) => {
    if (isInCode(regions, i)) return;
    // 中文后紧跟英文字母（无空格）
    const noSpace1 = new RegExp(`[${CJK}][${ASCII_LETTER}]`);
    // 英文字母后紧跟中文（无空格）
    const noSpace2 = new RegExp(`[${ASCII_LETTER}][${CJK}]`);
    const m1 = line.match(noSpace1);
    const m2 = line.match(noSpace2);
    if (m1 || m2) {
      warn(`中英文字词之间缺少空格：第${i + 1}行 "${line.trim().slice(0, 60)}..."`, file);
    }
  });
}

/** 4. 全角/半角标点混用（仅针对中文文章，英文文章跳过以避免误判） */
function checkPunctuation(body, regions, file) {
  // 仅中文文章做此检查
  if (file.includes("/articles-en/")) return;
  const lines = body.split("\n");
  lines.forEach((line, i) => {
    if (isInCode(regions, i)) return;
    // 中文语境下混入英文半角逗号/句号/问号/分号
    if (/[\u4e00-\u9fff][,;?!]/.test(line)) {
      warn(`中文后使用了英文半角标点，第${i + 1}行 "${line.trim().slice(0, 50)}..."`, file);
    }
  });
}

/** 5. 段落/列表之间的空行规范 */
function checkBlankLines(body, regions, file) {
  const lines = body.split("\n");
  // 列表项之间：无序列表 "  - " / 有序列表 "  1. " 相邻项之间缺空行（允许连续，无需空行）
  // 主要检查：段落之间连续多个空行（>2）
  let consecutive = 0;
  lines.forEach((line, i) => {
    if (isInCode(regions, i)) return;
    if (line.trim() === "") {
      consecutive++;
      if (consecutive > 2) {
        warn(`连续 ${consecutive} 个空行（第${i + 1}行附近），建议最多保留一个空行`, file);
      }
    } else {
      consecutive = 0;
    }
  });
  // 引用块 ">" 相邻两段之间缺空行会导致合并（类似参考文献不换行问题）
  lines.forEach((line, i) => {
    if (isInCode(regions, i)) return;
    if (/^>\s*\S/.test(line)) {
      const next = lines[i + 1];
      if (next !== undefined && next.trim() !== "" && !/^>/.test(next.trim()) && !/^[#\-*\d`|]/.test(next.trim())) {
        // 引用块下一行是普通正文且无空行 → 引用块会被提前结束，属于潜在排版问题，但 Markdown 合法，仅提示
        info(`引用块后直接接正文（第${i + 1}行）建议加空行分隔`, file);
      }
    }
  });
}

/** 6. 代码块闭合 */
function checkFences(body, regions, fenceClosed, file) {
  if (!fenceClosed) err("存在未闭合的代码围栏（``` 或 ~~~ 数量不配对）", file);
}

/** 7. 图片引用存在性 */
function checkImages(body, file) {
  const lines = body.split("\n");
  lines.forEach((line, i) => {
    const m = line.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
    if (!m) return;
    const src = m[1];
    if (/^https?:\/\//.test(src) || /^data:/.test(src)) return;
    let p = src.split(/[?#]/)[0];
    if (p.startsWith("/")) {
      p = join(PUBLIC_DIR, p.replace(/^\//, ""));
    } else {
      p = resolve(REPO_ROOT, p);
    }
    if (!existsSync(p)) {
      warn(`引用的图片不存在：${src}（第${i + 1}行）`, file);
    }
  });
}

/** 8. 文字质量：常见错别字 + AI 味套话 */
function checkTextQuality(body, regions, file) {
  const lines = body.split("\n");
  lines.forEach((line, i) => {
    if (isInCode(regions, i)) return;
    for (const { re, word, fix } of COMMON_MISTAKES) {
      if (re.test(line)) {
        warn(`疑似错别字 "${word}"（建议用"${fix}"）：第${i + 1}行`, file);
      }
    }
    for (const c of AI_CLICHES) {
      if (line.includes(c)) {
        // 只提示一次，避免刷屏：改为统计在下方
      }
    }
  });
  // AI 味高频词统计（排除代码）
  const joined = lines.filter((_, i) => !isInCode(regions, i)).join("\n");
  const hits = AI_CLICHES.filter((c) => joined.includes(c));
  if (hits.length >= 3) {
    info(`检测到较多 AI 味高频词(${hits.length} 个)：${hits.join("、")}，建议人工复核去 AI 腔`, file);
  }
}

/** 9. 参考文献 / 上标 / 链接规范（针对 Issue #160） */
function checkReferences(body, file) {
  const lines = body.split("\n");
  // 参考文献定义行（[N] 开头，纯文本引用形态，即 Issue #160 的根因场景）
  const isBracketDef = (l) =>
    /^\s*\[\d+\]\s*[:：]/.test(l) || // [1]: / [1]：
    /^\s*\[\d+\]\s+[^\s]/.test(l); // [1] 内容
  // 有序列表项（1. 2. …）：天然换行，不会产生"不换行"问题，但计入参考文献条数
  const isOrderedItem = (l) => /^\s*\d+\.\s+\S/.test(l);

  // 1) 检测纯文本 [N] 参考文献条目相邻无空行 → 会被合并为同一段落导致不换行（Issue #160 根因）
  let prevDefIdx = -1;
  lines.forEach((line, i) => {
    if (isBracketDef(line)) {
      // 是否处于 <ol> 块内（<ol> 内条目天然换行，无需空行）
      const inOl = lines.slice(Math.max(0, i - 30), i + 1).join("\n").includes("<ol>");
      if (prevDefIdx >= 0 && i === prevDefIdx + 1 && !inOl) {
        warn(`参考文献条目相邻无空行（第${i + 1}行附近），纯文本下会被合并为同一段落导致不换行（建议改用 <ol> 有序列表，或条目之间留空行）`, file);
      }
      prevDefIdx = i;
    }
  });

  // 2) 正文普通文本式引用 [N]（既非上标也非链接）→ 建议按规范改为上标+双向链接
  const hasSup = /<sup>\[?\s*\d+\s*\]?<\/sup>/.test(body);
  const hasLink = /\[\d+\]\(#[^)]*\)/.test(body);
  // 统计正文中的 [N] 引用（排除 [N] 参考文献定义行、引用块）
  const bodyRefLines = [];
  lines.forEach((line, i) => {
    if (isBracketDef(line) || /^>/.test(line)) return;
    const m = line.match(/\[(\d+)\]/);
    if (m) bodyRefLines.push(i + 1);
  });
  if (bodyRefLines.length > 0 && !hasSup && !hasLink) {
    info(`正文存在 ${bodyRefLines.length} 处普通文本式 "[N]" 引用（如第${bodyRefLines[0]}行），既非上标 <sup> 也非链接，建议按 Issue #160 规范改为上标+双向链接`, file);
  }

  // 3) 参考文献条数统计（仅提示）
  const defCount = lines.filter((l) => isBracketDef(l) || isOrderedItem(l)).length;
  if (defCount > 0) {
    info(`参考文献定义共 ${defCount} 条`, file);
  }
}

/** 10. 字数统计 + 可读性评估（新增维度，2026-08-21 Issue #160） */
function checkReadability(body, regions, file, counts) {
  const isEn = file.includes("/articles-en/");
  const zh = counts.zh;
  const enWords = counts.enWords;
  const totalChars = zh + counts.en + counts.num;

  // 阅读时长估算：中文按 readingSpeedZh 字/分钟，英文按 readingSpeedEn 词/分钟
  const readMin = isEn
    ? (enWords / READABILITY.readingSpeedEn).toFixed(1)
    : (zh / READABILITY.readingSpeedZh).toFixed(1);

  info(`字数统计：中文 ${zh} 字 / 英文字 ${counts.en} / 数字 ${counts.num}，全文约 ${totalChars} 字符`, file);
  info(`可读性：预计阅读时长约 ${readMin} 分钟（${isEn ? enWords + " 词" : zh + " 字"}，按 ${isEn ? READABILITY.readingSpeedEn : READABILITY.readingSpeedZh}/分估算）`, file);

  // 中文文章过短提示（仅中文；英文短文通常正常，避免误报）
  if (!isEn && zh > 0 && zh < READABILITY.minArticleZhChars) {
    info(`文章正文偏短（中文约 ${zh} 字，低于建议 ${READABILITY.minArticleZhChars} 字），内容可能不够充实`, file);
  }

  // 段落过长提示：单段中文超过阈值，或英文单词过多
  for (const [i, para] of (counts.paragraphs || []).entries()) {
    const paraText = para.text.join(" ");
    if (!isEn && para.zhChars > READABILITY.maxParagraphZhChars) {
      warn(`段落过长（约 ${para.zhChars} 中文字，建议 ≤ ${READABILITY.maxParagraphZhChars} 字）：\n    "${paraText.slice(0, 60)}..."`, file);
    }
    if (isEn && para.enWords > 120) {
      warn(`段落过长（约 ${para.enWords} 英文词，建议 ≤ 120 词）：\n    "${paraText.slice(0, 60)}..."`, file);
    }
  }
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------
function checkFile(absPath) {
  const file = absPath.replace(REPO_ROOT + "/", "");
  const text = readFile(absPath);
  if (text === null) {
    err(`文件无法读取：${absPath}`, file);
    return;
  }
  const { data, body, raw, hasFrontmatter } = parseFrontmatter(text);
  const { regions, fenceClosed } = collectCodeRegions(body);
  const counts = countChars(body, regions);

  checkFrontmatter({ data, raw, hasFrontmatter, file });
  checkHeadings(body, regions, file);
  checkZhEnSpacing(body, regions, file);
  checkPunctuation(body, regions, file);
  checkBlankLines(body, regions, file);
  checkFences(body, regions, fenceClosed, file);
  checkImages(body, file);
  checkTextQuality(body, regions, file);
  checkReferences(body, file);
  checkReadability(body, regions, file, counts);
}

function collectTargets(args) {
  if (args.length > 0) {
    return args.filter((a) => existsSync(a)).map((a) => resolve(REPO_ROOT, a));
  }
  const targets = [];
  for (const dir of [ARTICLES_DIR, ARTICLES_EN_DIR]) {
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (extname(f) === ".md") targets.push(join(dir, f));
    }
  }
  return targets;
}

function main() {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const files = collectTargets(args.filter((a) => !a.startsWith("--")));

  if (files.length === 0) {
    console.log("未找到可检查的文章文件。");
    process.exit(0);
  }

  // 中英文配对检查
  const zhSlugs = new Set();
  const enSlugs = new Set();
  for (const f of files) {
    const b = basename(f);
    if (f.includes("/articles-en/")) enSlugs.add(b);
    else if (f.includes("/articles/")) zhSlugs.add(b);
  }
  for (const b of zhSlugs) {
    if (!enSlugs.has(b)) info(`中文文章缺少英文版正文（可选，英文页会回退中文）：${b}`, b);
  }
  for (const b of enSlugs) {
    if (!zhSlugs.has(b)) warn(`存在英文版但缺对应中文版：${b}`, b);
  }

  // 逐篇体检
  for (const f of files) {
    checkFile(f);
  }

  // 汇总输出
  console.log(`\n========== 文章上线前全面体检 ==========`);
  console.log(`检查文件数：${files.length}`);
  console.log(`提示(info)  ：${infos.length}  警告(warn) ：${warnings.length}  错误(error)：${errors.length}\n`);

  if (infos.length) {
    console.log(`--- 提示（建议关注，非必改）---`);
    for (const { file, msg } of infos) console.log(`  [info] ${file}: ${msg}`);
  }
  if (warnings.length) {
    console.log(`\n--- 警告（建议修复）---`);
    for (const { file, msg } of warnings) console.log(`  [warn] ${file}: ${msg}`);
  }
  if (errors.length) {
    console.log(`\n--- 错误（必须修复）---`);
    for (const { file, msg } of errors) console.log(`  [error] ${file}: ${msg}`);
  }

  const hasError = errors.length > 0;
  const hasWarning = warnings.length > 0;
  console.log(`\n体检结论：${hasError ? "FAIL（存在必须修复的错误）" : hasWarning && strict ? "FAIL（strict 模式存在警告）" : "PASS"}`);
  process.exit(hasError ? 1 : hasWarning && strict ? 2 : 0);
}

main();
