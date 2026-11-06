import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SinglePage from "@/components/SinglePage";
import { getServiceBySlug, getServices } from "@/lib/directus";

type Lang = "en" | "ru" | "az";

const SITE_URL = "https://besmile.az";
const PORTAL_ASSETS_URL = "https://portal.besmile.az/assets";
const DEFAULT_LANG: Lang = "az";

type PageParams = {
  lang: string;
  slug: string;
};

type PageProps = {
  params: Promise<PageParams> | PageParams;
};

function normalizeLang(lang: string): Lang {
  if (lang === "en" || lang === "ru" || lang === "az") return lang;
  return DEFAULT_LANG;
}

function buildUrl(lang: Lang, slug: string) {
  return `${SITE_URL}/${lang}/services/${slug}`;
}

function buildServicesUrl(lang: Lang) {
  return `${SITE_URL}/${lang}/services`;
}

function buildHomeUrl(lang: Lang) {
  return `${SITE_URL}/${lang}`;
}

function getLanguageName(lang: Lang) {
  if (lang === "ru") return "ru_RU";
  if (lang === "en") return "en_US";
  return "az_AZ";
}

function getHomeLabel(lang: Lang) {
  if (lang === "ru") return "Главная";
  if (lang === "en") return "Home";
  return "Ana səhifə";
}

function getServicesLabel(lang: Lang) {
  if (lang === "ru") return "Услуги";
  if (lang === "en") return "Services";
  return "Xidmətlər";
}

function getDefaultDescription(lang: Lang) {
  if (lang === "ru") {
    return "Профессиональные стоматологические услуги в BeSmile Dental Clinic в Баку.";
  }

  if (lang === "en") {
    return "Professional dental services at BeSmile Dental Clinic in Baku.";
  }

  return "Bakıda BeSmile Dental Clinic-də peşəkar stomatoloji xidmətlər.";
}

