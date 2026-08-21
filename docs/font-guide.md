# 全站字体规范（Font Guide）

> 最后更新：2026-08-21
> 适用范围：全站字体族（font-family）的选用、回退与加载。
> 原则：**Hero 版面字体冻结，非 Hero 字体遵循 Web 字体最佳实践优化。**

---

## 1. 设计原则

- **Hero 版面**（首页 `.hero-section`、About 页 `.about-hero`）是品牌视觉核心，其字体为「定制/手写/衬线」组合，**一经确定即冻结，禁止改动**。
- **非 Hero 字体**（正文、界面、标签、书籍阅读器）以「**易读、性能、跨平台稳定**」为准则，持续按 Web 字体最佳实践优化。
- 优化遵循的 Best Practice：
  1. **字体栈必须含完整系统回退**，Web 字体加载失败或未命中时仍能优雅降级；
  2. **`font-display: swap`** 保证首屏文字不被 Web 字体阻塞（FOIT）；
  3. **CJK 与 Latin 分离**：Latin 用西文衬线/无衬线，CJK 回落中文系统字体，避免中西文混排不协调；
  4. **`font-feature-settings` / `text-rendering`** 开启连字、优雅渲染等特性；
  5. **按需加载、控制字重数量**，避免体积膨胀拖慢首屏。

---

## 2. 字体变量字典（src/styles/global.css `@theme`）

| 变量 | 用途 | 是否 Hero 冻结 |
|------|------|:---:|
| `--font-serif` | 标题 / 引言 / 水印 / ghost 编号 | ⚠️ 部分 Hero 用（hero-intro、hp-mega-name）→ **冻结** |
| `--font-sans` | 界面 / 正文基础字体（body） | ✅ 可优化 |
| `--font-mono` | 标签 / 眉标 / 计数 | ⚠️ 部分 Hero 用（hero-eyebrow）→ **冻结** |
| `--font-hand` | 手写体座右铭（Caveat） | ⚠️ Hero motto / About 标语 → **冻结** |
| `--font-zhongqi` | 定制中文行楷（品牌标语） | ⚠️ Hero subtitle → **冻结** |
| `--font-song` | 正文中文宋体 | ✅ 可优化 |
| `--book-font` | 书籍阅读器（书体） | ✅ 可优化 |

> 说明：`--font-serif / --font-mono / --font-hand / --font-zhongqi` 被 Hero 直接引用，
> 改动会波及 Hero，故一律冻结；优化仅作用于 `--font-sans / --font-song / --book-font` 及非 Hero 的元素级覆盖。

---

## 3. Hero 字体冻结清单（禁止改动）

以下元素保持当前 `font-family` 与字重，改动需设计评审：

| 元素 | 字体变量 | 字重 |
|------|----------|:---:|
| `.hp-mega-name`（品牌水印） | `--font-serif` | 900 |
| `.hero-eyebrow`（眉标） | `--font-mono` | 默认 |
| `.hero-motto`（英文座右铭） | `--font-hand` | 600 |
| `.hero-subtitle`（中文标语） | `--font-zhongqi` | 400 |
| `.hero-intro`（Bio 段） | `--font-serif` | 默认 |
| `.about-hero-title`（About 标语） | `--font-zhongqi` / `--font-hand` | 400 / 600 |
| `.about-hero-intro`（About 引言） | `--font-serif` | 默认 |

---

## 4. 非 Hero 字体最佳实践

### 4.1 界面 / 正文基础（`--font-sans`）

界面文本与基础正文使用无衬线体，优先中文可读性；字体栈含完整系统回退：

```css
--font-sans: "Source Sans 3", "Noto Sans SC", "PingFang SC", "Microsoft YaHei",
             -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
             Arial, system-ui, sans-serif;
```

要点：
- Latin 优先 `Source Sans 3`，CJK 回落 `Noto Sans SC`；
- 加入 `PingFang SC`（macOS/iOS）、`Microsoft YaHei`（Windows）系统中文字体；
- 末尾 `-apple-system / Segoe UI / Roboto / system-ui` 兜底，保证任意平台不落到裸 `sans-serif`。

### 4.2 正文中文宋体（`--font-song`）

长文正文使用宋体提升「书卷气」，Latin 回落衬线体：

```css
--font-song: "Songti SC", "STSong", "SimSun", "宋体", "Noto Serif SC",
             "Source Han Serif SC", serif;
```

### 4.3 书籍阅读器（`--book-font`）

中文正文宋体、英文正文新罗马体，段落首行缩进、两端对齐（见 `docs/typography-guide.md`）。

### 4.4 渲染优化

在非 Hero 文本上启用优雅渲染：

```css
font-feature-settings: "cv02", "cv03", "cv04", "cv11";
text-rendering: optimizeLegibility;
```

---

## 5. 加载策略（BaseLayout）

- `preconnect`：`fonts.googleapis.com` / `fonts.gstatic.com`；
- 阻塞字体：正文无衬线（Source Sans 3 + Noto Sans SC，各 400/500/600）；
- 非阻塞按需加载：衬线 / 手写体（Playfair Display + Noto Serif SC + Caveat），`media="print"` + `onload` 切换；
- 全部 `display=swap`；
- `document.fonts.ready` + 1s 超时门控 Hero 遮罩动画（`html.fonts-ready`）。

---

## 6. 实现位置

- 字体变量：`src/styles/global.css` 的 `@theme` 块；
- 加载策略：`src/layouts/BaseLayout.astro` 的 `<head>`；
- 规范文档：`docs/font-guide.md`（本文件）。

---

## 7. 校验清单

- [ ] Hero 元素 `font-family` 与字重未改动（对照 §3 冻结清单）
- [ ] `--font-sans` 含完整系统回退（`-apple-system / Segoe UI / Roboto / system-ui`）
- [ ] `--font-song` 中文回落正常
- [ ] 渲染特性（feature-settings / optimizeLegibility）在非 Hero 文本生效
- [ ] `display=swap` 生效，无 FOIT
- [ ] 暗色模式配色与字体不受影响
