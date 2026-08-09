#!/usr/bin/env node
/**
 * cover-render.mjs — 文章封面渲染库（星野极光 · 分栏配色）
 *
 * 职责：
 *   1. 从文章 frontmatter 解析标题/副标题/栏目/日期
 *   2. 自动拆分标题为一行或两行（中英文各自平衡）
 *   3. 按栏目配色 + 星野极光构图生成中/英文封面 SVG
 *   4. 调用 rsvg-convert 渲染出 PNG（cover.png / cover-en.png）
 *
 * 用法（单篇）：
 *   node scripts/cover-render.mjs --article src/content/articles/<slug>.md
 *   node scripts/cover-render.mjs --article <md> --tag "VIBE CODING · 2026.08" --sig-cn "Galvin × CodeBuddy · xxx"
 *
 * 可选参数：
 *   --tag      <string>   封面标签（默认按栏目自动生成，如 "AI · 智能实践 · 2026"）
 *   --tag-en   <string>   英文封面标签（默认按栏目自动生成）
 *   --sig-cn   <string>   中文封面署名（默认按栏目品牌署名）
 *   --sig-en   <string>   英文封面署名
 *   --title-cn <string>   强制指定中文标题（默认取 frontmatter title）
 *   --title-en <string>   强制指定英文标题（默认取 frontmatter titleEn）
 *   --desc-cn  <string>   强制指定中文副标题（默认取 frontmatter description 截断）
 *   --desc-en  <string>   强制指定英文副标题
 *   --out      <dir>      输出目录（默认 public/images/<slug>）
 *   --no-png              只生成 SVG，不渲染 PNG（调试用）
 *
 * 依赖：rsvg-convert（librsvg2-bin）、Noto CJK 字体（fonts-noto-cjk）
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";

/* ============ 栏目配色（方案 A｜星野极光·分栏配色）============ */
const PALETTES = {
  insights: { c1: "#8E1F2F", c2: "#6C2A33", tag: "#E8A2AC" }, // 行业洞察·酒红
  ai:       { c1: "#1E3A8A", c2: "#27477F", tag: "#8FB4F5" }, // AI 学习·深蓝
  tips:     { c1: "#B45309", c2: "#4ADE80", tag: "#FBBF24" }, // 实用技巧·琥珀棕
  books:    { c1: "#7C3AED", c2: "#F33BD6", tag: "#A78BFA" }, // 书籍专区·紫罗兰
  invest:   { c1: "#8E1F2F", c2: "#6C2A33", tag: "#E8A2AC" }, // 复用酒红
};
const DEFAULT_PALETTE = PALETTES.ai;

const SECTION_TAG_CN = {
  insights: "INSIGHTS · 行业洞察",
  ai: "AI · 智能实践",
  tips: "TIPS · 实用技巧",
  books: "BOOKS · 阅读",
  invest: "INVEST · 投资复盘",
};
const SECTION_TAG_EN = {
  insights: "INSIGHTS",
  ai: "AI IN PRACTICE",
  tips: "TIPS",
  books: "BOOKS",
  invest: "INVEST",
};
const SECTION_SIG_CN = {
  insights: "Galvin × CodeBuddy · 洞察趋势，沉淀判断",
  ai: "Galvin × CodeBuddy · 先会用，再理解，后深入",
  tips: "Galvin × CodeBuddy · 内容优先，安静克制",
  books: "Galvin × CodeBuddy · 读书，读世界",
  invest: "Galvin × CodeBuddy · 认知决定收益",
};
const SECTION_SIG_EN = {
  insights: "Galvin x CodeBuddy · Insight & Judgment",
  ai: "Galvin x CodeBuddy · Use it first, then go deeper",
  tips: "Galvin x CodeBuddy · Content-first, quiet and calm",
  books: "Galvin x CodeBuddy · Read, reflect, grow",
  invest: "Galvin x CodeBuddy · Mindset drives returns",
};

/* ============ 工具函数 ============ */

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function chars(s) {
  return Array.from(s ?? "");
}

function textWidth(s, lang) {
  return chars(s).reduce((acc, ch) => {
    const code = ch.codePointAt(0);
    // 全角 / CJK / 扩展区按 1 个汉字宽
    if (code > 0x2e80) return acc + 1.0;
    // 半角按 0.55（中文排版）或 0.62（英文排版）
    return acc + (lang === "zh" ? 0.55 : 0.62);
  }, 0);
}

