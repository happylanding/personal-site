import { defineCollection, z } from "astro:content";

const articlesCollection = defineCollection({
  type: "content",
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
 * 草稿箱：格式不限（不需要 frontmatter，也不需要日期/标签）。
 * 使用宽松 schema，避免自动生成集合的 deprecation 警告，
 * 也不会在草稿文件加入时触发校验错误。
 */
const draftsCollection = defineCollection({
  type: "content",
  schema: z.object({}),
});

const sitesCollection = defineCollection({
  type: "content",
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

export const collections = {
  articles: articlesCollection,
  sites: sitesCollection,
  drafts: draftsCollection,
};
