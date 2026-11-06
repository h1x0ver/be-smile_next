import type { Metadata } from "next";

export type Lang = "az" | "ru" | "en";

export const SITE_URL = "https://besmile.az";
export const SITE_NAME = "BeSmile Dental Clinic";
export const DEFAULT_LANG: Lang = "az";

export const CLINIC = {
  phone: "+994704210204",
  email: "info@besmile.az",
  address: {
    streetAddress: "24 Khan Shushinski",
    addressLocality: "Baku",
    postalCode: "1007",
    addressCountry: "AZ",
  },
  geo: { latitude: 40.3976936, longitude: 49.8361854 },
  mapUrl: "https://maps.google.com/?cid=15329295648517687907",
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "19:00",
  },
};

export function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return DEFAULT_LANG;
}

export function getLocale(lang: Lang) {
  if (lang === "ru") return "ru_RU";
  if (lang === "az") return "az_AZ";
  return "en_US";
}

/** Canonical + hreflang alternates for a path like "contact" or "" (home). */
export function buildAlternates(lang: Lang, path: string) {
  const suffix = path ? `/${path}` : "";

  return {
    canonical: `${SITE_URL}/${lang}${suffix}`,
    languages: {
      az: `${SITE_URL}/az${suffix}`,
      ru: `${SITE_URL}/ru${suffix}`,
      en: `${SITE_URL}/en${suffix}`,
      "x-default": `${SITE_URL}/${DEFAULT_LANG}${suffix}`,
    },
  };
}

export function buildPageMetadata({
  lang,
  path,
  title,
  description,
  noindex = false,
}: {
  lang: Lang;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const alternates = buildAlternates(lang, path);

  return {
    title,
    description,
    alternates,
    robots: noindex
      ? { index: false, follow: true }
      : {
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
      url: alternates.canonical,
      title,
      description,
      siteName: SITE_NAME,
      locale: getLocale(lang),
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

/** Schema.org Dentist entity, shared by every page that describes the clinic. */
export function buildDentistSchema(lang: Lang) {
  return {
    "@type": ["Dentist", "MedicalBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}#dentist`,
    name: SITE_NAME,
    alternateName: ["BeSmile", "BeSmile Dental Clinic Baku", "Be Smile"],
    url: `${SITE_URL}/${lang}`,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/logo.png`,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    priceRange: "$$",
    currenciesAccepted: "AZN",
    address: { "@type": "PostalAddress", ...CLINIC.address },
    geo: { "@type": "GeoCoordinates", ...CLINIC.geo },
    hasMap: CLINIC.mapUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: CLINIC.openingHours.days,
        opens: CLINIC.openingHours.opens,
        closes: CLINIC.openingHours.closes,
      },
    ],
    areaServed: { "@type": "City", name: "Baku" },
    medicalSpecialty: "Dentistry",
    availableLanguage: ["az", "ru", "en"],
    sameAs: [
      "https://www.instagram.com/besmile_dental/",
      "https://www.facebook.com/p/BeSmile-Dental-Clinic-100057466744487",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CLINIC.phone,
        contactType: "customer service",
        areaServed: "AZ",
        availableLanguage: ["az", "ru", "en"],
      },
    ],
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\u003c"),
      }}
    />
  );
}
