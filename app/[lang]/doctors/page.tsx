import type { Metadata } from "next";
import { getDoctors } from "@/lib/directus";
import DoctorsClient from "./doctors.client";

export type Lang = "ru" | "en" | "az";

type DoctorTranslation = {
  language?: Lang | string;
  firstname?: string;
  lastname?: string;
  profession?: string;
  description?: string;
};

type DoctorItem = {
  id?: string | number;
  image?: string | { id?: string };
  translations?: DoctorTranslation[];
};

const SITE_URL = "https://besmile.az";
const SITE_NAME = "BeSmile Dental Clinic";
const DEFAULT_LANG: Lang = "az";

const SUPPORTED_LANGS: Lang[] = ["ru", "en", "az"];

const PAGE_SEO: Record<
  Lang,
  {
    title: string;
    description: string;
    keywords: string[];
    heroTitle: string;
    shortIntro: string;
    breadcrumbName: string;
    ogTitle: string;
    ogDescription: string;
  }
> = {
  ru: {
    title: "Врачи BeSmile | Стоматологи в Баку",
    description:
      "Познакомьтесь с врачами BeSmile Dental Clinic в Баку. Опытные стоматологи, индивидуальный подход, современная диагностика, лечение зубов, имплантация и эстетическая стоматология.",
    keywords: [
      "врачи BeSmile",
      "стоматологи Баку",
      "стоматолог Баку",
      "стоматологическая клиника Баку",
      "имплантолог Баку",
      "ортопед стоматолог Баку",
      "эстетическая стоматология Баку",
      "лечение зубов Баку",
      "BeSmile Dental Clinic",
    ],
    heroTitle: "НАШИ ВРАЧИ",
    shortIntro:
      "Команда BeSmile объединяет опыт, точность и современный подход в стоматологии, имплантологии и эстетическом лечении.",
    breadcrumbName: "Врачи",
    ogTitle: "Врачи BeSmile Dental Clinic в Баку",
    ogDescription:
      "Команда стоматологов BeSmile: опыт, точная диагностика, индивидуальный подход и премиальная забота о пациентах.",
  },
  en: {
    title: "BeSmile Doctors | Dentists in Baku",
    description:
      "Meet the doctors of BeSmile Dental Clinic in Baku. Experienced dentists, personal care, modern diagnostics, dental treatment, implants and cosmetic dentistry.",
    keywords: [
      "BeSmile doctors",
      "dentists in Baku",
      "dental clinic Baku",
      "implantologist in Baku",
      "prosthodontist in Baku",
      "cosmetic dentist Baku",
      "dental treatment Baku",
      "BeSmile Dental Clinic",
    ],
    heroTitle: "OUR DOCTORS",
    shortIntro:
      "The BeSmile team combines experience, precision, and a modern approach to dentistry, implantology, and aesthetic care.",
    breadcrumbName: "Doctors",
    ogTitle: "BeSmile Dental Clinic Doctors in Baku",
    ogDescription:
      "Meet the BeSmile dental team: experience, precise diagnostics, personal care and a premium treatment approach.",
  },
  az: {
    title: "BeSmile Həkimləri | Bakıda stomatoloqlar",
    description:
      "Bakıda BeSmile Dental Clinic həkimləri ilə tanış olun. Təcrübəli stomatoloqlar, fərdi yanaşma, müasir diaqnostika, diş müalicəsi, implantasiya və estetik stomatologiya.",
    keywords: [
      "BeSmile həkimləri",
      "Bakı stomatoloq",
      "Bakı diş həkimi",
      "Bakı diş klinikası",
      "implantoloq Bakı",
      "ortoped stomatoloq",
      "estetik stomatologiya Bakı",
      "diş müalicəsi Bakı",
      "BeSmile Dental Clinic",
    ],
    heroTitle: "BİZİM HƏKİMLƏR",
    shortIntro:
      "BeSmile komandası stomatologiya, implantologiya və estetik müalicədə təcrübəni, dəqiqliyi və müasir yanaşmanı birləşdirir.",
    breadcrumbName: "Həkimlər",
    ogTitle: "BeSmile Dental Clinic həkimləri",
    ogDescription:
      "BeSmile stomatoloji komandası: təcrübə, dəqiq diaqnostika, fərdi yanaşma və premium pasiyent qayğısı.",
  },
};

function normalizeLang(lang?: string): Lang {
  return SUPPORTED_LANGS.includes(lang as Lang) ? (lang as Lang) : DEFAULT_LANG;
}

