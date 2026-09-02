import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    /** 所属专栏 */
    section: z.enum(["insights", "ai", "tips", "books"]).default("tips"),
    draft: z.boolean().default(false),
    /** 不在任何栏目/列表/归档/搜索中展示，仅保留独立详情页（用于挂载到书本详情页「阅读感悟」的附属内容） */
    hidden: z.boolean().default(false),
    featured: z.boolean().default(false),
    /** 文章封面 / 社交分享图（可选） */
    ogImage: z.string().optional(),
    /** 阅读思考专属字段 */
    coverImage: z.string().optional(),
    author: z.string().optional(),
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
    /** 阅读感悟文章 slug 列表（一本书记载站主对其的独立读后感文章） */
    reflectionSlugs: z.array(z.string()).optional(),
    /** 购买链接 */
    buyUrl: z.string().optional(),
    /** 是否受版权保护：true 时不提供下载与在线阅读，仅展示购买链接 */
    copyright: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
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
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    /** 所属专栏 */
    section: z.enum(["insights", "ai", "tips", "books"]).default("insights"),
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
    description: z.string().optional(),
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
    /** 站内下载地址（script 类型，如 /downloads/xxx.zip） */
    downloadUrl: z.string().optional(),
    /** 版本号（可选） */
    version: z.string().optional(),
    /** 开源仓库地址（可选） */
    repo: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  articles: articlesCollection,
  sites: sitesCollection,
  tools: toolsCollection,
  drafts: draftsCollection,
};
