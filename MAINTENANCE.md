# 个人网站维护文档

> 最后更新：2026-08-08（P0 改造后 + 评审修正）
> 项目地址：`happylanding/personal-site`（GitHub，Cloudflare 部署源）| 线上地址：https://galvinai.pages.dev
> 开发镜像：`Galvin2026/personal-site`（CNB，方案 A）→ 同步回 GitHub → Cloudflare 自动部署

---

## 1. 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Astro (SSG) | ^5.7 |
| 样式 | Tailwind CSS v4 + Typography 插件 | ^4.1 / ^0.5 |
| 语言 | TypeScript (strict) | — |
| 代码高亮 | Shiki (`github-dark-dimmed`) | 内置于 Astro |
| SEO | `@astrojs/sitemap`（生成 `/sitemap.xml`） | ^3.x |
| 部署 | Cloudflare Pages (自动 CI) | — |

项目使用 **ESM 模块** (`"type": "module"`)，无 `tailwind.config.mjs`（Tailwind v4 通过 Vite 插件在 CSS 内配置）。

---

## 2. 项目结构

```
src/
├── components/          # 15 个 Astro 组件
│   ├── ArticleCard.astro       # 文章卡片（备用）
│   ├── ArticleTOC.astro        # 文章内目录（h2/h3 自动收集 + 滚动高亮）
│   ├── BackToTop.astro         # 回到顶部按钮
│   ├── Breadcrumb.astro        # 面包屑导航
│   ├── ColumnIcon.astro        # 专栏图标（insights/ai/tips/books）
│   ├── Currently.astro         # 首页"正在做"模块
│   ├── Footer.astro            # 页脚
│   ├── Header.astro            # 顶部导航（含汉堡菜单）
│   ├── LanguageSwitcher.astro  # 中英文切换按钮
│   ├── MouseGlow.astro         # 鼠标跟随光晕效果
│   ├── ReadingProgress.astro   # 顶部阅读进度条 + 百分比
│   ├── ScrollReveal.astro      # 滚动渐入 + 卡片 3D 翻牌
│   ├── SearchDialog.astro      # 搜索弹窗
│   ├── ThemeToggle.astro       # 暗色/亮色模式切换
│   └── TOCPanel.astro          # 电子书目录预览面板
│
├── content/
│   ├── config.ts               # Zod schema 定义（见 §3）
│   ├── articles/               # 已发布文章
│   └── drafts/                 # 草稿箱：写完丢这里，智能体自动处理 → 发布到 articles/
│
├── i18n/
│   ├── ui.ts                   # 中英文 UI 文本字典
│   └── utils.ts                # getLangFromUrl / useTranslations 工具函数
│
├── layouts/
│   └── BaseLayout.astro        # 唯一布局：SEO meta、View Transitions、全局组件
│
├── lib/
│   └── sections.ts             # 栏目统一类型 SectionKey + 顺序常量
│
├── pages/                      # Astro 文件路由
│   ├── index.astro             # 首页 /
│   ├── about.astro             # 关于页
│   ├── archive.astro           # 归档页
│   ├── contact.astro           # 联系页
│   ├── [section].astro         # 专栏列表页 /:section
│   ├── [section]/[slug].astro  # 文章详情页 /:section/:slug
│   ├── tags/index.astro        # 标签聚合页
│   ├── tags/[tag].astro        # 标签筛选页
│   └── en/                     # 英文版镜像路由
│
└── styles/
    └── global.css              # 全局样式（Tailwind + prose + 动效 + 自定义覆盖）

docs/                           # 归档文档
├── maintenance-zh.md           # 原《维护指南.md》
└── vibe-coding-creation.md     # 原《我的第一件Vibe-Coding作品.md》
```

---

## 3. 内容管理（Frontmatter Schema）

所有字段定义在 `src/content/config.ts`，使用 Zod 校验：

