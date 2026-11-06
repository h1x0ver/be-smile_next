import type { MetadataRoute } from "next";
import { getAllSiteUrls } from "@/lib/siteUrls";

const SITE_URL = "https://besmile.az";

type SitePage = {
  type: "static" | "service" | "case" | "blog";
  lang: "az" | "ru" | "en";
  name: string;
  url: string;
};

const EXCLUDED_PATHS = [
  "/gallery",
];

const EXCLUDED_PATTERNS = [
  "/api/",
  "/admin",
  "/search",
];

function normalizeUrl(url: string) {
  return url.trim().replace(/\/$/, "");
}

function getPathFromUrl(url: string) {
  try {
    return new URL(url).pathname;
  } catch {
    return "";
  }
}

function shouldExcludeUrl(url: string) {
  const cleanUrl = normalizeUrl(url);
  const path = getPathFromUrl(cleanUrl);

  if (!cleanUrl.startsWith(SITE_URL)) {
    return true;
  }

  if (!path) {
    return true;
  }

  if (EXCLUDED_PATHS.some((excluded) => path.endsWith(excluded))) {
    return true;
  }

  if (EXCLUDED_PATTERNS.some((pattern) => path.includes(pattern))) {
    return true;
  }

  return false;
}

function dedupePages<T extends { url: string }>(pages: T[]) {
  const map = new Map<string, T>();

  for (const page of pages) {
    const cleanUrl = normalizeUrl(page.url);

    if (!map.has(cleanUrl)) {
      map.set(cleanUrl, {
        ...page,
        url: cleanUrl,
      });
    }
  }

  return Array.from(map.values());
}

function getPriority(page: SitePage) {
  const path = getPathFromUrl(page.url);

  if (path === "/az" || path === "/ru" || path === "/en") {
    return 1;
  }

  if (page.type === "service") {
    return 0.85;
  }

  if (page.type === "blog") {
    return 0.75;
  }

  if (page.type === "case") {
    return 0.7;
  }

  if (
    path.endsWith("/services") ||
    path.endsWith("/doctors") ||
    path.endsWith("/about") ||
    path.endsWith("/prices") ||
    path.endsWith("/book-online") ||
    path.endsWith("/contact")
  ) {
    return 0.8;
  }

  return 0.65;
}

function getChangeFrequency(
  page: SitePage
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (page.type === "blog") {
    return "weekly";
  }

  if (page.type === "service") {
    return "weekly";
  }

  if (page.type === "case") {
    return "monthly";
  }

  return "weekly";
}

// "/ru/services/veneers" -> "/services/veneers"
function getPathWithoutLang(url: string) {
  return getPathFromUrl(url).replace(/^\/(az|ru|en)(?=\/|$)/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages = await getAllSiteUrls();
  const uniquePages = dedupePages(pages as SitePage[]).filter(
    (page) => !shouldExcludeUrl(page.url)
  );

  // Group language versions of the same page so every URL lists its hreflang siblings
  const versions = new Map<string, Partial<Record<SitePage["lang"], string>>>();
  for (const page of uniquePages) {
    const key = getPathWithoutLang(page.url);
    versions.set(key, { ...versions.get(key), [page.lang]: page.url });
  }

  return uniquePages
    .map((page) => {
      const siblings = versions.get(getPathWithoutLang(page.url)) || {};
      const languages: Record<string, string> = { ...siblings } as Record<string, string>;
      if (siblings.az) languages["x-default"] = siblings.az;

      return {
        url: page.url,
        lastModified: now,
        changeFrequency: getChangeFrequency(page),
        priority: getPriority(page),
        alternates: { languages },
      };
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      return a.url.localeCompare(b.url);
    });
}
