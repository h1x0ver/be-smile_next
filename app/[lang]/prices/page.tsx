import type { Metadata } from "next";
import { getPrices, getPricesCategories, Lang } from "@/lib/directus";
import PricesClient from "./prices.client";

type PriceTranslation = {
  language?: Lang;
  service_name: string;
  description?: string;
};

type PriceCategory = {
  id: number;
  slug: string;
  translations?: { language: Lang; name: string }[];
};

type PriceItem = {
  id: number;
  slug?: string;
  price: string;
  is_from_price: boolean;
  category?: {
    id: number;
    slug: string;
  };
  translations: PriceTranslation[];
};

const SITE_URL = "https://besmile.az";
const SITE_NAME = "BeSmile Dental Clinic";

const PAGE_SEO: Record<
  Lang,
  {
    title: string;
    description: string;
    keywords: string[];
    breadcrumb: string;
    intro: string;
  }
> = {
  ru: {
    title:
      "Цены BeSmile в Баку | Стоимость стоматологии, имплантов, виниров и лечения зубов",
    description:
      "Актуальные цены BeSmile Dental Clinic в Баку: стоматологические услуги, имплантация, лечение зубов, хирургия, ортопедия, гигиена и эстетическая стоматология.",
    keywords: [
      "цены стоматология Баку",
      "стоимость имплантов Баку",
      "цены на виниры Баку",
      "стоимость лечения зубов Баку",
      "цены BeSmile",
      "стоматология Баку цены",
      "имплантация Баку стоимость",
      "цены на стоматологические услуги",
    ],
    breadcrumb: "Цены",
    intro:
      "Прозрачная стоимость стоматологических услуг BeSmile с современным подходом, эстетикой и точностью на каждом этапе лечения.",
  },
  en: {
    title:
      "BeSmile Prices in Baku | Dental Treatment, Implants, Veneers and Dentistry Costs",
    description:
      "Explore BeSmile Dental Clinic prices in Baku for dental treatment, implants, surgery, prosthetics, oral hygiene, smile aesthetics and premium dental care.",
    keywords: [
      "dental prices in Baku",
      "implant cost Baku",
      "veneers price Baku",
      "dental treatment prices Baku",
      "BeSmile prices",
      "dentistry costs Baku",
      "premium dental clinic prices",
      "oral surgery prices Baku",
    ],
    breadcrumb: "Prices",
    intro:
      "Transparent BeSmile pricing for modern dentistry, implants, smile aesthetics and premium patient care in Baku.",
  },
  az: {
    title:
      "BeSmile qiymətləri | Bakı üzrə stomatoloji xidmətlər, implantlar, vinirlər və müalicə qiymətləri",
    description:
      "BeSmile Dental Clinic qiymətləri: stomatoloji xidmətlər, implantasiya, diş müalicəsi, cərrahiyyə, ortopediya, gigiyena və estetik stomatologiya üzrə aktual qiymətlər.",
    keywords: [
      "stomatologiya qiymətləri Bakı",
      "implant qiyməti Bakı",
      "vinir qiyməti Bakı",
      "diş müalicəsi qiyməti Bakı",
      "BeSmile qiymətləri",
      "Bakı diş klinikası qiymətləri",
      "implantasiya qiyməti Bakı",
      "stomatoloji xidmət qiymətləri",
    ],
    breadcrumb: "Qiymətlər",
    intro:
      "BeSmile stomatoloji xidmətlərinin şəffaf qiymətləri — müasir müalicə, estetika və premium pasiyent yanaşması ilə.",
  },
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return "en";
}

function getLocalizedPath(lang: Lang) {
  return `/${lang}/prices`;
}

