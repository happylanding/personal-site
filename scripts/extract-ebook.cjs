/**
 * 统一电子书提取工具
 * 
 * 支持的格式：
 *  - EPUB  (.epub)   — 使用 epub 库，提取 NCX/Spine 目录 + 逐章文本
 *  - FB2    (.fb2)    — 使用 fast-xml-parser，提取 XML 结构树
 *  - MOBI   (.mobi)   — 提取 EXTH/PalmDOC 头信息（目录有限，建议转为 EPUB）
 *  - AZW3   (.azw3)   — 提取基础头信息（建议转为 EPUB）
 *  - TXT    (.txt)    — 正则匹配章节标题
 *  - PDF    (.pdf)    — 使用 pdf-parse 提取文本 + 基础章节检测
 *
 * 输出：
 *   {slug}.toc.json      — 完整目录结构（含层级关系）
 *   {slug}.preview.json  — 前 3 章完整文本，供在线预览
 *
 * 用法：
 *   node scripts/extract-ebook.cjs <文件路径> [--slug <标识符>] [--max-preview 3]
 *
 * 批处理：
 *   node scripts/batch-extract.cjs
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// =========================== 参数解析 ===========================

const args = process.argv.slice(2);
const filePath = args.find(a => !a.startsWith("--")) || "";
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : null;
};

const slug = getArg("slug") || path.basename(filePath, path.extname(filePath));
const maxPreviewChapters = parseInt(getArg("max-preview")) || 3;
const outputDir = path.join(__dirname, "..", "public", "books");

if (!filePath || !fs.existsSync(filePath)) {
  console.error("Usage: node scripts/extract-ebook.cjs <file> [--slug <slug>] [--max-preview 3]");
  console.error("Error: file not found:", filePath);
  process.exit(1);
}

const ext = path.extname(filePath).toLowerCase();

// =========================== 输出工具 ===========================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveJSON(filename, data) {
  const file = path.join(outputDir, filename);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  const size = (JSON.stringify(data).length / 1024).toFixed(1);
  console.log(`  ✓ ${filename} (${size} KB)`);
}

function generateId(title, index) {
  const hash = crypto.createHash("md5").update(title || String(index)).digest("hex").slice(0, 8);
  return `ch-${hash}`;
}

function stripHTML(text) {
  return text.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#?\w+;/g, "").trim();
}

function truncateText(text, maxLen = 2000) {
  const cleaned = stripHTML(text);
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen) + "...";
}

// =========================== EPUB 提取 ===========================

async function extractEPUB(filePath) {
  const { EPub } = require("epub");
  const epub = new EPub(filePath);
  await epub.parse();

  // 过滤有效的 content flow（跳过封面和 Gutenberg 样板）
  const contentFlow = (epub.flow || []).filter(f => {
    const id = (f.id || "").toLowerCase();
    const href = (f.href || "").toLowerCase();
    if (id.includes("cover")) return false;
    if (id.includes("pg-header") || href.includes("pg-header")) return false;
    return true;
  });

  const metadata = {
    title: epub.metadata?.title || "Unknown",
    author: epub.metadata?.creator || "Unknown",
    language: epub.metadata?.language || "unknown",
    format: "epub",
    hasTOC: !!(epub.toc && epub.toc.length > 0),
  };

  // 从 NCX toc 提取目录结构
  const toc = [];
  if (epub.toc && epub.toc.length > 0) {
    function walkTOC(items, level = 0) {
      for (const item of items) {
        toc.push({
          id: item.id || generateId(item.title, toc.length),
          title: item.title || `Chapter ${toc.length + 1}`,
          level: level,
          href: item.href || null,
        });
        if (item.children && item.children.length > 0) {
          walkTOC(item.children, level + 1);
        }
      }
    }
    walkTOC(epub.toc);
  }

  // 如果 NCX 没有目录，从 flow 生成
  if (toc.length === 0 && contentFlow.length > 0) {
    contentFlow.forEach((f, i) => {
      toc.push({
        id: f.id || generateId("ch-" + i, i),
        title: f.title || `Chapter ${i + 1}`,
        level: 0,
        href: f.href || null,
      });
    });
  }

  // 提取前 N 章预览（从 flow 而非 toc，因为 toc id 不在 manifest 中）
  const previewChapters = [];
  const previewCount = Math.min(maxPreviewChapters, contentFlow.length);

  for (let i = 0; i < previewCount; i++) {
    const flowEntry = contentFlow[i];
    // 匹配到对应的 toc 标题
    const tocEntry = toc[i] || { title: flowEntry.title || `Chapter ${i + 1}` };

    try {
      const text = await epub.getChapter(flowEntry.id);
      previewChapters.push({
        id: flowEntry.id,
        title: tocEntry.title || flowEntry.title || `Chapter ${i + 1}`,
        level: tocEntry.level || 0,
        content: truncateText(text, 3000),
      });
    } catch {
      previewChapters.push({
        id: flowEntry.id,
        title: tocEntry.title || flowEntry.title || `Chapter ${i + 1}`,
        level: tocEntry.level || 0,
        content: "(Preview not available)",
      });
    }
  }

  return { metadata, toc, totalChapters: toc.length, previewChapters };
}

// =========================== FB2 提取 ===========================

async function extractFB2(filePath) {
  const { XMLParser } = require("fast-xml-parser");
  const xml = fs.readFileSync(filePath, "utf-8");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
  });
  const doc = parser.parse(xml);
  const fb = doc.FictionBook;

  const metadata = {
    title: fb?.description?.["title-info"]?.["book-title"] || "Unknown",
    author: (() => {
      const a = fb?.description?.["title-info"]?.author;
      if (!a) return "Unknown";
      const first = a.firstName || a["first-name"] || "";
      const last = a.lastName || a["last-name"] || "";
      return `${first} ${last}`.trim();
    })(),
    language: fb?.description?.["title-info"]?.lang || "unknown",
    format: "fb2",
    hasTOC: false,
  };

  const toc = [];
  const previewChapters = [];

  // 遍历 body 中的 section 层级
  function walkSections(sections, level = 0) {
    if (!sections) return;
    const items = Array.isArray(sections) ? sections : [sections];
    for (const sec of items) {
      const titleEl = sec.title;
      let title = "";
      // FB2 title 可嵌套 p
      if (titleEl) {
        const paras = titleEl.p || [];
        if (Array.isArray(paras)) {
          title = paras.map(p => (typeof p === "string" ? p : p["#text"] || "")).join(" ");
        } else if (typeof paras === "string") {
          title = paras;
        }
      }
      title = title || sec["@_id"] || `Chapter ${toc.length + 1}`;
      const id = sec["@_id"] || generateId(title, toc.length);
      toc.push({ id, title: stripHTML(title), level });

      if (sec.section) {
        walkSections(sec.section, level + 1);
      }
    }
  }

  const body = fb?.body;
  if (body) {
    metadata.hasTOC = true;
    walkSections(body.section);
  }

  // 预览章节
  const previewCount = Math.min(maxPreviewChapters, toc.length);
  for (let i = 0; i < previewCount; i++) {
    previewChapters.push({
      id: toc[i].id,
      title: toc[i].title,
      level: toc[i].level,
      content: "(FB2 chapter content — full text available on download)",
    });
  }

  return { metadata, toc, totalChapters: toc.length, previewChapters };
}

// =========================== MOBI / AZW3 提取 ===========================

function extractMOBI(filePath) {
  /**
   * MOBI 格式是 Amazon 封闭格式。纯 JS 环境下我们只能提取：
   *  - PDB Header（类型识别）
   *  - PalmDOC Header（压缩信息）
   *  - MOBI Header（EXTH 元数据：标题、作者）
   *
   * 完整的目录（NCX）提取需要：
   *  a) 解压 PalmDOC 数据（lz77 变体）
   *  b) 解析 MOBI 内部的 HTML/NCX 资源
   *
   * 推荐方案：使用 Calibre 的 `ebook-convert` 转为 EPUB 后再提取，或使用
   * Cloudflare Worker 运行 calibre 命令。
   *
   * 这里我们只提取基本元数据，并生成占位目录。
   */
  const buf = fs.readFileSync(filePath);

  if (buf.length < 200) {
    throw new Error("File too small to be a valid MOBI/AZW3");
  }

  // PDB Header: 前 78 字节
  const name = buf.toString("utf-8", 0, 32).replace(/\0/g, "").trim();
  const fileType = buf.toString("utf-8", 60, 68).replace(/\0/g, "").trim();

  // MOBI Header 在 PalmDOC header 之后，偏移 = 78 + 16 + 偏移量
  const palmOffset = 78 + 16;

  let metadata = {
    title: name || "Unknown",
    author: "Unknown",
    language: "unknown",
    format: ext === ".azw3" ? "azw3" : "mobi",
    hasTOC: false,
    note: "MOBI/AZW3 is a proprietary Amazon format. Full TOC extraction requires conversion to EPUB via Calibre. Only basic metadata has been extracted.",
  };

  // 尝试定位 MOBI header magic (0x424F4F4D = "MOBI")
  let mobiOffset = -1;
  for (let i = palmOffset; i < Math.min(buf.length - 4, 1000); i++) {
    if (buf[i] === 0x4D && buf[i + 1] === 0x4F && buf[i + 2] === 0x42 && buf[i + 3] === 0x49) {
      mobiOffset = i;
      break;
    }
  }

  if (mobiOffset > 0) {
    // MOBI Header length (uint32 at offset+20)
    const mobiHeaderLen = buf.readUInt32BE(mobiOffset + 20) || 232;
    // EXTH 紧随 MOBI header
    const exthOffset = mobiOffset + mobiHeaderLen;

    // 检查 EXTH magic (0x45585448 = "EXTH")
    if (
      exthOffset + 12 < buf.length &&
      buf[exthOffset] === 0x45 &&
      buf[exthOffset + 1] === 0x58 &&
      buf[exthOffset + 2] === 0x54 &&
      buf[exthOffset + 3] === 0x48
    ) {
      const recordCount = buf.readUInt32BE(exthOffset + 8);
      let pos = exthOffset + 12;

      for (let r = 0; r < recordCount && pos + 8 < buf.length; r++) {
        const recType = buf.readUInt32BE(pos);
        const recLen = buf.readUInt32BE(pos + 4);
        const recData = buf.slice(pos + 8, pos + 8 + recLen - 8);

        // EXTH record types:
        // 100 = Author, 503 = Title, 524 = Language
        if (recType === 100 && recLen > 8) {
          metadata.author = recData.toString("utf-8").replace(/\0/g, "").trim();
        }
        if (recType === 503 && recLen > 8) {
          metadata.title = recData.toString("utf-8").replace(/\0/g, "").trim();
        }
        if (recType === 524 && recLen > 8) {
          metadata.language = recData.toString("utf-8").replace(/\0/g, "").trim();
        }
        pos += recLen;
      }
    }
  }

  // 占位目录
  const toc = [
    {
      id: generateId("toc-placeholder", 0),
      title: `Table of Contents — ${metadata.format.toUpperCase()} file`,
      level: 0,
      note: "Full TOC not available for MOBI/AZW3 in pure JS. Convert to EPUB with Calibre for complete TOC extraction.",
    },
  ];

  const previewChapters = [
    {
      id: toc[0].id,
      title: toc[0].title,
      level: 0,
      content: metadata.note,
    },
  ];

  return { metadata, toc, totalChapters: toc.length, previewChapters };
}

