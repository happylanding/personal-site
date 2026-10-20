---
title: "Justin3go：把手绘纸感做进产品叙事的独立创造者个人站"
description: "独立产品创造者 Justin3go 的个人站，用『手绘纸张 + 胶带 + 素描箭头』的纸感语言，把手写动画、Canvas 纸上小剧场与逐屏编号的故事分镜串成一条叙事长卷，工程与生活双线并行。"
date: 2026-10-20
updated: 2026-10-20
tags: ["设计灵感", "个人品牌站", "产品叙事", "手绘纸感", "动效", "Canvas"]
section: insights
featured: false
siteUrl: https://justin3go.com/
---

> 本报告是「设计灵感收藏夹」系列第 6 期。站点：<https://justin3go.com/>

## 一句话定位

[Justin3go](https://justin3go.com/) 是现居北京的**独立产品创造者** Justin3go 的个人站，主题词是"创造、探索与记录"：既有 6 个在跑的产品（Turbo0 / HUNT0 / Mux0 / Input0 / FindHarness / Edit0）与履历，也有摄影和羽毛球的生活切片。技术上是 **VitePress v2 alpha + Vue 自定义主题（ProfileHome 组件）**，中文排版用**思源宋体 Source Han Serif CN 变量字体**做正文，把"个人简历"做成了一份**手绘纸感的长卷故事**，而不是干巴巴的条目清单。

## 结构与信息架构

整站是**一页式滚动 + 编号分镜**的叙事结构，每个区块带 `01/06`～`06/06` 的编号眉，告诉浏览者"故事到哪里了"：

| 区块 | 编号 | 内容 | 设计意图 |
|------|------|------|---------|
| Hero | — | "Hi，我是 Justin3go。独立产品创造者 · 中国北京"，主张句"把想法，拼成日常。" + 手绘素描箭头 + 纸感插画 + macOS 窗口红绿灯装饰 | 用人名 + 一句主张开场，比一张大照片更贴近"创造者"身份 |
| 阅读博客 | 02/06 | "把小想法，写成日常。"入口卡 | 内容资产分流，博客独立成站内一级入口 |
| SELECTED WORK | 01/06 | 6 个产品卡（turbo0 / hunt0 / mux0 / input0 / findharness / edit0），每张带域名、编号、一句话描述；下方"更多项目"列表（心之链、Template0、PDFuck、FAV0） | 作品密度极高，用编号 + 域名双标识让每个项目可被记住、可直接访问 |
| OFF THE SCREEN | 02/06 | 摄影板块，"EVERYDAY, THROUGH MY LENS."，Sony A7C II | 把"人"从工程师身份里解放出来 |
| A DIFFERENT RHYTHM | 04/06 | 羽毛球，"每周至少 3 小时……也希望球价能早日降下来" | 反差生活切片，制造记忆点 |
| THE JOURNEY | 03/06 | 竖向时间线：2025.09 至今大厂前端 → 2023-2025 国企 → 2022 实习 → 2019-2023 本科 → 2001 故事开始 → "2101，希望我还活着；3001，千年修为，我还在修炼" | 把履历写成时间线，末尾用幽默收尾，削弱"简历感" |
| SAY HELLO | 04/06 | 邮件、微信（弹窗二维码）、X、GitHub、掘金、公众号 | 转化收口，微信二维码用 `<dialog>` 弹窗而非跳转 |

**亮点**：导航只有「首页 / 博客 / 归档 / 赞助」四项，加语言切换（简体中文 / English）与 RSS——**把"博客"从主页里拆出去**，主页专心做"我是谁 + 我做了什么"，内容归档另立门户，信息职责非常清晰。

## 创意与设计拆解

### 0. 动效专项：一套"手绘纸片"的完整动效体系

这个站最值得看的不是布局，而是**「纸」的物理感**——它不是一张静态纸，而是一叠能被翻、能被吹、能被手指拨动的纸。基于实际源码核实：

**① Hero 手绘素描箭头：一条"自己画出来"的线**

- 一条 `viewBox="0 0 220 45"` 的 SVG 路径 `<path d="M5 28C54 7 113 38 199 10m-19-2 20 2-13 18">`，一条贝塞尔曲线 + 三笔箭头，`stroke-linecap:round`、`stroke-width:1.4`、`opacity:.55`
- 用的是**两段路径拼接**（曲线上 + 箭头三笔），模仿真人手绘"画一笔、再补箭头"的顺序感
- 视觉上它以 `width:185px` 斜插在标题右侧、`margin:21px 0 -45px 145px` 负边距压住下一行，像随手在纸上标注了一句"看这边 →"
- **可借鉴**：比起下载一个 handwritten-arrow 图标，用 `stroke-linecap:round` + 低 `stroke-width` + 半透明 currentColor 自己画一条路径，成本几乎为零，但"手作感"大幅提升

**② 入场动画 `home-arrive`：用 `translate` 属性而非 `transform` 做位移**

- 关键帧 `home-arrive-03eddfc5`：`0% { opacity:.35; translate: 0 20px }` → `100% { opacity:1; translate: 0 0 }`
- 注意它用的是独立的 **`translate` 属性**（CSS Transforms Level 2），不是 `transform: translateY()`——好处是**位移与 `transform` 上的旋转/缩放互不覆盖**，因为卡片本身还在用 `transform: rotate(var(--card-angle))` 保持随机歪斜
- 全站动画可通过 `.motion-off` 一键关闭：`.motion-off * { animation:none!important; transition:none!important }`，并在 JS 里监听 `matchMedia("(prefers-reduced-motion: reduce)")` 自动切换
- **可借鉴**：当元素同时需要"歪斜/旋转"和"入场位移"时，把位移交给 `translate`/`rotate`/`scale` 独立属性，比在 `transform` 里堆叠多个函数更不容易打架

**③ 滚动揭示：一个 IntersectionObserver 管全站**

- JS 侧一个 `IntersectionObserver`（`threshold:.08`）批量观察 `[data-reveal]`、`.profile-project-card`、`.profile-timeline li`，进入视口就给元素加 `has-arrived` 类；**只观察一次（unobserve）**，避免反复触发
- 滚动/尺寸/hash 变化都挂 `passive:true` 的监听，配合 `requestAnimationFrame` 节流
- **可借鉴**：不要为每个卡片单独写进场的 JS，"一个 observer + 一个 class + CSS 里定义过渡"是最省性能也最好维护的组合

**④ 卡片"纸片"交互：随机歪斜 + 胶带 + 悬停归正 + 3D 微倾斜**

- 每张作品卡 `transform: rotate(var(--card-angle))`，由 `:nth-child(2n)` 给 `1deg`、`:nth-child(3n)` 给 `-.55deg`，**让整齐的网格拥有一点"手工摆放"的不齐**
- 卡片背景用 `clip-path: polygon(...)` 切出**撕裂纸边**（十几个不均匀顶点），再叠 `repeating-linear-gradient(0deg, transparent 0 3px, ... 3px 4px)` 画 3px 一行的**纸纹横线**
- 每张卡上方贴一条"胶带" `::after`：`width:66px;height:23px; transform:rotate(-7deg)`，胶带自己也用 `clip-path` 切出不齐的撕口
- hover 时 `transform: translateY(-4px) rotate(0)`——**歪斜的纸被"扶正"**，同时 `filter: drop-shadow` 加深，配合 `translate 0.22s ease` 手感很轻
- 图片层另有指针跟随 3D 倾斜：JS 按指针位置写 CSS 变量 `--project-tilt-x/y`（最大 ±3deg）、`--project-shift-x/y`（±2px）、`--project-scale:1.018`，图片 `transform: perspective(900px) rotateX() rotateY() translate3d() scale()`，用 `cubic-bezier(.22,1,.36,1)` 收尾
- **可借鉴**：hover 不必只做"上浮"，做"**扶正**"更有拟物趣味；随机量的实现不要硬编码，用 `--card-angle` 变量 + `:nth-child` 分档，既可全局调参又不会显得刻意

**⑤ Canvas 纸上小剧场：`paper-stage` / `paper-scene`**

- 全站有 6 组 `paper-stage` + `paper-canvas`，用 `requestAnimationFrame` 驱动，`will-change:transform`，**帧间隔做限制**（源码里有 `if (c - lastFrame < 32 && motion) { 请求下一帧; return }`，等于把绘制上限压到约 30fps）
- 页面隐藏时 `document.hidden` 直接停帧，滚出视口则 `unobserve`，非常克制
- 场景之间有"**散开-重组**"的过渡：用 `mix` 与 `scatter = Math.sin(Math.PI * mix)` 控制两份场景图的混合与粒子散射，切换时像纸片被吹散再重新拼成下一幅画
- 纸面阴影直接画在 canvas 里（`ellipse(300, y+3, 122, 9)` 配 `globalAlpha:.055`），而不是 CSS `box-shadow`——**阴影作为"画面的一部分"参与合成，才像真的纸浮在桌面上**
- 指针位置也参与：`pointermove` 时把 `clientX/innerWidth*2-1` 归一化后驱动场景的轻微位移，纸会"跟着手躲"
- **可借鉴**：Canvas 动画三件事——**限帧（30fps 足够）、隐藏即停、视口外不画**；再加一点点 pointer 驱动，静态插画立刻有"可触摸"的错觉

**⑥ 细节里的"人味"**

- `<body>` 上有 `check-mac-os` 脚本，`document.documentElement.classList.toggle("mac", /Mac|iPhone|iPod|iPad/i.test(navigator.platform))`——只在 Mac/iOS 上显示 macOS 窗口红绿灯装饰，**不打扰其他平台**
- 微信 / 公众号二维码用原生 `<dialog>` + `showModal()`，点遮罩外部才关闭（监听 `clientX/clientY` 判断是否点在矩形外），比自造遮罩层省事得多
- 深色模式由 `localStorage` + `prefers-color-scheme` 双向决定，首屏前就写入 `dark` 类，**避免闪白**
- 2001 出生年与"2101，希望我还活着；3001，千年修为"的玩笑，把时间线从履历变回了故事

### 1. 手绘纸感：一套"物理材质"级别的视觉语言

- **纸张色不用纯白**：卡片材质由 `color-mix(in srgb, var(--vp-c-bg-soft) 92%, var(--vp-c-text-1) 8%)` 算出，纸面永远比背景"厚一点"
- **纸纹用 CSS 生成**：`repeating-linear-gradient(0deg, transparent 0 29px, color-mix(...) 29px 30px)` 画出 29px 一行的信纸横线；`repeating-linear-gradient(0deg, transparent 0 3px, ... 3px 4px)` 画细纸纹
- **撕纸边一律 `clip-path: polygon()`**：15 处 `clip-path`，用在纸面底、胶带、按钮（`--paper-button-edge` 是一个 24 顶点的多边形），**按钮边缘也是不齐的**
- **歪斜是系统性的**：`--card-angle`、`hero-accent { transform:rotate(1deg) }`、胶带 `-7deg`、印章 `10deg`、便签 `-7deg`——每个元素偏一点点，整体才像"贴在墙上的一叠纸"
- **字体分工**：中文正文用思源宋体变量字体（大字号 `clamp(48px,5.7vw,86px)`、`letter-spacing:-.065em` 负字距），小标签用等宽字体 `var(--vp-font-family-mono)` + `letter-spacing:.05em`

### 2. 逐屏编号 = 阅读进度条

- 每个区块顶部的 `eyebrow` 写"01 / SELECTED WORK"或"02 / 06"，配一条细线 `paper-scene-line { width:45px; height:1px }`
- 屏幕右下角还有一个跟随滚动的 `01 06` 侧标记 + "向下滚动，故事继续 ↓"
- **长页面最怕"不知道还有多少"**，编号 + 细线 + 滚动提示三重冗余，把"阅读位置"变成故事进度

### 3. 内容策略：作品前置，博客外挂，生活垫底

- 第一屏之后立刻是作品（6 个能点开的产品），**用可访问的域名做作品标识**（turbo0.com / hunt0.com / mux0.com…），域名本身就是命名体系
- 履历被写成时间线而非表格，且用"继续打磨前端工程能力，探索 AI 与独立开发的更多可能"这种**描述能力而非罗列框架**的口吻
- 结尾不写"如想合作请联系我"，而是"关于产品、技术，或者打个招呼。**如果你从博客而来，记得简单介绍一下来意**"——有礼貌也有边界

## 亮点特色总结

1. **手绘纸感做到材质级**：撕纸 `clip-path`、CSS 纸纹、随机歪斜、胶带贴角、手绘素描箭头——不是"贴个纸纹背景"，而是一整套物理隐喻
2. **Canvas 纸上小剧场**：6 组 Canvas 场景，限帧 30fps + 隐藏停帧 + 散开重组过渡 + 指针驱动，插画级别的"可触摸感"
3. **入场用 `translate` 独立属性**：绕开与 `transform: rotate()` 的冲突，是很有经验的做法
4. **一个 IntersectionObserver + 一个 class 管全站揭示**：性能与可维护性双赢，并自动尊重 `prefers-reduced-motion`
5. **逐屏编号做阅读进度**：01/06～06/06 把"往下滚"变成"翻故事"
6. **作品即名片**：6 个上线产品 + 域名命名体系，比任何"擅长 XX"的自我描述都硬
7. **人在工程之外**：摄影 + 羽毛球板块用一张图和一句话完成人格补全
8. **克制的高级细节**：只在 Mac 显示窗口红绿灯、`<dialog>` 原生二维码弹窗、首屏前写好深色类防闪白

## 可借鉴的设计亮点

- **给交互加一层物理隐喻**：先想清楚"这些内容像什么实物"（一叠纸 / 一份报纸 / 一张桌），再让歪斜、阴影、撕边、贴纸都服从这个隐喻，风格自然统一
- **手绘元素自己画 SVGo**：一条 path + `stroke-linecap:round` + 半透明 currentColor，就能做出比图标库更"手作"的箭头/下划线/圈注
- **位移与其它变换分开写**：同时需要歪斜 + 入场位移时，用 `translate` 属性 + `transform: rotate()` 组合，不要在一个 `transform` 里堆
- **hover 做"扶正"而不是"上浮"**：歪斜元素在 hover 时回正，比位移更有拟物趣味，也更不容易引起布局抖动
- **Canvas 动画守住三条线**：限帧（约 30fps 就够）、`document.hidden` 停帧、离开视口不画——90% 的性能问题都出在这三处
- **长页面必须有"还剩多少"的提示**：编号 / 进度线 / 滚动文案任选其二，读者的耐心会明显变长
- **随机感要可控**：用 CSS 变量 + `:nth-child` 分档给出"看起来随机"的歪斜角度，既自然又能一处调参
- **尊重系统偏好**：`prefers-reduced-motion` 与 `prefers-color-scheme` 都在首屏前生效，动效与主题都不该强迫用户

---

_报告由 CodeBuddy 自动采集生成，收录于[设计灵感收藏夹](../)。_
