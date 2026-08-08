/**
 * 批量电子书目录提取脚本
 *
 * 扫描 public/books/ 目录下所有电子书文件，
 * 对尚未生成 .toc.json 的文件执行提取，
 * 支持并行处理。
 *
 * 用法：
 *   node scripts/batch-extract.cjs [--force]
 *     --force  强制重新提取所有文件（覆盖已有 JSON）
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const booksDir = path.join(__dirname, "..", "public", "books");
const force = process.argv.includes("--force");

if (!fs.existsSync(booksDir)) {
  console.log("public/books/ 目录不存在，跳过。");
  process.exit(0);
}

// 支持的扩展名
const supportedExts = [".epub", ".fb2", ".mobi", ".azw3", ".azw", ".txt", ".pdf"];

// 扫描所有电子书文件
const allFiles = fs.readdirSync(booksDir);
const bookFiles = allFiles
  .filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return supportedExts.includes(ext);
  })
  .map((f) => path.join(booksDir, f));

if (bookFiles.length === 0) {
  console.log("未找到支持的电子书文件。");
  process.exit(0);
}

console.log(`\n📚 批量电子书目录提取`);
console.log(`  目录: ${booksDir}`);
console.log(`  找到 ${bookFiles.length} 本书`);
console.log(`  模式: ${force ? "强制重新提取" : "仅提取未处理的文件"}\n`);

let processed = 0;
let skipped = 0;
let failed = 0;

for (const bookFile of bookFiles) {
  const basename = path.basename(bookFile);
  const slug = basename.replace(path.extname(basename), "");
  const tocFile = path.join(booksDir, `${slug}.toc.json`);

  // 跳过已处理的文件（除非 --force）
  if (fs.existsSync(tocFile) && !force) {
    console.log(`⏭️ 跳过 ${basename}（已有 TOC）`);
    skipped++;
    continue;
  }

  try {
    console.log(`\n--- 处理: ${basename} ---`);
    execSync(`node "${path.join(__dirname, 'extract-ebook.cjs')}" "${bookFile}" --slug "${slug}"`, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
    processed++;
  } catch (err) {
    console.error(`❌ 失败: ${basename}`, err.message);
    failed++;
  }
}

console.log(`\n========================================`);
console.log(`📊 统计: 成功 ${processed} | 跳过 ${skipped} | 失败 ${failed}`);
console.log(`========================================\n`);

// 生成索引文件
const indexData = [];
const allJsonFiles = fs.readdirSync(booksDir).filter(f => f.endsWith(".toc.json"));

for (const jsonFile of allJsonFiles) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(booksDir, jsonFile), "utf-8"));
    const slug = jsonFile.replace(".toc.json", "");
    // 找到对应的电子书文件
    const ebookFile = allFiles.find(f => {
      const fSlug = path.basename(f).replace(path.extname(f), "");
      return fSlug === slug;
    });
    indexData.push({
      slug,
      title: data.title,
      author: data.author,
      format: data.format,
      totalChapters: data.totalChapters,
      fileName: ebookFile ? path.basename(ebookFile) : null,
      extractedAt: data.extractedAt,
    });
  } catch {}
}

if (indexData.length > 0) {
  const indexFile = path.join(booksDir, "books-index.json");
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2), "utf-8");
  console.log(`📑 已生成书籍索引: books-index.json (${indexData.length} 本)\n`);
}