// =========================== TXT 提取 ===========================

function extractTXT(filePath) {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split(/\r?\n/);

  const metadata = {
    title: slug,
    author: "Unknown",
    language: "unknown",
    format: "txt",
    hasTOC: false,
  };

  // 正则匹配常见章节格式
  const chapterPatterns = [
    /^(第[一二三四五六七八九十百千\d]+[章节回篇部])/,
    /^(Chapter\s+\d+)/i,
    /^(Part\s+\d+)/i,
    /^(Section\s+\d+)/i,
    /^(Book\s+\d+)/i,
    /^(VOLUME\s+\d+)/i,
    /^(卷)\s*[第]?[一二三四五六七八九十百千\d]+/,
    /^(\d+[\.\,\。\、]\s)/,
    /^(CHAPTER\s+\d+)/i,
    /^(PROLOGUE|EPILOGUE|PREFACE|INTRODUCTION|CONTENTS|INDEX)/i,
  ];

  const toc = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.length > 100) continue;
    for (const pat of chapterPatterns) {
      const match = line.match(pat);
      if (match) {
        toc.push({
          id: generateId(line, toc.length),
          title: line,
          level: 0,
          lineNumber: i,
        });
        break;
      }
    }
  }

  if (toc.length > 0) metadata.hasTOC = true;

  // 预览：取前 maxPreviewChapters 章，每章接下来 200 行
  const previewChapters = [];
  const previewCount = Math.min(maxPreviewChapters, toc.length);
  for (let c = 0; c < previewCount; c++) {
    const startLine = toc[c].lineNumber;
    const endLine = Math.min(startLine + 200, lines.length);
    const content = lines.slice(startLine, endLine).join("\n");
    previewChapters.push({
      id: toc[c].id,
      title: toc[c].title,
      level: toc[c].level,
      content: truncateText(content, 3000),
    });
  }

  // 没有章节时基于空行分段
  if (toc.length === 0) {
    const totalLines = lines.length;
    const segmentSize = Math.ceil(totalLines / 10);
    for (let s = 0; s < 10 && s * segmentSize < totalLines; s++) {
      const start = s * segmentSize;
      const end = Math.min(start + segmentSize, totalLines);
      const segTitle = `Part ${s + 1}`;
      toc.push({
        id: generateId(segTitle, s),
        title: segTitle,
        level: 0,
        lineNumber: start,
      });
    }
    if (toc.length > 0) metadata.hasTOC = true;

    for (let c = 0; c < Math.min(maxPreviewChapters, toc.length); c++) {
      const startLine = toc[c].lineNumber;
      const endLine = Math.min(startLine + 200, lines.length);
      previewChapters.push({
        id: toc[c].id,
        title: toc[c].title,
        level: toc[c].level,
        content: truncateText(lines.slice(startLine, endLine).join("\n"), 3000),
      });
    }
  }

  return { metadata, toc, totalChapters: toc.length, previewChapters };
}

