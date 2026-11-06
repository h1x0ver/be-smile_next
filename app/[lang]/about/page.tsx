import type { Metadata } from "next";
import { getAboutBlocks } from "@/lib/directus";
import AboutClient from "./about.client";

export type Lang = "ru" | "en" | "az";

type PageProps = {
  params: { lang: Lang } | Promise<{ lang: Lang }>;
};

const SITE_URL = "https://besmile.az";
const SITE_NAME = "BeSmile Dental Clinic";
const DEFAULT_LANG: Lang = "az";

const PHONE = "+994704210204";
const EMAIL = "info@besmile.az";

const ADDRESS = {
  streetAddress: "24 Khan Shushinski",
  addressLocality: "Baku",
  postalCode: "1007",
  addressCountry: "AZ",
};

const SOCIAL_LINKS = [
  "https://www.instagram.com/besmile_dental/",
  "https://www.facebook.com/p/BeSmile-Dental-Clinic-100057466744487",
  "https://wa.me/994704210204",
];

const PAGE_TITLE: Record<Lang, string> = {
  en: "ABOUT US",
  ru: "О НАС",
  az: "HAQQIMIZDA",
};

const ABOUT_SEO: Record<
  Lang,
  {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
  }
> = {
  ru: {
    title:
      "О клинике BeSmile | Стоматология в Баку, врачи, технологии и премиальный подход",
    description:
      "BeSmile Dental Clinic — современная стоматологическая клиника в Баку. Узнайте о нашей философии, врачах, технологиях, эстетическом подходе, диагностике и заботе о пациентах.",
    keywords: [
      "BeSmile Dental Clinic",
      "О клинике BeSmile",
      "стоматология в Баку",
      "стоматологическая клиника Баку",
      "премиальная стоматология Баку",
      "стоматологи BeSmile",
      "современная стоматология Баку",
      "эстетическая стоматология Баку",
      "цифровая стоматология Баку",
      "лечение зубов Баку",
    ],
    ogTitle: "О клинике BeSmile Dental Clinic",
    ogDescription:
      "Современная стоматология в Баку: врачи, технологии, эстетика улыбки и премиальный подход к лечению.",
  },
  en: {
    title:
      "About BeSmile Dental Clinic | Dentist in Baku, Doctors, Technology and Premium Care",
    description:
      "BeSmile Dental Clinic is a modern dental clinic in Baku. Learn about our philosophy, doctors, technology, smile aesthetics, diagnostics and premium patient care.",
    keywords: [
      "BeSmile Dental Clinic",
      "about BeSmile",
      "dentist in Baku",
      "dental clinic Baku",
      "premium dental clinic Baku",
      "BeSmile doctors",
      "modern dentistry Baku",
      "cosmetic dentistry Baku",
      "digital dentistry Baku",
      "dental treatment Baku",
    ],
    ogTitle: "About BeSmile Dental Clinic",
    ogDescription:
      "Modern dentistry in Baku: expert doctors, technology, smile aesthetics and premium patient care.",
  },
  az: {
    title:
      "BeSmile Dental Clinic haqqında | Bakıda stomatologiya, həkimlər və premium yanaşma",
    description:
      "BeSmile Dental Clinic Bakıda müasir stomatoloji klinikadır. Fəlsəfəmiz, həkimlərimiz, texnologiyalarımız, estetik yanaşmamız və pasiyent qayğımız haqqında məlumat alın.",
    keywords: [
      "BeSmile Dental Clinic",
      "BeSmile haqqında",
      "Bakıda stomatologiya",
      "Bakı diş klinikası",
      "premium stomatologiya Bakı",
      "BeSmile həkimləri",
      "müasir stomatologiya Bakı",
      "estetik stomatologiya Bakı",
      "rəqəmsal stomatologiya Bakı",
      "diş müalicəsi Bakı",
    ],
    ogTitle: "BeSmile Dental Clinic haqqında",
    ogDescription:
      "Bakıda müasir stomatologiya: həkimlər, texnologiyalar, təbəssüm estetikası və premium pasiyent qayğısı.",
  },
};

