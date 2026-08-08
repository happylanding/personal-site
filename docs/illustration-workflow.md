# 文章配图流程（星野极光 · 分栏配色）

> 适用范围：本仓库（Galvin2026/personal-site）所有文章封面/正文配图
> 最后更新：2026-08-08

---

## 一、流程总览

```
写文章 → 丢草稿箱(drafts/) → 处理草稿(生成 frontmatter) → 发布到 articles/
                                              │
                                              ▼
                                    【配图环节】(本流程)
                                    ① 生成封面 cover.png / cover-en.png
                                    ② frontmatter 写入 ogImage / ogImageEn
                                    ③ （可选）正文章节配图
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
- 顶部细光带、左上角双竖线装饰
- 中文标题衬线（Noto Serif SC）、英文标题 Playfair Display
- 1200×630，同时用于文章页头部 banner 与社交分享图（og:image）

### 栏目配色

| 栏目 | section | 主色 c1（左上光晕/标签/双竖线/分隔线圆点） | 辅色 c2（右下光晕） | 标签文字 |
|------|---------|-------------------------------|----------------|---------|
| 行业洞察 | `insights` | 冰蓝 `#0E96E9` | 蓝紫 `#6C7AFF` | `#38BDF8` |
| 智能实践 | `ai` | 墨绿 `#16A34A` | 暖褐 `#B45309` | `#4ADE80` |
| 实用技巧 | `tips` | 琥珀 `#B45309` | 青绿 `#4ADE80` | `#FBBF24` |
| 书籍资源 | `books` | 紫罗兰 `#7C3AED` | 品红 `#F33BD6` | `#A78BFA` |
| 投资复盘 | `invest` | 冰蓝 `#0E96E9` | 蓝紫 `#6C7AFF` | `#38BDF8` |

> 配色常量集中在 `scripts/cover-render.mjs` 顶部的 `PALETTES` 中，改色只需改这一处。

### 封面版式

```
┌────────────────────────────────────────────┐
│ ▕▎  标签（栏目英文 + 年份，主色）            │
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

---

## 四、批量处理旧文章

```bash
# 全量重新生成（会用当前规范刷新所有文章封面）
for f in src/content/articles/*.md; do node scripts/cover-render.mjs --article "$f"; done
```

> 说明：全量刷新会覆盖人工微调过的封面（如 `vibe-coding` 的手工定制版式）。确认要覆盖再执行，否则建议单篇生成。

---

## 五、生成后检查清单

- [ ] `public/images/<slug>/cover.png` 与 `cover-en.png` 存在（1200×630）
- [ ] 封面标题完整、无单词被切断、无溢出
- [ ] frontmatter 已加 `ogImage`（/ `ogImageEn`）
- [ ] `npm run build` 通过
- [ ] 页面预览：文章页头部 banner + 社交分享图正常

---

## 六、依赖与排障

| 依赖 | 用途 | 安装 |
|------|------|------|
| `rsvg-convert` | SVG → PNG 渲染 | `apt-get install -y librsvg2-bin` |
| Noto CJK 字体 | 中文封面文字 | `apt-get install -y fonts-noto-cjk` |

常见问题：

- **中文显示成方块/豆腐块**：未装 Noto CJK 字体 → 安装后重跑
- **PNG 渲染失败**：缺 `rsvg-convert` → 安装 `librsvg2-bin`
- **标题溢出**：多数字号已自适应；如仍溢出，用 `--title-cn/--title-en` 手动精简标题
- **想微调配色**：改 `scripts/cover-render.mjs` 顶部 `PALETTES`，全站封面统一生效

---

## 七、与其他文档的关系

- `AGENT_OPS.md`：发布新文章总流程（写作 → 草稿 → 发布 → 配图 → 部署）
- `MAINTENANCE.md`：站点维护总览（技术栈 / 结构 / 内容管理）