/** 中文标题拆分：先按宽度判断能否单行，再优先在标点/语义边界断行 */
function splitTitleZh(title) {
  const totalW = textWidth(title, "zh");
  if (totalW <= 15) return [title, ""]; // 一行放得下（≈15 个汉字宽，64px 下约 960px）
  const cs = chars(title);
  const len = cs.length;
  const punct = new Set(["：", ":", "，", ",", "、", "；", ";", "·", "—"]);
  // 候选断点：标点之后（语义块），或空格之后（中英混排）
  const candidates = [];
  for (let i = 1; i < len; i++) {
    const prev = cs[i - 1];
    const cur = cs[i];
    if (punct.has(prev)) candidates.push(i);
    else if (prev === " " && cur !== " ") candidates.push(i);
  }
  // 优先语义断点：选择使两行宽度最均衡且不拆散单词的候选
  let best = null;
  let bestScore = 1e9;
  for (const i of candidates) {
    const w1 = textWidth(cs.slice(0, i).join(""), "zh");
    const w2 = textWidth(cs.slice(i).join(""), "zh");
    if (w2 > 16.5) continue; // 第二行过长则不用（避免换行后更挤）
    const score = Math.abs(w1 - w2) * 2 + Math.min(w1, w2); // 越均衡越好
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  if (best === null) return [title, ""]; // 无合适语义断点，保持单行交给字号缩放
  let t1 = cs.slice(0, best).join("");
  let t2 = cs.slice(best).join("");
  // 仅去掉行尾/行首的空格与纯连接性符号；
  // 保留语义标点（：/ : 等），避免标题丢字（如「当 AI 成为同事：人机协作…」断行后冒号被吞）
  t1 = t1.replace(/[\s·,，、；;]+$/, "");
  t2 = t2.replace(/^[\s·,，、；;]+/, "");
  if (!t2) return [title, ""];
  if (!t1) return [t2, ""];
  return [t1, t2];
}

/** 英文标题拆分：按单词边界平衡两行宽度（不拆单词，超长时降权而非直接放弃） */
function splitTitleEn(title) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 3) return [title, ""];
  const widths = words.map((w) => textWidth(w, "en") + 0.3);
  let best = -1;
  let bestScore = 1e9;
  for (let i = 1; i < words.length; i++) {
    const w1 = widths.slice(0, i).reduce((a, b) => a + b, 0);
    const w2 = widths.slice(i).reduce((a, b) => a + b, 0);
    if (w2 < w1 * 0.45) continue; // 第二行过短不用（避免头重脚轻）
    if (words.slice(i).join(" ").length < 3) continue; // 第二行单词过少不用
    const diff = Math.abs(w1 - w2);
    const overflow = Math.max(0, w2 - 16) * 2; // 第二行超宽时降权（字号会自适应缩小）
    const score = diff + overflow;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  if (best === -1) return [title, ""];
  const t1 = words.slice(0, best).join(" ");
  const t2 = words.slice(best).join(" ");
  if (!t2) return [title, ""];
  return [t1, t2];
}

/** 依据最长标题行自适应字号（中英文各自系数） */
function pickFontSize(lines, lang) {
  const usable = 1040; // 1200 - 左右各 60 - 保守余量
  const maxW = Math.max(...lines.map((l) => textWidth(l, lang)));
  let fs = Math.floor(usable / Math.max(maxW, 1));
  fs = lang === "zh" ? Math.max(36, Math.min(64, fs)) : Math.max(32, Math.min(58, fs));
  return fs - (fs % 2);
}

function truncate(s, maxChars, lang) {
  const cs = chars(s);
  if (cs.length <= maxChars) return s;
  // 以像素宽度估算截断位置（一行副标题，font-size 26/24）
  const usable = 1060; // 1200 - 左右各 60 - 余量
  const unit = lang === "zh" ? 26 : 24;
  let width = 0;
  for (let i = 0; i < cs.length; i++) {
    const w = textWidth(cs[i], lang) * unit;
    if (width + w > usable) {
      return cs
        .slice(0, i)
        .join("")
        .replace(/[，、。；：,.;:]+$/, "") + "…";
    }
    width += w;
  }
  return s;
}

/* ============ SVG 模板（1200×630｜星野极光）============ */