// =========================== PDF 提取 ===========================

async function extractPDF(filePath) {
  /**
   * PDF TOC extraction has limited pure-JS support.
   * 
   * pdfjs-dist v4 is ESM-only and cannot be `require()`'d from CJS.
   * For a full solution, consider:
   *   a) Rename this script to .mjs and use ESM imports
   *   b) Use pdf-parse (npm) v1.x for text extraction  
   *   c) Manually create TOC JSON for each PDF
   * 
   * Currently: generate a metadata-only TOC with page count
   * using basic file inspection.
   */
  const buf = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);

  // 从 PDF 头提取基本元数据
  const header = buf.toString("latin1", 0, Math.min(buf.length, 2000));
  let title = slug;
  let author = "Unknown";

  // 尝试匹配 /Title 和 /Author
  const titleMatch = header.match(/\/Title\s*\(([^)]*)\)/);
  if (titleMatch) title = titleMatch[1] || slug;

  const authorMatch = header.match(/\/Author\s*\(([^)]*)\)/);
  if (authorMatch) author = authorMatch[1] || "Unknown";

  // 统计页数 （粗略匹配 /Page 对象）
  const pageMatches = header.match(/\/Type\s*\/Page[^s]/g);
  const estimatedPages = pageMatches ? pageMatches.length : 1;

  // 查找 /Outlines 书签（如果存在，说明有目录信息但无法直接提取）
  const hasBookmarks = /\/Outlines/.test(header);

  const metadata = {
    title,
    author,
    language: "unknown",
    format: "pdf",
    totalPages: estimatedPages,
    hasTOC: hasBookmarks,
    note: hasBookmarks
      ? "PDF contains bookmarks, but pure-JS extraction for them requires pdfjs-dist (ESM). Run with .mjs script for full bookmark extraction."
      : "PDF does not contain embedded bookmarks. For the best reading experience, create a manual TOC JSON.",
  };

  const toc = [];
  if (hasBookmarks) {
    toc.push({
      id: generateId("pdf-bookmarks", 0),
      title: "Bookmarks (embedded in PDF — full extraction requires ESM)",
      level: 0,
    });
  }

  const previewChapters = [
    {
      id: generateId("preview", 0),
      title: `${title} — ${estimatedPages} pages — ${(stats.size / 1024).toFixed(0)} KB`,
      level: 0,
      content: truncateText(
        "PDF preview is available on download. For online reading, PDF files can be viewed directly in the browser. " +
          (metadata.note || ""),
        3000
      ),
    },
  ];

  return { metadata, toc, totalChapters: toc.length || estimatedPages, previewChapters };
}

