/**
 * build-books.mjs — 自动化“上传书本 → 生成在线阅读内容”流水线
 *
 * 功能：扫描 `public/books/` 下的 EPUB / PDF 文件，自动解析正文并生成：
 *   1. `src/data/books/{slug}.json`    —— 阅读页读取的章节数据
 *   2. `src/content/articles/{slug}.md` —— 书籍文章页（若该 slug 尚无文章时自动补建）
 *
 * 目标：Galvin 只需把书本文件放进 `public/books/`，构建时自动产出可在线阅读的内容，
 *       无需 AI 人工介入解析。
 *
 * 触发方式：
 *   - 构建前置钩子（astro.config.mjs 的 astro:build:start 已挂载本脚本）
 *   - 手动运行：`node scripts/build-books.mjs`
 *
 * 幂等：已生成且源文件未变动的书籍会被跳过；已有文章的 slug 不会被覆盖。
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import JSZip from "jszip";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BOOKS_DIR = join(ROOT, "public", "books");
const DATA_DIR = join(ROOT, "src", "data", "books");
const ARTICLES_DIR = join(ROOT, "src", "content", "articles");

// —— 工具：HTML → 纯文本 ——
function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// —— EPUB 解析：利用 TOC(spine) 提取章节 ——
async function parseEpub(filePath) {
  const data = readFileSync(filePath);
  const zip = await JSZip.loadAsync(data);

  const container = await zip.file("META-INF/container.xml").async("string");
  const opfMatch = container.match(/full-path="([^"]+)"/);
  if (!opfMatch) throw new Error("EPUB 缺少 container.xml / content.opf");
  const opfPath = opfMatch[1];
  const opf = await zip.file(opfPath).async("string");
  const baseDir = opfPath.replace(/\/[^/]+$/, "");

  // spine 阅读顺序（idref 列表）
  const spineIds = [...opf.matchAll(/<itemref[^>]*idref="([^"]+)"/g)].map((m) => m[1]);
  // manifest: id -> href
  const manifest = {};
  for (const m of opf.matchAll(/<item[^>]*id="([^"]+)"[^>]*href="([^"]+)"/g)) manifest[m[1]] = m[2];

  // 定位 toc.ncx
  const ncxHref =
    [...opf.matchAll(/<item[^>]*media-type="application\/x-dtbncx\+xml"[^>]*href="([^"]+)"/g)].map((m) => m[1])[0] ||
    [...opf.matchAll(/<item[^>]*href="([^"]+\.ncx)"[^>]*>/g)].map((m) => m[1])[0];
  let toc = [];
  if (ncxHref) {
    const ncxPath = ncxHref.startsWith("/") ? ncxHref.slice(1) : baseDir ? `${baseDir}/${ncxHref}` : ncxHref;
    const ncxFile = zip.file(ncxPath);
    if (ncxFile) {
      const ncx = await ncxFile.async("string");
      // 递归收集所有 navPoint（含嵌套子目录）
      const collect = (block) => {
        const entries = [];
        for (const m of block.matchAll(/<navPoint[^>]*>([\s\S]*?)<\/navPoint>/g)) {
          const inner = m[1];
          const text = (inner.match(/<text>([\s\S]*?)<\/text>/) || [, ""])[1].replace(/<[^>]+>/g, "").trim();
          const src = (inner.match(/<content[^>]*src="([^"]+)"/) || [, ""])[1];
          entries.push({ title: text, src });
          entries.push(...collect(inner));
        }
        return entries;
      };
      toc = collect(ncx);
    }
  }

  // 读取某个 src（文件[#锚点]）对应的纯文本
  async function readSrc(src) {
    if (!src) return { text: "", title: "" };
    const [filePart, anchor] = src.split("#");
    let full = filePart;
    if (filePart.startsWith("/")) full = filePart.slice(1);
    else if (baseDir) full = `${baseDir}/${filePart}`;
    const f = zip.file(full);
    if (!f) return { text: "", title: "" };
    const html = await f.async("string");
    return { text: htmlToText(html), title: "" };
  }

  // 用 TOC 逐项提取章节；若 TOC 为空则退回按 spine 逐文件切分
  if (toc.length > 0) {
    const chapters = [];
    for (let i = 0; i < toc.length; i++) {
      const { title, src } = toc[i];
      if (!src) continue;
      const { text } = await readSrc(src);
      if (!text) continue;
      chapters.push({ num: String(i + 1), title, text });
    }
    if (chapters.length > 0) return chapters;
  }

  // 兜底：按 spine 顺序逐文件提取（每个 xhtml 作为一个章节）
  const chapters = [];
  let idx = 0;
  for (const idref of spineIds) {
    const href = manifest[idref];
    if (!href || !/\.(x?html?)$/i.test(href)) continue;
    let full = href;
    if (href.startsWith("/")) full = href.slice(1);
    else if (baseDir) full = `${baseDir}/${href}`;
    const f = zip.file(full);
    if (!f) continue;
    const html = await f.async("string");
    const text = htmlToText(html);
    if (text.length < 40) continue; // 跳过封面等空白页
    idx++;
    chapters.push({ num: String(idx), title: `Chapter ${idx}`, text });
  }
  return chapters;
}

// —— PDF 解析：提取文本并按“章/卷/篇”标题启发式切分 ——
async function parsePdf(filePath) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(readFileSync(filePath));
  const doc = await getDocument({ data, disableFontFace: true }).promise;
  let fullText = "";
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const line = content.items
      .map((it) => (it.str !== undefined ? it.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    fullText += line + "\n";
  }

  // 章节标题启发式：匹配 第X章/卷/篇、Chapter X、Book X、FIRST BOOK、I. 等
  const ordinal = "(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH|THIRTEENTH)";
  const headingRe = new RegExp(
    `^\\s*(${ordinal}\\s+(BOOK|VOLUME|PART|CHAPTER)|` +
    `(BOOK|VOLUME|PART|CHAPTER)\\s+[IVXLCDM0-9]+|` +
    `第\\s*[一二三四五六七八九十百千0-9]+\\s*[章卷篇节]|` +
    `第\\s*[一二三四五六七八九十百千0-9]+\\s*部分)`,
    "im"
  );
  const lines = fullText.split("\n");
  const chapters = [];
  let current = null;
  let num = 0;
  const flush = () => {
    if (current && current.text.trim().length > 0) chapters.push(current);
  };
  for (const line of lines) {
    const m = line.match(headingRe);
    if (m && line.trim().length < 80) {
      flush();
      num++;
      current = { num: String(num), title: line.trim(), text: line.trim() + "\n" };
    } else if (current) {
      current.text += line + "\n";
    } else {
      // 标题前的引言并入第一个章节
      if (num === 0) {
        num = 1;
        current = { num: "1", title: "", text: line + "\n" };
      }
    }
  }
  flush();
  if (chapters.length === 0) {
    // 无法识别章节：整本作为一个章节
    chapters.push({ num: "1", title: "", text: fullText });
  }
  return chapters;
}

// —— PDF 原图渲染：将 PDF 每页渲染为 PNG，供阅读页“原图展示 + 翻页”使用 ——
// 返回：{ pages: number, dir: 相对站点的图片目录, files: string[] }
function renderPdfPages(slug, filePath) {
  const pagesDir = join(ROOT, "public", "books", slug, "pages");
  mkdirSync(pagesDir, { recursive: true });

  // 清理旧页面图（幂等：源文件变化时重新整目录渲染，避免残留旧页）
  for (const f of readdirSync(pagesDir)) {
    if (/^page-\d+\.png$/i.test(f)) {
      try { rmSync(join(pagesDir, f), { force: true }); } catch { /* 忽略 */ }
    }
  }

  const pages = execSync(
    `pdftoppm -png -r 110 "${filePath}" "${join(pagesDir, "page")}"`,
    { stdio: "pipe" }
  );
  const files = readdirSync(pagesDir)
    .filter((f) => /^page-\d+\.png$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/page-(\d+)/)?.[1] || "0", 10);
      const nb = parseInt(b.match(/page-(\d+)/)?.[1] || "0", 10);
      return na - nb;
    });
  if (files.length === 0) throw new Error("pdftoppm 未渲染出任何页面图片");

  return { pages: files.length, dir: `/books/${slug}/pages/`, files };
}

