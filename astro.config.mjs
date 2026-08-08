// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: "https://galvinai.pages.dev",
  integrations: [
    sitemap({
      filter: (page) => {
        // 隐藏路由（如 /invest/）不进入 sitemap，避免搜索引擎收录不对外栏目
        return !/\/invest(\/|$)/.test(new URL(page).pathname);
      },
    }),
  ],
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
    },
  },
  devToolbar: {
    enabled: false,
  },
});
