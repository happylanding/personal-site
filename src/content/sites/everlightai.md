---
title: "陈硕 everlightai.top：用『知识结构』做壁垒的 AI 连续创业者个人知识产品站"
description: "AI 连续创业者陈硕的个人站，以『结构外脑』为核心把知识库、工具库、阅览室、社群织成一张持续生长的网，报纸编辑部风格 + 动态眼睛 + 半色调肖像 + 滚动揭幕，Build in Public 的范本。"
date: 2026-08-10
updated: 2026-08-10
tags: ["设计灵感", "个人品牌站", "知识库", "信息架构", "动效"]
section: insights
featured: false
siteUrl: https://everlightai.top/
---

> 本报告是「设计灵感收藏夹」系列第 5 期。站点：<https://everlightai.top/>

## 一句话定位

[陈硕 everlightai.top](https://everlightai.top/) 是 AI 连续创业者**陈硕**的个人知识产品站：它不贩卖"我是谁"，而是立起一个**持续生长的"结构外脑"**——把知识库、工具库、阅览室、AI 社群、GitHub 公开建造记录织成一张可行动的网络。核心主张是：**"真正的差距不是知道多少，而是你是否拥有一套能持续运转的思维结构"**——网站本身就是这套结构的载体。它是典型的 **Build in Public（公开建造）** 个人品牌站。

## 结构与信息架构

整站是**一页式的"编辑部"**：以报纸排版式的信息层级组织，把"知识产品"拆成几个可进入的分区，而不是塞满超链接：

| 区块 | 内容 | 设计意图 |
|------|------|---------|
| Hero | 巨型字母 **KAI** + 手写体楷体小字"打造全国最大的 AI 社群"、编辑体引言、个人简介、CTA 动作组 | 一个巨大的字母做记忆符号，下方用"编辑部简报"式文案立住人设 |
| 编辑网格背景 | 顶部/底部用 CSS 渐变画出报纸排版参考线（`linear-gradient` 竖/横栏线） | 把"报纸编辑部"的隐喻做成视觉底纹，贯穿整站 |
| 知识库起源 | `knowledge-origin-card` 系列长卡片：从"信息不是稀缺的"讲起，到"瓶颈是结构缺失"再到"核心目标是把信息重组为可执行路径" | 用**叙事长文**解释知识库为什么存在，说服力强于一句 slogan |
| 产品实验室 | AI 工具/产品库、个人成长系统、知识结构入口 三大入口卡 | 把"产品矩阵"按用途归类，每个工具服务于学习/训练/内容/转化 |
| 有温度阅览室 | 心理/认知/行动方法的长期阅读入口 | 把"知道"缩短到"做到"，内容资产反哺品牌 |
| 全平台信号台 | GitHub 公开数据（repos / followers）、X、飞书知识库、全国 AI 社区入口 | 用**实时公开数据**做"公开建造"的信任状 |
| 社群 | 面向 00/10 后的 AI 共创社群：真实复盘、主题周、共创者机制、加入门槛与规则 | 把流量转化为深度连接与共创 |
| 联系 | 邮件 / X / 微信咨询 + 联系方式 | 收口转化 |

**亮点**：信息架构遵循"**先讲清楚为什么（起源）→ 再给入口（产品/阅览/地图）→ 最后收口（社群/联系）**"的叙事动线，且全站用一套"编辑部报纸"视觉语言贯穿——Hero 巨型字母、编辑网格、栏目线、小号字距标签，统一度很高。

## 创意与设计拆解

### 0. 一只能"呼吸"的眼睛 + 半色调肖像：把静态 Hero 做出活的记忆点

这是全站最抢眼的一套动效，全部基于源码实核实：

**① CSS 关键帧驱动的"编辑部之眼"（`editorialHeroEyeIn` + `editorialHeroEyeRing`）**
- Hero 右上角有一只眼睛，入场用 `editorialHeroEyeIn`（1.1s `cubic-bezier(.2,.8,.2,1)` 延迟 .26s）：从 `translate3d(16px,12px,0) scale(.72) rotate(-8deg)` 的"藏起"状态淡入，到 65% 处 `scale(1.04) rotate(1deg)` 轻微过冲回弹，再归位——**用一个带 overshoot 的弹性入场让"眼睛睁开"有呼吸感**
- 眼睛四周叠一层 `editorialHeroEyeRing` 环形（5s ease-in-out infinite，`scale(.92↔1)` + `opacity(.3↔)` 缓慢脉动），像瞳孔在微微散大收缩
- 眼睛内部是 WebGL（`evil-eye` 组件）渲染的动态瞳孔 + 火光，参数如 `eyeColor:#FF744C`、`intensity:1.25`、`glowIntensity:.28`、`flameSpeed:.85`——**用 CSS 做"睁眼"仪式、用 WebGL 做"活着"的瞳孔**，两层结合

**② 半色调肖像的"漂浮"（`editorialPortraitDrift` + `mix-blend-mode`）**
- 主角半色调（halftone 网点）肖像 `editorial-portrait img` 用 `mix-blend-mode:multiply` 叠进纸张底，`filter:contrast(1.03) saturate(.96)` 让网点透出纸纹
- 整个肖像以 `editorialPortraitDrift`（12s ease-in-out infinite alternate）做 `translate3d(-8px,-6px,0) scale(1.015)` 的**缓慢漂移**，像老照片在纸面上轻微"呼吸"，成本极低但很有味道

**③ 背景"扫描线"与漂浮光点（`scanMove` / `pixelTwinkle` / `lineFloat`）**
- `scanMove`（7s linear infinite）让背景有纵向扫描线缓慢下移，模拟 CRT/印刷扫描质感
- `motion-field` 里的三根光点线条以 `lineFloat`（9/10/11s ease-in-out infinite）在不同角度缓慢漂移，其中一档 `reverse`，制造错峰漂浮
- `pixelTwinkle`（1.8s `steps(2,end)` infinite）让像素风光点以**阶梯式闪烁**（硬切换而非渐变），非常复古

**可借鉴点**：不必让整页动，只需在 Hero 的**一到两个记忆点上做有层次的动效**——CSS 做"入场仪式"（弹性 overshoot 回弹），WebGL/图片做"持续的活感"（脉动、漂移），并记得 `prefers-reduced-motion` 优雅降级（源码中已有 `@media` 把 animation 全部置 none）。

### 1. "报纸编辑部"的贯穿性视觉语言

- **巨型字母 Hero**：`KAI` 用 `clamp(240px,27vw,500px)` 的超大字号 + `letter-spacing:-.12em` 负字距 + `line-height:.67`，像报纸头条压满一屏，比放一张照片更有冲击力
- **编辑网格底纹**：Hero 背景用多层 `linear-gradient` 画出竖栏线 + 横栏线 + `radial-gradient` 网点（`background-size:5px`），模拟报纸版面的参考线与纸网纹，`mix-blend-mode:multiply` 让网点透出纸张色
- **小号全大写标签**：栏目眉（kicker）用字距略开的全大写小字（如 `AI / CONTENT / PRODUCT`），模拟报纸栏眉，精致且克制
- **纸张暖白 + 墨黑 + 酸橙点缀**：`--editorial-paper:#f4f0e8` 暖纸底、`--editorial-ink:#191817` 墨字、`--editorial-accent:#ff744c` 酸橙橙点缀，天然有"纸媒"的年代质感

### 2. 内容即结构：用"叙事长文"立知识库，而非一句口号

- 知识库起源不是一句"我整理知识"，而是一整段**从"信息爆炸 → 收藏夹变满 → 瓶颈是结构缺失 → 知识库是结构外脑"**的递进叙事，像一篇编辑手记
- 用 `——` 破折号开头的列表（`.knowledge-origin-card li:before{content:"—"}`）呈现"从哪里开始 / 哪些是关键 / 下一步"等路径问题，把"思考过程"也做成版式的一部分
- 卡片标题用 `font-weight:900` 的中文粗黑，段落用宽松行距（`line-height:1.9`）的宋体，层级分明、有纸面阅读感

### 3. "公开建造"的信任状：实时数据 + 状态标签

- 全平台信号台实时拉取 GitHub API（`repos`/`followers`），甚至展示最近的 commit SHA 与 message（`github-build-commit`）——**把"我在持续更新"变成可验证的实时数据**
- 文案反复出现 **build in public / 公开建造中 / 持续开源** 等状态标签，配 `GitHub 公开建造页面` 入口，把"努力"本身做成品牌资产
- 社群部分更是"反向筛选"：不承诺赚钱/资源/大佬，只承诺"不只剩下空话"，并写明清退规则——**用门槛和坦诚立信任**，比"万人社群"更有质感

### 4. 卡片系统的"像素/编辑部"双形态切换

- `knowledge-origin-card` 同一套结构在不同主题下**整套换肤**：暗色胶片版是渐变玻璃卡 + 酸橙点缀；像素风版是 `4px` 粗边框 + 奶油纸底 + 彩色 accent（`#fff071`/`#78d6d0`/`#ff6a8d` 三色循环）+ 硬阴影 `box-shadow:8px 8px`
- 像素风下的 hover/active 用 `steps(2,end)` 阶梯过渡 + `translate(-2px,-3px)` + 阴影位移，**交互反馈也是"像素化"的**，和主题风格严格一致——这是"主题化"做得很彻底的地方

## 亮点特色总结

1. **"结构外脑"立差异化定位**：不卖"我有什么内容"，而卖"我帮你把信息变成能行动的路径"——定位高级且有记忆点
2. **报纸编辑部贯穿全站**：巨型字母、编辑网格、栏目线、纸张暖白，用一个隐喻统一视觉语言
3. **Hero 层次化动效**：CSS 弹性睁眼 + WebGL 活瞳孔 + 半色调肖像漂浮，一两个记忆点做到位
4. **Build in Public 的实时信任状**：GitHub 实时数据、commit 展示、状态标签，把"努力"做成可验证的资产
5. **内容即结构的叙事**：用编辑手记式的长文讲清"为什么存在"，说服力远强于一句 slogan
6. **主题化到交互细节**：像素风连 hover/active 都用 `steps(2,end)` 阶梯过渡，风格自洽度极高
7. **社群门槛即信任**：反向筛选 + 坦诚规则，比"拉人头"更有长期主义质感

## 可借鉴的设计亮点

- **用一个巨型字母/单词做 Hero 记忆符号**：比放照片更抓眼球，配合负字距大字号有"报刊头条"的冲击力
- **CSS 网格渐变做报纸版式底纹**：多层 `linear-gradient` + `radial-gradient` 网点 + `mix-blend-mode:multiply`，零图片成本实现"纸面"质感
- **动效分层做**：入场用 CSS 关键帧带 overshoot 回弹（弹性睁眼），持续活感交给 WebGL/图片漂移，并记得 `prefers-reduced-motion` 优雅降级
- **用"叙事长文 + 编辑版式"讲定位**：把"为什么要做"写成一页编辑手记，比一句 slogan 更有说服力，也更能沉淀内容资产
- **实时公开数据做信任状**：拉取 GitHub API 展示 repos/commit，把"持续更新"变成可验证的事实
- **让主题化深入到交互**：像素风就配 `steps(2,end)` 阶梯过渡，主题不是只换颜色，而是连交互语言一起换
- **用门槛与坦诚立信任**：社群明说"不保证赚钱/不保证资源"，反向筛选真正想参与的人

---

_报告由 CodeBuddy 自动采集生成，收录于[设计灵感收藏夹](../)。_
