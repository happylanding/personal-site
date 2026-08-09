---
title: "My First Vibe Coding Project — Building a Personal Site with AI"
titleEn: "My First Vibe Coding Project — Building a Personal Site with AI"
description: "A non-developer built a 55-page bilingual personal site in five days by talking to AI. This article documents the whole process: how we divided labor, how the five stages went, the mobile adaptation pitfalls, and which lessons you can copy directly."
descriptionEn: "A non-developer built a 55-page bilingual personal site in five days by talking to AI. This article documents the whole process: how we divided labor, how the five stages went, the mobile adaptation pitfalls, and which lessons you can copy directly."
date: 2026-08-02
tags: ["Vibe Coding", "AI Programming", "Web Dev", "Personal Blog", "CodeBuddy"]
tagsEn: ["Vibe Coding", "AI Programming", "Web Dev", "Personal Blog", "CodeBuddy"]
section: tips
---

> Author: Galvin · Co-creator: CodeBuddy
> 2026-08-02

---

## The Bottom Line First

This article is written for everyone who has been shut out by the phrase "I can't program."

I can't write code, and I've never systematically learned any framework. But by talking to AI, I built a working personal website in 5 days — 55+ bilingual pages, zero build errors, deployed at [galvinai.pages.dev](https://galvinai.pages.dev).

This article covers four things: what Vibe Coding is, how we divided the work, how the five stages progressed, and which pitfalls are worth avoiding.

This isn't a technical tutorial — it's a record of "possibility."

---

## 1. What Is Vibe Coding

The term was coined by former OpenAI researcher Andrej Karpathy. It describes a new way of programming: code is no longer typed character by character; instead, you talk to AI in natural language, AI executes, you share ideas, and you iterate together.

I'm neither a frontend engineer nor a professional developer. I'm a person with ideas and content to express, held back by the technical barrier.

This article records how I turned the vague thought "I want a personal website" into a real, running URL online.

---

## 2. The Starting Point: I Just Wanted a Website

My requirements were simple:

- An online space for thoughts, insights, tips, reading notes, and investment reviews
- Bilingual, serving two kinds of readers at once
- Clean, quiet, not flashy
- Searchable
- Works well on both phone and computer

The traditional path would mean learning HTML, CSS, JavaScript, then a modern framework, then responsive design, i18n, and deployment operations. I had some familiarity with these topics, but my experience running through a complete project was zero.

But I had a conversation partner: CodeBuddy. It can modify code on the local filesystem, build the project, and even verify results with browser screenshots.

**On August 1, 2026, I opened the first conversation window.**

---

## 3. How We Divided the Work

Looking back at the past few days of development, I realize we formed a special collaboration model:

| Traditional Development | Our Way |
|------------------------|---------|
| I write code, Google for docs | I describe ideas, AI writes code |
| Ctrl+C / Ctrl+V copy-paste | AI modifies project files directly |
| Run → error → check logs → fix | AI builds → verifies with screenshots → pinpoints the issue |
| I look up CSS property meanings | I just say "the spacing is too big" |
| "This bug took 3 hours to fix" | "Describe the symptom, solved in 3 rounds of conversation" |

![How we divided the work](/images/vibe-coding/division-of-labor-en.png)

**My role**: Product Manager + QA tester + decision-maker
**AI's role**: Full-stack developer + automated tester + technical writer

The conversation was extremely natural. I'd often take a screenshot and say "look, this is the mobile version, and it clearly doesn't meet the requirements." AI would analyze the root cause, find the files, make the change, build, and verify — and at the end I'd just confirm "that's good."

But this kind of lazy description also wasted a fair amount of compute. Vague phrases like "clearly doesn't meet the requirements" made AI check all kinds of unrelated things. Once, to fix a single text-overflow issue, we burned through 100+ compute units without solving it. Later I adjusted my approach, calmed down, and described the problem clearly — efficiency went up immediately.

---

## 4. Five Stages: From Zero to Launch

The whole project can be divided into five stages.

![Five stages: from zero to launch](/images/vibe-coding/five-stages-en.png)

### Stage 1: Build the Skeleton (~2 hours)

I said: "I want to build a personal blog website, bilingual, using the Astro framework."

AI helped me choose Astro. The reasoning was practical: a website is essentially a bunch of articles; no complex frontend interactions needed; Astro compiles to pure static HTML — fast, secure, simple to deploy.

This stage set up:
- Project initialization and directory structure
- Markdown + frontmatter data model for articles
- Homepage + four column pages (Industry Insights, Practical Tips, Book Shelf, Investment Review)
- About / Contact pages

### Stage 2: Core Features (~1 hour)

Every feature was "your idea + AI's implementation":

- **Bilingual (i18n)**: URL-path-based switching (`/zh/` vs `/en/`), with pages, navigation, and SEO metadata all synced
- **Dark / light theme**: click to toggle, follows system preference, remembers locally
- **Full-text search**: floating search panel, supporting Chinese word segmentation and English search
- **Table visualization**: homepage articles categorized by tag, like a Notion database view

### Stage 3: Polish the Pages (~4 hours)

This was the most conversation-dense stage and where Vibe Coding felt strongest. A typical rhythm:

1. I say: "The header should be a dropdown menu"
2. AI understands and gives a design plan
3. I confirm
4. AI edits Header.astro and builds
5. I look at the result screenshot: "make this spacing bigger, the arrow animation isn't smooth enough"
6. AI fine-tunes and rebuilds

Back and forth like an improvised jam session. My aesthetic sense + AI's execution = results both sides are happy with.

The final header achieved:
- Desktop: multi-level dropdown menu with hover and underline animations
- Mobile: hamburger menu expanding into a full-screen slide-out panel
- Function buttons: language switch, theme switch, search toggle — icons + text, with hover states

### Stage 4: Mobile Adaptation (the hardest, ~6 hours)

This was the most effort-intensive and hardest part of the whole project. We iterated the mobile hamburger menu at least 4 versions:

**v1**: The menu could open, but only showed within the header height — didn't cover everything. The problem was in CSS: `body { overflow-x: hidden }` changed the positioning context of `position: fixed` from the viewport to the body.

**v2**: The menu covered the full screen, but the hamburger button and close button visually overlapped. The fix was raising the header to `z-[70]`, removing the standalone close button inside the overlay, and letting the hamburger button itself animate into an X icon.

**v3**: Menu item spacing too large, too much whitespace. Compressed menu item padding, category label spacing, and panel top padding.

**v4**: Clicking the blank area of the page couldn't close the menu. The earlier event listener only caught `#mobile-overlay-bg`, missing clicks in the nav panel's inner area. Simplified to "any click inside the overlay closes it."

Each problem was sent to AI as a screenshot; it analyzed → modified → built → verified with a Playwright screenshot under an iPhone simulator. Not once was it "shoot from the hip and try" — every step had root-cause analysis and verification.

### Stage 5: Deploy and Launch (~1 hour)

The last step was pushing the project live. We chose the completely free GitHub + Cloudflare Pages option:

1. Initialize Git locally and connect to the GitHub repo
2. Configure SSH keys
3. Connect Cloudflare Pages to the repo for auto build and deploy
4. Hit a `.pages.dev` subdomain conflict when renaming the project (a Cloudflare design quirk — easy to trip over the first time)

After deployment, AI even visited the live URL to verify the homepage load and core navigation.

Final live address: **[galvinai.pages.dev](https://galvinai.pages.dev)** (55+ bilingual pages, zero build errors)

---

## 5. Four Ways of Deep Collaboration

The interaction here is far more complex than "ask one, answer one."

![Four ways of deep collaboration](/images/vibe-coding/four-modes-en.png)

### 5.1 Screenshot-Driven

My most-used approach: screenshot the page, send it to AI, and say "look, this isn't right."

AI automatically:
- Reads the relevant source files
- Analyzes what's wrong in the screenshot
- Locates the specific CSS or JS logic causing it
- Proposes a fix and executes it directly (often I ask for the plan first and confirm before execution)
- Builds the project
- Launches Playwright to screenshot-verify under a mobile simulator

I never needed to understand the difference between `padding-top` and `calc()`, or that `overflow-x: hidden` affects `position: fixed`. AI analyzed and worked around those technical details itself.

### 5.2 Feeling-Driven

I often say things like:
- "The spacing between lines is too big, too much whitespace"
- "This animation isn't smooth enough"
- "The buttons overlap visually, awkward to use"
- "Make the font bigger"
- "The colors could be softer"

These purely subjective expressions get translated by AI into concrete technical changes: adjusting `padding` values, tuning `transition` parameters, reordering `z-index` layers, modifying color values.

### 5.3 Exploratory Probing

Sometimes I don't know what I want either, so I ask:
- "How is a mobile menu usually done?"
- "What else could be added to this page?"
- "Any recommended approaches?"

AI gives a few options, I pick one, it implements. This "show me the options" approach suits people who aren't deeply familiar with technical implementation.

### 5.4 Translation + Review

For all the site's Chinese-English copy, I write Chinese and AI translates to English. Navigation menus, button text, the 404 page, SEO descriptions — all were "I raise the requirement, it executes."

---

## 6. The Four Hardest Problems

![The four hardest problems](/images/vibe-coding/four-problems-en.png)

### Problem 1: The Chain Reaction of `overflow-x: hidden`

**Symptom**: after the mobile hamburger menu opened, it only covered the upper part of the content area; the body text was still visible below.

**Analysis**: AI found that `body { overflow-x: hidden }` made `<body>` a scroll container, so `position: fixed` children were positioned relative to the body rather than the viewport.

**Fix**: keep `overflow-x: hidden` only on `html`, remove the declaration from `body`.

**Lesson**: a seemingly harmless CSS property can cause cross-file problems. Trying to debug that myself, I might never have found the cause.

### Problem 2: The Optical Overlap of Two Buttons

**Symptom**: the X close button in the overlay and the hamburger button on the header stacked on top of each other, confusing users about "which one to click."

**Analysis**: two buttons in the same area with unreasonable z-index distribution.

**Fix**: remove the standalone close button in the overlay; let the hamburger button itself animate into an X, keeping the header layer above the overlay. Open and close are in the same place — muscle memory stays consistent.

### Problem 3: Clicking Blank Space Doesn't Close

**Symptom**: after the menu opened, clicking the blank area between menu items didn't close it.

**Analysis**: the event listener only matched `#mobile-overlay-bg`; clicks on inner divs of the nav panel matched no close condition.

**Fix**: simplify to "any click inside the overlay closes it" — 11 lines of code became 4.

**Lesson**: sometimes the simplest solution is the best.

### Problem 4: The Cloudflare Pages Subdomain Misunderstanding

**Symptom**: renamed the project from `personal-site` to `galvin`, but `galvin.pages.dev` wasn't accessible while the old `personal-site-6ed.pages.dev` still worked.

**Analysis**: Cloudflare Pages' project display name and `.pages.dev` subdomain are separate. The subdomain is locked at creation; renaming only changes the display name.

**Fix**: after understanding the mechanism, deleted the project and redeployed, successfully obtaining `galvinai.pages.dev`.

---

## 7. The Final Result

| Dimension | Status |
|-----------|--------|
| Page count | 55+ bilingual pages |
| Build status | Zero errors |
| Desktop experience | Dropdown nav, table view, full-text search |
| Mobile experience | Full-screen menu panel, touch-friendly, safe-area adaptation |
| Internationalization | Bilingual, URL-path distinguished |
| Theme | Light/dark auto-detection + manual toggle + local memory |
| Deployment | GitHub push → Cloudflare auto build, live in 1–2 minutes |
| SEO | Independent title / description / og:image per page |

---

## 8. In Closing

Before I started, my expectation for AI programming was just "help me write a few chunks of code."

The actual experience far exceeded expectations.

The biggest takeaway isn't how well AI wrote — it's that it took me from being a "code consumer" to a "product creator." I no longer agonize over "how to implement this feature"; instead I focus on "what interaction do I want users to feel." I shifted from caring about How to caring about What and Why.

That's the Vibe: a flowing, intuition-driven creative state. AI reduces the cost of "implementation" to nearly zero and unlocks my creativity and aesthetic sense.

Of course, that doesn't mean I can just sit back and do nothing. I still make the final decisions: whether to keep this animation, whether that spacing is right, which direction the overall design takes. These judgments can't be replaced by AI — and it's exactly these judgments that make a work truly "yours."

If I had one sentence for friends who want to try Vibe Coding: **don't think "I can't" — just think "what do I want," and go have the conversation.**

The project is only preliminarily complete; there's much more to refine and more content to fill in.

Thank you, CodeBuddy. This co-creation is one of the most precious memories of my technical journey 💪