// 规范化 slug（文件名 → 可作文章 id / json 文件名）
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 判断一个源文件是否已有对应文章（按 epubUrl/pdfUrl 指向该文件）
function findExistingArticleForFile(fileName) {
  if (!existsSync(ARTICLES_DIR)) return null;
  const url = `/books/${fileName}`;
  for (const f of readdirSync(ARTICLES_DIR)) {
    if (!f.endsWith(".md")) continue;
    const content = readFileSync(join(ARTICLES_DIR, f), "utf8");
    if (content.includes(`epubUrl: "${url}"`) || content.includes(`pdfUrl: "${url}"`)) {
      return { slug: basename(f, ".md"), file: f };
    }
  }
  return null;
}

// —— 拆分大书章节为独立 JSON（懒加载用）——
// 章节 >= 30 时，把每章写入 public/books/{slug}/chapters/ch-{index}.json
function splitChaptersForLazyLoad(slug, chapters) {
  if (chapters.length < 30) return false;
  const chunkDir = join(ROOT, "public", "books", slug, "chapters");
  mkdirSync(chunkDir, { recursive: true });
  // 清理旧的章节文件（幂等重建）
  if (existsSync(chunkDir)) {
    for (const f of readdirSync(chunkDir)) {
      if (/^ch-\d+\.json$/.test(f)) {
        try { rmSync(join(chunkDir, f), { force: true }); } catch { /* 忽略 */ }
      }
    }
  }
  chapters.forEach((c, i) => {
    const chunk = { index: i, num: c.num, titleZh: c.titleZh || null, text: c.text, textZh: c.textZh || null };
    writeFileSync(join(chunkDir, `ch-${i}.json`), JSON.stringify(chunk), "utf8");
  });
  console.log(`[build-books] ✓ 拆分 ${chapters.length} 章到 public/books/${slug}/chapters/（懒加载）`);
  return true;
}

