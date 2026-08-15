const LEGACY_ROUTE_MAP = {
  "/": "/",
  "/about": "/关于",
  "/archive": "/叩问",
  "/tools": "/造物",
  "/sites": "/藏页",
  "/tags": "/叩问",
  "/en": "/",
  "/en/about": "/关于",
  "/en/archive": "/叩问",
  "/en/tools": "/造物",
  "/en/sites": "/藏页",
  "/en/tags": "/叩问",
} as const;

export function getGalvinRouteFromLegacyPath(pathname: string): string {
  const normalisedPath = pathname.replace(/\/$/, "") || "/";
  return LEGACY_ROUTE_MAP[normalisedPath as keyof typeof LEGACY_ROUTE_MAP] ?? "/";
}
