# 文章配图流程（星野极光 · 分栏配色）

> 适用范围：本仓库（Galvin2026/personal-site）所有文章封面/正文配图
> 最后更新：2026-08-09

---

## 一、流程总览

```
写文章 → 丢草稿箱(drafts/) → 处理草稿(生成 frontmatter) → 发布到 articles/
                                              │
                                              ▼
                                    【配图环节】(本流程)
                                    ① 生成封面 cover.png / cover-en.png
                                    ② frontmatter 写入 ogImage / ogImageEn
                                    ③ （可选）正文章节配图（双语文章须配套 -en 英文版）
                                              │
                                              ▼
                                    构建验证 → 提交 → 部署
```

**约定：每一篇文章生成/发布后，紧接着就进入配图环节**，默认使用「星野极光·分栏配色」风格（见下文规范）。正文配图、写作润色等后续流程独立沉淀文档。

---

## 二、风格规范（方案 A｜星野极光·分栏配色）

### 视觉语言

- 深色底 `#0c0c0c` + 双径向光晕（左上主色光 + 右下辅色光）
- 星点背景（17 颗固定白色星点，多档透明度）
- 顶部细光带、左上角双竖线 + 圆点节奏装饰（双竖线右侧一条竖线 + 三颗递减透明度圆点 + 短横线，填充左上角空白区域）
- **字体规范：中文宋体（SimSun/宋体）+ 英文新罗马（Times New Roman）**；中英混排统一用「新罗马优先 + 宋体回退」的字体栈
- 1200×630，同时用于文章页头部 banner 与社交分享图（og:image）

### 栏目配色

| 栏目 | section | 主色 c1（左上光晕/双竖线/分隔线圆点） | 辅色 c2（右下光晕） | 标签文字（浅色亮版） |
|------|---------|-------------------------------|----------------|---------|
| 行业洞察 | `insights` | 酒红 `#8E1F2F` | 深红棕 `#6C2A33` | `#E8A2AC` |
| AI 学习 | `ai` | 深蓝 `#1E3A8A` | 深蓝灰 `#27477F` | `#8FB4F5` |
| 实用技巧 | `tips` | 琥珀 `#B45309` | 青绿 `#4ADE80` | `#FBBF24` |
| 书籍专区 | `books` | 紫罗兰 `#7C3AED` | 品红 `#F33BD6` | `#A78BFA` |

> **专属配色说明**：`insights` 行业洞察专属酒红、`ai` AI 学习专属深蓝，包含站点图标/导航栏/封面与全部配图的底色，颜色保持全局统一。
> **深色区文字**：标签/浅色背景文字一律使用主色的亮版（见上表），避免深色背景上颜色重叠难以分辨。
> 配色常量集中在 `scripts/cover-render.mjs` 顶部的 `PALETTES` 与 `scripts/covers-palette.sh` 中，改色只需改这两处。

### 封面版式

```
┌────────────────────────────────────────────┐
│ ▕▎  标签（栏目英文 + 年份，主色亮版）       │
│                                             │
│   主标题（1~2 行，自动拆行 + 字号自适应）    │
│   副标题（description 截断为一行）           │
│                                             │
│   ────────●──────── 分隔线 + 主色圆点       │
│   署名（Galvin × CodeBuddy · 栏目 slogan）  │
└────────────────────────────────────────────┘
```

- 标题自动拆行：中文在标点/语义块后断行，英文按单词边界平衡两行；单行放得下则保持单行
- 字号自适应：按最长标题行宽度自动缩放（中文 36~64px，英文 32~58px），保证不溢出
- **主标题两行行间距**：两行基线间隔 = 字号 + 20px（`titleGap=20`），保证两行标题之间留有舒适空隙，不挤在一起
- 副标题截断：按一行像素宽度截断并加 `…`
- 标签默认格式：中文 `{栏目中文} · {年份}`、英文 `{栏目英文} · {年份}`
- 署名默认：`Galvin × CodeBuddy · {栏目 slogan}`（可覆盖）

