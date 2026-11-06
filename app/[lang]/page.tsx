import type { Metadata } from "next";
import { Suspense } from "react";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import ServicesSection from "@/components/ServicesSection";
import Doctors from "@/components/Doctors";
import CasesPremium from "@/components/CasesPremium";
import { getCases, getBlogPosts } from "@/lib/directus";
import BlogCarouselPremium from "@/components/BlogCarouselPremium";
import HomeFaq from "@/components/HomeFaq";
import ServicesMarquee from "@/components/ServicesMarquee";
import { getNavServiceGroups } from "@/lib/navigation";
import { buildDentistSchema } from "@/lib/seo";
export type Lang = "en" | "ru" | "az";

type PageProps = {
  params: { lang: Lang } | Promise<{ lang: Lang }>;
};

const SITE_URL = "https://besmile.az";
const SITE_NAME = "BeSmile Dental Clinic";
const DEFAULT_LANG: Lang = "az";

const HOME_SEO: Record<
  Lang,
  {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    h1?: string;
  }
> = {
  ru: {
    title:
      "Стоматология в Баку | BeSmile Dental Clinic — лечение зубов, имплантация и эстетика улыбки",
    description:
      "Стоматология в Баку BeSmile Dental Clinic: лечение зубов, имплантация, виниры, коронки, отбеливание, диагностика и эстетическая стоматология. Современная клиника с опытными врачами.",
    keywords: [
      "стоматология в Баку",
      "стоматология Баку",
      "стоматологическая клиника в Баку",
      "стоматолог Баку",
      "лечение зубов Баку",
      "имплантация зубов Баку",
      "виниры Баку",
      "зубные коронки Баку",
      "отбеливание зубов Баку",
      "эстетическая стоматология Баку",
      "премиальная стоматология Баку",
      "BeSmile Dental Clinic",
      "стоматологическая клиника BeSmile",
    ],
    ogTitle: "Стоматология в Баку | BeSmile Dental Clinic",
    ogDescription:
      "Современная стоматологическая клиника в Баку: лечение зубов, имплантация, виниры, коронки, отбеливание и эстетика улыбки.",
    h1: "Стоматология в Баку",
  },
  en: {
    title:
      "Dentist in Baku | BeSmile Dental Clinic — Dental Treatment, Implants and Smile Aesthetics",
    description:
      "BeSmile Dental Clinic in Baku offers dental treatment, implants, veneers, crowns, whitening, diagnostics and cosmetic dentistry with an experienced medical team.",
    keywords: [
      "dentist in Baku",
      "dentistry in Baku",
      "dental clinic Baku",
      "dental treatment Baku",
      "dental implants Baku",
      "veneers Baku",
      "dental crowns Baku",
      "teeth whitening Baku",
      "cosmetic dentistry Baku",
      "premium dental clinic Baku",
      "BeSmile Dental Clinic",
    ],
    ogTitle: "Dentist in Baku | BeSmile Dental Clinic",
    ogDescription:
      "Modern dental clinic in Baku for dental treatment, implants, veneers, crowns, whitening and smile aesthetics.",
    h1: "Dentist in Baku",
  },
  az: {
    title:
      "Bakıda stomatologiya | BeSmile Dental Clinic — diş müalicəsi, implantasiya və estetik təbəssüm",
    description:
      "BeSmile Dental Clinic Bakıda stomatologiya xidmətləri təqdim edir: diş müalicəsi, implantasiya, vinirlər, qapaqlar, ağartma, diaqnostika və estetik stomatologiya.",
    keywords: [
      "Bakıda stomatologiya",
      "Bakı stomatologiya",
      "Bakı diş klinikası",
      "Bakı diş həkimi",
      "diş müalicəsi Bakı",
      "implantasiya Bakı",
      "vinirlər Bakı",
      "diş qapaqları Bakı",
      "diş ağartma Bakı",
      "estetik stomatologiya Bakı",
      "premium stomatologiya Bakı",
      "BeSmile Dental Clinic",
    ],
    ogTitle: "Bakıda stomatologiya | BeSmile Dental Clinic",
    ogDescription:
      "Bakıda müasir stomatoloji klinika: diş müalicəsi, implantasiya, vinirlər, qapaqlar, ağartma və estetik təbəssüm.",
    h1: "Bakıda stomatologiya",
  },
};

