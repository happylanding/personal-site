import {
  mapLegacyArticleSection,
  type GalvinContentKind,
} from "./galvin-content";

export const QUESTION_ALL_FILTER = "全部";

export function getQuestionFilterOptions(tags: readonly string[]): string[] {
  return [QUESTION_ALL_FILTER, ...new Set(tags.filter(Boolean))];
}

export function isQuestionArticleMatch(
  articleTags: readonly string[],
  activeFilter: string,
): boolean {
  return activeFilter === QUESTION_ALL_FILTER || articleTags.includes(activeFilter);
}

export function filterToolsByType<T extends { type: string }>(
  tools: readonly T[],
  activeType: string,
): T[] {
  return activeType === "all" ? [...tools] : tools.filter((tool) => tool.type === activeType);
}

export function resolveArticleSearchKind(
  kind: GalvinContentKind | undefined,
  section: Parameters<typeof mapLegacyArticleSection>[0],
): GalvinContentKind {
  return kind || mapLegacyArticleSection(section);
}