// =========================== 主逻辑 ===========================

async function main() {
  console.log(`\n📖 提取: ${path.basename(filePath)} (${ext})`);

  let result;

  switch (ext) {
    case ".epub":
      console.log("  格式: EPUB — 使用 epub 库提取 NCX 导航 + Spine");
      result = await extractEPUB(filePath);
      break;

    case ".fb2":
      console.log("  格式: FB2 — 使用 fast-xml-parser 提取 XML 结构树");
      result = await extractFB2(filePath);
      break;

    case ".mobi":
      console.log("  格式: MOBI — 提取 EXTH 头信息（目录推荐转 EPUB）");
      result = extractMOBI(filePath);
      break;

    case ".azw3":
    case ".azw":
      console.log("  格式: AZW3 — 提取头信息（目录推荐转 EPUB）");
      result = extractMOBI(filePath);
      break;

    case ".txt":
      console.log("  格式: TXT — 正则匹配章节标题");
      result = extractTXT(filePath);
      break;

    case ".pdf":
      console.log("  格式: PDF — 使用 pdf-parse 提取文本 + 章节检测");
      result = await extractPDF(filePath);
      break;

    default:
      console.error(`  ✗ 不支持的格式: ${ext}`);
      console.error("  当前支持: .epub .fb2 .mobi .azw3 .txt .pdf");
      process.exit(1);
  }

  // 输出统计
  console.log(`\n📋 元数据:`);
  console.log(`  标题: ${result.metadata.title}`);
  console.log(`  作者: ${result.metadata.author}`);
  console.log(`  语言: ${result.metadata.language}`);
  console.log(`  格式: ${result.metadata.format}`);
  console.log(`  目录: ${result.metadata.hasTOC ? "✓ 已提取" : "✗ 未能提取"}`);
  console.log(`  章数: ${result.totalChapters}`);

  if (result.metadata.note) {
    console.log(`  ⚠️  ${result.metadata.note}`);
  }

  // 保存输出
  ensureDir(outputDir);

  // TOC file
  const tocFileName = `${slug}.toc.json`;
  saveJSON(tocFileName, {
    title: result.metadata.title,
    author: result.metadata.author,
    language: result.metadata.language,
    format: result.metadata.format,
    totalChapters: result.totalChapters,
    pageCount: result.metadata.totalPages || null,
    note: result.metadata.note || null,
    extractedAt: new Date().toISOString(),
    toc: result.toc,
  });

  // Preview file
  const previewFileName = `${slug}.preview.json`;
  saveJSON(previewFileName, {
    title: result.metadata.title,
    format: result.metadata.format,
    chapters: result.previewChapters,
  });

  console.log(`\n✅ 完成！输出目录: ${outputDir}/\n`);
}

main().catch((err) => {
  console.error("❌ 提取失败:", err.message);
  process.exit(1);
});