const STARS = [
  [120, 90, 1.8, 0.5], [280, 160, 1.2, 0.4], [430, 70, 1.6, 0.45],
  [580, 130, 1.1, 0.35], [720, 80, 1.7, 0.5], [880, 150, 1.2, 0.4],
  [1030, 90, 1.5, 0.45], [1150, 140, 1.1, 0.35], [200, 300, 1.3, 0.3],
  [350, 380, 1.0, 0.25], [520, 320, 1.4, 0.3], [700, 400, 1.0, 0.25],
  [900, 330, 1.3, 0.3], [1050, 420, 1.0, 0.25], [90, 500, 1.2, 0.25],
  [640, 540, 1.1, 0.2], [980, 560, 1.4, 0.25],
];

function starsSvg() {
  return STARS.map(
    ([cx, cy, r, o]) =>
      `    <circle cx="${cx}" cy="${cy}" r="${r}" opacity="${o}"/>`,
  ).join("\n");
}

function buildSvg({ lang, section, t1, t2, sub, tag, sig }) {
  const pal = PALETTES[section] || DEFAULT_PALETTE;
  const c1 = pal.c1;
  const c2 = pal.c2;
  const tagColor = pal.tag || c1;
  const lines = t2 ? 2 : 1;
  const fs = pickFontSize([t1, t2].filter(Boolean), lang);
  const fontStack = lang === "zh"
    ? "'Times New Roman', 'Liberation Serif', 'SimSun', 'Songti SC', 'Noto Serif CJK SC', serif"
    : "'Times New Roman', 'Liberation Serif', 'DejaVu Serif', serif";
  // 字体规范：中文宋体 + 英文新罗马（Times New Roman）
  const serif = fontStack;
  const sans = fontStack;
  const mono = fontStack;
  const subSize = lang === "zh" ? 26 : 24;
  // 主标题两行行间距：比字号多出 20px（放大行距，避免两行标题挤在一起）
  const titleGap = 20;
  const subY = 290 + fs * lines + titleGap + 26;

  let titleBlock;
  if (lines === 2) {
    titleBlock = `  <text x="60" y="290" font-family="${serif}" font-size="${fs}" font-weight="bold" fill="#ffffff">${esc(t1)}</text>
  <text x="60" y="${290 + fs + titleGap}" font-family="${serif}" font-size="${fs}" font-weight="bold" fill="#ffffff">${esc(t2)}</text>`;
  } else {
    titleBlock = `  <text x="60" y="290" font-family="${serif}" font-size="${fs}" font-weight="bold" fill="#ffffff">${esc(t1)}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow1" cx="0.15" cy="0.2" r="0.9">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.32"/>
      <stop offset="60%" stop-color="${c1}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.85" cy="0.85" r="0.9">
      <stop offset="0%" stop-color="${c2}" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="${c2}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="1200" height="630" fill="#0c0c0c"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- 星野 -->
  <g fill="#ffffff">
${starsSvg()}
  </g>

  <!-- 顶部光带 -->
  <rect width="1200" height="4" fill="url(#fade)"/>

  <!-- 装饰：左上角双竖线 + 圆点节奏（填充空白区域） -->
  <rect x="60" y="52" width="2" height="64" fill="${c1}" opacity="0.7"/>
  <rect x="66" y="52" width="2" height="64" fill="${c1}" opacity="0.35"/>
  <line x1="76" y1="52" x2="76" y2="116" stroke="${c1}" stroke-opacity="0.18" stroke-width="1"/>
  <circle cx="94" cy="70" r="3" fill="${c1}" opacity="0.85"/>
  <circle cx="94" cy="84" r="3" fill="${c1}" opacity="0.5"/>
  <circle cx="94" cy="98" r="3" fill="${c1}" opacity="0.25"/>
  <line x1="104" y1="70" x2="118" y2="70" stroke="${c1}" stroke-opacity="0.5" stroke-width="1.5"/>

  <!-- 标签 -->
  <text x="60" y="170" font-family="${mono}" font-size="20" letter-spacing="6" fill="${tagColor}" opacity="0.9">${esc(tag)}</text>

  <!-- 主标题 -->
${titleBlock}

  <!-- 副标题 -->
  <text x="60" y="${subY}" font-family="${sans}" font-size="${subSize}" fill="#a3a3a3">${esc(sub)}</text>

  <!-- 分隔线 -->
  <line x1="60" y1="485" x2="360" y2="485" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1"/>
  <circle cx="360" cy="485" r="4" fill="${c1}"/>
  <line x1="368" y1="485" x2="460" y2="485" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1"/>

  <!-- 底部署名 -->
  <text x="60" y="540" font-family="${sans}" font-size="18" fill="#737373">${esc(sig)}</text>
</svg>
`;
}

/* ============ frontmatter 解析 ============ */

function parseFrontmatter(mdPath) {
  const md = readFileSync(mdPath, "utf8");
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    fm[kv[1]] = v;
  }
  return fm;
}

