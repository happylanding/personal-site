# 个人网站维护完全指南

> 网址：https://personal-site-6ed.pages.dev  
> 仓库：https://github.com/happylanding/personal-site  
> 平台：Astro + Cloudflare Pages

---

## 一、发布新文章

### 1. 创建 Markdown 文件

在 `src/content/articles/` 目录下新建 `.md` 文件。**文件名即文章网址**（如 `my-article.md` → 网址 `/tips/my-article/`）。

**完整模板：**

```markdown
---
title: 你的文章标题
titleEn: Your Article Title
description: 文章的简短摘要，用于列表页和首页展示
descriptionEn: A short description of the article
date: 2026-08-02
updated: 2026-08-02
tags: ["标签1", "标签2"]
tagsEn: ["tag1", "tag2"]
section: tips
draft: false
featured: false
---

文章正文，支持 Markdown 格式。

## 二级标题

正文内容……

**加粗文字** 和 *斜体文字*。

> 引用块

```

### 2. 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 中文标题 |
| `titleEn` | 否 | 英文标题（英文版页面显示） |
| `description` | 否 | 中文摘要 |
| `descriptionEn` | 否 | 英文摘要 |
| `date` | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `updated` | 否 | 更新日期 |
| `tags` | 否 | 中文标签，用于标签页分类 |
| `tagsEn` | 否 | 英文标签 |
| `section` | 否 | 所属栏目，默认 `tips` |
| `draft` | 否 | `true` 则不发布（本地可见，线上不显示） |
| `featured` | 否 | `true` 则在首页标记为"精选文章" |

### 3. section 栏目分类

| 值 | 栏目名 | 示例网址 | 适合内容 |
|----|--------|---------|----------|
| `tips` | 实用技巧 | `/tips/xxx/` | 工具教程、开发经验 |
| `insights` | 行业洞察 | `/insights/xxx/` | 行业分析、深度观点 |
| `books` | 书籍资源 | `/books/xxx/` | 书评、推荐、电子书分享 |
| `invest` | 投资复盘 | `/invest/xxx/` | 投资记录、策略复盘 |

### 4. 书籍文章额外字段

仅 `section: books` 时使用：

```markdown
---
section: books
author: 作者名
authorEn: Author Name
coverImage: /images/book-cover.jpg
rating: 5
epubUrl: /books/my-book.epub
pdfUrl: /books/my-book.pdf
buyUrl: https://douban.com/xxx
---
```

| 字段 | 说明 |
|------|------|
| `author` | 作者中文名 |
| `authorEn` | 作者英文名 |
| `coverImage` | 封面图片路径（放在 `public/images/` 下） |
| `rating` | 评分 1-5 |
| `epubUrl` / `pdfUrl` 等 | 下载链接（文件放 `public/books/` 下） |
| `buyUrl` | 购买链接 |

### 5. 投资复盘文章额外字段

仅 `section: invest` 时使用：

```markdown
---
section: invest
ticker: AAPL
pnl: +12.5%
---
```

---

## 二、本地预览

在项目根目录运行：

```powershell
cd <项目根目录>
npm run dev
```

浏览器打开 `http://localhost:4321`，修改 Markdown 文件后页面自动刷新。

本地预览会显示 `draft: true` 的草稿文章，方便调试。

---

## 三、发布上线（3 步）

```powershell
# 第 1 步：进入项目目录
cd <项目根目录>

# 第 2 步：提交到 Git
git add .
git commit -m "feat: 发布新文章 - 你的文章标题"

# 第 3 步：推送到 GitHub（自动触发 Cloudflare 部署）
git push origin main
```

推送后 Cloudflare Pages 自动构建，**1-2 分钟**上线。

---

## 四、修改已有文章

直接编辑对应的 `.md` 文件，修改内容后执行：

```powershell
cd <项目根目录>
git add .
git commit -m "fix: 修改文章标题"
git push origin main
```

---

## 五、创建草稿（不发布）

设置 `draft: true`：

```markdown
---
title: 待发布的文章
date: 2026-08-05
section: tips
draft: true
---
```

草稿文章本地可预览，但**线上不可见**。准备发布时改为 `draft: false` 再推送。

---

## 六、关于转发公众号文章

微信公众号是封闭平台，**无法直接嵌入或显示公众号原始界面**。推荐的迁移方案：

1. 复制公众号文章的文字内容，粘贴到新建的 `.md` 文件
2. 图片需单独下载后放入 `public/images/` 目录
3. 用 Markdown 语法调整排版后推送上线

如果需要批量迁移，可以使用工具将公众号文章导出为 Markdown 再进行转换。

---

## 七、常用命令速查

```powershell
# 本地开发预览
cd <项目根目录> && npm run dev

# 本地构建（检查是否有错误）
cd <项目根目录> && npm run build

# 构建后本地预览生产版本
cd <项目根目录> && npm run preview

# 查看 Git 状态
cd <项目根目录> && git status

# 一键提交 + 推送
cd <项目根目录> && git add . && git commit -m "描述" && git push origin main
```

---

## 八、常见问题

### Q: 文章推送后网站没变化？

- 等 1-2 分钟，Cloudflare Pages 需要构建时间
- 检查文章 `draft` 是否为 `true`
- 在 Cloudflare Pages → Deployments 查看构建状态和日志

### Q: 中英文显示不对？

- `title` 和 `description` 是中文版显示
- `titleEn` 和 `descriptionEn` 是英文版（`/en/` 路径）显示
- 如果少了一个，切换语言后会变空

### Q: 图片不显示？

- 图片放在 `public/images/` 目录下
- Markdown 中引用路径写 `/images/xxx.png`（以 `/` 开头）
- 不要在 `src/content/` 下放图片

### Q: 想更换网站域名？

- 免费方案：在 Cloudflare Pages 删除项目重建，项目名就是 `.pages.dev` 子域名
- 专业方案：在 Cloudflare 购买自定义域名（如 `galvin.me`，$15-20/年），绑定到 Pages

---

> 最后更新：2026-08-02
