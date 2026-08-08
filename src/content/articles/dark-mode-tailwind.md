---
title: "Tailwind CSS 暗色模式实践"
titleEn: "Practicing Dark Mode with Tailwind CSS"
description: "介绍如何使用 Tailwind CSS 的 class 策略实现暗色模式切换。"
descriptionEn: "How to implement dark mode toggle using Tailwind CSS class strategy."
date: 2026-07-25
tags: ["tailwind", "css", "design"]
tagsEn: ["tailwind", "css", "design"]
section: tips
---

暗色模式已成为现代网站的标配功能。Tailwind CSS 提供了极其简洁的方式来实现暗色模式。

## 配置

在 `tailwind.config.js` 中设置：

```js
module.exports = {
  darkMode: "class",
  // ...
};
```

使用 `class` 策略意味着当 `<html>` 元素上有 `dark` 类时，所有 `dark:` 前缀的样式生效。

## 使用方式

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  这个 div 会在浅色/暗色模式间自动切换
</div>
```

## 切换实现

配合 `localStorage` 持久化用户偏好：

```js
// 初始化主题
const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}

// 切换按钮
toggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
```

## 设计建议

1. 避免纯黑背景（`#000`），使用深灰（`gray-950`）更舒适
2. 在暗色模式下降低文字对比度，使用 `gray-300` 代替纯白
3. 保持交互元素的视觉响应一致

---

暗色模式不仅关乎美观，也能在低光环境中保护用户视力。
