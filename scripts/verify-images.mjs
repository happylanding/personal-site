#!/usr/bin/env node
/**
 * verify-images.mjs — 文章配图完整性与准确性自检工具
 *
 * 用途：每次生成/修改配图后运行，检查图片是否完整、准确、无乱码。
 * 所有封面/正文配图在交付前必须通过本工具自检（见 docs/illustration-workflow.md §五）。
 *
 * 检查项：
 *   1. 尺寸     —— PNG 必须为 1200×630（封面）/ 与 SVG 一致（正文图）
 *   2. 完整性   —— 引用的图片文件必须存在；SVG/PNG 成对存在
 *   3. 无乱码   —— 用 rsvg-convert 重渲染 SVG，与仓库中 PNG 对比，
 *                  差异像素占比超过阈值即判定为"在无中文字体环境渲染的乱码图/豆腐块"
 *                  （正常同环境渲染差异 ≈ 0；缺字体渲染时文字区块差异可达 1%~5%+）
 *   4. 标题准确 —— SVG 文本必须包含文章 frontmatter 标题的全部汉字/关键字符
 *                  （防标题截断、丢字、内容错乱）
 *   5. 双语配套 —— 有英文正文（articles-en/<slug>.md）的文章必须存在 -en 配图
 *   6. 正文引用 —— 文章 Markdown 中引用的 /images/... 文件必须真实存在
 *
 * 用法：
 *   node scripts/verify-images.mjs                       # 全量检查
 *   node scripts/verify-images.mjs --slug <slug>         # 只检查某篇
 *   node scripts/verify-images.mjs --threshold 0.01      # 自定义乱码差异阈值（默认 1%）
 *   node scripts/verify-images.mjs --render-tmp <dir>    # 临时渲染目录（默认 /tmp/cnb-verify）
 *
 * 退出码：0 = 全部通过；1 = 存在失败项（可在 CI / 交付前拦截）
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/* ============ 参数解析 ============ */
function parseArgs(argv) {
  const args = { threshold: 0.01, renderTmp: "/tmp/cnb-verify", slug: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") args.slug = argv[++i];
    else if (a === "--threshold") args.threshold = parseFloat(argv[++i]);
    else if (a === "--render-tmp") args.renderTmp = argv[++i];
  }
  return args;
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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    fm[kv[1]] = v;
  }
  return fm;
}

/* ============ 文本工具 ============ */
function chars(s) {
  return Array.from(s ?? "");
}

/** 提取 SVG 中所有 <text> 标签的文本内容 */
function svgTexts(svgPath) {
  const svg = readFileSync(svgPath, "utf8");
  const out = [];
  const re = /<text\b[^>]*>([\s\S]*?)<\/text>/g;
  let m;
  while ((m = re.exec(svg))) {
    out.push(m[1]);
  }
  return out.join("");
}

/** 标题准确性：title 中的每个 CJK/关键字符是否都出现在 SVG 文本中 */
function checkTitleAccuracy(svgPath, title) {
  if (!title) return { pass: true, hit: 1, total: 0 };
  const all = svgTexts(svgPath);
  const ts = chars(title);
  let hit = 0;
  const missing = [];
  for (const ch of ts) {
    if (/\s/.test(ch)) { hit++; continue; }
    if (all.includes(ch)) hit++;
    else missing.push(ch);
  }
  const rate = ts.length ? hit / ts.length : 1;
  const pass = rate >= 0.9 && missing.length === 0;
  return { pass, hit: ts.length - missing.length, total: ts.length, missing };
}

/* ============ PNG 读取 / 像素对比 ============ */

/** 通过 Python(PIL+numpy) 对比两张 PNG，返回 {w,h,ratio,sizeMismatch} */
function diffPngs(pngA, pngB) {
  const out = execFileSync("python3", ["-c", `
from PIL import Image
import numpy as np, sys
try:
    a = np.asarray(Image.open(sys.argv[1]).convert('RGB'), dtype=np.int32)
    b = np.asarray(Image.open(sys.argv[2]).convert('RGB'), dtype=np.int32)
except Exception as e:
    print('ERR', e); sys.exit(2)
if a.shape != b.shape:
    print('SIZE', a.shape[1], a.shape[0], b.shape[1], b.shape[0])
    sys.exit(0)
diff = np.abs(a-b).sum(axis=2) > 60
print('OK', a.shape[1], a.shape[0], float(diff.mean()))
`, pngA, pngB], { encoding: "utf8" });
  const parts = out.trim().split(" ");
  if (parts[0] === "OK") return { sizeMismatch: false, w: +parts[1], h: +parts[2], ratio: +parts[3] };
  if (parts[0] === "SIZE") return { sizeMismatch: true, w: +parts[1], h: +parts[2], ratio: 1 };
  throw new Error(parts.slice(1).join(" "));
}

