import type { Metadata } from "next";
import BlogClient from "./case.client";
import { getCases, getCaseCategories, Lang } from "@/lib/directus";

const SITE_URL = "https://besmile.az";
const SITE_NAME = "BeSmile Dental Clinic";
const DEFAULT_LANG: Lang = "az";

const SEO: Record<
  Lang,
  {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    heroTitle: string;
  }
> = {
  ru: {
    title: "До и после лечения зубов в Баку | Кейсы BeSmile Dental Clinic",
    description:
      "Реальные кейсы BeSmile Dental Clinic: виниры, имплантация, коронки, отбеливание, профессиональная чистка и восстановление улыбки в Баку.",
    keywords: [
      "до и после стоматология Баку",
      "кейсы стоматологии Баку",
      "виниры до после Баку",
      "имплантация зубов до после",
      "коронки до после Баку",
      "отбеливание зубов до после",
      "BeSmile Dental Clinic кейсы",
      "стоматология в Баку",
    ],
    ogTitle: "До и после | Кейсы BeSmile Dental Clinic",
    ogDescription:
      "Реальные стоматологические кейсы BeSmile в Баку: эстетика улыбки, имплантация, виниры, коронки и отбеливание.",
    heroTitle: "До / После",
  },
  en: {
    title: "Before and After Dental Cases in Baku | BeSmile Dental Clinic",
    description:
      "Real BeSmile Dental Clinic cases: veneers, implants, crowns, whitening, professional cleaning and smile restoration in Baku.",
    keywords: [
      "before after dentistry Baku",
      "dental cases Baku",
      "veneers before after Baku",
      "dental implants before after",
      "dental crowns before after Baku",
      "teeth whitening before after",
      "BeSmile Dental Clinic cases",
      "dentist in Baku",
    ],
    ogTitle: "Before and After | BeSmile Dental Clinic Cases",
    ogDescription:
      "Real dental cases by BeSmile in Baku: smile aesthetics, implants, veneers, crowns and whitening.",
    heroTitle: "Before / After",
  },
  az: {
    title: "Diş müalicəsi əvvəl və sonra | BeSmile Dental Clinic keysləri",
    description:
      "BeSmile Dental Clinic real keysləri: vinirlər, implantasiya, diş qapaqları, ağartma, professional təmizləmə və təbəssüm bərpası.",
    keywords: [
      "əvvəl sonra stomatologiya Bakı",
      "diş keysləri Bakı",
      "vinirlər əvvəl sonra",
      "implantasiya əvvəl sonra",
      "diş qapaqları əvvəl sonra",
      "diş ağartma əvvəl sonra",
      "BeSmile Dental Clinic keyslər",
      "Bakıda stomatologiya",
    ],
    ogTitle: "Əvvəl / Sonra | BeSmile Dental Clinic keysləri",
    ogDescription:
      "BeSmile-in real stomatoloji keysləri: təbəssüm estetikası, implantasiya, vinirlər, qapaqlar və ağartma.",
    heroTitle: "Əvvəl / Sonra",
  },
};

type PageProps = {
  params: { lang: Lang } | Promise<{ lang: Lang }>;
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return DEFAULT_LANG;
}

function getCanonical(lang: Lang) {
  return `${SITE_URL}/${lang}/before-after`;
}

function getLocale(lang: Lang) {
  if (lang === "ru") return "ru_RU";
  if (lang === "az") return "az_AZ";
  return "en_US";
}

function getHomeLabel(lang: Lang) {
  if (lang === "ru") return "Главная";
  if (lang === "az") return "Ana səhifə";
  return "Home";
}

function getPageLabel(lang: Lang) {
  if (lang === "ru") return "До и после";
  if (lang === "az") return "Əvvəl və sonra";
  return "Before and after";
}

function getTranslation(item: any, lang: Lang) {
  const translations = Array.isArray(item?.translations)
    ? item.translations
    : [];

  return (
    translations.find(
      (tr: any) =>
        tr?.lang === lang ||
        tr?.language === lang ||
        tr?.languages_code === lang
    ) ||
    translations.find(
      (tr: any) =>
        tr?.lang === DEFAULT_LANG ||
        tr?.language === DEFAULT_LANG ||
        tr?.languages_code === DEFAULT_LANG
    ) ||
    translations.find(
      (tr: any) =>
        tr?.lang === "en" ||
        tr?.language === "en" ||
        tr?.languages_code === "en"
    ) ||
    translations[0] ||
    null
  );
}

