import type { Metadata } from "next";
import ContactClient from "./contact.client";
import {
  buildDentistSchema,
  buildPageMetadata,
  JsonLd,
  normalizeLang,
  SITE_URL,
  type Lang,
} from "@/lib/seo";

const SEO: Record<Lang, { title: string; description: string; home: string; page: string }> = {
  ru: {
    title: "Контакты стоматологии BeSmile в Баку — адрес, телефон, часы работы",
    description:
      "Стоматология BeSmile Dental Clinic в Баку: ул. Хана Шушинского 24. Телефон и WhatsApp +994 70 421 02 04. Пн–Сб 09:00–19:00. Запишитесь на консультацию стоматолога.",
    home: "Главная",
    page: "Контакты",
  },
  en: {
    title: "Contact BeSmile Dental Clinic in Baku — Address, Phone, Hours",
    description:
      "BeSmile Dental Clinic in Baku: 24 Khan Shushinski St. Phone & WhatsApp +994 70 421 02 04. Mon–Sat 09:00–19:00. Book a dentist consultation.",
    home: "Home",
    page: "Contact",
  },
  az: {
    title: "BeSmile Dental Clinic əlaqə — Bakıda stomatologiya ünvanı və telefonu",
    description:
      "BeSmile Dental Clinic Bakıda: Xan Şuşinski küç. 24. Telefon və WhatsApp +994 70 421 02 04. B.e.–Ş. 09:00–19:00. Diş həkimi konsultasiyasına yazılın.",
    home: "Ana səhifə",
    page: "Əlaqə",
  },
};

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = normalizeLang(lang);

  return buildPageMetadata({
    lang: safeLang,
    path: "contact",
    title: SEO[safeLang].title,
    description: SEO[safeLang].description,
  });
}

export default async function ContactPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const safeLang = normalizeLang(lang);
  const pageUrl = `${SITE_URL}/${safeLang}/contact`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      buildDentistSchema(safeLang),
      {
        "@type": "ContactPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: SEO[safeLang].title,
        description: SEO[safeLang].description,
        inLanguage: safeLang,
        about: { "@id": `${SITE_URL}#dentist` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SEO[safeLang].home, item: `${SITE_URL}/${safeLang}` },
          { "@type": "ListItem", position: 2, name: SEO[safeLang].page, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <ContactClient lang={safeLang} />
    </>
  );
}
