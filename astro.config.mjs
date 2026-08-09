// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      // 允许 CNB 云原生开发环境的端口预览代理域名（如 https://<business>-<port>.cnb.run）
      allowedHosts: [".cnb.run", ".cnb.cool"],
    },
  },
  site: "https://galvinai.pages.dev",
  integrations: [
    sitemap({
      filter: (page) => {
        // 隐藏路由（如 /sites/ 收藏夹）不进入 sitemap，避免搜索引擎收录不对外栏目
        return !/\/(sites)(\/|$)/.test(new URL(page).pathname);
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