function stripHtml(value?: string) {
  if (!value) return "";

  return value
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function assetUrl(file: any) {
  const directusUrl =
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az";

  const cleanDirectusUrl = directusUrl.replace(/\/$/, "");
  const id = typeof file === "string" ? file : file?.id ? String(file.id) : "";

  return id ? `${cleanDirectusUrl}/assets/${id}` : "";
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = normalizeLang(params?.lang);
  const seo = SEO[lang];
  const canonical = getCanonical(lang);

  return {
    metadataBase: new URL(SITE_URL),

    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,

    alternates: {
      canonical,
      languages: {
        az: `${SITE_URL}/az/before-after`,
        ru: `${SITE_URL}/ru/before-after`,
        en: `${SITE_URL}/en/before-after`,
        "x-default": `${SITE_URL}/${DEFAULT_LANG}/before-after`,
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
      siteName: SITE_NAME,
      locale: getLocale(lang),
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [`${SITE_URL}/og-image.jpg`],
    },

    category: "healthcare",
  };
}

function buildSchema({
  lang,
  cases,
}: {
  lang: Lang;
  cases: any[];
}) {
  const seo = SEO[lang];
  const pageUrl = getCanonical(lang);

  const normalizedCases = Array.isArray(cases)
    ? cases
        .map((item, index) => {
          const tr = getTranslation(item, lang);
          const title = stripHtml(tr?.title) || item?.slug || `Case ${index + 1}`;
          const description =
            stripHtml(tr?.description) ||
            stripHtml(tr?.details) ||
            seo.description;

          const beforeImage = assetUrl(item?.before_image);
          const afterImage = assetUrl(item?.after_image);

          if (!item?.slug) return null;

          return {
            "@type": "CreativeWork",
            "@id": `${pageUrl}#case-${item.slug}`,
            name: title,
            description,
            url: `${pageUrl}?case=${item.slug}`,
            image: [beforeImage, afterImage].filter(Boolean),
            creator: {
              "@id": `${SITE_URL}#dentist`,
            },
            about: {
              "@type": "MedicalProcedure",
              name:
                lang === "ru"
                  ? "Стоматологическое лечение"
                  : lang === "az"
                    ? "Stomatoloji müalicə"
                    : "Dental treatment",
            },
          };
        })
        .filter(Boolean)
    : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: "BeSmile",
        inLanguage: ["az", "ru", "en"],
        publisher: {
          "@id": `${SITE_URL}#dentist`,
        },
      },
      {
        "@type": ["Dentist", "MedicalBusiness", "LocalBusiness"],
        "@id": `${SITE_URL}#dentist`,
        name: SITE_NAME,
        alternateName: ["BeSmile", "BeSmile Dental Clinic Baku"],
        url: SITE_URL,
        image: `${SITE_URL}/og-image.jpg`,
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
        medicalSpecialty:
          lang === "ru"
            ? "Стоматология"
            : lang === "az"
              ? "Stomatologiya"
              : "Dentistry",
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        headline: seo.ogTitle,
        description: seo.description,
        inLanguage: lang,
        isPartOf: {
          "@id": `${SITE_URL}#website`,
        },
        about: {
          "@id": `${SITE_URL}#dentist`,
        },
        mainEntity: {
          "@id": `${pageUrl}#cases-list`,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#cases-list`,
        name: getPageLabel(lang),
        numberOfItems: normalizedCases.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: normalizedCases.map((item: any, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@id": item["@id"],
          },
        })),
      },
      ...normalizedCases,
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: getHomeLabel(lang),
            item: `${SITE_URL}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: getPageLabel(lang),
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const lang = normalizeLang(params?.lang);

  const [cases, categories] = await Promise.all([
    getCases(lang),
    getCaseCategories(lang),
  ]);

  const safeCases = Array.isArray(cases) ? cases : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const schema = buildSchema({
    lang,
    cases: safeCases,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <BlogClient
        key={lang}
        lang={lang}
        cases={safeCases}
        categories={safeCategories}
      />
    </>
  );
}