function decodeHtmlEntities(input?: string) {
  if (!input) return "";

  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&uuml;/g, "ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&ouml;/g, "ö")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&auml;/g, "ä")
    .replace(/&Auml;/g, "Ä")
    .replace(/&ccedil;/g, "ç")
    .replace(/&Ccedil;/g, "Ç")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&#231;/g, "ç")
    .replace(/&#252;/g, "ü")
    .replace(/&#246;/g, "ö")
    .replace(/&#214;/g, "Ö")
    .replace(/&#220;/g, "Ü");
}

function stripHtml(html?: string) {
  return decodeHtmlEntities(html)
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(value?: string | null) {
  return stripHtml(value || "").trim();
}

function getTranslation(data: any, lang: Lang) {
  const translations = Array.isArray(data?.translations)
    ? data.translations
    : [];

  const map: Record<string, any> = {};

  for (const tr of translations) {
    const key = tr?.language || tr?.languages_code;
    if (key) map[key] = tr;
  }

  return map[lang] || map[DEFAULT_LANG] || map.en || translations[0] || null;
}

function getAssetUrl(asset: any): string | null {
  if (!asset) return null;

  if (typeof asset === "string") {
    if (asset.startsWith("http")) return asset;
    return `${PORTAL_ASSETS_URL}/${asset}`;
  }

  if (typeof asset === "object") {
    if (typeof asset.id === "string") {
      return `${PORTAL_ASSETS_URL}/${asset.id}`;
    }

    if (typeof asset.directus_files_id === "string") {
      return `${PORTAL_ASSETS_URL}/${asset.directus_files_id}`;
    }

    if (
      typeof asset.directus_files_id === "object" &&
      typeof asset.directus_files_id?.id === "string"
    ) {
      return `${PORTAL_ASSETS_URL}/${asset.directus_files_id.id}`;
    }
  }

  return null;
}

function getCoverUrl(data: any): string | null {
  const coverUrl = getAssetUrl(data?.cover);
  if (coverUrl) return coverUrl;

  const firstImage = Array.isArray(data?.images) ? data.images[0] : null;
  return getAssetUrl(firstImage);
}

function getSeoTitle(t: any) {
  return (
    cleanText(t?.seo_title) ||
    cleanText(t?.title) ||
    "BeSmile Dental Clinic"
  );
}

function getSeoDescription(t: any, lang: Lang) {
  return (
    cleanText(t?.seo_description) ||
    cleanText(t?.description) ||
    cleanText(t?.content)?.slice(0, 155) ||
    getDefaultDescription(lang)
  );
}

function getSeoKeywords(t: any): string[] | undefined {
  const raw = t?.seo_keywords || t?.keywords;

  if (!raw || typeof raw !== "string") return undefined;

  const keywords = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return keywords.length > 0 ? keywords : undefined;
}

function getAccordionFaqItems(data: any, lang: Lang) {
  const accordion = Array.isArray(data?.accordion) ? data.accordion : [];

  return accordion
    .map((item: any) => {
      const title =
        cleanText(item?.[`title_${lang}`]) ||
        cleanText(item?.title_en) ||
        cleanText(item?.title_ru) ||
        cleanText(item?.title_az);

      const content =
        cleanText(item?.[`content_${lang}`]) ||
        cleanText(item?.content_en) ||
        cleanText(item?.content_ru) ||
        cleanText(item?.content_az);

      if (!title || !content) return null;

      return {
        "@type": "Question",
        name: title,
        acceptedAnswer: {
          "@type": "Answer",
          text: content,
        },
      };
    })
    .filter(Boolean);
}

function buildJsonLd({
  data,
  lang,
  slug,
}: {
  data: any;
  lang: Lang;
  slug: string;
}) {
  const t = getTranslation(data, lang);

  const pageUrl = buildUrl(lang, slug);
  const servicesUrl = buildServicesUrl(lang);
  const homeUrl = buildHomeUrl(lang);

  const title = getSeoTitle(t);
  const description = getSeoDescription(t, lang);
  const visibleTitle = cleanText(t?.title) || title;
  const imageUrl = getCoverUrl(data);

  const faqItems = getAccordionFaqItems(data, lang);

  const graph: any[] = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "BeSmile Dental Clinic",
      url: SITE_URL,
      inLanguage: lang,
      publisher: {
        "@id": `${SITE_URL}#dentist`,
      },
    },
    {
      "@type": ["Dentist", "MedicalBusiness"],
      "@id": `${SITE_URL}#dentist`,
      name: "BeSmile Dental Clinic",
      alternateName: "BeSmile",
      url: SITE_URL,
      image: `${SITE_URL}/logo.png`,
      logo: `${SITE_URL}/logo.png`,
      telephone: "+994704210204",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "24 Khan Shushinski",
        addressLocality: "Baku",
        postalCode: "1007",
        addressCountry: "AZ",
      },
      areaServed: {
        "@type": "City",
        name: "Baku",
      },
      medicalSpecialty: "Dentistry",
      sameAs: [
        "https://www.instagram.com/besmile_dental/",
        "https://www.facebook.com/besmiledentalclinic/",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: {
        "@id": `${SITE_URL}#website`,
      },
      about: {
        "@id": `${pageUrl}#service`,
      },
      breadcrumb: {
        "@id": `${pageUrl}#breadcrumb`,
      },
      ...(imageUrl
        ? {
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: imageUrl,
            },
          }
        : {}),
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: title,
      alternateName: visibleTitle,
      description,
      url: pageUrl,
      serviceType: "Dental service",
      provider: {
        "@id": `${SITE_URL}#dentist`,
      },
      areaServed: {
        "@type": "City",
        name: "Baku",
      },
      ...(imageUrl
        ? {
            image: imageUrl,
          }
        : {}),
    },
    {
      "@type": "MedicalProcedure",
      "@id": `${pageUrl}#procedure`,
      name: title,
      description,
      url: pageUrl,
      medicalSpecialty: "Dentistry",
      bodyLocation: "Mouth",
      provider: {
        "@id": `${SITE_URL}#dentist`,
      },
      ...(imageUrl
        ? {
            image: imageUrl,
          }
        : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: getHomeLabel(lang),
          item: homeUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: getServicesLabel(lang),
          item: servicesUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: visibleTitle,
          item: pageUrl,
        },
      ],
    },
  ];

  if (faqItems.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqItems,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

// Prerender every service page at build time, new ones are generated on first visit and cached
export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  const services = await getServices(normalizeLang(params.lang)).catch(() => []);

  return (Array.isArray(services) ? services : [])
    .map((service: any) => cleanText(service?.slug))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = (await props.params) as PageParams;

  const lang = normalizeLang(params.lang);
  const slug = params.slug;

  const data = await getServiceBySlug(slug, lang);

  if (!data) {
    return {
      title: "BeSmile Dental Clinic",
      description: "BeSmile Dental Clinic",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const t = getTranslation(data, lang);

  const seoTitle = getSeoTitle(t);
  const seoDescription = getSeoDescription(t, lang);
  const keywords = getSeoKeywords(t);

  const canonical = buildUrl(lang, slug);
  const coverUrl = getCoverUrl(data);
  const visibleTitle = cleanText(t?.title) || seoTitle;

  return {
    metadataBase: new URL(SITE_URL),
    title: seoTitle,
    description: seoDescription,
    keywords,

    alternates: {
      canonical,
      languages: {
        az: buildUrl("az", slug),
        ru: buildUrl("ru", slug),
        en: buildUrl("en", slug),
        "x-default": buildUrl(DEFAULT_LANG, slug),
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonical,
      siteName: "BeSmile Dental Clinic",
      type: "website",
      locale: getLanguageName(lang),
      images: coverUrl
        ? [
            {
              url: coverUrl,
              width: 1200,
              height: 630,
              alt: visibleTitle,
            },
          ]
        : [
            {
              url: `${SITE_URL}/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: "BeSmile Dental Clinic",
            },
          ],
    },

    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: coverUrl ? [coverUrl] : [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function ServicePage(props: PageProps) {
  const params = (await props.params) as PageParams;

  const lang = normalizeLang(params.lang);
  const slug = params.slug;

  const data = await getServiceBySlug(slug, lang);

  if (!data) {
    notFound();
  }

  const schema = buildJsonLd({
    data,
    lang,
    slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <SinglePage data={data} lang={lang} />
    </>
  );
}