// 检查大书章节拆分文件是否已就绪（补齐缺失的章节文件）
function ensureChaptersSplit(slug, chapters) {
  if (chapters.length < 30) return;
  const chunkDir = join(ROOT, "public", "books", slug, "chapters");
  const missing = [];
  for (let i = 0; i < chapters.length; i++) {
    const f = join(chunkDir, `ch-${i}.json`);
    if (!existsSync(f)) {
      missing.push(i);
      const c = chapters[i];
      const chunk = { index: i, num: c.num, titleZh: c.titleZh || null, text: c.text, textZh: c.textZh || null };
      mkdirSync(chunkDir, { recursive: true });
      writeFileSync(f, JSON.stringify(chunk), "utf8");
    }
  }
  if (missing.length > 0) {
    console.log(`[build-books] ✓ 补齐 ${missing.length} 个缺失章节文件 → public/books/${slug}/chapters/`);
  }
}

// 从 EPUB metadata 提取标题/作者
async function extractMeta(filePath) {
  try {
    const data = readFileSync(filePath);
    const zip = await JSZip.loadAsync(data);
    const container = await zip.file("META-INF/container.xml").async("string");
    const opfPath = (container.match(/full-path="([^"]+)"/) || [, ""])[1];
    if (!opfPath || !zip.file(opfPath)) return {};
    const opf = await zip.file(opfPath).async("string");
    const title = (opf.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/) || [, ""])[1].replace(/<[^>]+>/g, "").trim();
    const creator = (opf.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/) || [, ""])[1].replace(/<[^>]+>/g, "").trim();
    const lang = (opf.match(/<dc:language[^>]*>([\s\S]*?)<\/dc:language>/) || [, ""])[1].replace(/<[^>]+>/g, "").trim();
    return { title, creator, lang };
  } catch {
    return {};
  }
}

