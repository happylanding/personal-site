---
title: "Rebuilding a Personal Site with AI: A Non-Programmer's Experiment"
titleEn: "Rebuilding a Personal Site with AI: A Non-Programmer's Experiment"
description: "From stack choice, i18n, interactions to deployment — a record of rebuilding a personal site with AI as a non-programmer, plus a practical methodology and the boundaries of Vibe Coding."
descriptionEn: "From stack choice, i18n, interactions to deployment — a record of rebuilding a personal site with AI as a non-programmer, plus a practical methodology and the boundaries of Vibe Coding."
date: 2026-08-10
tags: ["AI", "Vibe Coding", "Hands-on"]
tagsEn: ["AI", "Vibe Coding", "Hands-on"]
section: ai
---

> This is the most "hands-on" article in the AI column — because it documents the very rebuild I'm going through right now: how someone who doesn't know front-end used AI to turn a "I want a personal website" idea into a running product.

---

## 1. Why I Dared to Do This

In the past, building a website meant learning HTML, CSS, JavaScript, deployment — a whole front-end knowledge stack that was enough to scare off most people.

But today it's different:

- AI can understand natural-language goals like "I want a bilingual personal blog"
- AI can generate page structures that match modern aesthetics
- AI can explain errors, fix problems, and optimize interactions

**AI has dramatically lowered the technical bar** — what remains is another kind of bar: the ability to think things through clearly.

## 2. My Workflow: Requirements → Plan → Execute → Verify

Through this rebuild, I've settled into a stable collaboration process:

1. **Say the requirement clearly**: the more specific the better. "I want a personal website" is worse than "I want an Astro-based, bilingual, dark-mode personal blog"
2. **Let AI propose a plan**: explain the thinking before touching anything; for important changes, review the plan before executing
3. **Small steps + continuous verification**: every change must be build-verified — never settle for "looks right"
4. **Acceptance**: local preview, mobile checks, animation feel — score it with real experience

At its core, this process is **borrowing engineering thinking for AI to use**.

## 3. Pitfalls and Lessons

1. **"Big bang" doesn't work**: having AI change ten files at once means you can't localize problems. After switching to small commits, problems immediately decreased.
2. **AI gets overconfident**: sometimes it "helpfully" touches unrelated code. **Always review the diff before merging.**
3. **Build verification is the bottom line**: every change is judged by whether `npm run build` passes. If it doesn't pass, don't merge.
4. **Judgment is the core**: when AI gives me ten options, I need to be able to say why A over B — that requires continuous accumulation.

## 4. Advice for "Non-Programmers"

If you want to do something similar, my advice:

- **Start from real needs**: don't learn for the sake of learning; learn to "solve a problem"
- **Imitate before creating**: have AI reference website styles you like; start from "modifying someone else's work"
- **Stay curious but disciplined**: AI is powerful, but ultimately you're accountable for the results

## 5. Conclusion

This rebuild convinced me: **"being able to program" is shifting from a professional skill into a human capability that AI can amplify.** The door to technology is opening to everyone, and the key to pushing it open is knowing clearly what you want.
