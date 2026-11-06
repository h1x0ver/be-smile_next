import type { Metadata } from "next";
import CinematicReviewsVaultUltimate from "@/components/CinematicReviewsVaultUltimate";
import { getReviews } from "@/lib/directus";
import { buildPageMetadata, normalizeLang, type Lang } from "@/lib/seo";

const SEO: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: "Отзывы пациентов о стоматологии BeSmile в Баку",
    description:
      "Реальные отзывы пациентов BeSmile Dental Clinic в Баку о лечении зубов, имплантации, винирах и эстетической стоматологии.",
  },
  en: {
    title: "Patient Reviews of BeSmile Dental Clinic in Baku",
    description:
      "Real patient reviews of BeSmile Dental Clinic in Baku about dental treatment, implants, veneers and cosmetic dentistry.",
  },
  az: {
    title: "BeSmile Dental Clinic haqqında pasiyent rəyləri — Bakı",
    description:
      "BeSmile Dental Clinic pasiyentlərinin diş müalicəsi, implantasiya, vinirlər və estetik stomatologiya haqqında real rəyləri.",
  },
};

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = normalizeLang(lang);

  return buildPageMetadata({
    lang: safeLang,
    path: "reviews",
    ...SEO[safeLang],
  });
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <CinematicReviewsVaultUltimate reviews={reviews as any} />
    </div>
  );
}
