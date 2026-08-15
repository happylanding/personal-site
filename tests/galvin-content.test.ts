import { describe, expect, it } from "vitest";
import {
  GALVIN_CONTENT_KINDS,
  getGalvinKindLabel,
  mapLegacyArticleSection,
} from "../src/lib/galvin-content";
import { getGalvinRouteFromLegacyPath } from "../src/lib/galvin-routing";

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
});