---

## 三、如何配图

### 3.1 生成封面（核心步骤）

```bash
# 方式一：传文章文件路径
bash scripts/gen-cover.sh src/content/articles/my-new-article.md

# 方式二：传 slug（自动定位）
bash scripts/gen-cover.sh my-new-article
```

生成结果（写入 `public/images/<slug>/`）：

| 文件 | 说明 |
|------|------|
| `cover.svg` / `cover.png` | 中文封面（1200×630） |
| `cover-en.svg` / `cover-en.png` | 英文封面（有 `titleEn` 时自动生成） |

### 3.2 覆盖文案（可选）

```bash
bash scripts/gen-cover.sh my-new-article \
  --tag "VIBE CODING · 2026.08" \
  --sig-cn "Galvin × CodeBuddy · 从「我不会」到「我想要」" \
  --title-cn "自定义主标题" \
  --desc-en "Custom English subtitle"
```

常用参数（透传 `scripts/cover-render.mjs`）：

| 参数 | 作用 |
|------|------|
| `--tag` / `--tag-en` | 封面标签 |
| `--sig-cn` / `--sig-en` | 底部署名 |
| `--title-cn` / `--title-en` | 强制指定标题 |
| `--desc-cn` / `--desc-en` | 强制指定副标题 |
| `--out <dir>` | 输出到指定目录 |
| `--no-png` | 只生成 SVG 不渲染 PNG（调试） |

### 3.3 写入 frontmatter

在文章 frontmatter 中配置封面字段（生成器不会自动改文章，需手动加）：

```yaml
ogImage: /images/my-new-article/cover.png
ogImageEn: /images/my-new-article/cover-en.png
```

- `ogImage`：中文页封面 + 社交分享图（必须）
- `ogImageEn`：英文页封面（有英文版时建议加）
- 文章 schema 定义见 `src/content/config.ts`

### 3.4 正文章节配图（可选）

长篇/教程类文章可在正文关键章节插入章节插图，风格与封面统一：

1. 新建 `public/images/<slug>/<图名>.svg`，复用 `scripts/gen-vibe-coding-figs.sh` 里的构图元素（星点背景 + 栏目配色 + 卡片/时间线等）
2. 用 `rsvg-convert -o <图名>.png <图名>.svg` 渲染 PNG
3. 在文章 Markdown 中引用：`![图注](/images/<slug>/<图名>.png)`

> 章节配图如需与封面同模板的自动排版能力，可参考 `scripts/cover-render.mjs` 的 `buildSvg()`。

### 3.5 正文章节配图·英文版（双语文章必须）

**规则：只要文章有英文正文（`articles-en/<slug>.md`），正文章节插图就必须配套英文版。** 中文正文引中文图，英文正文引英文图，避免英文页面出现中文插图。

```bash
# vibe-coding 的 4 张章节插图英文版（星野极光·分栏配色，文字全英文）
bash scripts/gen-vibe-coding-figs-en.sh
```

约定：

- 英文插图文件命名 `<图名>-en.svg` / `<图名>-en.png`，与中文版 `<图名>.svg` / `<图名>.png` 同目录（`public/images/<slug>/`）
- 英文正文（`src/content/articles-en/<slug>.md`）引用 `-en` 版本，中文正文（`src/content/articles/<slug>.md`）引用原版
- 中英混排字体栈统一：英文用「新罗马（Times New Roman / Liberation Serif）优先 + 宋体回退」，与封面规范一致
- 其他文章新增章节插图时，按同一约定生成 `-en` 版本并同步引用，防止再出现「英文页图片还是中文」

---

## 四、批量处理旧文章

```bash
# 全量重新生成（会用当前规范刷新所有文章封面）
for f in src/content/articles/*.md; do node scripts/cover-render.mjs --article "$f"; done
```

