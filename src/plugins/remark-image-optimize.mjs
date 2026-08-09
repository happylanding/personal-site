/**
 * remark-image-optimize — 文章 Markdown 图片自动优化
 *
 * 对 Markdown 中的图片（![alt](src)）自动：
 *  - 追加 decoding="async"
 *  - 非首屏图片加 loading="lazy"（正文插图均非首屏）
 *  - 若 /images 下存在同名 .webp，则把 src 切换到 .webp（体积平均降 85%）
 *
 * 说明：width/height 在文章页封面用固定 1200×630；正文插图宽度不定，
 * 用 CSS（.article-content img { height:auto }）避免布局抖动，此处不再强加数值。
 */
import { visit } from "unist-util-visit";
import { existsSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(new URL("../../", import.meta.url).pathname);

export default function remarkImageOptimize() {
  return function (tree) {
    visit(tree, "image", (node) => {
      if (!node.url || !/^\/images\//.test(node.url)) return;
      // 优先用同目录 .webp（体积平均降 85%）
      if (node.url.endsWith(".png")) {
        const webpUrl = node.url.replace(/\.png$/, ".webp");
        const abs = path.join(REPO_ROOT, "public", webpUrl.replace(/^\//, ""));
        if (existsSync(abs)) node.url = webpUrl;
      }
      // 追加图片属性（渲染为 <img ...>）
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      const props = node.data.hProperties;
      props.decoding = "async";
      // 正文插图都不是首屏内容，统一懒加载
      props.loading = "lazy";
    });
  };
}
