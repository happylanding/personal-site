import type { GalvinContentKind } from "./galvin-content";

export type GalvinNavigationItem = {
  id: GalvinContentKind;
  label: string;
  href: string;
  index: string;
};

export const GALVIN_NAVIGATION: readonly GalvinNavigationItem[] = [
  { id: "now", label: "此刻", href: "/", index: "01" },
  { id: "making", label: "造物", href: "/tools", index: "02" },
  { id: "question", label: "叩问", href: "/archive", index: "03" },
  { id: "journey", label: "行迹", href: "/about#journey", index: "04" },
  { id: "archive", label: "藏页", href: "/sites", index: "05" },
  { id: "shelf", label: "书架", href: "/books", index: "06" },
  { id: "about", label: "关于", href: "/about", index: "07" },
] as const;