const HOME_FAQ: Record<
  Lang,
  Array<{
    question: string;
    answer: string;
  }>
> = {
  ru: [
    {
      question: "Какие стоматологические услуги доступны в BeSmile Dental Clinic в Баку?",
      answer:
        "В BeSmile Dental Clinic доступны диагностика, лечение зубов, имплантация, виниры, зубные коронки, протезирование, отбеливание, профессиональная гигиена, хирургическая стоматология и эстетическая стоматология.",
    },
    {
      question: "Можно ли записаться на консультацию к стоматологу в Баку?",
      answer:
        "Да, в BeSmile Dental Clinic можно записаться на консультацию стоматолога в Баку для диагностики, составления плана лечения и подбора подходящего решения для здоровья и эстетики улыбки.",
    },
    {
      question: "Делают ли в BeSmile имплантацию зубов?",
      answer:
        "Да, клиника BeSmile проводит имплантацию зубов в Баку с предварительной диагностикой, индивидуальным планом лечения и вниманием к функциональному и эстетическому результату.",
    },
    {
      question: "Есть ли эстетическая стоматология в BeSmile?",
      answer:
        "Да, BeSmile Dental Clinic специализируется на эстетической стоматологии: виниры, отбеливание, восстановление формы и цвета зубов, а также комплексное улучшение улыбки.",
    },
    {
      question: "Где находится стоматология BeSmile в Баку и какой график работы?",
      answer:
        "BeSmile Dental Clinic находится в Баку по адресу: ул. Хана Шушинского, 24. Клиника работает с понедельника по субботу с 09:00 до 19:00.",
    },
    {
      question: "Как записаться на приём к стоматологу BeSmile?",
      answer:
        "Записаться можно онлайн на сайте, по телефону +994 70 421 02 04 или через WhatsApp. Администратор подберёт удобное время и врача под вашу задачу.",
    },
  ],
  en: [
    {
      question: "What dental services are available at BeSmile Dental Clinic in Baku?",
      answer:
        "BeSmile Dental Clinic provides diagnostics, dental treatment, implants, veneers, crowns, prosthetics, whitening, professional hygiene, oral surgery and cosmetic dentistry in Baku.",
    },
    {
      question: "Can I book a dentist consultation in Baku?",
      answer:
        "Yes, you can book a dentist consultation at BeSmile Dental Clinic in Baku for diagnostics, treatment planning and personalized smile care.",
    },
    {
      question: "Does BeSmile provide dental implants?",
      answer:
        "Yes, BeSmile Dental Clinic provides dental implants in Baku with diagnostics, personalized treatment planning and a focus on functional and aesthetic results.",
    },
    {
      question: "Does BeSmile offer cosmetic dentistry?",
      answer:
        "Yes, BeSmile Dental Clinic offers cosmetic dentistry, including veneers, whitening, smile aesthetics and restoration of tooth shape and color.",
    },
    {
      question: "Where is BeSmile Dental Clinic in Baku and what are the opening hours?",
      answer:
        "BeSmile Dental Clinic is located at 24 Khan Shushinski St., Baku. The clinic is open Monday to Saturday from 09:00 to 19:00.",
    },
    {
      question: "How can I book an appointment at BeSmile?",
      answer:
        "You can book online on our website, by phone at +994 70 421 02 04 or via WhatsApp. Our team will find a convenient time and the right doctor for you.",
    },
  ],
  az: [
    {
      question: "BeSmile Dental Clinic Bakıda hansı stomatoloji xidmətləri göstərir?",
      answer:
        "BeSmile Dental Clinic Bakıda diaqnostika, diş müalicəsi, implantasiya, vinirlər, diş qapaqları, protezləşdirmə, ağartma, professional gigiyena, cərrahi stomatologiya və estetik stomatologiya xidmətləri təqdim edir.",
    },
    {
      question: "Bakıda diş həkimi konsultasiyasına yazılmaq mümkündür?",
      answer:
        "Bəli, BeSmile Dental Clinic-də diaqnostika, müalicə planı və fərdi stomatoloji həll üçün konsultasiyaya yazılmaq mümkündür.",
    },
    {
      question: "BeSmile-də diş implantasiyası edilir?",
      answer:
        "Bəli, BeSmile Dental Clinic Bakıda diş implantasiyası xidmətləri təqdim edir. Müalicə diaqnostika və fərdi plan əsasında aparılır.",
    },
    {
      question: "BeSmile estetik stomatologiya xidmətləri göstərir?",
      answer:
        "Bəli, BeSmile Dental Clinic vinirlər, diş ağartma, diş formasının və rənginin bərpası kimi estetik stomatologiya xidmətləri göstərir.",
    },
    {
      question: "BeSmile Dental Clinic Bakıda harada yerləşir və iş saatları necədir?",
      answer:
        "BeSmile Dental Clinic Bakıda, Xan Şuşinski küçəsi 24 ünvanında yerləşir. Klinika bazar ertəsindən şənbəyədək 09:00–19:00 saatlarında işləyir.",
    },
    {
      question: "BeSmile-də diş həkiminin qəbuluna necə yazılmaq olar?",
      answer:
        "Saytda onlayn, +994 70 421 02 04 nömrəsi ilə və ya WhatsApp vasitəsilə yazıla bilərsiniz. Komandamız sizin üçün uyğun vaxt və həkim seçəcək.",
    },
  ],
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return DEFAULT_LANG;
}

