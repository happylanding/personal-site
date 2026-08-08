import { ui, type Lang } from "./ui";

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang && (lang === "en" || lang === "zh")) {
    return lang;
  }
  return "zh";
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split(".");
    let value: any = ui[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value ?? key;
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  if (lang === "zh") return path;
  return `/${lang}${path}`;
}

export function getAlternateLinks(path: string): Array<{ lang: string; href: string }> {
  return [
    { lang: "zh", href: path.replace(/^\/en/, "") || "/" },
    { lang: "en", href: path.startsWith("/en") ? path : `/en${path}` },
  ];
}
