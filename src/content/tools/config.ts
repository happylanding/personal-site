/**
 * 工具箱数据模型共享类型
 * 与 src/content/config.ts 中 toolsCollection 的 schema 保持一致
 */

export type ToolType = "online" | "app" | "script";
export type ToolStatus = "online" | "dev" | "beta" | "stable";

export interface ToolData {
  title: string;
  description?: string;
  type: ToolType;
  url?: string;
  status: ToolStatus;
  command?: string;
  /** 使用方法步骤（script 类型，无 command 时展示步骤卡） */
  usage?: string[];
  downloadUrl?: string;
  version?: string;
  repo?: string;
  date: Date;
  updated?: Date;
  tags: string[];
  draft: boolean;
  featured: boolean;
}

export interface ToolEntry {
  id: string;
  slug: string;
  body: string;
  collection: "tools";
  data: ToolData;
}

/** 工具箱三类工具的主题色（与 SECTION_COLORS 风格统一） */
export const TOOL_COLORS: Record<ToolType, string> = {
  online: "#0E96E9",
  app: "#16A34A",
  script: "#B45309",
};

/** 工具分类顺序（Tab 展示） */
export const TOOL_TYPE_ORDER: ToolType[] = ["online", "app", "script"];

/** 状态徽章文案 key（zh） */
export const STATUS_LABEL_ZH: Record<ToolStatus, string> = {
  online: "在线",
  dev: "开发中",
  beta: "试玩中",
  stable: "稳定",
};