| 字段 | 类型 | 必填 | 说明 |
|------|------|:---:|------|
| `title` | `string` | ✅ | 中文标题 |
| `titleEn` | `string` | | 英文标题 |
| `description` | `string` | | 中文摘要 |
| `descriptionEn` | `string` | | 英文摘要 |
| `date` | `date` | ✅ | 发布日期 |
| `updated` | `date` | | 更新日期 |
| `tags` | `string[]` | | 中文标签（默认 `[]`） |
| `tagsEn` | `string[]` | | 英文标签（默认 `[]`） |
| `section` | `enum` | | 专栏：`insights` / `ai` / `tips` / `books` / `invest`（默认 `tips`） |
| `draft` | `boolean` | | 草稿（默认 `false`） |
| `featured` | `boolean` | | 精选（默认 `false`） |
| `bodyEn` | `string` | | **英文正文（HTML）**，不填则英文页 fallback 到中文原文 |
| `coverImage` | `string` | | 书籍封面图 |
| `author` | `string` | | 作者 |
| `authorEn` | `string` | | 英文作者名 |
| `rating` | `number` | | 评分（0-5） |
| `epubUrl` 等 | `string` | | 各格式电子书下载链接（公版书才提供） |
| `readUrl` | `string` | | 合法在线阅读链接（公版书） |
| `reviewUrl` | `string` | | 书评文章链接 |
| `buyUrl` | `string` | | 购买链接 |
| `ticker` | `string` | | 股票代码（投资复盘专栏，保留但已隐藏） |
| `pnl` | `string` | | 盈亏（投资复盘专栏，保留但已隐藏） |

> ⚠️ **版权红线**：只有公版书（Public Domain）可提供文件下载/在线阅读；受版权保护书籍一律走「书评 + 购买/借阅链接」模式。

---

## 4. 栏目结构（P0 重组后）

| # | 栏目 | key | 状态 | 说明 |
|---|------|-----|:---:|------|
| 01 | 行业洞察 | `insights` | ✅ | 数字经济 / 数字政府 / 产业观察（本职行业） |
| 02 | AI 学习 | `ai` | ✅ 新增 | AI 工具实测 / 学习路径 / 实战笔记 |
| 03 | 实用技巧 | `tips` | ✅ | 效率工具 / WPS / 建站教程 |
| 04 | 书籍专区 | `books` | ✅ | 书评 + 阅读笔记，公版书在线阅读 |
| ~~05~~ | ~~投资复盘~~ | `invest` | 🕳 隐藏 | 路由保留、数据不删，未来可恢复 |

- 导航栏 / 首页卡片 / 关于页只展示前 4 栏。
- `invest` 路由仍在 `getStaticPaths` 中生成（`src/lib/sections.ts` 的 `ALL_SECTIONS`），避免旧链接 404。
- `sites`（设计灵感收藏夹）为隐藏栏目：不在导航/首页展示，入口是页脚的小书签图标，键盘按 `g` `s` 也可直达，供站主个人查阅；sitemap 已过滤。

---

## 5. 双语实现逻辑

同 P0 前：双份页面 + 静态字典；`/en/` 前缀英文路由。`bodyEn` 未填时英文页 fallback 中文原文。

---

## 6. 样式与动效体系（P0 新增）

| 能力 | 类 / 组件 | 说明 |
|------|-----------|------|
| 滚动渐入 | `data-reveal` | IntersectionObserver |
| Hero 遮罩入场 | `.lmask` / `.lmask-inner` | 逐行 `translateY(112%)` 上滑，`--lmask-delay` 交错 |
| 卡片 3D 翻牌 | `.roll-card` | `perspective` + `rotateX`，`--roll-index` 交错延迟 |
| 幽灵编号 | `.ghost-num` | 首页四栏 `01-04` 大号浅色编号 |
| 阅读进度条 | `<ReadingProgress />` | 顶部 3px 细条 + 百分比，reduced-motion 降级 |
| 文章内目录 | `<ArticleTOC />` | 自动收集 h2/h3，滚动高亮当前章节 |
| 电子书目录 | `<TOCPanel />` | 读预生成的 `.toc.json` |

> 所有动效尊重 `prefers-reduced-motion`，低能力设备自动降级。

---

