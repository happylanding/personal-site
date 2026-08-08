const { EPub } = require("epub");

async function test() {
  const e = new EPub("public/books/the-art-of-war.epub");
  await e.parse();

  console.log("=== TOC ===");
  console.log("TOC count:", e.toc.length);
  e.toc.slice(0, 5).forEach(t => console.log(`  id=${t.id} title=${t.title}`));

  console.log("\n=== Flow ===");
  console.log("Flow count:", e.flow.length);
  e.flow.slice(0, 5).forEach(f => console.log(`  id=${f.id} href=${f.href}`));

  console.log("\n=== Manifest Check ===");
  console.log("np-1 in manifest:", !!e.manifest["np-1"]);
  console.log("item4 in manifest:", !!e.manifest["item4"]);

  // 用 flow 的 id 获取章节
  const chapterText = await e.getChapter("item4");
  console.log("\n=== Chapter item4 ===");
  console.log("Length:", chapterText.length);
  console.log("Preview:", chapterText.slice(0, 200));

  // 遍历所有 flow 章节获取内容
  console.log("\n=== All Chapters ===");
  for (let i = 0; i < Math.min(e.flow.length, 5); i++) {
    const f = e.flow[i];
    try {
      const text = await e.getChapter(f.id);
      console.log(`[${i}] ${f.id}: ${text.slice(0, 80)}...`);
    } catch (err) {
      console.log(`[${i}] ${f.id}: SKIP (${err.message})`);
    }
  }
}

test().catch(console.error);