function stripHtml(html?: string): string {
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

function pickPriceTranslation(item: PriceItem, lang: Lang): PriceTranslation | null {
  const translations = Array.isArray(item.translations) ? item.translations : [];
  return (
    translations.find((tr) => tr.language === lang) ||
    translations.find((tr) => tr.language === "en") ||
    translations[0] ||
    null
  );
}

function pickCategoryName(category: PriceCategory, lang: Lang): string {
  const translations = Array.isArray(category.translations) ? category.translations : [];
  return (
    translations.find((tr) => tr.language === lang)?.name ||
    translations.find((tr) => tr.language === "en")?.name ||
    translations[0]?.name ||
    category.slug
  );
}

function makeAnchor(value?: string) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

function formatPrice(price: string, isFrom: boolean, lang: Lang) {
  if (!isFrom) return price;
  if (lang === "ru") return `от ${price}`;
  if (lang === "az") return `${price}-dən başlayaraq`;
  return `from ${price}`;
}

export async function generateMetadata(
  props: { params: Promise<{ lang: Lang }> }
): Promise<Metadata> {
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
        en: `${SITE_URL}/en/prices`,
        ru: `${SITE_URL}/ru/prices`,
        az: `${SITE_URL}/az/prices`,
        "x-default": `${SITE_URL}/en/prices`,
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
          alt: lang === "ru" ? "Цены BeSmile" : lang === "az" ? "BeSmile qiymətləri" : "BeSmile Prices",
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

export default async function Page(
  props: { params: { lang: Lang } | Promise<{ lang: Lang }> }
) {
  const { lang: rawLang } = await props.params;
  const lang = normalizeLang(rawLang);

  const [pricesRaw, categoriesRaw] = await Promise.all([
    getPrices(lang),
    getPricesCategories(lang),
  ]);

  const prices = Array.isArray(pricesRaw) ? (pricesRaw as PriceItem[]) : [];
  const categories = Array.isArray(categoriesRaw)
    ? (categoriesRaw as PriceCategory[])
    : [];

  const seo = PAGE_SEO[lang];
  const pageUrl = `${SITE_URL}${getLocalizedPath(lang)}`;

  const priceListSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    itemListElement: prices.slice(0, 200).map((item, index) => {
      const tr = pickPriceTranslation(item, lang);
      const name = tr?.service_name || `Service ${index + 1}`;
      const description = truncate(stripHtml(tr?.description), 200) || seo.intro;
      const anchor = makeAnchor(item.slug || name || String(item.id));

      return {
        "@type": "Offer",
        position: index + 1,
        url: `${pageUrl}#price-${anchor}`,
        itemOffered: {
          "@type": "Service",
          name,
          description,
          provider: {
            "@type": "Dentist",
            name: SITE_NAME,
            url: SITE_URL,
          },
          areaServed: {
            "@type": "City",
            name: "Baku",
          },
        },
        price: item.price,
        priceCurrency: "AZN",
        description: formatPrice(item.price, item.is_from_price, lang),
      };
    }),
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    inLanguage: lang,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Dentist",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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

  const faqByLang: Record<
    Lang,
    Array<{ q: string; a: string }>
  > = {
    ru: [
      {
        q: "Указаны ли на странице актуальные цены?",
        a: "На странице представлены актуальные цены на основные стоматологические услуги BeSmile. Точный план лечения и итоговая стоимость могут зависеть от клинической ситуации.",
      },
      {
        q: "Есть ли цены \"от\"?",
        a: "Да. Для некоторых услуг стоимость может указываться в формате \"от\", если итоговая цена зависит от объема лечения, материалов или клинической сложности.",
      },
    ],
    en: [
      {
        q: "Are the prices on this page current?",
        a: "This page shows current BeSmile prices for key dental services. The final treatment plan and total cost may vary depending on the clinical case.",
      },
      {
        q: "Do some services have starting prices?",
        a: "Yes. Some services may be listed as starting prices when the final cost depends on treatment scope, materials, or clinical complexity.",
      },
    ],
    az: [
      {
        q: "Bu səhifədəki qiymətlər aktualdırmı?",
        a: "Bu səhifədə BeSmile əsas stomatoloji xidmətləri üzrə aktual qiymətlər göstərilir. Son müalicə planı və yekun məbləğ klinik vəziyyətdən asılı olaraq dəyişə bilər.",
      },
      {
        q: "Bəzi xidmətlər üçün başlanğıc qiymət göstərilirmi?",
        a: "Bəli. Bəzi xidmətlərdə yekun qiymət müalicənin həcmi, materiallar və ya klinik çətinlikdən asılı olduğuna görə başlanğıc qiymət göstərilə bilər.",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqByLang[lang].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const categorySchemas = categories.map((category) => ({
    "@type": "DefinedTerm",
    name: pickCategoryName(category, lang),
    termCode: category.slug,
    inDefinedTermSet: pageUrl,
  }));

  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `${seo.breadcrumb} categories`,
    hasDefinedTerm: categorySchemas,
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceListSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />

      <PricesClient
        key={lang}
        lang={lang}
        prices={prices as any}
        categories={categories as any}
      />
    </>
  );
}