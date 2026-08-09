import { getCollection } from "astro:content";
import { useTranslations } from "../i18n/utils";

// 中文搜索索引：构建期生成独立 JSON，页面不再内联全站文章数据。
// 由 SearchDialog 在搜索框首次打开时按需 fetch（/search-index.json）。
export async function GET() {
  const lang = "zh" as const;
  const t = useTranslations(lang);
  const langPrefix = "/";

  const allArticles = await getCollection("articles", function (entry) {
    return !entry.data.draft;
  });

  const searchData = allArticles.map(function (post) {
    var title = post.data.title;
    var excerpt = post.data.description;
    var tags = post.data.tags;
    var category = t("columns." + post.data.section + ".name");
    var dateStr = post.data.date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    var href = langPrefix + post.data.section + "/" + post.id + "/";
    return {
      title: title,
      excerpt: excerpt || "",
      tags: (tags || []).join(" "),
      tagsArr: tags || [],
      category: category,
      section: post.data.section,
      date: dateStr,
      href: href,
    };
  });

  return new Response(JSON.stringify(searchData), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
