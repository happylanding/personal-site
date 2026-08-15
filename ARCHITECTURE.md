# Galvin V1 架构基线

Galvin V1 采用 **Astro 内容骨架 + 按需交互 Island + Cloudflare Pages**。Markdown 与 Astro Content Collections 承担文章、藏页、工具和书架的主要内容；搜索、主题、阅读进度和复杂工具仅在需要的位置加载客户端代码。

## 约束

1. 默认使用 Astro、原生 HTML/CSS 与小型客户端脚本；新的 UI 依赖必须证明其包体积和移动端退化合理。
2. 所有业务逻辑、URL 映射、筛选与下载规则必须先有失败测试，再写最小实现。
3. 文章内容不依赖 JavaScript 才能阅读；动效失败或关闭时，导航和正文仍然完整可用。
4. 首版部署维持 Cloudflare Pages；需要私密后台、自动网址分析、语义搜索或文件上传时，再渐进迁往 Cloudflare Workers。
5. `main` 是稳定线上分支；所有改版只在 `revamp/galvin-v1` 实施与审阅。