## 7. 路由一览

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `index.astro` | 首页 |
| `/about` | `about.astro` | 关于 |
| `/archive` | `archive.astro` | 归档 |
| `/contact` | `contact.astro` | 联系 |
| `/insights` | `[section].astro` | 行业洞察 |
| `/ai` | `[section].astro` | AI 学习 |
| `/tips` | `[section].astro` | 实用技巧 |
| `/books` | `[section].astro` | 书籍专区 |
| `/invest` | `[section].astro` | 投资复盘（隐藏，保留路由） |
| `/sites` | `sites.astro` | 设计灵感收藏夹（隐藏入口，页脚小书签 + 快捷键 `g s`） |
| `/sites/oiloil` | `sites/[slug].astro` | 收藏夹报告详情 |
| `/tips/vibe-coding` | `[section]/[slug].astro` | 文章详情 |
| `/tags` | `tags/index.astro` | 标签聚合 |
| `/tags/标签名` | `tags/[tag].astro` | 标签筛选 |
| `/sitemap.xml` | `@astrojs/sitemap` | 站点地图 |

英文路由在以上路径前加 `/en/`，如 `/en/tips/vibe-coding`。

---

## 8. 已知问题与修复记录

### 8.1 View Transitions + ScrollReveal 冲突（已修复）
`ScrollReveal.astro` 监听 `astro:page-load` 重新 observe。

### 8.2 手机端汉堡菜单无法关闭（已修复）
Overlay 点击关闭逻辑简化。

### 8.3 CSS 伪元素选择器笔误（已修复）
`:::-webkit-scrollbar` → `::-webkit-scrollbar`；`:::view-transition-old/root` → `::view-transition-old(root)`。

### 8.4 英文页面缺失 prose 排版（已修复）
`en/[section]/[slug].astro` 补 `prose dark:prose-invert`。

### 8.5 技术债清理（P0 完成）
- ✅ `robots.txt` Sitemap 指向 `galvinai.pages.dev`
- ✅ 接入 `@astrojs/sitemap`，真实生成 `/sitemap.xml`
- ✅ 三个闲置组件挂载：`Currently`（首页）/ `TOCPanel`（书籍页）/ `ArticleTOC`（文章页）
- ✅ `ColumnIcon` 统一 `SectionKey` 类型（`src/lib/sections.ts`）
- ✅ 英文 tags 按 `tagsEn` 独立聚合
- ✅ 根目录散文档归档进 `docs/`
- ✅ `AGENT_OPS.md` 去除写死的 `D:/personal-site` 路径

### 8.6 评审修正（2026-08-08）
- ✅ sitemap 过滤隐藏路由 `/invest/`，避免搜索引擎收录不对外栏目
- ✅ `MAINTENANCE.md` 组件数由 16 修正为 15，标注 GitHub/CNB 双仓库地址
- ✅ `AGENT_OPS.md` section 列表改为 `insights/ai/tips/books`

---

## 9. 常用命令

```bash
npm run dev        # 启动开发服务器 (localhost:4321)
npm run build      # 构建生产版本（含 sitemap）
npm run preview    # 预览构建结果
```

推送后 Cloudflare Pages 自动构建部署，无需额外操作。

---

## 10. 添加新文章

1. 在 `src/content/drafts/` 下创建 `{slug}.md`（只写正文，无需 frontmatter）
2. 在 CodeBuddy 中说：**"帮我处理草稿"**
3. 智能体自动生成 Meta → 你审核确认 → 自动发布到 `articles/` 并推送部署

**草稿格式：**
```markdown
# 文章标题

正文内容，随便写，Markdown 格式。
```

---

## 11. 部署链路（方案 A）

```
CNB 仓库 Galvin2026/personal-site  ←（开发/提交/构建验证）
        │ ① push 到 main 自动触发
        │ ② 每日 02:00 定时兜底
        ▼
   git-sync 插件（tencentcom/git-sync）
        │ 携带 GitHub Token 推送 main
        ▼
GitHub happylanding/personal-site  ←（Cloudflare 连接源）
        │ 自动构建
        ▼
Cloudflare Pages → galvinai.pages.dev
```

**自动同步机制**：仓库根目录的 `.cnb.yml` 配置了「构建验证 + git-sync 同步」流水线。
在 CNB 完成改动并合并到 `main` 后，流水线自动运行 `npm run build` 验证，通过后自动把 `main` 推送到 GitHub，Cloudflare 随即自动部署，**全程无需手动操作**。

> 首次配置步骤（创建 GitHub Token、CNB 密钥仓库、填写 imports 地址）详见 [`docs/github-sync.md`](docs/github-sync.md)。
