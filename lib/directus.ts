import { createDirectus, readItems, rest } from "@directus/sdk";

export type Lang = "ru" | "en" | "az";

const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az";

// CMS data is cached by Next.js and refreshed in the background (ISR),
// so pages are served from cache instead of hitting Directus on every request.
export const CMS_REVALIDATE_SECONDS = 300;

export const cachedFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["directus"] },
  });

export const directus = createDirectus(DIRECTUS_URL, {
  globals: { fetch: cachedFetch },
}).with(rest());

function stripHtml(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearch(value: unknown) {
  return String(value ?? "").toLowerCase().trim();
}

function pickTranslation<T extends { language?: Lang; lang?: Lang }>(
  translations: T[] | undefined,
  lang: Lang,
  fallback: Lang[] = ["ru", "en"]
) {
  if (!Array.isArray(translations) || translations.length === 0) return null;

  return (
    translations.find((x) => x.language === lang || x.lang === lang) ||
    translations.find(
      (x) => x.language === fallback[0] || x.lang === fallback[0]
    ) ||
    translations.find(
      (x) => x.language === fallback[1] || x.lang === fallback[1]
    ) ||
    translations[0]
  );
}

/* =========================
   BLOG
========================= */

type BlogPostRow = {
  id: number;
  sort: number | null;
  slug: string;
  cover_image: string | null;
  published_at: string | null;
  reading_time: number | null;
  is_featured: boolean;
  is_secondary_featured: boolean;
  is_active: boolean;
  translations?: Array<{
    id: number;
    language?: Lang;
    title?: string;
    excerpt?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    content?: string | null;
  }>;
};

export type BlogPost = {
  id: number;
  slug: string;
  cover_image: string | null;
  published_at: string | null;
  reading_time: number | null;
  sort: number | null;
  is_featured: boolean;
  is_secondary_featured: boolean;
  is_active: boolean;
  title: string;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

function mapBlogPost(row: BlogPostRow, lang: Lang): BlogPost | null {
  const t = pickTranslation(row.translations, lang);
  if (!t) return null;

  return {
    id: row.id,
    slug: row.slug,
    cover_image: row.cover_image,
    published_at: row.published_at,
    reading_time: row.reading_time,
    sort: row.sort,
    is_featured: row.is_featured,
    is_secondary_featured: row.is_secondary_featured,
    is_active: row.is_active,
    title: t.title ?? "",
    excerpt: t.excerpt ?? null,
    seo_title: t.seo_title ?? null,
    seo_description: t.seo_description ?? null,
  };
}

export async function getBlogPosts(lang: Lang): Promise<BlogPost[]> {
  try {
    const data = await directus.request(
      readItems("blog_posts", {
        fields: [
          "id",
          "sort",
          "slug",
          "cover_image",
          "published_at",
          "reading_time",
          "is_featured",
          "is_secondary_featured",
          "is_active",
          "translations.id",
          "translations.language",
          "translations.title",
          "translations.excerpt",
          "translations.seo_title",
          "translations.seo_description",
        ],
        filter: {
          is_active: { _eq: true },
        },
        deep: {
          translations: {
            _filter: {
              language: { _eq: lang },
            },
          },
        },
        sort: ["sort", "-published_at"],
        limit: -1,
      })
    );

    if (!Array.isArray(data)) return [];

    return data
      .map((row) => mapBlogPost(row as BlogPostRow, lang))
      .filter(Boolean) as BlogPost[];
  } catch (err: any) {
    console.error("❌ getBlogPosts ERROR:", {
      message: err?.message,
      errors: err?.errors,
      response: err?.response,
      cause: err?.cause,
    });
    return [];
  }
}

export async function getBlogPostBySlug(slug: string, lang: Lang) {
  try {
    const rows = await directus.request(
      readItems("blog_posts", {
        fields: [
          "*",
          "translations.id",
          "translations.language",
          "translations.title",
          "translations.excerpt",
          "translations.content",
          "translations.seo_title",
          "translations.seo_description",
        ],
        filter: {
          slug: { _eq: slug },
          is_active: { _eq: true },
        },
        deep: {
          translations: {
            _filter: {
              language: { _eq: lang },
            },
          },
        },
        limit: 1,
      })
    );

    return rows?.[0] || null;
  } catch (err) {
    console.error("❌ getBlogPostBySlug ERROR:", err);
    return null;
  }
}

/* =========================
   SERVICES
========================= */

export async function getServices(lang: Lang) {
  try {
    const data = await directus.request(
      readItems("services", {
        fields: ["*", "translations.*", "accordion.*"],
        filter: {
          is_active: { _eq: true },
        },
        deep: {
          translations: {
            _filter: {
              language: { _eq: lang },
            },
          },
        },
        sort: ["order"],
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getServices ERROR:", err);
    return [];
  }
}

export async function getServiceBySlug(slug: string, _lang?: Lang) {
  try {
    const rows = await directus.request(
      readItems("services", {
        filter: { slug: { _eq: slug } },
        limit: 1,
        fields: [
          "*",
          "images.*",
          "accordion.*",
          "translations.id",
          "translations.language",
          "translations.title",
          "translations.content",
          "translations.seo_title",
          "translations.seo_description",
        ],
      })
    );

    return rows?.[0] || null;
  } catch (err) {
    console.error("❌ getServiceBySlug ERROR:", err);
    return null;
  }
}

/* =========================
   DOCTORS
========================= */

export async function getDoctors(lang: Lang) {
  try {
    const data = await directus.request(
      readItems("Doctors", {
        fields: ["*", "image.*", "translations.*"],
        deep: {
          translations: {
            _filter: {
              language: { _eq: lang },
            },
          },
        },
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getDoctors ERROR:", err);
    return [];
  }
}

/* =========================
   CASES
========================= */

export async function getCases(lang: Lang) {
  try {
    const data = await directus.request(
      readItems("cases", {
        fields: [
          "id",
          "slug",
          "featured",
          "before_image",
          "after_image",
          "sort",
          "status",
          "category.id",
          "category.slug",
          "translations.lang",
          "translations.title",
          "translations.description",
          "translations.details",
        ],
        filter: {
          status: { _eq: "published" },
        },
        deep: {
          translations: {
            _filter: {
              lang: { _eq: lang },
            },
          },
        },
        sort: ["sort"],
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getCases ERROR:", err);
    return [];
  }
}

export async function getCaseCategories(lang: Lang) {
  try {
    const data = await directus.request(
      readItems("case_categories", {
        fields: [
          "id",
          "slug",
          "sort",
          "case_categories_translations.lang",
          "case_categories_translations.name",
        ],
        deep: {
          case_categories_translations: {
            _filter: { lang: { _eq: lang } },
          },
        },
        sort: ["sort"],
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getCaseCategories ERROR:", err);
    return [];
  }
}

/* =========================
   PRICES
========================= */

export async function getPrices(lang: Lang) {
  try {
    const data = await directus.request(
      readItems("prices", {
        fields: [
          "id",
          "sort",
          "price",
          "is_from_price",
          "slug",
          "is_active",
          "translations.id",
          "translations.language",
          "translations.service_name",
          "translations.description",
          "category.id",
          "category.slug",
        ],
        deep: {
          translations: {
            _filter: {
              language: { _eq: lang },
            },
          },
        },
        filter: {
          is_active: { _eq: true },
        },
        sort: ["sort"],
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getPrices ERROR:", err);
    return [];
  }
}

export async function getPricesCategories(lang: Lang) {
  try {
    const data = await directus.request(
      readItems("price_categories", {
        fields: [
          "id",
          "slug",
          "price_categories_translations.lang",
          "price_categories_translations.name",
        ],
        deep: {
          price_categories_translations: {
            _filter: { lang: { _eq: lang } },
          },
        },
        sort: ["sort"],
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getPriceCategory ERROR:", err);
    return [];
  }
}

/* =========================
   GALLERY / ABOUT / WHY / REVIEWS
========================= */

export async function getGallery() {
  try {
    const data = await directus.request(
      readItems("gallery", {
        fields: ["*", "slider_images.directus_files_id"],
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getGallery ERROR:", err);
    return [];
  }
}

export async function getAboutBlocks() {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/about?fields=*,image.*,translitions.*`,
      { next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["directus"] } }
    );

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("❌ getAboutBlocks ERROR:", err);
    return [];
  }
}

export async function getWhyBesmile(lang: Lang) {
  try {
    const data = await directus.request(
      readItems("whybesmile", {
        fields: ["*", "translations.*"],
        deep: {
          translations: {
            _filter: {
              language: { _eq: lang },
            },
          },
        },
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getWhyBesmile ERROR:", err);
    return [];
  }
}

export async function getReviews() {
  try {
    const data = await directus.request(
      readItems("reviews", {
        fields: ["id", "author", "text", "rating", "order"],
        filter: {
          is_active: { _eq: true },
        },
        sort: ["order"],
        limit: -1,
      })
    );

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ getReviews ERROR:", err);
    return [];
  }
}

/* =========================
   GLOBAL SEARCH
========================= */

export type SearchResultItem = {
  type: "service" | "price" | "doctor" | "page" | "case" | "blog";
  title: string;
  href: string;
  description?: string;
  price?: string;
};

const SEARCH_PAGES: Record<Lang, Array<{ title: string; href: string }>> = {
  en: [
    { title: "About Us", href: "/en/about" },
    { title: "Services", href: "/en/services" },
    { title: "Doctors", href: "/en/doctors" },
    { title: "Prices", href: "/en/prices" },
    { title: "Before After", href: "/en/before-after" },
    { title: "Blog", href: "/en/blog" },
    { title: "Contact", href: "/en/contact" },
  ],
  ru: [
    { title: "О нас", href: "/ru/about" },
    { title: "Услуги", href: "/ru/services" },
    { title: "Врачи", href: "/ru/doctors" },
    { title: "Цены", href: "/ru/prices" },
    { title: "До После", href: "/ru/before-after" },
    { title: "Блог", href: "/ru/blog" },
    { title: "Контакты", href: "/ru/contact" },
  ],
  az: [
    { title: "Haqqımızda", href: "/az/about" },
    { title: "Xidmətlər", href: "/az/services" },
    { title: "Həkimlər", href: "/az/doctors" },
    { title: "Qiymətlər", href: "/az/prices" },
    { title: "Əvvəl Sonra", href: "/az/before-after" },
    { title: "Bloq", href: "/az/blog" },
    { title: "Əlaqə", href: "/az/contact" },
  ],
};
type ServiceSearchRow = {
  slug?: string;
  translations?: Array<{
    language?: Lang;
    lang?: Lang;
    title?: string;
    content?: string | null;
  }>;
};

type PriceSearchRow = {
  slug?: string;
  price?: string | number | null;
  is_from_price?: boolean;
  translations?: Array<{
    language?: Lang;
    lang?: Lang;
    service_name?: string;
    description?: string | null;
  }>;
};

type DoctorSearchRow = {
  slug?: string;
  translations?: Array<{
    language?: Lang;
    lang?: Lang;
    firstname?: string;
    lastname?: string;
    speciality?: string | null;
  }>;
};

type CaseSearchRow = {
  slug?: string;
  translations?: Array<{
    language?: Lang;
    lang?: Lang;
    title?: string;
    description?: string | null;
    details?: string | null;
  }>;
};

type BlogSearchRow = {
  slug?: string;
  translations?: Array<{
    language?: Lang;
    lang?: Lang;
    title?: string;
    excerpt?: string | null;
  }>;
};
export async function searchSite(
  query: string,
  lang: Lang
): Promise<SearchResultItem[]> {
  const q = normalizeSearch(query);
  if (q.length < 2) return [];

  const [services, prices, doctors, cases, blogPosts] = await Promise.all([
    getServices(lang),
    getPrices(lang),
    getDoctors(lang),
    getCases(lang),
    getBlogPosts(lang),
  ]);

  const results: SearchResultItem[] = [];

  for (const page of SEARCH_PAGES[lang] ?? []) {
    if (normalizeSearch(page.title).includes(q)) {
      results.push({
        type: "page",
        title: page.title,
        href: page.href,
      });
    }
  }

  for (const row of (services as ServiceSearchRow[])) {
    const t = pickTranslation(row.translations, lang);
    const title = t?.title ?? "";
    const content = stripHtml(t?.content ?? "");

    if (!title && !content) continue;

    if (normalizeSearch(`${title} ${content}`).includes(q)) {
      results.push({
        type: "service",
        title,
        href: row.slug ? `/${lang}/services/${row.slug}` : `/${lang}/services`,
        description: content,
      });
    }
  }

  for (const row of (prices as PriceSearchRow[])) {
    const t = pickTranslation(row.translations, lang);
    const title = t?.service_name ?? "";
    const description = t?.description ?? "";
    const price =
      row.price != null
        ? `${row.is_from_price ? "from " : ""}${row.price} ₼`
        : "";

    if (!title && !description && !price) continue;

    if (normalizeSearch(`${title} ${description} ${price}`).includes(q)) {
      results.push({
        type: "price",
        title,
        href: `/${lang}/prices?highlight=${encodeURIComponent(row.slug || title)}`,
        description,
        price,
      });
    }
  }

  for (const row of (doctors as DoctorSearchRow[])) {
    const t = pickTranslation(row.translations, lang);
    const fullName = `${t?.firstname ?? ""} ${t?.lastname ?? ""}`.trim();
    const speciality = t?.speciality ?? "";

    if (!fullName && !speciality) continue;

    if (normalizeSearch(`${fullName} ${speciality}`).includes(q)) {
      results.push({
        type: "doctor",
        title: fullName,
        href: row.slug ? `/${lang}/doctors/${row.slug}` : `/${lang}/doctors`,
        description: speciality,
      });
    }
  }

  for (const row of (cases as CaseSearchRow[])) {
    const t = pickTranslation(row.translations, lang);
    const title = t?.title ?? "";
    const description = stripHtml(t?.description ?? t?.details ?? "");

    if (!title && !description) continue;

    if (normalizeSearch(`${title} ${description}`).includes(q)) {
      results.push({
        type: "case",
        title,
        href: row.slug
          ? `/${lang}/before-after?case=${row.slug}`
          : `/${lang}/before-after`,
        description,
      });
    }
  }

  for (const row of (blogPosts as BlogSearchRow[])) {
    const t = pickTranslation(row.translations, lang);
    const title = t?.title ?? "";
    const description = stripHtml(t?.excerpt ?? "");

    if (!title && !description) continue;

    if (normalizeSearch(`${title} ${description}`).includes(q)) {
      results.push({
        type: "blog",
        title,
        href: row.slug ? `/${lang}/blog/${row.slug}` : `/${lang}/blog`,
        description,
      });
    }
  }

  return results.slice(0, 30);
}