// 生成 markdown 文章（新文件首次出现时自动补建）
function autoCreateArticle(slug, filePath, ext, meta = {}) {
  if (existsSync(join(ARTICLES_DIR, `${slug}.md`))) return false;
  // 优先用 EPUB metadata 里的书名，否则用规范化后的 slug
  const title = meta.title || slug;
  const author = meta.creator || "";
  const isZh = /[\u4e00-\u9fff]/.test(title);
  const date = new Date().toISOString().slice(0, 10);
  const url = `/books/${basename(filePath)}`;
  const frontmatter = [
    "---",
    `title: "${title}"`,
    `titleEn: "${title}"`,
    `description: "该书已上传，等待补充简介。"`,
    `descriptionEn: "This book has been uploaded; description pending."`,
    `date: ${date}`,
    `section: books`,
    `tags: ${isZh ? '["经典"]' : '["classic"]'}`,
    `tagsEn: ${isZh ? '["classic"]' : '["classic"]'}`,
    `author: "${author}"`,
    `authorEn: "${author}"`,
    ext === ".pdf" ? `pdfUrl: "${url}"` : `epubUrl: "${url}"`,
    `readUrl: "/books/${slug}/read/"`,
    `rating: 5`,
    `draft: false`,
    "---",
    "",
    `# ${title}`,
    "",
    `*本书已自动导入，正文见“在线阅读”。*`,
    "",
  ].join("\n");
  mkdirSync(ARTICLES_DIR, { recursive: true });
  writeFileSync(join(ARTICLES_DIR, `${slug}.md`), frontmatter, "utf8");
  return true;
}

