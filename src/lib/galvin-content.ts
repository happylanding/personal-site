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

export function mapLegacyArticleSection(
  section: keyof typeof LEGACY_ARTICLE_SECTION_MAP,
): GalvinContentKind {
  return LEGACY_ARTICLE_SECTION_MAP[section];
}