function getLocalizedHomePath(lang: Lang) {
  return `/${lang}`;
}

function getCanonical(lang: Lang) {
  return `${SITE_URL}${getLocalizedHomePath(lang)}`;
}

function getLocale(lang: Lang) {
  if (lang === "ru") return "ru_RU";
  if (lang === "az") return "az_AZ";
  return "en_US";
}

function getHomeName(lang: Lang) {
  if (lang === "ru") return "Главная";
  if (lang === "en") return "Home";
  return "Ana səhifə";
}

function getServicesLabel(lang: Lang) {
  if (lang === "ru") return "Стоматологические услуги";
  if (lang === "en") return "Dental services";
  return "Stomatoloji xidmətlər";
}

function getMedicalSpecialty(lang: Lang) {
  if (lang === "ru") return "Стоматология";
  if (lang === "az") return "Stomatologiya";
  return "Dentistry";
}

export async function generateMetadata(
  props: { params: Promise<{ lang: Lang }> | { lang: Lang } }
): Promise<Metadata> {
  const params = await props.params;
  const lang = normalizeLang(params?.lang);
  const seo = HOME_SEO[lang];
  const canonical = getCanonical(lang);

  return {
    metadataBase: new URL(SITE_URL),

    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,

    alternates: {
      canonical,
      languages: {
        az: `${SITE_URL}/az`,
        ru: `${SITE_URL}/ru`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/${DEFAULT_LANG}`,
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
              ? "Стоматология в Баку — BeSmile Dental Clinic"
              : lang === "az"
                ? "Bakıda stomatologiya — BeSmile Dental Clinic"
                : "Dentist in Baku — BeSmile Dental Clinic",
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

function buildHomeSchema(lang: Lang) {
  const seo = HOME_SEO[lang];
  const pageUrl = getCanonical(lang);
  const faq = HOME_FAQ[lang];

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
        ...buildDentistSchema(lang),
        medicalSpecialty: getMedicalSpecialty(lang),
        knowsAbout:
          lang === "ru"
            ? [
              "стоматология в Баку",
              "лечение зубов",
              "имплантация зубов",
              "виниры",
              "зубные коронки",
              "эстетическая стоматология",
              "цифровая диагностика",
            ]
            : lang === "az"
              ? [
                "Bakıda stomatologiya",
                "diş müalicəsi",
                "implantasiya",
                "vinirlər",
                "diş qapaqları",
                "estetik stomatologiya",
                "rəqəmsal diaqnostika",
              ]
              : [
                "dentistry in Baku",
                "dental treatment",
                "dental implants",
                "veneers",
                "dental crowns",
                "cosmetic dentistry",
                "digital diagnostics",
              ],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        headline: seo.h1 || seo.ogTitle,
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
            name: getHomeName(lang),
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#services-list`,
        name: getServicesLabel(lang),
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: 8,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "ru" ? "Диагностика зубов" : lang === "az" ? "Diş diaqnostikası" : "Dental diagnostics",
            url: `${SITE_URL}/${lang}/services/diagnostics`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: lang === "ru" ? "Лечение зубов" : lang === "az" ? "Diş müalicəsi" : "Dental treatment",
            url: `${SITE_URL}/${lang}/services/dental-treatment`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: lang === "ru" ? "Имплантация зубов" : lang === "az" ? "Diş implantasiyası" : "Dental implants",
            url: `${SITE_URL}/${lang}/services/Dental-implants`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: lang === "ru" ? "Виниры" : lang === "az" ? "Vinirlər" : "Veneers",
            url: `${SITE_URL}/${lang}/services/veneers`,
          },
          {
            "@type": "ListItem",
            position: 5,
            name: lang === "ru" ? "Зубные коронки" : lang === "az" ? "Diş qapaqları" : "Dental crowns",
            url: `${SITE_URL}/${lang}/services/dental-crowns`,
          },
          {
            "@type": "ListItem",
            position: 6,
            name: lang === "ru" ? "Отбеливание зубов" : lang === "az" ? "Diş ağartma" : "Teeth whitening",
            url: `${SITE_URL}/${lang}/services/teeth-whitening`,
          },
          {
            "@type": "ListItem",
            position: 7,
            name: lang === "ru" ? "Профессиональная гигиена" : lang === "az" ? "Ağız gigiyenası" : "Oral hygiene",
            url: `${SITE_URL}/${lang}/services/oral-hygiene`,
          },
          {
            "@type": "ListItem",
            position: 8,
            name: lang === "ru" ? "Ортодонтия" : lang === "az" ? "Ortodontiya" : "Orthodontics",
            url: `${SITE_URL}/${lang}/services/orthodontics`,
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

async function HomeMarquee({ lang }: { lang: Lang }) {
  const groups = await getNavServiceGroups(lang);
  return <ServicesMarquee lang={lang} groups={groups} />;
}

async function HomeCases({ lang }: { lang: Lang }) {
  const cases = await getCases(lang);
  return <CasesPremium lang={lang} cases={cases as React.ComponentProps<typeof CasesPremium>["cases"]} />;
}

async function HomeBlog({ lang }: { lang: Lang }) {
  const posts = await getBlogPosts(lang);
  return <BlogCarouselPremium lang={lang} posts={posts} />;
}

function SectionSkeleton() {
  return <div aria-hidden="true" className="min-h-[620px]" />;
}

export default async function HomePage(props: PageProps) {
  const params = await props.params;
  const lang: Lang = normalizeLang(params?.lang);

  const schema = buildHomeSchema(lang);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="relative overflow-clip bg-[#f8f6f1]">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.188),transparent)] scale-[1.6]" />
          {/* A fixed offset keeps this light stable while streamed sections arrive. */}
          <div className="absolute right-[-8%] top-[1200px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.112),transparent)] scale-[1.6]" />
          <div className="absolute bottom-[8%] left-[18%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent_26%,rgba(255,255,255,0.4))]" />

          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
        </div>

        <div className="relative z-10">
          <Hero lang={lang} />
          <Suspense fallback={<div aria-hidden="true" className="h-20" />}>
            <HomeMarquee lang={lang} />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}><WhyUs lang={lang} /></Suspense>
          <Suspense fallback={<SectionSkeleton />}><Doctors lang={lang} /></Suspense>
          <Suspense fallback={<SectionSkeleton />}><HomeCases lang={lang} /></Suspense>
          <Suspense fallback={<SectionSkeleton />}><HomeBlog lang={lang} /></Suspense>
          <ServicesSection lang={lang} />
          <HomeFaq lang={lang} items={HOME_FAQ[lang]} />
        </div>
      </div>
    </>
  );
}