// —— 主流程 ——
async function main() {
  if (!existsSync(BOOKS_DIR)) {
    console.log("[build-books] 未找到 public/books/，跳过");
    return;
  }
  mkdirSync(DATA_DIR, { recursive: true });
  const files = readdirSync(BOOKS_DIR).filter((f) => /\.(epub|pdf)$/i.test(f));
  if (files.length === 0) {
    console.log("[build-books] public/books/ 下没有 EPUB/PDF 文件");
    return;
  }

  let generated = 0;
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const filePath = join(BOOKS_DIR, file);
    const stat = statSync(filePath);

    // 确定 slug：优先复用已有文章映射，否则用文件名
    const existing = findExistingArticleForFile(file);
    const slug = existing ? existing.slug : toSlug(basename(file, ext));

    // 幂等：已有 JSON 且比源文件新则跳过；
    // 但对 PDF 增加校验：若 JSON 非 type:"pdf"，或页面图片目录缺失/页数不符，视为需重新渲染原图
    const jsonPath = join(DATA_DIR, `${slug}.json`);
    let needReRenderPdf = false;
    if (ext === ".pdf" && existsSync(jsonPath)) {
      try {
        const parsed = JSON.parse(readFileSync(jsonPath, "utf8"));
        needReRenderPdf = !parsed || parsed.type !== "pdf";
        if (parsed && parsed.type === "pdf") {
          // 校验页面图片是否齐全
          const pagesDir = join(ROOT, "public", "books", slug, "pages");
          const actual = existsSync(pagesDir)
            ? readdirSync(pagesDir).filter((f) => /^page-\d+\.png$/i.test(f)).length
            : 0;
          needReRenderPdf = actual !== parsed.pages;
        }
      } catch {
        needReRenderPdf = true;
      }
    }
    // 保护已人工精修/已清理翻译稿件的书：若已有 JSON 带 textZh 或 titleZh（说明内容已按原始语言精修），
    // 绝不自动重新解析覆盖，避免把中文原书重新变成英文译本。
    let isCurated = false;
    if (existsSync(jsonPath) && ext === ".epub") {
      try {
        const parsed = JSON.parse(readFileSync(jsonPath, "utf8"));
        isCurated =
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          (parsed[0].textZh !== undefined || parsed[0].titleZh !== undefined);
      } catch {
        isCurated = false;
      }
    }
    if (isCurated) {
      console.log(`[build-books] 跳过（已精修/已清理，保持原始语言）: ${file} -> ${slug}.json`);
      continue;
    }
    if (existsSync(jsonPath) && !needReRenderPdf && statSync(jsonPath).mtimeMs >= stat.mtimeMs) {
      console.log(`[build-books] 跳过（已生成）: ${file} -> ${slug}.json`);
      // 即便幂等跳过，也确保大书章节拆分文件就绪（第一次升级懒加载时补建）
      try {
        const parsed = JSON.parse(readFileSync(jsonPath, "utf8"));
        if (Array.isArray(parsed)) ensureChaptersSplit(slug, parsed);
      } catch { /* JSON 损坏则重新走完整流程 */ }
      continue;
    }

    // PDF 保持原图展示（不解析文本）：渲染每页图片 + 写入页面元数据 JSON
    if (ext === ".pdf") {
      console.log(`[build-books] 渲染 PDF 页面原图 ${file} ...`);
      let pageMeta;
      try {
        pageMeta = renderPdfPages(slug, filePath);
      } catch (e) {
        console.error(`[build-books] ✗ PDF 渲染失败 ${file}: ${e.message}`);
        continue;
      }
      const payload = {
        type: "pdf",
        pages: pageMeta.pages,
        dir: pageMeta.dir,
        files: pageMeta.files,
      };
      writeFileSync(jsonPath, JSON.stringify(payload, null, 2), "utf8");
      console.log(`[build-books] ✓ 生成 ${slug}.json（PDF 原图 ${pageMeta.pages} 页）`);

      // 自动补建文章（仅当尚无文章时）
      if (!existing) {
        if (autoCreateArticle(slug, file, ext, {})) {
          console.log(`[build-books] ✓ 自动补建文章 ${slug}.md`);
        }
      }
      generated++;
      continue;
    }

    console.log(`[build-books] 解析 ${file} ...`);
    let chapters;
    try {
      chapters = await parseEpub(filePath);
    } catch (e) {
      console.error(`[build-books] ✗ 解析失败 ${file}: ${e.message}`);
      continue;
    }
    if (!chapters || chapters.length === 0) {
      console.error(`[build-books] ✗ ${file} 未提取到任何章节`);
      continue;
    }

    // 写入 JSON（保持既有 schema：[{num, text, titleZh?, textZh?}]）
    const payload = chapters.map((c) => ({ num: c.num, text: c.text }));
    writeFileSync(jsonPath, JSON.stringify(payload, null, 2), "utf8");
    console.log(`[build-books] ✓ 生成 ${slug}.json（${chapters.length} 章）`);

    // —— 大书懒加载：章节较多时拆分为独立 JSON，供阅读页按需 fetch ——
    splitChaptersForLazyLoad(slug, chapters);

    // 自动补建文章（仅当尚无文章时）；EPUB 尽量带上真实书名/作者
    if (!existing) {
      const meta = await extractMeta(filePath);
      if (autoCreateArticle(slug, file, ext, meta)) {
        console.log(`[build-books] ✓ 自动补建文章 ${slug}.md`);
      }
    }

    generated++;
  }
  console.log(`[build-books] 完成：新增/更新 ${generated} 本书`);
}

main().catch((e) => {
  console.error("[build-books] 出错：", e);
  process.exit(1);
});
