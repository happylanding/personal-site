import { test, expect } from "@playwright/test";

test("首页保留可读的主标题与键盘可达的导航", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "主导航" })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus-visible")).toBeVisible();
});

test("首页将四条主线与藏页资源作为连续阅读轨道呈现", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("七个入口", { exact: false })).toHaveCount(0);
  const track = page.locator("#home-path-track");
  await expect(track).toBeVisible();
  await expect(track.getByRole("link", { name: "造物" })).toHaveAttribute("href", "/tools/");
  await expect(track.getByRole("link", { name: "叩问" })).toHaveAttribute("href", "/archive/");
  await expect(track.getByRole("link", { name: "网站与资源" })).toHaveAttribute("href", "/sites/");
  await expect(track.getByRole("link", { name: "书架" })).toHaveAttribute("href", "/books/");
});

test("桌面主导航压缩为内容主线，并以点击式藏页菜单公开资源与书架", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "主导航" });
  await expect(nav.getByRole("link", { name: "造物" })).toHaveAttribute("href", "/tools/");
  await expect(nav.getByRole("link", { name: "叩问" })).toHaveAttribute("href", "/archive/");
  await expect(nav.getByRole("link", { name: "行迹" })).toHaveAttribute("href", "/traces/");
  await expect(nav.getByRole("link", { name: "关于" })).toHaveAttribute("href", "/about/");
  await expect(nav.getByRole("link", { name: "此刻", exact: true })).toHaveCount(0);

  const resources = nav.getByRole("button", { name: "打开藏页资源菜单" });
  await resources.click();
  const menu = page.getByRole("menu", { name: "藏页资源" });
  await expect(menu.getByRole("link", { name: "网站与资源" })).toHaveAttribute("href", "/sites/");
  await expect(menu.getByRole("link", { name: "书架" })).toHaveAttribute("href", "/books/");

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(resources).toBeFocused();
});

test("移动端导航直接呈现藏页的资源与书架二级链接", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "打开栏目导航" }).click();

  const mobileMenu = page.locator("#galvin-mobile-menu");
  await expect(mobileMenu.getByText("藏页", { exact: true })).toBeVisible();
  await expect(mobileMenu.getByRole("link", { name: "网站与资源" })).toHaveAttribute("href", "/sites/");
  await expect(mobileMenu.getByRole("link", { name: "书架" })).toHaveAttribute("href", "/books/");
  await expect(mobileMenu.getByRole("link", { name: "此刻", exact: true })).toHaveCount(0);
});

test("手机页脚保持单列信息流，品牌主张不会逐字断行", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const statement = page.locator(".galvin-footer__identity p");
  await expect(statement).toHaveText("把好奇心，做成一点有用的东西。");
  const box = await statement.boundingBox();
  expect(box?.width).toBeGreaterThan(180);
});

test("行迹具有独立且可访问的内容目的地", async ({ page }) => {
  await page.goto("/traces/");
  await expect(page.getByRole("heading", { level: 1, name: "行迹。" })).toBeVisible();
  await expect(page.getByText("南京、咖啡、力量训练与阅读，留在同一条慢速轨迹里。 ")).toBeVisible();
});

test("关于页以 Galvin 工作档案呈现公开身份边界与可复制邮箱", async ({ page }) => {
  await page.goto("/about/");

  const pageRoot = page.locator(".galvin-about-page");
  await expect(pageRoot).toBeVisible();
  await expect(pageRoot.getByRole("heading", { level: 1, name: /Galvin，/ })).toBeVisible();
  await expect(pageRoot.getByText("AI 初学者 × 数字政府/数字经济从业者")).toBeVisible();
  await expect(pageRoot.locator(".galvin-about-hero__meta dd").getByText("南京", { exact: true })).toBeVisible();

  const emailAddress = pageRoot.getByRole("link", { name: "cgaojiacheng@gmail.com" });
  await expect(emailAddress).toHaveAttribute("href", "mailto:cgaojiacheng@gmail.com");
  const copyEmail = pageRoot.getByRole("button", { name: "复制邮箱" });
  await copyEmail.click();
  await expect(pageRoot.locator("[data-copy-status]")).toContainText("邮箱已复制");
  await expect(pageRoot.getByRole("link", { name: "在 X 上关注 Galvin" })).toHaveAttribute("href", "https://x.com/galvin0119");
  await expect(pageRoot.getByText("加个微信")).toHaveCount(0);
});

