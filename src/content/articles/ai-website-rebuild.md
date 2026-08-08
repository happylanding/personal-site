---
title: "用 AI 重构个人网站：一场'非程序员'的改造实验"
titleEn: "Rebuilding a Personal Site with AI: A Non-Programmer's Experiment"
description: "从选型、双语、动效到部署，记录我作为非程序员用 AI 完成个人网站改造的全过程，总结 Vibe Coding 的实战方法论与边界。"
descriptionEn: "From stack choice, i18n, interactions to deployment — a record of rebuilding a personal site with AI as a non-programmer, plus a practical methodology and the boundaries of Vibe Coding."
date: 2026-08-10
tags: ["AI", "Vibe Coding", "实践"]
tagsEn: ["AI", "Vibe Coding", "Hands-on"]
section: ai
ogImage: /images/ai-website-rebuild/cover.png
ogImageEn: /images/ai-website-rebuild/cover-en.png
---

> 这篇文章是 ai 栏目里最"实战"的一篇——因为它记录的，就是我现在正在进行的改造：一个不懂前端的人，如何用 AI 把一个"想要个人网站"的念头，变成上线运行的产品。

---

## 一、为什么敢做这件事

过去，做网站意味着要学 HTML、CSS、JavaScript、部署……一套完整的前端知识栈，足以劝退绝大多数人。

但今天不一样了：

- AI 能理解"我想要一个中英双语的个人博客"这样的自然语言目标
- AI 能生成符合现代审美的页面结构
- AI 能解释报错、修复问题、优化交互

**技术门槛被 AI 大幅拉低了**，剩下的是另一个门槛——把事情想清楚的能力。

## 二、我的工作流：需求 → 方案 → 执行 → 验证

经过这轮改造，我沉淀出一套稳定的协作流程：

1. **把需求说清楚**：越具体越好。"要一个个人网站"不如"要一个 Astro 写的、中英双语、带暗色模式的个人博客"
2. **让 AI 给方案**：先讲思路再动手，重要改动先看方案再执行
3. **小步执行 + 持续验证**：每次改动都要构建验证，绝不停在"看起来对"
4. **效果验收**：本地预览、移动端检查、动效手感，用真实体验打分

这套流程的本质，是**把工程思维借给 AI 来用**。

## 三、踩过的坑与教训

1. **"一把梭"要不得**：让 AI 一次改十个文件，出问题时根本定位不了。改成小步提交后，问题立刻变少。
2. **AI 会自作聪明**：有时它会"顺手"改掉无关代码。**合入前一定要看 diff**。
3. **构建验证是底线**：一切改动以 `npm run build` 通过为准，不通过就不合入。
4. **判断力才是核心**：AI 给我十个方案，我要能说出为什么选 A 不选 B——这需要持续积累。

## 四、对"非程序员"的建议

如果你也想做类似的事，我的建议是：

- **从真实需求出发**：不要为了学而学，要为了"解决一个问题"而学
- **先模仿再创造**：让 AI 参考你喜欢的网站风格，从"改别人的"开始
- **保持好奇但克制**：AI 很强大，但最终是你为结果负责

## 五、结语

这轮改造让我确信：**"会编程"正在从一项专业技能，变成一种可以被 AI 放大的人类能力。** 技术的门正在向所有人敞开，而推开它的钥匙，是你想清楚自己要什么。
