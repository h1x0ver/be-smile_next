import { getServices, getCases, getBlogPosts } from "@/lib/directus";

export type Lang = "az" | "ru" | "en";

const SITE_URL = "https://besmile.az";
const LANGS: Lang[] = ["az", "ru", "en"];

const STATIC_PAGES = [
  { path: "", name: { ru: "Главная", en: "Home", az: "Ana səhifə" } },
  { path: "about", name: { ru: "О нас", en: "About", az: "Haqqımızda" } },
  { path: "services", name: { ru: "Услуги", en: "Services", az: "Xidmətlər" } },
  { path: "doctors", name: { ru: "Врачи", en: "Doctors", az: "Həkimlər" } },
  { path: "before-after", name: { ru: "Кейсы", en: "Cases", az: "Keyslər" } },
  { path: "blog", name: { ru: "Блог", en: "Blog", az: "Bloq" } },
  { path: "prices", name: { ru: "Цены", en: "Prices", az: "Qiymətlər" } },
  { path: "contact", name: { ru: "Контакты", en: "Contact", az: "Əlaqə" } },
  { path: "reviews", name: { ru: "Отзывы", en: "Reviews", az: "Rəylər" } },
  {
    path: "book-online",
    name: { ru: "Запись на приём", en: "Book online", az: "Qəbula yazılın" },
  },
];

function buildUrl(lang: Lang, path: string) {
  return `${SITE_URL}/${lang}${path ? `/${path}` : ""}`;
}

function getTranslation(item: any, lang: Lang) {
  const translations = Array.isArray(item?.translations) ? item.translations : [];

  return (
    translations.find(
      (tr: any) => tr.language === lang || tr.languages_code === lang
    ) ||
    translations.find(
      (tr: any) => tr.language === "az" || tr.languages_code === "az"
    ) ||
    translations.find(
      (tr: any) => tr.language === "en" || tr.languages_code === "en"
    ) ||
    translations[0] ||
    null
  );
}

function getSlug(item: any) {
  return item?.slug || item?.Slug || item?.url_slug || "";
}

export async function getAllSiteUrls() {
  const pages: Array<{
    type: "static" | "service" | "case" | "blog";
    lang: Lang;
    name: string;
    url: string;
  }> = [];

  for (const lang of LANGS) {
    for (const page of STATIC_PAGES) {
      pages.push({
        type: "static",
        lang,
        name: page.name[lang],
        url: buildUrl(lang, page.path),
      });
    }
  }

  for (const lang of LANGS) {
    const services = await getServices(lang).catch(() => []);

    if (Array.isArray(services)) {
      for (const service of services) {
        const slug = getSlug(service);
        if (!slug) continue;

        const tr = getTranslation(service, lang);

        pages.push({
          type: "service",
          lang,
          name: tr?.seo_title || tr?.title || slug,
          url: `${SITE_URL}/${lang}/services/${slug}`,
        });
      }
    }
  }

  for (const lang of LANGS) {
    const cases = await getCases(lang).catch(() => []);

    if (Array.isArray(cases)) {
      for (const item of cases) {
        const slug = getSlug(item);
        if (!slug) continue;

        const tr = getTranslation(item, lang);

        pages.push({
          type: "case",
          lang,
          name: tr?.title || item?.title || slug,
          url: `${SITE_URL}/${lang}/before-after/${slug}`,
        });
      }
    }
  }

  for (const lang of LANGS) {
    const blogPosts = await getBlogPosts(lang).catch(() => []);

    if (Array.isArray(blogPosts)) {
      for (const post of blogPosts) {
        const slug = getSlug(post);
        if (!slug) continue;

        const tr = getTranslation(post, lang);

        pages.push({
          type: "blog",
          lang,
          name: tr?.title || post?.title || slug,
          url: `${SITE_URL}/${lang}/blog/${slug}`,
        });
      }
    }
  }

  return pages;
}