test("公共页脚提供可见的栏目导航和公开联系入口", async ({ page }) => {
  await page.goto("/");

  const footer = page.getByRole("contentinfo");
  await expect(footer).toBeVisible();
  await expect(footer.getByRole("navigation", { name: "页脚导航" }).getByRole("link", { name: "叩问" })).toHaveAttribute("href", "/archive/");
  await expect(footer.getByRole("link", { name: "cgaojiacheng@gmail.com" })).toHaveAttribute("href", "mailto:cgaojiacheng@gmail.com");
  await expect(footer.getByRole("button", { name: "复制邮箱" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "在 X 上关注 Galvin" })).toHaveAttribute("href", "https://x.com/galvin0119");
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

  await expect(page.getByRole("heading", { level: 1, name: "叩问", exact: true })).toBeVisible();
  const aiFilter = page.getByRole("tab", { name: "AI", exact: true });
  await aiFilter.click();
  await expect(aiFilter).toHaveAttribute("aria-selected", "true");

  const visibleCards = page.locator("[data-question-card]:not([hidden])");
  await expect(visibleCards.first()).toBeVisible();
  expect(await visibleCards.evaluateAll((cards) => cards.every((card) => (card as HTMLElement).dataset.tags?.split("|").includes("AI")))).toBe(true);
});

test("叩问归档以连续问题目录承载阅读信息而非编号卡片", async ({ page }) => {
  await page.goto("/archive/");

  const directory = page.locator("#question-directory");
  await expect(directory).toBeVisible();
  await expect(directory.locator("[data-question-card]").first()).toBeVisible();
  await expect(directory.locator(".galvin-question-card__index")).toHaveCount(0);
  await expect(page.getByText("篇已发布文章", { exact: false })).toHaveCount(0);
});

test("叩问筛选以核心主题和可披露的补充标签保持清晰", async ({ page }) => {
  await page.goto("/archive/");

  await expect(page.locator("[data-question-filter-primary]")).toBeVisible();
  await expect(page.getByRole("button", { name: /展开全部标签/ })).toBeVisible();
  await expect(page.locator("[data-question-filter-extra]")).toBeHidden();
});

test("叩问栏目标题使用中等尺度且不带句号", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("/archive/");

  const title = page.getByRole("heading", { name: "叩问", exact: true });
  await expect(title).toBeVisible();
  await expect(title).toHaveCSS("font-size", "44px");
});

test("叩问归档的辅助信息保持可读文字尺度", async ({ page }) => {
  await page.goto("/archive/");

  const metadata = page.locator("[data-question-metadata]").first();
  const tags = page.locator("[data-question-tags] span").first();
  await expect(metadata).toBeVisible();
  await expect(metadata).toHaveCSS("font-size", "13px");
  await expect(tags).toHaveCSS("font-size", "13px");
});

test("叩问归档将补充标签放入可展开的筛选披露", async ({ page }) => {
  await page.goto("/archive/");

  const toggle = page.locator("#question-filter-toggle");
  const extraFilters = page.locator("[data-question-filter-extra]");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(extraFilters).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(extraFilters).toBeVisible();
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
  await expect(results).toContainText("藏页");
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

test("移动端文章在正文前提供内联章节索引而不显示固定浮层", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai/easy-vibe-guide/");
  const index = page.locator("#article-toc-mobile-index");
  await expect(index).toBeVisible();
  await expect(index.locator("summary")).toContainText("章节索引");
  await expect(page.locator("#article-toc-dock")).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "目录" })).toHaveCount(0);
});

test("移动端内联章节索引原位展开、同步当前章节并在选章后收起", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai/easy-vibe-guide/");
  const index = page.locator("#article-toc-mobile-index");
  const summary = index.locator("summary");
  await summary.click();
  await expect(index).toHaveAttribute("open", "");
  await expect(index.locator(".article-toc-link").first()).toBeVisible();

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const heading = Array.from(document.querySelectorAll(".galvin-article-content h2"))
      .find((el) => el.textContent?.includes("二、整张学习地图"));
    if (heading) window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top - 160, behavior: "instant" as ScrollBehavior });
  });
  await expect(summary).toContainText("二、整张学习地图");
  const current = index.locator('.article-toc-link[aria-current="location"]');
  await expect(current).toContainText("二、整张学习地图");

  await current.click();
  await expect(index).not.toHaveAttribute("open", "");
});