function getLocalizedPath(lang: Lang) {
  return `/${lang}/doctors`;
}

function getPageUrl(lang: Lang) {
  return `${SITE_URL}${getLocalizedPath(lang)}`;
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

function stripHtml(html?: string): string {
  if (!html) return "";

  return html
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

function truncate(text: string, length = 220) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

function getDoctorTranslation(
  doctor: DoctorItem,
  lang: Lang
): DoctorTranslation | null {
  const translations = Array.isArray(doctor.translations)
    ? doctor.translations
    : [];

  return (
    translations.find((tr) => tr.language === lang) ||
    translations.find((tr) => tr.language === DEFAULT_LANG) ||
    translations.find((tr) => tr.language === "en") ||
    translations[0] ||
    null
  );
}

function getDoctorName(doctor: DoctorItem, lang: Lang): string {
  const t = getDoctorTranslation(doctor, lang);

  return `${t?.firstname ?? ""} ${t?.lastname ?? ""}`
    .replace(/\s+/g, " ")
    .trim();
}

function getDoctorProfession(doctor: DoctorItem, lang: Lang): string {
  const t = getDoctorTranslation(doctor, lang);
  return (t?.profession ?? "").trim();
}

function getDoctorDescription(doctor: DoctorItem, lang: Lang): string {
  const t = getDoctorTranslation(doctor, lang);
  return truncate(stripHtml(t?.description), 260);
}

function buildDoctorImageUrl(image?: string | { id?: string }): string | null {
  const imageId = typeof image === "string" ? image : image?.id;
  if (!imageId) return null;

  return `https://portal.besmile.az/assets/${imageId}?width=1200&quality=82&format=jpg`;
}

export async function generateMetadata(props: {
  params: { lang: Lang } | Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = normalizeLang(params?.lang);

  const seo = PAGE_SEO[lang];
  const canonical = getPageUrl(lang);

  return {
    metadataBase: new URL(SITE_URL),

    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,

    alternates: {
      canonical,
      languages: {
        az: `${SITE_URL}/az/doctors`,
        ru: `${SITE_URL}/ru/doctors`,
        en: `${SITE_URL}/en/doctors`,
        "x-default": `${SITE_URL}/${DEFAULT_LANG}/doctors`,
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
      locale: getLocale(lang),
      url: canonical,
      siteName: SITE_NAME,
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

function buildDoctorsSchema({
  lang,
  doctors,
}: {
  lang: Lang;
  doctors: DoctorItem[];
}) {
  const seo = PAGE_SEO[lang];
  const pageUrl = getPageUrl(lang);

  const physicians = doctors
    .map((doctor, index) => {
      const name = getDoctorName(doctor, lang);
      const profession = getDoctorProfession(doctor, lang);
      const description = getDoctorDescription(doctor, lang);
      const image = buildDoctorImageUrl(doctor.image);

      if (!name) return null;

      const doctorId = `${pageUrl}#doctor-${index + 1}`;

      return {
        "@type": "Physician",
        "@id": doctorId,
        name,
        description: description || profession || seo.shortIntro,
        medicalSpecialty: profession || "Dentistry",
        image: image || undefined,
        worksFor: {
          "@id": `${SITE_URL}#dentist`,
        },
        areaServed: {
          "@type": "City",
          name: "Baku",
        },
      };
    })
    .filter(Boolean);

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
        name: seo.title,
        headline: seo.ogTitle,
        description: seo.description,
        url: pageUrl,
        inLanguage: lang,
        isPartOf: {
          "@id": `${SITE_URL}#website`,
        },
        about: {
          "@id": `${SITE_URL}#dentist`,
        },
        mainEntity: {
          "@id": `${pageUrl}#doctors-list`,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#doctors-list`,
        name: seo.breadcrumbName,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: physicians.length,
        itemListElement: physicians.map((doctor: any, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@id": doctor["@id"],
          },
        })),
      },
      ...physicians,
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
            name: seo.breadcrumbName,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export default async function DoctorsPage(props: {
  params: { lang: Lang } | Promise<{ lang: Lang }>;
}) {
  const params = await props.params;
  const lang = normalizeLang(params?.lang);

  const raw = await getDoctors(lang);
  const doctors: DoctorItem[] = Array.isArray(raw) ? raw : [];

  const schema = buildDoctorsSchema({
    lang,
    doctors,
  });

  const seo = PAGE_SEO[lang];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <DoctorsClient
        lang={lang}
        title={seo.heroTitle}
        intro={seo.shortIntro}
        doctors={doctors}
      />
    </>
  );
}