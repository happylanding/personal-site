import { getCollection } from "astro:content";
import { getGalvinKindLabel } from "../lib/galvin-content";
import { resolveArticleSearchKind } from "../lib/galvin-content-view";

type SearchItem = {
  title: string;
  excerpt: string;
  tags: string;
  tagsArr: string[];
  category: string;
  section: string;
  date: string;
  href: string;
};

function dateLabel(date?: Date): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function makeSearchItem(input: Omit<SearchItem, "tags" | "tagsArr"> & { tags: string[] }): SearchItem {
  return {
    ...input,
    tags: input.tags.join(" "),
    tagsArr: input.tags,
  };
}

// 中文搜索索引：构建期生成独立 JSON，由搜索面板在首次打开时按需加载。
export async function GET() {
  const [articles, tools, sites, books] = await Promise.all([
    getCollection("articles", ({ data }) => !data.draft),
    getCollection("tools", ({ data }) => !data.draft),
    getCollection("sites", ({ data }) => !data.draft),
    getCollection("books", ({ data }) => !data.draft),
  ]);

  const articleItems = articles.map((post) => {
    const kind = resolveArticleSearchKind(post.data.kind, post.data.section);
    return makeSearchItem({
      title: post.data.title,
      excerpt: post.data.description || "",
      tags: post.data.tags,
      category: getGalvinKindLabel(kind),
      section: kind,
      date: dateLabel(post.data.date),
      href: `/${post.data.section}/${post.id}/`,
    });
  });

  const toolItems = tools.map((tool) => makeSearchItem({
    title: tool.data.title,
    excerpt: tool.data.description || "",
    tags: tool.data.tags,
    category: getGalvinKindLabel("making"),
    section: "making",
    date: dateLabel(tool.data.updated || tool.data.date),
    href: `/tools/${tool.id}/`,
  }));

  const siteItems = sites.map((site) => makeSearchItem({
    title: site.data.title,
    excerpt: site.data.description || "",
    tags: site.data.tags,
    category: getGalvinKindLabel("archive"),
    section: "archive",
    date: dateLabel(site.data.updated || site.data.date),
    href: `/sites/${site.id}/`,
  }));

  const bookItems = books.map((book) => makeSearchItem({
    title: book.data.title,
    excerpt: book.data.description || book.data.note || "",
    tags: book.data.tags,
    category: getGalvinKindLabel("shelf"),
    section: "shelf",
    date: dateLabel(book.data.finishedAt || book.data.startedAt),
    href: "/books/",
  }));

  return new Response(JSON.stringify([...articleItems, ...toolItems, ...siteItems, ...bookItems]), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
