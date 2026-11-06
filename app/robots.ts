import type { MetadataRoute } from "next";

const SITE_URL = "https://besmile.az";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ must stay crawlable: Google needs the JS/CSS to render pages
        disallow: ["/api/", "/admin/", "/directus/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
