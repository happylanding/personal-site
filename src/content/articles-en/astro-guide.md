---
title: "Building Static Sites with Astro"
titleEn: "Building Static Sites with Astro"
description: "Astro is a modern static site generator designed for content-driven websites."
descriptionEn: "Astro is a modern static site generator designed for content-driven websites."
date: 2026-07-28
tags: ["astro", "web", "tutorial"]
tagsEn: ["astro", "web", "tutorial"]
section: tips
---

Astro is one of the most popular static site generators in recent years. Its core design philosophy is **"zero JavaScript by default"** — it only loads JavaScript where interaction is needed.

## Why Choose Astro?

1. **Islands Architecture**: most of a page is pure HTML, and only interactive components load JS
2. **Multi-framework support**: you can use React, Vue, Svelte, and more in the same project
3. **Content Collections**: type-safe Markdown/MDX management
4. **Excellent developer experience**: blazing-fast hot reload and great build performance

## Basic Usage

Creating a new Astro project is very simple:

```bash
npm create astro@latest
```

Then follow the prompts to configure it.

## Integrating Tailwind CSS

Astro provides an official Tailwind CSS integration:

```bash
npx astro add tailwind
```

That completes the configuration, and you can use Tailwind classes directly in `.astro` files.

---

Astro is a great fit for personal blogs, documentation sites, and content websites. Its learning curve is gentle and its documentation is thorough — well worth trying.