> 说明：全量刷新会覆盖人工微调过的封面（如 `vibe-coding` 的手工定制版式）。确认要覆盖再执行，否则建议单篇生成。

---

## 五、生成后检查清单（每次生成后必须执行）

> **硬性规则**：每张图片生成/修改后，必须用自检工具跑一遍下面的检查，全部通过才能提交。
> 自检工具：`node scripts/verify-images.mjs`（全量）或 `node scripts/verify-images.mjs --slug <slug>`（单篇）。

### 自动检查（一条命令）

```bash
node scripts/verify-images.mjs --slug <slug>   # 单篇
node scripts/verify-images.mjs                  # 全量
```

自动覆盖：

- [x] `public/images/<slug>/cover.png` 与 `cover-en.png` 存在且为 1200×630
- [x] **无乱码**：重渲染 SVG 与 PNG 像素对比差异 ≤ 1%（差异大 = 在无中文字体环境渲染的豆腐块/乱码图）
- [x] **标题准确**：中文标题完整出现在 cover.svg、英文标题完整出现在 cover-en.svg（防标题丢字/截断）
- [x] frontmatter 的 `ogImage` / `ogImageEn` 指向的文件存在
- [x] 有英文正文的文章必须存在 `cover-en.png`
- [x] 文章正文引用的 `/images/...` 图片全部存在

### 人工复核（自动检查之外）

- [ ] 封面标题完整、无单词被切断、无溢出（打开 PNG 目视确认）
- [ ] 有英文正文的文章：正文章节插图存在 `-en` 版本且英文正文引用它
- [ ] `npm run build` 通过
- [ ] 页面预览：文章页头部 banner + 社交分享图正常

---

## 六、依赖与排障

| 依赖 | 用途 | 安装 |
|------|------|------|
| `rsvg-convert` | SVG → PNG 渲染 | `apt-get install -y librsvg2-bin` |
| Noto CJK 字体 | 中文封面文字 | `apt-get install -y fonts-noto-cjk fonts-noto-cjk-extra` |

> ⚠️ **必须在装有中文字体的环境渲染 PNG**：缺中文字体时中文会渲染成「空心方框/豆腐块」乱码（曾因此在 Issue #61 报告过「字体失效」、Issue #80 再次出现）。
> **所有生成脚本（含 bash 版与 Node 版）已内置环境检查**，缺 `rsvg-convert` 或中文字体时会报错并退出，防止再次产生坏图：
> - `scripts/cover-env-check.sh`：bash 生成脚本（gen-article-covers / gen-en-covers / gen-vibe-coding-figs / gen-vibe-coding-figs-en / gen-vibe-coding-cover）渲染前调用
> - `scripts/cover-render.mjs` 内置 `checkRenderEnv()`：Node 生成器渲染前调用

自检工具：

```bash
node scripts/verify-images.mjs --slug <slug>   # 单篇
node scripts/verify-images.mjs                  # 全量
```

- 输出 `✅ 全部通过` = 图片完整准确，可提交
- 输出 `❌ 疑似乱码` = 该 PNG 是在缺中文字体环境渲染的，重装字体后重新生成
- 输出 `❌ 标题不完整` = SVG 文本缺字（如断行吞掉冒号等），调整标题/断行后重新生成

常见问题：

- **中文显示成方块/豆腐块（乱码）**：未装 Noto CJK 字体（或环境无 lang=zh 字体）→ 安装后 `fc-cache -f` 重跑。生成脚本已内置拦截，不会静默产出坏图
- **PNG 渲染失败**：缺 `rsvg-convert` → 安装 `librsvg2-bin`
- **标题溢出**：多数字号已自适应；如仍溢出，用 `--title-cn/--title-en` 手动精简标题
- **标题丢字/被切断**：断行逻辑会保留语义标点（如冒号），若仍丢失说明标题过长，手动精简或 `--title-cn/--title-en` 指定
- **想微调配色**：改 `scripts/cover-render.mjs` 顶部 `PALETTES` 与 `scripts/covers-palette.sh`，全站封面统一生效

