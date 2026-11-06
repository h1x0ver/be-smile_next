import type { Metadata } from "next";
import { getBlogPosts, Lang } from "@/lib/directus";
import BlogPageClient from "./blog-page.client";

const SITE_URL = "https://besmile.az";

const metaByLang: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: "Блог BeSmile — стоматология, ортодонтия и уход за зубами в Баку",
    description:
      "Экспертные статьи BeSmile о стоматологии в Баку, ортодонтии, брекетах, Invisalign, чистке зубов, имплантации и выборе стоматолога.",
  },
  az: {
    title: "BeSmile Blog — Bakıda stomatologiya, ortodontiya və diş baxımı",
    description:
      "BeSmile-dan Bakıda stomatologiya, stomatoloji klinika seçimi, ortodontiya, breketlər, Invisalign, diş təmizliyi və implantasiya haqqında məqalələr.",
  },
  en: {
    title: "BeSmile Blog — Dentistry, Orthodontics and Dental Care in Baku",
    description:
      "Expert articles from BeSmile about dental care in Baku, orthodontics, braces, Invisalign, teeth cleaning, implants and choosing a dentist.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { lang: Lang } | Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = metaByLang[lang] ?? metaByLang.ru;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog`,
      languages: {
        ru: `${SITE_URL}/ru/blog`,
        az: `${SITE_URL}/az/blog`,
        en: `${SITE_URL}/en/blog`,
        "x-default": `${SITE_URL}/ru/blog`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${lang}/blog`,
      siteName: "BeSmile",
      type: "website",
      locale:
        lang === "ru" ? "ru_RU" : lang === "az" ? "az_AZ" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
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
  };
}

export default async function BlogPage(
  props: { params: { lang: Lang } | Promise<{ lang: Lang }> }
) {
  const { lang } = await props.params;

  const posts = await getBlogPosts(lang);

  return <BlogPageClient posts={posts as any} lang={lang} />;
}