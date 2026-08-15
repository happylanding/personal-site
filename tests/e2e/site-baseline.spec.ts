import { test, expect } from "@playwright/test";

test("首页保留可读的主标题与键盘可达的导航", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation")).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus-visible")).toBeVisible();
});

test("手机端栏目索引可打开并通过 Escape 关闭", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "打开栏目导航" });
  await toggle.click();
  await expect(page.locator("#galvin-mobile-menu")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#galvin-mobile-menu").getByRole("link", { name: "造物" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.locator("#galvin-mobile-menu")).toHaveAttribute("aria-hidden", "true");
});

test("叩问归档可按标签筛选已发布文章", async ({ page }) => {
  await page.goto("/archive/");

  await expect(page.getByRole("heading", { level: 1, name: "叩问。" })).toBeVisible();
  const aiFilter = page.getByRole("tab", { name: "AI", exact: true });
  await aiFilter.click();
  await expect(aiFilter).toHaveAttribute("aria-selected", "true");

  const visibleCards = page.locator("[data-question-card]:not([hidden])");
  await expect(visibleCards.first()).toBeVisible();
  expect(await visibleCards.evaluateAll((cards) => cards.every((card) => (card as HTMLElement).dataset.tags?.split("|").includes("AI")))).toBe(true);
});

test("造物页保留本地工具的隐私说明与下载入口", async ({ page }) => {
  await page.goto("/tools/");

  await expect(page.getByRole("heading", { level: 1, name: "造物。" })).toBeVisible();
  await expect(page.getByText("浏览器工具在本地运行；本地脚本在 Windows 电脑上执行")).toBeVisible();

  const scriptFilter = page.getByRole("tab", { name: /本地脚本/ });
  await scriptFilter.click();
  await expect(scriptFilter).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-tool-card]:not([hidden])')).toHaveCount(1);
  await expect(page.getByRole("link", { name: "下载工具" })).toHaveAttribute("href", "/downloads/excel-sheet-cleaner.zip");
});

test("全站搜索以 Galvin 栏目语义检索真实工具", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "打开全站搜索" }).click();

  const input = page.locator("#search-input");
  await expect(input).toBeVisible();
  await input.fill("Excel");

  const results = page.locator("#search-results-list");
  await expect(results).toContainText("Excel 空 Sheet 批量清理工具");
  await expect(results).toContainText("造物");
});

test("书架展示首本开源书目且不提供站内全文下载", async ({ page }) => {
  await page.goto("/books/");

  await expect(page.getByRole("heading", { level: 1, name: "书架。" })).toBeVisible();
  await expect(page.getByText("深入理解 AI Agent：设计原理与工程实践")).toBeVisible();
  await expect(page.getByText("正在阅读")).toBeVisible();
  await expect(page.getByRole("link", { name: "访问开源项目" })).toHaveAttribute("href", "https://github.com/bojieli/ai-agent-book");
  await expect(page.getByRole("link", { name: /EPUB|PDF|下载/ })).toHaveCount(0);
});

test("全站搜索可检索书架中的首本书目", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "打开全站搜索" }).click();
  await page.locator("#search-input").fill("Agent");

  const results = page.locator("#search-results-list");
  await expect(results).toContainText("深入理解 AI Agent：设计原理与工程实践");
  await expect(results).toContainText("书架");
});

test("书架可进入本站在线预览并保留官方阅读回退", async ({ page }) => {
  await page.goto("/books/");
  await expect(page.getByRole("link", { name: "在线预览" })).toHaveAttribute("href", "/books/understanding-ai-agent-engineering/read/");

  await page.goto("/books/understanding-ai-agent-engineering/read/");
  await expect(page.getByRole("heading", { level: 1, name: "在线预览" })).toBeVisible();
  await expect(page.locator('iframe[title="《深入理解 AI Agent：设计原理与工程实践》官方在线阅读器"]')).toHaveAttribute("src", "https://bojieli.github.io/ai-agent-book/");
  await expect(page.getByRole("link", { name: "在官方站点打开" })).toHaveAttribute("href", "https://bojieli.github.io/ai-agent-book/");
  await expect(page.getByRole("link", { name: "访问开源项目" })).toHaveAttribute("href", "https://github.com/bojieli/ai-agent-book");
});

test("叩问详情页提供 Galvin 阅读工作区与原始资源入口", async ({ page }) => {
  await page.goto("/ai/easy-vibe-guide/");

  await expect(page.locator("article.galvin-article-page")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Easy-Vibe 宝藏指南：把 Datawhale 这套 AI 编程教程里真正的好东西一次讲清楚" })).toBeVisible();
  await expect(page.getByRole("link", { name: "返回叩问" })).toHaveAttribute("href", "/archive/");
  await expect(page.getByRole("link", { name: "原始资源" })).toHaveAttribute("href", "https://datawhalechina.github.io/easy-vibe/zh-cn/");
});

test("叩问详情页按正文滚动同步可访问阅读进度", async ({ page }) => {
  await page.goto("/ai/easy-vibe-guide/");
  const progress = page.getByRole("progressbar", { name: "文章阅读进度" });

  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5));
  await expect.poll(async () => Number(await progress.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
});

test("叩问详情页的桌面目录在正文滚动时保持停留", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/ai/easy-vibe-guide/");
  const rail = page.locator("#article-toc-rail");
  await expect(rail).toBeVisible();

  const readingStart = await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    const content = document.querySelector(".galvin-article-content");
    return (content?.getBoundingClientRect().top || 0) + window.scrollY + 520;
  });
  const firstScroll = await page.evaluate((top) => {
    window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    return window.scrollY;
  }, readingStart);
  await page.waitForTimeout(50);
  const firstBox = await rail.boundingBox();
  const secondScroll = await page.evaluate((top) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const nextTop = Math.min(maxScroll, top + 700);
    window.scrollTo({ top: nextTop, behavior: "instant" as ScrollBehavior });
    return window.scrollY;
  }, firstScroll);
  await page.waitForTimeout(50);
  const secondBox = await rail.boundingBox();

  expect(secondScroll).toBeGreaterThan(firstScroll);
  expect(firstBox?.y).toBeGreaterThan(80);
  expect(secondBox?.y).toBeGreaterThan(80);
  expect(Math.abs((firstBox?.y || 0) - (secondBox?.y || 0))).toBeLessThan(6);
});

test("长文章当前章节会同步滚入桌面目录可视区域", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/ai/easy-vibe-guide/");
  const rail = page.locator("#article-toc-rail");
  await expect(rail).toBeVisible();
  await expect.poll(async () => Number(await rail.evaluate((el) => el.scrollTop))).toBe(0);

  const target = page.locator(".galvin-article-content h2").filter({ hasText: "六、Appendix" });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const heading = Array.from(document.querySelectorAll(".galvin-article-content h2"))
      .find((el) => el.textContent?.includes("六、Appendix"));
    if (!heading) return;
    window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top - 160, behavior: "instant" as ScrollBehavior });
  });
  const active = rail.locator(".article-toc-link.active");
  await expect(active).toContainText("六、Appendix");
  await expect.poll(async () => Number(await rail.evaluate((el) => el.scrollTop))).toBeGreaterThan(0);
});