/* ============ 环境检查（避免中文渲染成豆腐块/方块） ============ */

function checkRenderEnv() {
  // 1. rsvg-convert 是否存在
  try {
    execFileSync("which", ["rsvg-convert"], { stdio: "pipe" });
  } catch {
    console.error("❌ 缺少 rsvg-convert：请先安装 apt-get install -y librsvg2-bin");
    process.exit(1);
  }
  // 2. 中文字体是否存在（Noto CJK / 宋体等，缺了中文会渲染成空心方框/豆腐块）
  try {
    const out = execFileSync("fc-list", [":lang=zh"], { encoding: "utf8" });
    if (!out.trim()) {
      console.error("❌ 缺少中文字体：当前环境没有支持中文（lang=zh）的字体，中文会渲染成空心方框/豆腐块（乱码）。");
      console.error("   请先安装 apt-get update && apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra，再 fc-cache -f 后重跑。");
      process.exit(1);
    }
  } catch {
    console.error("❌ 无法检查中文字体（fc-list 不可用）：请先安装 fontconfig + fonts-noto-cjk");
    process.exit(1);
  }
}

/* ============ 主流程 ============ */

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else if (!args._) {
      args._ = a;
    }
  }
  return args;
}

function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);
  const mdPath = args.article || args._;
  if (!mdPath) {
    console.error("用法: node scripts/cover-render.mjs --article <article.md> [选项]");
    process.exit(1);
  }
  const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const slug = path.basename(mdPath, ".md");

  const fm = parseFrontmatter(path.resolve(mdPath));
  const section = fm.section || "tips";
  const year = (fm.date || "").slice(0, 4);

  const titleZh = args["title-cn"] || fm.title || slug;
  const titleEn = args["title-en"] || fm.titleEn || fm.title || slug;
  const descZh = args["desc-cn"] || fm.description || "记录思考、分享见解、展示作品";
  const descEn = args["desc-en"] || fm.descriptionEn || fm.description || "Think, share, build.";

  const [t1z, t2z] = splitTitleZh(titleZh);
  const [t1e, t2e] = splitTitleEn(titleEn);

  const tagZh = args.tag || `${SECTION_TAG_CN[section] || "AI · 智能实践"}${year ? ` · ${year}` : ""}`;
  const tagEn = args["tag-en"] || `${SECTION_TAG_EN[section] || "AI IN PRACTICE"}${year ? ` · ${year}` : ""}`;
  // 署名：books 类优先用作者名，其余用栏目品牌署名
  const isBook = section === "books" && (fm.author || fm.authorEn);
  const sigZh = args["sig-cn"] || (isBook ? fm.author : SECTION_SIG_CN[section] || SECTION_SIG_CN.ai);
  const sigEn = args["sig-en"] || (isBook ? (fm.authorEn || fm.author) : SECTION_SIG_EN[section] || SECTION_SIG_EN.ai);

  const outDir = args.out ? path.resolve(args.out) : path.join(repoRoot, "public", "images", slug);
  mkdirSync(outDir, { recursive: true });

  const specs = [
    { file: "cover", lang: "zh", t1: t1z, t2: t2z, sub: truncate(descZh, 30, "zh"), tag: tagZh, sig: sigZh },
    { file: "cover-en", lang: "en", t1: t1e, t2: t2e, sub: truncate(descEn, 80, "en"), tag: tagEn, sig: sigEn },
  ];

  checkRenderEnv();

  for (const s of specs) {
    const svg = buildSvg({ lang: s.lang, section, t1: s.t1, t2: s.t2, sub: s.sub, tag: s.tag, sig: s.sig });
    const svgPath = path.join(outDir, `${s.file}.svg`);
    writeFileSync(svgPath, svg, "utf8");
    console.log(`svg  done: ${svgPath}`);
    if (!args["no-png"]) {
      const pngPath = path.join(outDir, `${s.file}.png`);
      execFileSync("rsvg-convert", ["-o", pngPath, svgPath], { stdio: "inherit" });
      console.log(`png  done: ${pngPath}`);
    }
  }
  console.log(`封面完成: ${outDir}（${slug} / ${section} / ${tagZh}）`);
}

main();