const ABOUT_FAQ: Record<
  Lang,
  Array<{
    question: string;
    answer: string;
  }>
> = {
  ru: [
    {
      question: "Что такое BeSmile Dental Clinic?",
      answer:
        "BeSmile Dental Clinic — современная стоматологическая клиника в Баку, где лечение зубов, эстетическая стоматология, диагностика и забота о пациенте объединены в premium-подход.",
    },
    {
      question: "Где находится стоматологическая клиника BeSmile?",
      answer:
        "BeSmile Dental Clinic находится в Баку по адресу 24 Khan Shushinski. Клиника принимает пациентов для консультаций, диагностики и стоматологического лечения.",
    },
    {
      question: "Какие услуги предоставляет BeSmile Dental Clinic?",
      answer:
        "Клиника предоставляет диагностику, лечение зубов, профессиональную гигиену, имплантацию, протезирование, виниры, коронки, отбеливание и эстетическую стоматологию.",
    },
    {
      question: "Чем BeSmile отличается от обычной стоматологии?",
      answer:
        "BeSmile делает акцент на точной диагностике, индивидуальном плане лечения, эстетике улыбки, современных технологиях и спокойном premium-опыте для пациента.",
    },
    {
      question: "Можно ли записаться на консультацию в BeSmile?",
      answer:
        "Да, вы можете записаться на консультацию в BeSmile Dental Clinic, чтобы пройти диагностику, обсудить состояние зубов и получить индивидуальный план лечения.",
    },
  ],
  en: [
    {
      question: "What is BeSmile Dental Clinic?",
      answer:
        "BeSmile Dental Clinic is a modern dental clinic in Baku where dental treatment, cosmetic dentistry, diagnostics and patient comfort are combined with a premium approach.",
    },
    {
      question: "Where is BeSmile Dental Clinic located?",
      answer:
        "BeSmile Dental Clinic is located in Baku at 24 Khan Shushinski. The clinic welcomes patients for consultations, diagnostics and dental treatment.",
    },
    {
      question: "What services does BeSmile Dental Clinic provide?",
      answer:
        "The clinic provides diagnostics, dental treatment, professional hygiene, implants, prosthetics, veneers, crowns, whitening and cosmetic dentistry.",
    },
    {
      question: "What makes BeSmile different from a regular dental clinic?",
      answer:
        "BeSmile focuses on precise diagnostics, personalized treatment planning, smile aesthetics, modern technology and a calm premium patient experience.",
    },
    {
      question: "Can I book a consultation at BeSmile?",
      answer:
        "Yes, you can book a consultation at BeSmile Dental Clinic to receive diagnostics, discuss your dental condition and get a personalized treatment plan.",
    },
  ],
  az: [
    {
      question: "BeSmile Dental Clinic nədir?",
      answer:
        "BeSmile Dental Clinic Bakıda müasir stomatoloji klinikadır. Burada diş müalicəsi, estetik stomatologiya, diaqnostika və pasiyent rahatlığı premium yanaşma ilə birləşir.",
    },
    {
      question: "BeSmile Dental Clinic harada yerləşir?",
      answer:
        "BeSmile Dental Clinic Bakıda, 24 Khan Shushinski ünvanında yerləşir. Klinikada konsultasiya, diaqnostika və stomatoloji müalicə xidmətləri göstərilir.",
    },
    {
      question: "BeSmile Dental Clinic hansı xidmətləri göstərir?",
      answer:
        "Klinika diaqnostika, diş müalicəsi, professional gigiyena, implantasiya, protezləşdirmə, vinirlər, diş qapaqları, ağartma və estetik stomatologiya xidmətləri təqdim edir.",
    },
    {
      question: "BeSmile adi stomatologiyadan nə ilə fərqlənir?",
      answer:
        "BeSmile dəqiq diaqnostika, fərdi müalicə planı, təbəssüm estetikası, müasir texnologiyalar və sakit premium pasiyent təcrübəsinə fokuslanır.",
    },
    {
      question: "BeSmile-da konsultasiyaya yazılmaq mümkündür?",
      answer:
        "Bəli, BeSmile Dental Clinic-də konsultasiyaya yazılaraq diaqnostika keçə, dişlərinizin vəziyyətini müzakirə edə və fərdi müalicə planı əldə edə bilərsiniz.",
    },
  ],
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return DEFAULT_LANG;
}

