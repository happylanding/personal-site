---
title: "Easy-Vibe Treasure Guide: The Best Resources in Datawhale's AI Coding Course"
titleEn: "Easy-Vibe Treasure Guide: The Best Resources in Datawhale's AI Coding Course"
description: "Datawhale's open-source Easy-Vibe site is full of treasures: hands-on reviews of browser-based coding platforms, Claude Code / MCP / Agent Teams deep dives, and a 49-article appendix. This guide walks through the whole zero-to-fullstack AI coding map."
descriptionEn: "Datawhale's open-source Easy-Vibe site is full of treasures: hands-on reviews of browser-based coding platforms, Claude Code / MCP / Agent Teams deep dives, and a 49-article appendix. This guide walks through the whole zero-to-fullstack AI coding map."
date: 2026-08-08
tags: ["AI Coding", "Vibe Coding", "Learning Path", "Datawhale", "Resources"]
tagsEn: ["AI Coding", "Vibe Coding", "Learning Path", "Datawhale", "Resources"]
section: ai
---

> I previously added Easy-Vibe to the [design inspiration collection](./easy-vibe) (a report more focused on "website design teardown"). Today's article is different — I want to dig out **the real treasures inside the site** and explain them carefully: what it actually shares, which resources are worth saving, and in what order to learn most efficiently.

---

## 1. The Bottom Line First: Why This Is a "Treasure Site"