---

## 六·补、图片生成标准规范（写入本仓库，长期生效）

> 以下规范为「星野极光·分栏配色」的完整标准。**每次生成图片都必须遵守，生成后必须用 §五 自检**。

### 1. 尺寸与格式

- 封面一律 `1200×630`（同时用于文章页头部 banner 与社交分享图 og:image）
- 源文件 `.svg` + 渲染产物 `.png` 成对保存于 `public/images/<slug>/`
- 中文封面 `cover.svg` / `cover.png`；英文封面 `cover-en.svg` / `cover-en.png`
- 正文章节插图 `1200×630`，命名 `<图名>.svg/.png`，英文版 `<图名>-en.svg/.png`

### 2. 视觉语言（星野极光）

- 深色底 `#0c0c0c` + 双径向光晕（左上主色光 + 右下辅色光）
- 星点背景（17 颗固定白色星点，多档透明度）
- 顶部细光带 + 左上角双竖线/圆点节奏装饰
- 分隔线（左侧短横线 + 主色圆点 + 短横线）与底部署名

### 3. 字体规范（防乱码核心）

- 中文：宋体（`SimSun` / `Songti SC` / `Noto Serif CJK SC`）
- 英文：新罗马（`Times New Roman` / `Liberation Serif` / `DejaVu Serif`）
- 中英混排统一「新罗马优先 + 宋体回退」字体栈
- **渲染环境必须安装中文字体**（`fonts-noto-cjk`），否则中文变豆腐块

### 4. 栏目配色（PALETTES / covers-palette.sh 中统一定义）

| 栏目 | section | 主色 c1 | 辅色 c2 | 标签文字（亮版） |
|------|---------|---------|---------|---------|
| 行业洞察 | `insights` | `#8E1F2F` | `#6C2A33` | `#E8A2AC` |
| AI 学习 | `ai` | `#1E3A8A` | `#27477F` | `#8FB4F5` |
| 实用技巧 | `tips` | `#B45309` | `#4ADE80` | `#FBBF24` |
| 书籍专区 | `books` | `#7C3AED` | `#F33BD6` | `#A78BFA` |

> 深色区文字一律用主色亮版（上表末列），避免深色背景上难以分辨。

### 5. 文案与布局规则

- 标题自动拆行（中文语义边界/标点后断行；英文按单词边界平衡两行），不拆散单词、不吞掉语义标点
- 字号自适应：中文 36~64px、英文 32~58px，保证不溢出
- 两行标题行距 = 字号 + 20px
- 副标题按一行像素宽度截断加 `…`
- 标签默认 `{栏目名} · {年份}`；署名默认 `Galvin × CodeBuddy · {栏目 slogan}`（books 类用作者）
- frontmatter 必须写入 `ogImage`（有英文版再加 `ogImageEn`）

### 6. 双语配套规则

- 有英文正文（`articles-en/<slug>.md`）的文章，必须配套 `cover-en.png`
- 正文章节插图必须配套 `<图名>-en` 英文版；中文正文引中文图、英文正文引英文图
- 英文封面/插图命名统一 `-en` 后缀

### 7. 防乱码硬性要求

- 渲染 PNG 前必须先通过环境检查（脚本已内置：`cover-env-check.sh` / `checkRenderEnv()`）
- 生成后必须运行 `node scripts/verify-images.mjs --slug <slug>` 自检，`✅ 全部通过` 才能提交
- 任何人（含 NPC/协作者）在任意环境生成图片，都必须遵循上述规范并跑自检，否则不得提交

---

## 七、与其他文档的关系

- `AGENT_OPS.md`：发布新文章总流程（写作 → 草稿 → 发布 → 配图 → 部署）
- `MAINTENANCE.md`：站点维护总览（技术栈 / 结构 / 内容管理）
