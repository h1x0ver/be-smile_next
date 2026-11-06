import type { Metadata } from "next";
import { getServices } from "@/lib/directus/services";
import ServicesClient from "./service.client";

type Lang = "ru" | "en" | "az";

type ServiceTranslation = {
  title?: string | null;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

type ServiceItem = {
  id: string | number;
  slug?: string | null;
  cover?: string | null;
  order?: number | string | null;
  t?: ServiceTranslation | null;
};

const SITE_URL = "https://besmile.az";
const SITE_NAME = "BeSmile Dental Clinic";

const PAGE_TITLE: Record<Lang, string> = {
  en: "SERVICES",
  ru: "УСЛУГИ",
  az: "XİDMƏTLƏR",
};

const PAGE_SEO: Record<
  Lang,
  {
    title: string;
    description: string;
    keywords: string[];
    intro: string;
    breadcrumb: string;
  }
> = {
  ru: {
    title:
      "Услуги BeSmile в Баку | Имплантация, виниры, лечение зубов и эстетическая стоматология",
    description:
      "Услуги BeSmile Dental Clinic в Баку: диагностика, гигиена, лечение зубов, отбеливание, виниры, протезирование, хирургия и современная эстетическая стоматология.",
    keywords: [
      "услуги стоматологии Баку",
      "имплантация Баку",
      "виниры Баку",
      "лечение зубов Баку",
      "отбеливание зубов Баку",
      "протезирование зубов Баку",
      "хирургическая стоматология Баку",
      "BeSmile Dental Clinic",
    ],
    intro:
      "Современные стоматологические услуги BeSmile: диагностика, лечение, эстетика улыбки и премиальный подход к каждому клиническому этапу.",
    breadcrumb: "Услуги",
  },
  en: {
    title:
      "BeSmile Services in Baku | Implants, Veneers, Dental Treatment and Smile Aesthetics",
    description:
      "Explore BeSmile Dental Clinic services in Baku: diagnostics, oral hygiene, dental treatment, whitening, veneers, prosthetics, dental surgery and modern aesthetic dentistry.",
    keywords: [
      "dental services in Baku",
      "dental implants Baku",
      "veneers Baku",
      "teeth whitening Baku",
      "dental treatment Baku",
      "prosthetic dentistry Baku",
      "dental surgery Baku",
      "BeSmile Dental Clinic",
    ],
    intro:
      "Modern dental services at BeSmile including diagnostics, treatment, smile aesthetics and a premium standard of patient care.",
    breadcrumb: "Services",
  },
  az: {
    title:
      "BeSmile xidmətləri | Bakı üzrə implantasiya, vinirlər, diş müalicəsi və estetik stomatologiya",
    description:
      "BeSmile Dental Clinic xidmətləri: diaqnostika, ağız gigiyenası, diş müalicəsi, ağartma, vinirlər, protezlər, cərrahi stomatologiya və estetik xidmətlər.",
    keywords: [
      "stomatoloji xidmətlər Bakı",
      "implantasiya Bakı",
      "vinirlər Bakı",
      "diş müalicəsi Bakı",
      "diş ağartma Bakı",
      "protezlər Bakı",
      "cərrahi stomatologiya Bakı",
      "BeSmile Dental Clinic",
    ],
    intro:
      "BeSmile müasir stomatoloji xidmətləri: diaqnostika, müalicə, təbəssüm estetikası və hər mərhələdə premium yanaşma.",
    breadcrumb: "Xidmətlər",
  },
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return "en";
}

function getLocalizedPath(lang: Lang) {
  return `/${lang}/services`;
}

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function stripHtml(html?: string | null): string {
  if (!html) return "";

  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max = 180) {
  if (!text) return "";
  if (text.length <= max) return text;

  return `${text.slice(0, max).trim()}…`;
}

function normalizeOrder(order?: ServiceItem["order"]): number {
  if (typeof order === "number" && Number.isFinite(order)) return order;

  if (typeof order === "string") {
    const parsed = Number(order);
    if (Number.isFinite(parsed)) return parsed;
  }

  return Number.MAX_SAFE_INTEGER;
}

function sortServicesByOrder(services: ServiceItem[]): ServiceItem[] {
  return [...services].sort((a, b) => {
    const orderA = normalizeOrder(a.order);
    const orderB = normalizeOrder(b.order);

    if (orderA !== orderB) return orderA - orderB;

    return String(a.id).localeCompare(String(b.id));
  });
}

function getServiceTitle(service: ServiceItem, fallback = "") {
  return (
    cleanText(service.t?.seo_title) ||
    cleanText(service.t?.title) ||
    fallback
  );
}

function getServiceDescription(service: ServiceItem, fallback = "") {
  return (
    cleanText(service.t?.seo_description) ||
    truncate(stripHtml(service.t?.description), 220) ||
    fallback
  );
}

function buildServiceUrl(lang: Lang, slug?: string | null) {
  const cleanSlug = cleanText(slug);

  if (!cleanSlug) return `${SITE_URL}${getLocalizedPath(lang)}`;

  return `${SITE_URL}/${lang}/services/${cleanSlug}`;
}

function buildImageUrl(cover?: string | null) {
  const cleanCover = cleanText(cover);

  if (!cleanCover) return undefined;
  if (cleanCover.startsWith("http")) return cleanCover;

  return `https://portal.besmile.az/assets/${cleanCover}`;
}

export async function generateMetadata(props: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = normalizeLang(params.lang);
  const seo = PAGE_SEO[lang];
  const canonical = `${SITE_URL}${getLocalizedPath(lang)}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en/services`,
        ru: `${SITE_URL}/ru/services`,
        az: `${SITE_URL}/az/services`,
        "x-default": `${SITE_URL}/en/services`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: seo.title,
      description: seo.description,
      siteName: SITE_NAME,
      locale: lang === "ru" ? "ru_RU" : lang === "az" ? "az_AZ" : "en_US",
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: PAGE_TITLE[lang],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${SITE_URL}/og-image.jpg`],
    },
    category: "healthcare",
  };
}

export default async function ServicesPage(props: {
  params: { lang: Lang } | Promise<{ lang: Lang }>;
}) {
  const params = await props.params;
  const lang = normalizeLang(params.lang);

  const rawServices = await getServices(lang);

  const services: ServiceItem[] = Array.isArray(rawServices)
    ? sortServicesByOrder(rawServices as ServiceItem[])
    : [];

  const seo = PAGE_SEO[lang];
  const pageUrl = `${SITE_URL}${getLocalizedPath(lang)}`;

  const validServices = services.filter((service) => {
    return cleanText(service?.t?.title) && cleanText(service?.slug);
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${pageUrl}#services-list`,
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    inLanguage: lang,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: validServices.length,
    itemListElement: validServices.map((service, index) => {
      const serviceUrl = buildServiceUrl(lang, service.slug);
      const title = getServiceTitle(service, `Service ${index + 1}`);

      return {
        "@type": "ListItem",
        position: index + 1,
        url: serviceUrl,
        name: title,
        item: {
          "@type": "Service",
          "@id": `${serviceUrl}#service`,
          name: title,
          url: serviceUrl,
        },
      };
    }),
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection-page`,
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    inLanguage: lang,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Dentist",
      "@id": `${SITE_URL}#dentist`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: validServices.map((service, index) => {
      const serviceUrl = buildServiceUrl(lang, service.slug);
      const title = getServiceTitle(service, `Service ${index + 1}`);
      const description = getServiceDescription(service, seo.intro);
      const image = buildImageUrl(service.cover);

      return {
        "@type": "Service",
        "@id": `${serviceUrl}#service`,
        position: index + 1,
        name: title,
        description,
        url: serviceUrl,
        ...(image ? { image } : {}),
        provider: {
          "@type": "Dentist",
          "@id": `${SITE_URL}#dentist`,
          name: SITE_NAME,
          url: SITE_URL,
        },
        areaServed: {
          "@type": "City",
          name: "Baku",
        },
      };
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "ru" ? "Главная" : lang === "az" ? "Ana səhifə" : "Home",
        item: `${SITE_URL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: seo.breadcrumb,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema),
        }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <ServicesClient
        lang={lang}
        title={PAGE_TITLE[lang]}
        services={services}
      />
    </>
  );
}