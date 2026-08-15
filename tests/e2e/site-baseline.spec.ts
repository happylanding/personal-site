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
