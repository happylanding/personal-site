import fs from "fs";
import path from "path";
const h = fs.readFileSync("dist/index.html", "utf8");
const cssDir = "dist/_astro";
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith(".css"));
const cssC = cssFiles.map(f => fs.readFileSync(path.join(cssDir,f),"utf8")).join("\n");

console.log("=== 1. ID 唯一性检查（应为 1）===");
["search-trigger","theme-toggle","search-overlay","search-input","hamburger-btn"].forEach(id => {
  const c = (h.match(new RegExp('id="'+id+'"',"g"))||[]).length;
  console.log(`  ${id}: ${c} ${c===1?"OK":"问题!"}`);
});

console.log("\n=== 2. 无 delegate onclick 模式 ===");
console.log("  ", h.includes("getElementById('search-trigger')?.click") ? "仍使用delegate" : "已消除");

console.log("\n=== 3. CSS :global 穿透 ===");
console.log("  :global(.mobile-overlay-open):", cssC.includes(".mobile-overlay-open{overflow")?"OK":"问题");
console.log("  :global(.search-overlay-open):", cssC.includes(".search-overlay-open{overflow")?"OK":"问题");

console.log("\n=== 4. 汉堡菜单 CSS ===");
console.log("  #hamburger-btn.active:", cssC.includes("#hamburger-btn")?"OK":"问题");
console.log("  mobile-overlay-open bg:", cssC.includes("mobile-overlay-open #mobile-overlay-bg")?"OK":"问题");
console.log("  mobile-nav-item:", cssC.includes("mobile-nav-item")?"OK":"问题");
console.log("  safe-area:", cssC.includes("safe-area")?"OK":"问题");

console.log("\n=== 5. 搜索功能 ===");
console.log("  搜索面板自适应:", h.includes("sm:pt-[max(8vh")?"OK":"问题");
console.log("  搜索数据注入:", h.includes('"title":"沉思录')?"OK":"问题");
console.log("  面板可滚动:", h.includes("overflow-y-auto overscroll-contain")?"OK":"问题");

console.log("\n=== 6. 移动端布局 ===");
console.log("  按钮尺寸:", h.match(/w-\[42px\] h-\[42px\]/g)?.length || 0, "个 42x42 按钮");
console.log("  汉堡显示 md:hidden:", h.includes('class="md:hidden')?"OK":"问题");
