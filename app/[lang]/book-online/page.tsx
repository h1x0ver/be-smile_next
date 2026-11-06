import type { Metadata } from "next";
import BookOnlinePageClient from "./bookOnlinePage.client";
import { Suspense } from "react";

type Lang = "ru" | "en" | "az";

const SITE_URL = "https://besmile.az";
const SITE_NAME = "BeSmile Dental Clinic";
const DEFAULT_LANG: Lang = "az";

const SEO: Record<
  Lang,
  {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  }
> = {
  ru: {
    title: "Записаться к стоматологу в Баку | BeSmile Dental Clinic",
    description:
      "Онлайн-запись на приём в BeSmile Dental Clinic в Баку. Выберите удобную дату и время для консультации, диагностики, лечения зубов, имплантации или эстетической стоматологии.",
    ogTitle: "Запись на приём в BeSmile Dental Clinic",
    ogDescription:
      "Выберите удобное время визита. Мы свяжемся с вами для подтверждения записи.",
  },
  en: {
    title: "Book a Dentist in Baku | BeSmile Dental Clinic",
    description:
      "Book an appointment at BeSmile Dental Clinic in Baku. Choose a convenient date and time for consultation, diagnostics, dental treatment, implants or cosmetic dentistry.",
    ogTitle: "Book your visit at BeSmile Dental Clinic",
    ogDescription:
      "Choose a convenient appointment time. We will contact you to confirm the booking.",
  },
  az: {
    title: "Bakıda stomatoloqa yazılın | BeSmile Dental Clinic",
    description:
      "Bakıda BeSmile Dental Clinic-də qəbula onlayn yazılın. Konsultasiya, diaqnostika, diş müalicəsi, implantasiya və estetik stomatologiya üçün uyğun tarix və vaxt seçin.",
    ogTitle: "BeSmile Dental Clinic-də qəbula yazılın",
    ogDescription:
      "Qəbul üçün uyğun vaxt seçin. Təsdiq üçün sizinlə əlaqə saxlayacağıq.",
  },
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return DEFAULT_LANG;
}

function getCanonical(lang: Lang) {
  return `${SITE_URL}/${lang}/book-online`;
}

function getLocale(lang: Lang) {
  if (lang === "ru") return "ru_RU";
  if (lang === "az") return "az_AZ";
  return "en_US";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang?: string }> | { lang?: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = normalizeLang(resolvedParams?.lang);
  const seo = SEO[lang];
  const canonical = getCanonical(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,

    alternates: {
      canonical,
      languages: {
        az: `${SITE_URL}/az/book-online`,
        ru: `${SITE_URL}/ru/book-online`,
        en: `${SITE_URL}/en/book-online`,
        "x-default": `${SITE_URL}/${DEFAULT_LANG}/book-online`,
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

function buildBookingSchema(lang: Lang) {
  const pageUrl = getCanonical(lang);
  const seo = SEO[lang];

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
        "@type": "ContactPage",
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
          "@id": `${SITE_URL}#dentist`,
        },
        potentialAction: {
          "@type": "ReserveAction",
          target: pageUrl,
          result: {
            "@type": "Reservation",
            name:
              lang === "ru"
                ? "Запись на приём"
                : lang === "az"
                  ? "Qəbula yazılış"
                  : "Appointment booking",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name:
              lang === "ru" ? "Главная" : lang === "az" ? "Ana səhifə" : "Home",
            item: `${SITE_URL}/${lang}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name:
              lang === "ru"
                ? "Запись на приём"
                : lang === "az"
                  ? "Qəbula yazılın"
                  : "Book online",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang?: string }> | { lang?: string };
}) {
  const resolvedParams = await params;
  const safeLang = normalizeLang(resolvedParams?.lang);
  const schema = buildBookingSchema(safeLang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense>
       <BookOnlinePageClient lang={safeLang} />

      </Suspense>
    </>
  );
}