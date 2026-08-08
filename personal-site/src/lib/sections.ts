/**
 * 栏目（Section）统一类型
 *
 * - SECTION_ORDER：首页 / 导航展示的栏目顺序（invest 已隐藏，不在此列）
 * - ALL_SECTIONS：完整栏目集合（含隐藏的 invest，用于路由保留、未来恢复）
 */
export type SectionKey = "insights" | "ai" | "tips" | "books" | "invest";

/** 对外展示的栏目（首页卡片 / 导航 / 关于页） */
export const SECTION_ORDER: SectionKey[] = ["insights", "ai", "tips", "books"];

/** 全部栏目（含隐藏态 invest，路由仍保留避免旧链接 404） */
export const ALL_SECTIONS: SectionKey[] = ["insights", "ai", "tips", "books", "invest"];