function getCanonical(lang: Lang) {
  return `${SITE_URL}/${lang}/about`;
}

function getHomeUrl(lang: Lang) {
  return `${SITE_URL}/${lang}`;
}

function getLocale(lang: Lang) {
  if (lang === "ru") return "ru_RU";
  if (lang === "az") return "az_AZ";
  return "en_US";
}

function getHomeLabel(lang: Lang) {
  if (lang === "ru") return "Главная";
  if (lang === "en") return "Home";
  return "Ana səhifə";
}

function getAboutLabel(lang: Lang) {
  if (lang === "ru") return "О нас";
  if (lang === "en") return "About us";
  return "Haqqımızda";
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = normalizeLang(params?.lang);

  const seo = ABOUT_SEO[lang];
  const canonical = getCanonical(lang);

  return {
    metadataBase: new URL(SITE_URL),

    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,

    alternates: {
      canonical,
      languages: {
        az: `${SITE_URL}/az/about`,
        ru: `${SITE_URL}/ru/about`,
        en: `${SITE_URL}/en/about`,
        "x-default": `${SITE_URL}/${DEFAULT_LANG}/about`,
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
      title: seo.ogTitle,
      description: seo.ogDescription,
      siteName: SITE_NAME,
      locale: getLocale(lang),
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt:
            lang === "ru"
              ? "BeSmile Dental Clinic — стоматология в Баку"
              : lang === "az"
                ? "BeSmile Dental Clinic — Bakıda stomatologiya"
                : "BeSmile Dental Clinic — dentist in Baku",
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

function buildAboutSchema(lang: Lang) {
  const seo = ABOUT_SEO[lang];
  const pageUrl = getCanonical(lang);
  const faq = ABOUT_FAQ[lang];

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
        telephone: PHONE,
        email: EMAIL,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          ...ADDRESS,
        },
        areaServed: {
          "@type": "City",
          name: "Baku",
        },
        medicalSpecialty:
          lang === "ru" ? "Стоматология" : lang === "az" ? "Stomatologiya" : "Dentistry",
        knowsAbout:
          lang === "ru"
            ? [
                "стоматология в Баку",
                "лечение зубов",
                "эстетическая стоматология",
                "имплантация зубов",
                "виниры",
                "зубные коронки",
                "цифровая диагностика",
              ]
            : lang === "az"
              ? [
                  "Bakıda stomatologiya",
                  "diş müalicəsi",
                  "estetik stomatologiya",
                  "implantasiya",
                  "vinirlər",
                  "diş qapaqları",
                  "rəqəmsal diaqnostika",
                ]
              : [
                  "dentistry in Baku",
                  "dental treatment",
                  "cosmetic dentistry",
                  "dental implants",
                  "veneers",
                  "dental crowns",
                  "digital diagnostics",
                ],
        sameAs: SOCIAL_LINKS,
        hasMap:
          "https://www.google.com/maps/search/?api=1&query=BeSmile%20Dental%20Clinic%20Baku",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: PHONE,
            contactType: "customer service",
            areaServed: "AZ",
            availableLanguage: ["az", "ru", "en"],
          },
        ],
      },
      {
        "@type": "AboutPage",
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
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
        },
        breadcrumb: {
          "@id": `${pageUrl}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: getHomeLabel(lang),
            item: getHomeUrl(lang),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: getAboutLabel(lang),
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export default async function AboutPage(props: PageProps) {
  const params = await props.params;
  const lang = normalizeLang(params?.lang);

  const rawAboutBlocks = await getAboutBlocks();
  const aboutBlocks = Array.isArray(rawAboutBlocks) ? rawAboutBlocks : [];

  const schema = buildAboutSchema(lang);
  const faqItems = ABOUT_FAQ[lang];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <AboutClient
        lang={lang}
        title={PAGE_TITLE[lang]}
        aboutBlocks={aboutBlocks}
        faqItems={faqItems}
      />
    </>
  );
}