import { describe, expect, it } from "vitest";
import {
  GALVIN_CONTENT_KINDS,
  getGalvinKindLabel,
  mapLegacyArticleSection,
} from "../src/lib/galvin-content";
import { getGalvinRouteFromLegacyPath } from "../src/lib/galvin-routing";
import { GALVIN_NAVIGATION } from "../src/lib/galvin-navigation";
import {
  filterToolsByType,
  getQuestionFilterOptions,
  isQuestionArticleMatch,
  resolveArticleSearchKind,
} from "../src/lib/galvin-content-view";

describe("Galvin 内容分类", () => {
  it("定义了七个稳定的中文内容分类", () => {
    expect(GALVIN_CONTENT_KINDS).toEqual([
      "now",
      "making",
      "question",
      "journey",
      "archive",
      "shelf",
      "about",
    ]);
  });

  it("将旧文章栏目映射到 Galvin 的内容语义", () => {
    expect(mapLegacyArticleSection("insights")).toBe("question");
    expect(mapLegacyArticleSection("ai")).toBe("question");
    expect(mapLegacyArticleSection("tips")).toBe("making");
    expect(mapLegacyArticleSection("books")).toBe("shelf");
  });

  it("为稳定内容分类返回用户可见的中文栏目名称", () => {
    expect(getGalvinKindLabel("making")).toBe("造物");
    expect(getGalvinKindLabel("archive")).toBe("藏页");
    expect(getGalvinKindLabel("shelf")).toBe("书架");
  });

  it("为首版保留旧站的核心路径入口", () => {
    expect(getGalvinRouteFromLegacyPath("/tools")).toBe("/造物");
    expect(getGalvinRouteFromLegacyPath("/sites")).toBe("/藏页");
    expect(getGalvinRouteFromLegacyPath("/about")).toBe("/关于");
    expect(getGalvinRouteFromLegacyPath("/en/about")).toBe("/关于");
  });

  it("以中文优先的七栏目导航承接当前迁移期入口", () => {
    expect(GALVIN_NAVIGATION.map((item) => item.label)).toEqual([
      "此刻",
      "造物",
      "叩问",
      "行迹",
      "藏页",
      "书架",
      "关于",
    ]);
    expect(GALVIN_NAVIGATION.find((item) => item.id === "making")?.href).toBe("/tools");
    expect(GALVIN_NAVIGATION.find((item) => item.id === "about")?.href).toBe("/about");
  });

  it("为叩问归档保留全部筛选并从真实标签中生成去重入口", () => {
    expect(getQuestionFilterOptions(["AI", "数字政府", "AI", "效率工具"])).toEqual([
      "全部",
      "AI",
      "数字政府",
      "效率工具",
    ]);
  });

  it("只让匹配当前标签的叩问文章通过筛选", () => {
    expect(isQuestionArticleMatch(["AI", "效率工具"], "全部")).toBe(true);
    expect(isQuestionArticleMatch(["AI", "效率工具"], "效率工具")).toBe(true);
    expect(isQuestionArticleMatch(["AI", "效率工具"], "数字政府")).toBe(false);
  });

  it("按工具类型筛选造物条目，并让“全部”保留原有顺序", () => {
    const tools = [
      { id: "detector", type: "app" },
      { id: "cleaner", type: "script" },
      { id: "reference", type: "online" },
    ] as const;

    expect(filterToolsByType(tools, "script").map((tool) => tool.id)).toEqual(["cleaner"]);
    expect(filterToolsByType(tools, "all").map((tool) => tool.id)).toEqual([
      "detector",
      "cleaner",
      "reference",
    ]);
  });

  it("为搜索索引优先采用显式 Galvin 栏目，并兼容旧文章栏目", () => {
    expect(resolveArticleSearchKind(undefined, "ai")).toBe("question");
    expect(resolveArticleSearchKind(undefined, "tips")).toBe("making");
    expect(resolveArticleSearchKind("journey", "tips")).toBe("journey");
  });
});