[Easy-Vibe](https://datawhalechina.github.io/easy-vibe/zh-cn/) is an open-source AI coding (Vibe Coding) tutorial site by Datawhale. Its core claim, in one sentence:

> **Programming languages are becoming natural languages — if you can talk, you can build products.**

It's not one of those tutorials that "talks about a bunch of concepts and leaves you to figure it out." It's a **complete growth path from zero to full-stack development** — split into four major stages, each a project-based training where "following along means you build something." The site supports **10 languages** — Simplified Chinese, English, 日本語, 繁體中文, 한국어, Español, Français, Deutsch, العربية, Tiếng Việt. An open-source project reaching this level of internationalization is itself a "good thing."

I spent time going through the main chapters. Below I'll walk through it in order: "how the map goes → what treasures each stop holds → which ideas are worth taking away."

---

## 2. The Whole Learning Map: Four Stages from "Using AI" to "Building Products"

The site organizes the learning path into a very clear "level-up" route:

| Stage | Positioning | What You Can Do After |
|-------|-------------|----------------------|
| Stage 1 · Zero-Basics Intro | "No tech background? Perfect." | Build runnable, demoable product prototypes through conversation |
| Stage 2 · Junior-Mid Dev | "One person is a whole team." | Frontend + database + deployment + payments, full-stack loop |
| Stage 3 · Advanced Dev | "I want both product and results." | Cross-platform apps, AI agent teams, personal brand |
| Appendix · Appendix | "Make the code come alive." | 49-article knowledge base, reference on demand |

At the entrance there's also an **identity matching table** — students, professionals, product managers, founders, teachers, doctors... everyone can directly find "how this course helps you" and locate their entry point in 10 seconds. That's product thinking many tutorials lack.

---

## 3. Stage 1 · Zero-Basics Intro: Build Your First "AI-Native App" in Two Hours

This stage is entirely for people who've "never written a line of code," and its biggest treasure is **step-by-step hands-on practice**.

### 3.1 Build Snake in 60 Seconds: Witness the "Code in a Browser" Model

The course starts with an experimental web page, z.ai (Zhipu AI's GLM platform): **no environment setup, no editor configuration — open a browser, describe the requirement in natural language, and AI generates code with live preview.**

The sample prompt in the course is a perfect example of "how to talk to AI like a human":

```
Build me a Snake game:
1. Use arrow keys to control the snake
2. Eating food makes the snake grow and score increases
3. Hitting the wall or your own body ends the game
4. Need a start and restart button
5. The UI should be clean and nice-looking
```

Then the course walks you through iterations: make the snake eat **words instead of beans** → after eating 8 words, have the LLM **write a poem based on the words** → when the poem is done, **auto-generate a painting**. Three sentences demonstrate the power of "conversational programming" clearly.

### 3.2 Hands-On Comparison of Nine Online AI Coding Platforms (Worth Bookmarking)

This is a very high-value table in Stage 1 — the course compares the mainstream "code in a browser" platforms one by one:

| Tool | Maker | One-Liner |
|------|-------|-----------|
| Kimi Code | Moonshot AI | Terminal CLI + VS Code extension; coding-specialized model Kimi K2.7 Code; supports connecting Claude Code |
| Google AI Studio | Google | Gemini models, good for rapid prototyping |
| z.ai | Zhipu AI | GLM model; all-in-one for full-stack dev, slides, and posters |
| Figma Make | Figma | Deeply integrated with design tools, designer-friendly |
| Coze | ByteDance | No-code visual building; publish to Feishu, WeChat |
| v0.dev | Vercel | Type a description and get runnable React components |
| Bolt.new | StackBlitz | Directly generates and deploys complete web apps |
| Lovable | Lovable | Generates high-quality React apps, supports one-click GitHub-integrated deployment |
| Replit Agent | Replit | Online IDE with built-in AI assistant, real-time collaboration |

For domestic users, **Kimi Code, z.ai, and Coze** are options you can pick up with zero friction; if you want to go global, look at Google AI Studio and v0.dev.

### 3.3 Eight Hand-Picked Real Cases: AI Can Really Build Complex Games

The course also curates 8 real cases, each making you want to start building immediately:

- **WotAI Games**: recreated 10 classic arcade games (Pac-Man, Tetris, Space Invaders...) in one afternoon with Claude Code, no game engine needed
- **Blooming Garden**: a Japanese developer with zero programming background made a 2048-style "plant garden" game through pure conversation in 2 hours — particle animations, leaderboards, and sound effects all included
- **Planet Jumper**: a designer built a playable online 3D multiplayer platformer with AI
- **mini-browser-games**: a Chinese developer used Vibe Coding to make **100 zero-dependency single-HTML browser games**, open-sourced under MIT
- **CraftMine**: a 6,820-line single-file web remake of *Minecraft*, with 46 block types, 36 creatures, and even P2P multiplayer
- **AI Super Mario**: AI generates infinite levels in real time, playable for 45 minutes straight in testing
- **Kimi K3 3D Game**: one prompt builds a playable first-person 3D game; two rounds of conversation fix two bugs, ~$2 total
- **K399 Game Platform**: Moonshot AI's official platform, dozens of AI games all made with the K3 model, click and play

### 3.4 "Finding Good Ideas": Think About What to Build Before Writing Code

Stage 1 also includes a very "anti-conventional" section — **teaching you to find needs before teaching code**. It tells the story of Xiao Ming, an indie developer who spent a year building a feature-rich fitness app, only to get a 5% 7-day retention rate and lose ¥200,000.

The lesson: **the wrong direction costs more the deeper you go.** This section provides a complete methodology — what kind of needs users will pay for, how to dig business opportunities out of ordinary ideas, and how to use AI to polish an idea into a shippable product plan. For anyone who wants to "make something" but hasn't figured out what yet, this part is worth more than any tool tutorial.

---

## 4. Stage 2 · Junior-Mid Dev: One Person Is a Whole Team

This stage enters "real full-stack," covering the complete loop of **frontend design → design-to-code → database → deployment → payments → AI capability integration**.

### 4.1 Asset Generation Agents: Lovart + Nanobanana

Starting from Lovart and Nanobanana, you batch-generate high-quality design assets and build a drawing agent capable of "intent recognition" — the "asset pipeline" many people want to build.

### 4.2 Figma and MasterGo: Past and Present of Design Tools

The course explains frontend design tools thoroughly: from the manual "slicing, measuring, annotating" of the Photoshop era, to Sketch's componentization, to Figma's revolution of bringing collaboration to the cloud. It also lays out **three paths from design to code**:

- **Path 1**: screenshot to a multimodal LLM, which directly restores code (fastest, good for quick validation)
- **Path 2**: platform built-in capabilities/plugins to export (high fidelity, editable)
- **Path 3**: platform + MCP capabilities to export (highest automation)

The course even covers Figma's post-2025 AI family (Make for one-sentence UI generation, FigJam whiteboard collaboration, Buzz for batch brand assets, Site for one-click publishing to web) — the AI-ification of design tools is faster than you think.

### 4.3 Supabase: Database + User System Together

Using Supabase as the main thread, the course helps you understand "data" and "databases," then directly implements **registration/login/permissions**, extending into realtime, storage, edge functions, and even Google and GitHub login. You end with a reusable backend code template you can drop into future projects.

### 4.4 Deployment: Four Platform Comparison (Bookmark)

The "put your website online" section explains in plain language what deployment really is, and compares mainstream platforms:

| Platform | Features | Free Tier |
|----------|----------|-----------|
| Tencent Cloud CloudBase | Fast in China, WeChat ecosystem integration | Free tier (needs official-account redemption code, 6-month trial) |
| Vercel | Great frontend framework support, tight GitHub integration | Free tier |
| Netlify | Full-featured, forms/identity | Free tier |
| Zeabur | Multi-language multi-service templates, flexible config | ~$5/month free tier |

### 4.5 Dify: From "Chatbot" to "AI Agent + Workflow"

This is my favorite section in Stage 2. It first establishes a key insight: **a chatbot itself can't do things** — it can answer "how do I check my order" but can't actually query the database. To turn AI into a "digital employee," you need three things: domain knowledge, tool calling, and structured execution.

Then it introduces **RAG (Retrieval-Augmented Generation)**: enterprises have thousands of pages of documents — how does the model find the most relevant content in each conversation? The answer is injecting retrieved snippets into the model's input so it has evidence to rely on and fewer hallucinations. Finally, you use **Dify** to build a knowledge-base Q&A bot hands-on.

This section also includes a **low-code AI workflow platform comparison table**:

| Platform | Features | Best For |
|----------|----------|----------|
| Dify | Open source, RAG support, LLM orchestration, Chinese-friendly | Enterprise knowledge-base Q&A, custom agents |
| Coze (ByteDance) | Available in China, Douyin/Feishu ecosystem | Social bots, mini-program integration |
| n8n | General automation, API-orchestration emphasis | Cross-system data sync, AI + SaaS automation |
| Baidu Qianfan / Alibaba Bailian / Tencent Hunyuan | Big-tech cloud-native solutions | Enterprise deployment, high compliance needs |

### 4.6 Capstone: Two Portfolio-Worthy Complete Projects

At the end of Stage 2, two capstone projects aim to "assemble the parts into a runnable, demoable, launchable product":

- **Capstone 1 · Copywriting SaaS**: login → generation → database → Stripe payments → admin panel, running the most common modern SaaS main loop
- **Capstone 2 · Online Exam System**: roles & permissions, question-bank modeling, exam flow, grading statistics — closer to a real business system

Each capstone requires three deliverables: **a runnable project repo + an accessible demo link + README and demo video** — the complete template for a job-hunting portfolio. There are also 6 extended topics (web landing pages, Dify-like platforms, AI travel planning, Spring Boot recommendation systems, microservices, Go data analysis), freely chosen by tech direction.

---

## 5. Stage 3 · Advanced Dev: Claude Code, MCP, and Agent Teams

At this stage, the tutorial dives into **engineering and AI agent collaboration** — exactly what advanced players need most:

### 5.1 Claude Code Series

- **Claude Code Quick-Start Core Guide**: installation, configuration, basic operations, practical tips
- **The Complete Guide to MCP and Claude Code**: extending AI coding tools with the Model Context Protocol
- **The Complete Guide to Claude Code Skills**: packaging domain knowledge, workflows, and best practices into reusable skill packs
- **How to Make Coding Tools Work for Long Hours**: using loop scripts and the Ralph plugin to manage long-running tasks so Claude Code works overnight reliably
- **The Complete Guide to Claude Agent Teams**: making multiple AI instances collaborate like a real dev team
- **Claude Code Superpowers**: using frameworks to make AI write engineering-grade code
- **Claude Code Workflow Best Practices**

### 5.2 Cross-Platform Development

WeChat mini-programs (with backend), Android, iOS, PWA, browser AI assistant extensions, Electron desktop apps (speech-to-text), VS Code plugins, Qt industrial-grade desktop apps — covering nearly every form of "making your AI product omnipresent." Even NFT smart-contract minting has a 10-minute starter version.

### 5.3 Personal Brand

"How to build your own personal webpage and academic blog" — for those of us building a personal-site right now, this section is practically tailor-made advanced reference material.

### 5.4 Advanced AI Capabilities

RAG principles, mid-to-advanced RAG, and LangGraph workflow orchestration leave enough headroom for people who want to go deep into AI-native applications.

---

## 6. Appendix: 49 Articles, a "Living Dictionary" for On-Demand Reference

The appendix is, in my view, the **highest value-for-money and most easily overlooked** part — 9 major topics, 49 articles:

| Topic | Count | Coverage |
|-------|-------|----------|
| 💻 Computer Basics | 7 | Vibe Coding full-stack overview, CPU, OS, data structures, algorithmic thinking, programming language map, networking basics |
| 🔧 Dev Tools | 6 | Git version control, etc. |
| 🌍 Browser & Frontend | 6 | Frontend frameworks, JavaScript deep dives |
| ⚙️ Server & Backend | 7 | API design, backend languages, layered architecture |
| 📊 Data | 4 | Database principles, etc. |
| 🏗️ Architecture Design | 4 | — |
| ☁️ Infrastructure | 4 | — |
| 🤖 AI | 6 | AI history, prompt engineering, LLM principles, agents |
| ✨ Engineering Craft | 5 | — |

When you hit conceptual questions like "what is frontend" or "how do I write prompts" while learning Vibe Coding, checking the appendix beats searching around. **Especially "Prompt Engineering" and "AI History" — I strongly recommend reading those two first.**

---

## 7. More Than a Tutorial: Ideas Worth Taking Away

### 7.1 "The Art of Asking" Is an Essential Skill for the AI Era

The tutorial devotes a whole section to asking questions — the most universally valuable content on the site, in my opinion:

> In reality, there's rarely a complete document. More often you face unclear requirements, half-finished code, and scattered error messages. **The more key information you provide and the more you constrain the output format, the more usable the answer.**

It also gives a very practical **screenshot vs. copy-paste** comparison:

| Method | Best For | Key Requirements |
|--------|----------|------------------|
| Copy-paste | Error stacks, logs, code, config, API responses | Be as complete as possible; don't just copy one keyword line |
| Screenshot | UI layout, interaction bugs, can't find a button | Full-screen shot + annotate key areas + a one-line description |

(Caveat: the AI must support image input — Claude, GPT-4o, Gemini, Qwen, ERNIE Bot, etc.)

### 7.2 Done Is Better Than Perfect

Each chapter opens with a warm reminder: "**Done is better than perfect 🐣**." It also explains why project-based training — "in a relatively safe environment, giving you a simulated taste of the real world early," training you to solve problems with ambiguous requirements and shifting boundaries.

### 7.3 Empathetic Design: Putting "I Want to Quit" in the Headlines

The appendix and FAQ directly contain chapter titles like:

- "I've been stuck for a long time and can't figure it out — I want to give up"
- "I think some of the tutorial's designs are unreasonable"

Writing learners' emotional pain points directly into headlines, reassuring before guiding — this "treating people as people" tutorial design is far superior to cold documentation.

### 7.4 User Stories Are the Best Social Proof

The homepage features a real story: *"Giving up a five-figure monthly salary, he taught kids in a rural primary school to 'shoo flies with AI'."* Rural teacher Xiao Hao took third-graders and "talked" with AI into building a touchscreen anti-mistouch software, solving the classroom pain point of electronic screens being bothered by flies. After reading it, you understand — **the barrier to AI programming really is low enough that anyone can participate in creation.**

---

## 8. How to Use This Guide: Actionable Advice for Galvin

Given what we're doing with the personal site, Easy-Vibe offers at least these things you can use right away:

1. **Browse the appendix first**: focus on "Prompt Engineering," "AI History," and "Vibe Coding Full-Stack Overview" to build a concept map
2. **Try an online platform**: start with z.ai or Kimi Code, follow Stage 1 to build a Snake in 60 seconds, and feel "conversation is programming"
3. **Turn "the art of asking" into a habit**: when having CodeBuddy do work, copy-paste errors completely and annotate UI issues with screenshots — efficiency will visibly improve
4. **Reference its learning path design**: our site's article/tutorial arrangement can also be organized by "levels/stages," with a "next level" entry at the end of each piece
5. **Portfolio thinking**: if you want to build your own AI product, complete the three deliverables from the Stage 2 capstones (repo + demo link + README/video), and you'll have a portfolio that works

---

## Conclusion

What moved me most about Easy-Vibe isn't any specific feature — it's how it broke a grand proposition — "ordinary people can build products" — into a path where **anyone can take the first step today.** From a 60-second Snake, to 100 browser games, to a "touchscreen lock" in a rural classroom, the barrier to AI programming is visibly disappearing.

As the site's homepage puts it:

> **The hardest part used to be how to write code. Now the hardest part is what you want to build.**

The rest is up to your imagination. 🚀

---

*Reference: <https://datawhalechina.github.io/easy-vibe/zh-cn/> (CC BY-NC-SA 4.0 open course)*
