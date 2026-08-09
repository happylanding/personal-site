---
title: "Practicing Dark Mode with Tailwind CSS"
titleEn: "Practicing Dark Mode with Tailwind CSS"
description: "How to implement dark mode toggle using Tailwind CSS class strategy."
descriptionEn: "How to implement dark mode toggle using Tailwind CSS class strategy."
date: 2026-07-25
tags: ["tailwind", "css", "design"]
tagsEn: ["tailwind", "css", "design"]
section: tips
---

Dark mode has become a standard feature of modern websites. Tailwind CSS offers an extremely simple way to implement it.

## Configuration

In `tailwind.config.js`:

```js
module.exports = {
  darkMode: "class",
  // ...
};
```

Using the `class` strategy means that when the `<html>` element has a `dark` class, all `dark:` prefixed styles take effect.

## Usage

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  This div will automatically switch between light/dark mode
</div>
```

## Toggle Implementation

Combine with `localStorage` to persist the user's preference:

```js
// Initialize theme
const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}

// Toggle button
toggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
```

## Design Tips

1. Avoid pure black backgrounds (`#000`); dark gray (`gray-950`) is more comfortable
2. Lower text contrast in dark mode; use `gray-300` instead of pure white
3. Keep interactive elements visually responsive and consistent

---

Dark mode isn't just about looks — it also protects your eyes in low-light environments.
