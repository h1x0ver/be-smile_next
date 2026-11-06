import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts, Lang } from "@/lib/directus";
import BlogSlugPageClient from "./blog-slug-page.client";

const SITE_URL = "https://besmile.az";
const DIRECTUS_URL = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az").replace(/\/$/, "");

function pickTranslation(translations: any[] | undefined, lang: Lang) {
  if (!Array.isArray(translations) || translations.length === 0) return null;

  return (
    translations.find((x) => x.language === lang) ||
    translations.find((x) => x.language === "ru") ||
    translations.find((x) => x.language === "en") ||
    translations[0]
  );
}

function stripHtml(value: string | null | undefined) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getAssetUrl(fileId: string | null | undefined) {
  if (!fileId || !DIRECTUS_URL) return undefined;

  return `${DIRECTUS_URL}/assets/${fileId}?width=1600&quality=92&format=webp`;
}

function getLocale(lang: Lang) {
  if (lang === "az") return "az_AZ";
  if (lang === "en") return "en_US";
  return "ru_RU";
}

// Prerender every article at build time, new ones are generated on first visit and cached
export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  const lang = (["az", "ru", "en"].includes(params.lang) ? params.lang : "az") as Lang;
  const posts = await getBlogPosts(lang);

  return posts.filter((post) => post.slug).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params:
    | { lang: Lang; slug: string }
    | Promise<{ lang: Lang; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;

  const post = await getBlogPostBySlug(slug, lang);

  if (!post) {
    return {
      title: "Статья не найдена — BeSmile",
      robots: { index: false, follow: false },
    };
  }

  const t = pickTranslation(post.translations as any, lang);

  if (!t) {
    return {
      title: "Статья не найдена — BeSmile",
      robots: { index: false, follow: false },
    };
  }

  const title = t.seo_title || t.title || "BeSmile Blog";
  const description =
    t.seo_description ||
    t.excerpt ||
    stripHtml(t.content).slice(0, 155);

  const url = `${SITE_URL}/${lang}/blog/${slug}`;
  const image = getAssetUrl(post.cover_image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${SITE_URL}/ru/blog/${slug}`,
        az: `${SITE_URL}/az/blog/${slug}`,
        en: `${SITE_URL}/en/blog/${slug}`,
        "x-default": `${SITE_URL}/ru/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "BeSmile",
      type: "article",
      locale: getLocale(lang),
      publishedTime: post.published_at ?? undefined,
      images: image
        ? [
            {
              url: image,
              width: 1600,
              height: 900,
              alt: t.title || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
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

export default async function BlogSlugPage(
  props: {
    params:
      | { lang: Lang; slug: string }
      | Promise<{ lang: Lang; slug: string }>;
  }
) {
  const { lang, slug } = await props.params;

  const post = await getBlogPostBySlug(slug, lang);

  if (!post) return notFound();

  const t = pickTranslation(post.translations as any, lang) as any;

  if (!t) return notFound();

  const normalizedPost = {
    id: post.id,
    slug: post.slug,
    cover_image: post.cover_image ?? null,
    published_at: post.published_at ?? null,
    reading_time: post.reading_time ?? null,
    is_featured: post.is_featured,
    is_secondary_featured: post.is_secondary_featured,
    title: t.title ?? "",
    excerpt: t.excerpt ?? "",
    content: t.content ?? "",
    seo_title: t.seo_title ?? "",
    seo_description: t.seo_description ?? "",
  };

  return <BlogSlugPageClient post={normalizedPost} lang={lang} />;
}