export const GALVIN_CONTENT_KINDS = [
  "now",
  "making",
  "question",
  "journey",
  "archive",
  "shelf",
  "about",
] as const;

export type GalvinContentKind = (typeof GALVIN_CONTENT_KINDS)[number];

// 可发现分类与页面内容源不同：书架仍有独立路由和内容类型，但在全站发现中归入“藏页”。
export const GALVIN_DISCOVERY_KINDS = [
  "now",
  "making",
  "question",
  "journey",
  "archive",
  "about",
] as const;

export type GalvinDiscoveryKind = (typeof GALVIN_DISCOVERY_KINDS)[number];

const KIND_LABELS: Record<GalvinContentKind, string> = {
  now: "此刻",
  making: "造物",
  question: "叩问",
  journey: "行迹",
  archive: "藏页",
  shelf: "书架",
  about: "关于",
};

const LEGACY_ARTICLE_SECTION_MAP = {
  insights: "question",
  ai: "question",
  tips: "making",
  books: "shelf",
} as const satisfies Record<string, GalvinContentKind>;

export function getGalvinKindLabel(kind: GalvinContentKind): string {
  return KIND_LABELS[kind];
}

export function getGalvinDiscoveryKind(kind: GalvinContentKind): GalvinDiscoveryKind {
  return kind === "shelf" ? "archive" : kind;
}

export function mapLegacyArticleSection(
  section: keyof typeof LEGACY_ARTICLE_SECTION_MAP,
): GalvinContentKind {
  return LEGACY_ARTICLE_SECTION_MAP[section];
}
