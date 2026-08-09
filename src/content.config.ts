import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    tagsEn: z.array(z.string()).default([]),
    /** 所属专栏 */
    section: z.enum(["insights", "ai", "tips", "books", "invest"]).default("tips"),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    /** 英文正文（可选），填写后在英文页面优先展示 */
    bodyEn: z.string().optional(),
    /** 文章封面 / 社交分享图（可选） */
    ogImage: z.string().optional(),
    /** 英文版封面 / 社交分享图（可选，英文页优先使用） */
    ogImageEn: z.string().optional(),
    /** 书籍专区专属字段 */
    coverImage: z.string().optional(),
    author: z.string().optional(),
    authorEn: z.string().optional(),
    /** 各格式下载链接 */
    epubUrl: z.string().optional(),
    pdfUrl: z.string().optional(),
    mobiUrl: z.string().optional(),
    azw3Url: z.string().optional(),
    fb2Url: z.string().optional(),
    txtUrl: z.string().optional(),
    /** 合法在线阅读链接（公版书） */
    readUrl: z.string().optional(),
    /** 书评文章链接 */
    reviewUrl: z.string().optional(),
    /** 购买链接 */
    buyUrl: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    /** 投资复盘专属字段 */
    ticker: z.string().optional(),
    pnl: z.string().optional(),
  }),
});

/**
 * 英文文章正文集合：与 articles 同 slug 一一对应（英文原文优先）。
 * 文章路径 /en/:section/:slug 会优先渲染本集合的正文；
 * 缺失时回退到中文原文（见 src/pages/en/[section]/[slug].astro）。
 */
const articlesEnCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles-en" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    tagsEn: z.array(z.string()).default([]),
    section: z.enum(["insights", "ai", "tips", "books", "invest"]).default("tips"),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    bodyEn: z.string().optional(),
    ogImage: z.string().optional(),
    ogImageEn: z.string().optional(),
    coverImage: z.string().optional(),
    author: z.string().optional(),
    authorEn: z.string().optional(),
    epubUrl: z.string().optional(),
    pdfUrl: z.string().optional(),
    mobiUrl: z.string().optional(),
    azw3Url: z.string().optional(),
    fb2Url: z.string().optional(),
    txtUrl: z.string().optional(),
    readUrl: z.string().optional(),
    reviewUrl: z.string().optional(),
    buyUrl: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    ticker: z.string().optional(),
    pnl: z.string().optional(),
  }),
});

/**
 * 草稿箱：格式不限（不需要 frontmatter，也不需要日期/标签）。
 * 使用宽松 schema，避免自动生成集合的 deprecation 警告，
 * 也不会在草稿文件加入时触发校验错误。
 */
const draftsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/drafts" }),
  schema: z.object({}),
});

const sitesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sites" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    tagsEn: z.array(z.string()).default([]),
    /** 所属专栏 */
    section: z.enum(["insights", "ai", "tips", "books", "invest"]).default("insights"),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    /** 被收藏的网站地址 */
    siteUrl: z.string().optional(),
  }),
});

/**
 * 工具箱工具集合
 *
 * type 三类：
 * - online  在线工具（收藏引用他人网页工具）
 * - app     自研小工具（站内可玩 Demo）
 * - script  脚本工具（本地 CLI，站内下载 / 复制命令）
 */
const toolsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tools" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    /** 工具类型：online | app | script */
    type: z.enum(["online", "app", "script"]).default("online"),
    /** 外链地址（online/app 使用） */
    url: z.string().optional(),
    /** 状态：online 在线 / dev 开发中 / beta 试玩中 / stable 稳定 */
    status: z.enum(["online", "dev", "beta", "stable"]).default("online"),
    /** 脚本命令（script 类型，终端卡一键复制） */
    command: z.string().optional(),
    /** 使用方法步骤（script 类型，无 command 时展示步骤卡） */
    usage: z.array(z.string()).optional(),
    /** 使用方法步骤（英文版） */
    usageEn: z.array(z.string()).optional(),
    /** 站内下载地址（script 类型，如 /downloads/xxx.zip） */
    downloadUrl: z.string().optional(),
    /** 版本号（可选） */
    version: z.string().optional(),
    /** 开源仓库地址（可选） */
    repo: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    tagsEn: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  articles: articlesCollection,
  "articles-en": articlesEnCollection,
  sites: sitesCollection,
  tools: toolsCollection,
  drafts: draftsCollection,
};
