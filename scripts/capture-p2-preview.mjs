import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});

const desktop = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
await desktop.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await desktop.screenshot({ path: "/home/ubuntu/webdev-static-assets/galvin-p2-desktop.png", fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await mobile.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await mobile.screenshot({ path: "/home/ubuntu/webdev-static-assets/galvin-p2-mobile.png", fullPage: true });

await browser.close();
