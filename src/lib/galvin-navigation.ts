import type { GalvinContentKind } from "./galvin-content";

export type GalvinNavigationItem = {
  id: Extract<GalvinContentKind, "making" | "question" | "journey" | "about">;
  label: string;
  href: string;
};

export type GalvinResourceNavigationItem = {
  id: Extract<GalvinContentKind, "archive" | "shelf">;
  label: string;
  summary: string;
  href: string;
};

/* Galvin IA reminder: `此刻` belongs to the homepage; resources are one discoverable
   group. Keep content taxonomy independent from visible primary navigation. */
export const GALVIN_NAVIGATION: readonly GalvinNavigationItem[] = [
  { id: "making", label: "造物", href: "/tools/" },
  { id: "question", label: "叩问", href: "/archive/" },
  { id: "journey", label: "行迹", href: "/traces/" },
  { id: "about", label: "关于", href: "/about/" },
] as const;

export const GALVIN_RESOURCE_NAVIGATION: readonly GalvinResourceNavigationItem[] = [
  { id: "archive", label: "网站与资源", summary: "保留下来的网页、工具与分析笔记。", href: "/sites/" },
  { id: "shelf", label: "书架", summary: "正在读的书、阅读状态与合法外链。", href: "/books/" },
] as const;

export const getDiscoverySection = (section: string) => section === "shelf" ? "archive" : section;
