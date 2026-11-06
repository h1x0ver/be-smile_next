import type { Metadata } from "next";
import type { Lang } from "@/lib/directus";
import { buildPageMetadata, normalizeLang } from "@/lib/seo";
import ActivityFeedPageClient from "./ActivityFeedPage.client";

const SEO: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: "Жизнь клиники BeSmile — новости и работы стоматологии в Баку",
    description:
      "Новости, видео и работы стоматологии BeSmile Dental Clinic в Баку: эстетика улыбки, имплантация, виниры и команда клиники.",
  },
  en: {
    title: "BeSmile Clinic Life — News and Work of Our Dentists in Baku",
    description:
      "News, videos and work by BeSmile Dental Clinic in Baku: smile aesthetics, implants, veneers and our team.",
  },
  az: {
    title: "BeSmile klinikasının həyatı — Bakıda stomatologiya xəbərləri",
    description:
      "BeSmile Dental Clinic-in xəbərləri, videoları və işləri: estetik təbəssüm, implantasiya, vinirlər və komandamız.",
  },
};

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = normalizeLang(lang);

  return buildPageMetadata({ lang: safeLang, path: "activity", ...SEO[safeLang] });
}

export default async function ActivityFeedPage(
  props: { params: Promise<{ lang: string }> }
) {
  const { lang } = await props.params;

  return <ActivityFeedPageClient lang={normalizeLang(lang)} />;
}
