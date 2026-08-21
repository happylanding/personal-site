import { getCollection } from "astro:content";

// 中文搜索索引：构建期生成独立 JSON，页面不再内联全站文章数据。
// 由 SearchDialog 在搜索框首次打开时按需 fetch（/search-index.json）。
const columnNames: Record<string, string> = {
  insights: "行业洞察",
  ai: "AI 学习",
  tips: "实用技巧",
  books: "阅读思考",
};

export async function GET() {
  const allArticles = await getCollection("articles", function (entry) {
    return !entry.data.draft;
  });

  const searchData = allArticles.map(function (post) {
    var title = post.data.title;
    var excerpt = post.data.description;
    var tags = post.data.tags;
    var category = columnNames[post.data.section];
    var dateStr = post.data.date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    var href = "/" + post.data.section + "/" + post.id + "/";
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
