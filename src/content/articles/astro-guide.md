---
title: "使用 Astro 构建静态网站"
titleEn: "Building Static Sites with Astro"
description: "Astro 是一个现代的静态网站生成器，专为内容驱动的网站设计。"
descriptionEn: "Astro is a modern static site generator designed for content-driven websites."
date: 2026-07-28
tags: ["astro", "web", "tutorial"]
tagsEn: ["astro", "web", "tutorial"]
section: tips
---

Astro 是近年来最受欢迎的静态网站生成器之一。它的核心设计理念是 **"零 JavaScript 默认输出"**（Zero JS by default），只在需要交互的地方加载 JavaScript。

## 为什么选择 Astro？

1. **组件群岛架构（Islands Architecture）**：页面的大部分是纯 HTML，只有交互式组件才会加载 JS
2. **多框架支持**：可以在同一个项目中使用 React、Vue、Svelte 等
3. **内容集合（Content Collections）**：类型安全的 Markdown/MDX 管理
4. **出色的开发体验**：热更新极快，构建速度优秀

## 基本使用

创建一个新的 Astro 项目非常简单：

```bash
npm create astro@latest
```

然后按提示选择配置即可。

## 与 Tailwind CSS 集成

Astro 官方提供了 Tailwind CSS 集成：

```bash
npx astro add tailwind
```

这样就完成了配置，可以直接在 `.astro` 文件中使用 Tailwind 类名。

---

Astro 非常适合构建个人博客、文档站和内容网站。它的学习曲线平缓，文档完善，值得尝试。