/** 读取 PNG 尺寸（供封面尺寸校验） */
function pngSize(p) {
  const out = execFileSync("python3", ["-c", `
from PIL import Image
import sys
im = Image.open(sys.argv[1])
print(im.size[0], im.size[1])
`, p], { encoding: "utf8" });
  const [w, h] = out.trim().split(" ").map(Number);
  return `${w}×${h}`;
}

/** 重渲染 SVG 并与现有 PNG 对比，返回差异像素占比 */
function diffWithSvg(svgPath, pngPath, renderTmp) {
  mkdirSync(renderTmp, { recursive: true });
  const tmpPng = path.join(renderTmp, path.basename(svgPath).replace(/\.svg$/, "-render.png"));
  execFileSync("rsvg-convert", ["-o", tmpPng, svgPath], { stdio: "pipe" });
  return diffPngs(pngPath, tmpPng);
}

/* ============ 正文引用检查 ============ */
function checkBodyRefs(mdPath) {
  const md = readFileSync(mdPath, "utf8");
  const re = /!\[[^\]]*\]\(\s*(\/images\/[^)\s]+)\s*\)/g;
  const refs = [];
  let m;
  while ((m = re.exec(md))) refs.push(m[1]);
  const missing = [];
  for (const r of refs) {
    const p = path.join(REPO_ROOT, "public", r.replace(/^\//, ""));
    if (!existsSync(p)) missing.push(r);
  }
  return { total: refs.length, missing };
}

/* ============ 主流程 ============ */
function main() {
  const args = parseArgs(process.argv.slice(2));
  const failures = [];
  const passes = [];
  const warnings = [];

  const articlesDir = path.join(REPO_ROOT, "src/content/articles");
  const articlesEnDir = path.join(REPO_ROOT, "src/content/articles-en");
  const allArticles = readdirSync(articlesDir).filter((f) => f.endsWith(".md"));

  // 锁定检查范围
  const targets = args.slug
    ? allArticles.filter((f) => path.basename(f, ".md") === args.slug)
    : allArticles;
  if (args.slug && targets.length === 0) {
    console.error(`❌ 未找到文章：${args.slug}`);
    process.exit(1);
  }

  for (const file of targets) {
    const slug = path.basename(file, ".md");
    const mdPath = path.join(articlesDir, file);
    const fm = parseFrontmatter(mdPath);
    const imgDir = path.join(REPO_ROOT, "public/images", slug);
    const enExists = existsSync(path.join(articlesEnDir, file));

    console.log(`\n📄 ${slug}（section=${fm.section || "?"}${enExists ? "，有英文正文" : ""}）`);

    /* 1) ogImage / ogImageEn 配置与存在性 */
    for (const key of ["ogImage", "ogImageEn"]) {
      const v = fm[key];
      if (v) {
        const p = path.join(REPO_ROOT, "public", v.replace(/^\//, ""));
        if (!existsSync(p)) {
          failures.push(`${slug}: frontmatter ${key}=${v} 指向的文件不存在`);
          console.error(`  ❌ ${key}=${v} 文件不存在`);
        } else {
          passes.push(`${slug}: ${key} 存在`);
        }
      } else if (key === "ogImage") {
        failures.push(`${slug}: 缺少 ogImage（封面必须配置）`);
        console.error(`  ❌ 缺少 ogImage`);
      }
    }

    /* 2) 封面 SVG + PNG 完整性 */
    const coverSvg = path.join(imgDir, "cover.svg");
    const coverPng = path.join(imgDir, "cover.png");
    if (!existsSync(coverSvg) || !existsSync(coverPng)) {
      failures.push(`${slug}: 封面 cover.svg / cover.png 缺失`);
      console.error(`  ❌ 封面缺失（cover.svg=${existsSync(coverSvg)}，cover.png=${existsSync(coverPng)}）`);
      continue;
    }

    /* 3) 封面尺寸 */
    const dim = (() => {
      try {
        return pngSize(coverPng);
      } catch { return "读取失败"; }
    })();
    const expectDim = "1200×630";
    if (dim !== expectDim) {
      failures.push(`${slug}: cover.png 尺寸 ${dim}（应为 ${expectDim}）`);
      console.error(`  ❌ 尺寸 ${dim}，应为 ${expectDim}`);
    } else {
      passes.push(`${slug}: cover.png 尺寸 ${dim}`);
    }

    /* 4) 无乱码检测（重渲染对比） */
    try {
      const r = diffWithSvg(coverSvg, coverPng, args.renderTmp);
      if (r.sizeMismatch) {
        failures.push(`${slug}: cover.png 与 cover.svg 尺寸不一致`);
        console.error(`  ❌ cover.png 与 cover.svg 尺寸不一致`);
      } else if (r.ratio > args.threshold) {
        failures.push(`${slug}: cover.png 疑似乱码（与 SVG 重渲染差异 ${(r.ratio * 100).toFixed(2)}% > ${(args.threshold * 100).toFixed(2)}%）——很可能在无中文字体环境渲染`);
        console.error(`  ❌ 疑似乱码：与 SVG 重渲染差异 ${(r.ratio * 100).toFixed(2)}%`);
      } else {
        passes.push(`${slug}: 无乱码（重渲染差异 ${(r.ratio * 100).toFixed(3)}%）`);
      }
    } catch (e) {
      failures.push(`${slug}: 渲染对比失败（${e.message}）`);
      console.error(`  ❌ 渲染对比失败: ${e.message}`);
    }

    /* 5) 标题准确性（中文标题 → cover.svg；英文标题 → cover-en.svg） */
    if (fm.title) {
      const r = checkTitleAccuracy(coverSvg, fm.title);
      if (!r.pass) {
        failures.push(`${slug}: 中文标题「${fm.title}」在 cover.svg 中不完整（命中 ${r.hit}/${r.total}，缺失 ${JSON.stringify(r.missing)}）`);
        console.error(`  ❌ 中文标题 不完整：缺失 ${JSON.stringify(r.missing)}`);
      } else {
        passes.push(`${slug}: 中文标题 完整（${r.hit}/${r.total} 字符命中）`);
      }
    }
    const coverEnSvg = path.join(imgDir, "cover-en.svg");
    if (fm.titleEn && existsSync(coverEnSvg)) {
      const r = checkTitleAccuracy(coverEnSvg, fm.titleEn);
      if (!r.pass) {
        failures.push(`${slug}: 英文标题「${fm.titleEn}」在 cover-en.svg 中不完整（命中 ${r.hit}/${r.total}，缺失 ${JSON.stringify(r.missing)}）`);
        console.error(`  ❌ 英文标题 不完整：缺失 ${JSON.stringify(r.missing)}`);
      } else {
        passes.push(`${slug}: 英文标题 完整（${r.hit}/${r.total} 字符命中）`);
      }
    }

    /* 6) 双语配套：有英文正文必须有 cover-en 配图 */
    if (enExists) {
      const coverEnPng = path.join(imgDir, "cover-en.png");
      if (!existsSync(coverEnPng)) {
        failures.push(`${slug}: 有英文正文但缺少 cover-en.png`);
        console.error(`  ❌ 有英文正文但缺少 cover-en.png`);
      } else {
        passes.push(`${slug}: cover-en.png 存在`);
      }
    }

    /* 7) 正文引用检查 */
    const bodyRefs = checkBodyRefs(mdPath);
    if (bodyRefs.missing.length) {
      failures.push(`${slug}: 正文引用缺失 ${JSON.stringify(bodyRefs.missing)}`);
      console.error(`  ❌ 正文引用缺失：${bodyRefs.missing.join("，")}`);
    } else {
      passes.push(`${slug}: 正文图片引用 ${bodyRefs.total} 处全部存在`);
    }

    /* 8) 若文章无英文正文但存在 cover-en.png，提示（不强报） */
    if (!enExists && existsSync(path.join(imgDir, "cover-en.png"))) {
      warnings.push(`${slug}: 无英文正文但存在 cover-en.png（如需删除可忽略）`);
    }
  }

  /* ============ 汇总 ============ */
  console.log("\n" + "=".repeat(60));
  console.log(`自检完成：通过 ${passes.length} 项 / 失败 ${failures.length} 项 / 提示 ${warnings.length} 项`);
  if (warnings.length) {
    console.log("\n提示：");
    for (const w of warnings) console.log(`  ⚠️ ${w}`);
  }
  if (failures.length) {
    console.log("\n❌ 失败项：");
    for (const f of failures) console.log(`  ✗ ${f}`);
    console.log("\n👉 若为“疑似乱码”，请在装有中文字体的环境（apt-get install -y fonts-noto-cjk）重新渲染 PNG。");
    process.exit(1);
  }
  console.log("✅ 全部通过，图片完整准确。");
  process.exit(0);
}

main();
