"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/directus";
import { BlogSkeletonGrid } from "../../../components/BlogSkeleton";

type BlogPost = {
  id: number;
  slug: string;
  cover_image: string | null;
  published_at: string | null;
  reading_time: number | null;
  sort: number | null;
  is_featured: boolean;
  is_secondary_featured: boolean;
  is_active: boolean;
  title: string;
  excerpt: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

type BlogPageClientProps = {
  posts: BlogPost[];
  lang: Lang;
};

const copy = {
  ru: {
    eyebrow: "BEAUTY / EXPERTISE / CLINICAL EDITORIAL",
    title: "БЛОГ",
    intro:
      "Точный, эстетичный и содержательный контент о стоматологии, улыбке и современных протоколах лечения — в подаче, которая ощущается как часть премиального бренда BeSmile.",
    featured: "FEATURED ARTICLE",
    selected: "SELECTED READING",
    latest: "ALL ARTICLES",
    readMore: "Читать статью",
    minRead: "мин чтения",
    empty: "Скоро здесь появятся статьи.",
    loadMore: "Показать ещё",
  },
  en: {
    eyebrow: "BEAUTY / EXPERTISE / CLINICAL EDITORIAL",
    title: "BLOG",
    intro:
      "Thoughtful, refined editorial content about dentistry, smile design, and modern treatment protocols — presented as an extension of the BeSmile premium brand.",
    featured: "FEATURED ARTICLE",
    selected: "SELECTED READING",
    latest: "ALL ARTICLES",
    readMore: "Read article",
    minRead: "min read",
    empty: "Articles will appear here soon.",
    loadMore: "Load more",
  },
  az: {
    eyebrow: "BEAUTY / EXPERTISE / CLINICAL EDITORIAL",
    title: "BLOG",
    intro:
      "Stomatologiya, gülüş estetikası və müasir müalicə protokolları haqqında dəqiq, zərif və premium səviyyəli redaksiya kontenti — BeSmile brendinin davamı kimi.",
    featured: "FEATURED ARTICLE",
    selected: "SELECTED READING",
    latest: "ALL ARTICLES",
    readMore: "Məqaləni oxu",
    minRead: "dəq oxu",
    empty: "Məqalələr tezliklə burada görünəcək.",
    loadMore: "Daha çox göstər",
  },
} as const;

function getAssetUrl(fileId: string | null, width = 1000, quality = 75) {
  if (!fileId) return null;

  const base = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az").replace(/\/$/, "");
  if (!base) return null;

  return `${base}/assets/${fileId}?width=${width}&quality=${quality}&format=webp`;
}

function formatDate(value: string | null, lang: Lang) {
  if (!value) return null;

  const localeMap: Record<Lang, string> = {
    ru: "ru-RU",
    en: "en-US",
    az: "az-Latn-AZ",
  };

  try {
    return new Intl.DateTimeFormat(localeMap[lang], {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function splitPosts(posts: BlogPost[]) {
  const featured = posts.find((post) => post.is_featured) ?? posts[0] ?? null;

  const secondary = posts.filter(
    (post) => post.id !== featured?.id && post.is_secondary_featured
  );

  const rest = posts.filter(
    (post) => post.id !== featured?.id && !secondary.some((x) => x.id === post.id)
  );

  return { featured, secondary, rest };
}

function Glow({ backgroundImage, className = "" }: { backgroundImage: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ backgroundImage }}
    />
  );
}

function PostMeta({
  date,
  readingTime,
  lang,
}: {
  date: string | null;
  readingTime: number | null;
  lang: Lang;
}) {
  const t = copy[lang];

  if (!date && !readingTime) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-black/45">
      {date ? <span>{date}</span> : null}
      {date && readingTime ? <span className="h-[3px] w-[3px] rounded-full bg-black/25" /> : null}
      {readingTime ? (
        <span>
          {readingTime} {t.minRead}
        </span>
      ) : null}
    </div>
  );
}

function ArticleImage({
  title,
  image,
  priority = false,
  className,
}: {
  title: string;
  image: string | null;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[30px] border border-white/60 bg-white/50",
        "shadow-[0_20px_80px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,199,162,0.26),rgba(255,255,255,0.78),rgba(201,174,123,0.18))]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.20),transparent_45%)]" />
    </div>
  );
}

function FeaturedPost({ post, lang }: { post: BlogPost; lang: Lang }) {
  const t = copy[lang];
  const image = getAssetUrl(post.cover_image, 1400, 78);
  const date = formatDate(post.published_at, lang);

  return (
    <article className="group">
      <Link href={`/${lang}/blog/${post.slug}`} className="block">
        <div
          className={cn(
            "relative overflow-hidden rounded-[34px] border border-white/70 bg-white/58 backdrop-blur-2xl",
            "shadow-[0_30px_100px_rgba(0,0,0,0.08)]"
          )}
        >
          <Glow
            className="-left-16 top-8 h-40 w-40"
            backgroundImage="radial-gradient(circle, rgba(217,199,162,0.4), transparent 70%)"
          />
          <Glow
            className="-right-10 bottom-0 h-48 w-48"
            backgroundImage="radial-gradient(circle, rgba(237,227,208,0.7), transparent 70%)"
          />

          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-0">
            <div className="relative min-h-[340px] p-3 sm:min-h-[440px] lg:min-h-[620px]">
              <ArticleImage
                title={post.title}
                image={image}
                priority
                className="h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[596px]"
              />
            </div>

            <div className="relative flex flex-col justify-between px-6 pb-7 pt-2 sm:px-9 sm:pb-9 sm:pt-3 lg:px-12 lg:pb-12 lg:pt-10">
              <div className="space-y-7">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-black/60">
                    {t.featured}
                  </div>

                  <PostMeta date={date} readingTime={post.reading_time} lang={lang} />
                </div>

                <div className="h-px w-full bg-black/10" />

                <div className="space-y-5">
                  <h2 className="max-w-[720px] text-balance text-[32px] font-light leading-[1.02] tracking-[-0.04em] text-[#111111] sm:text-[48px] lg:text-[68px]">
                    {post.title}
                  </h2>

                  {post.excerpt ? (
                    <p className="max-w-[620px] text-[15px] leading-7 text-black/66 sm:text-[17px] sm:leading-8">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-black/70 transition-transform duration-500 group-hover:translate-x-1">
                  <span>{t.readMore}</span>
                  <span className="block h-px w-10 bg-black/40 transition-all duration-500 group-hover:w-14" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function SecondaryPostCard({ post, lang, index }: { post: BlogPost; lang: Lang; index: number }) {
  const t = copy[lang];
  const image = getAssetUrl(post.cover_image, 900, 76);
  const date = formatDate(post.published_at, lang);

  return (
    <article className="group h-full">
      <Link href={`/${lang}/blog/${post.slug}`} className="block h-full">
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/65 bg-white/60 p-3 backdrop-blur-xl",
            "shadow-[0_20px_80px_rgba(0,0,0,0.08)] transition-all duration-500",
            "group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_100px_rgba(0,0,0,0.10)]"
          )}
        >
          <Glow
            className="right-0 top-0 h-32 w-32"
            backgroundImage="radial-gradient(circle, rgba(215,189,146,0.28), transparent 70%)"
          />

          <ArticleImage title={post.title} image={image} className="relative h-[260px] w-full" />

          <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-black/58">
                {t.selected}
              </div>

              <PostMeta date={date} readingTime={post.reading_time} lang={lang} />

              <h3 className="max-w-[560px] text-balance text-[24px] font-light leading-[1.08] tracking-[-0.035em] text-[#111111] sm:text-[30px]">
                {post.title}
              </h3>

              {post.excerpt ? (
                <p className="max-w-[520px] text-[14px] leading-7 text-black/66 sm:text-[15px]">
                  {post.excerpt}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-black/68">
              <span>{t.readMore}</span>
              <span className="h-px w-9 bg-black/35 transition-all duration-500 group-hover:w-12" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PostGridCard({ post, lang, index }: { post: BlogPost; lang: Lang; index: number }) {
  const t = copy[lang];
  const image = getAssetUrl(post.cover_image, 700, 74);
  const date = formatDate(post.published_at, lang);

  return (
   <article className="group h-full">
      <Link href={`/${lang}/blog/${post.slug}`} className="block h-full">
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/58 p-3 backdrop-blur-xl",
            "shadow-[0_18px_70px_rgba(0,0,0,0.07)] transition-all duration-500",
            "group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_90px_rgba(0,0,0,0.09)]"
          )}
        >
          <ArticleImage title={post.title} image={image} className="relative h-[220px] w-full" />

          <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
            <div className="space-y-3">
              <PostMeta date={date} readingTime={post.reading_time} lang={lang} />

              <h3 className="text-balance text-[22px] font-light leading-[1.12] tracking-[-0.03em] text-[#111111]">
                {post.title}
              </h3>

              {post.excerpt ? (
                <p className="text-[14px] leading-7 text-black/64">{post.excerpt}</p>
              ) : null}
            </div>

            <div className="mt-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-black/66">
              <span>{t.readMore}</span>
              <span className="h-px w-8 bg-black/35 transition-all duration-500 group-hover:w-11" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}



function PostGrid({ posts, lang }: { posts: BlogPost[]; lang: Lang }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post, index) => (
        <PostGridCard
          key={post.id}
          post={post}
          lang={lang}
          index={index}
        />
      ))}
    </div>
  );
}

export default function BlogPageClient({ posts, lang }: BlogPageClientProps) {
  const t = copy[lang];
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading - in real app, posts would come from async source
  useEffect(() => {
    if (posts && posts.length > 0) {
      // Simulate min loading time for smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [posts]);

  const activePosts = useMemo(() => posts.filter((post) => post.is_active), [posts]);
  const { featured, secondary, rest } = useMemo(() => splitPosts(activePosts), [activePosts]);

  return (
    <div className="relative overflow-hidden bg-[#f8f6f1] text-[#111111]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,227,208,0.95),transparent_28%),radial-gradient(circle_at_top_right,rgba(201,174,123,0.18),transparent_24%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.92),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.52),rgba(255,255,255,0.16))]" />

      <Glow
        className="-left-16 top-[-20px] h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]"
        backgroundImage="radial-gradient(circle, rgba(217,199,162,0.5), transparent 70%)"
      />
      <Glow
        className="right-[-40px] top-[80px] h-[280px] w-[280px] sm:h-[360px] sm:w-[360px]"
        backgroundImage="radial-gradient(circle, rgba(201,174,123,0.32), transparent 70%)"
      />
      <Glow
        className="bottom-[-80px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 sm:h-[420px] sm:w-[420px]"
        backgroundImage="radial-gradient(circle, rgba(255,255,255,0.85), transparent 70%)"
      />

      <section className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-10">
        <motion.div
          className="mx-auto flex max-w-[1120px] flex-col items-center text-center"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            <span className="text-[18px] font-light tracking-[0.26em] text-black/42 sm:text-[28px] lg:text-[34px]">
              [
            </span>
            <h1 className="text-balance text-[44px] font-light leading-[0.95] tracking-[0.18em] text-[#111111] sm:text-[68px] lg:text-[96px]">
              {t.title}
            </h1>
            <span className="text-[18px] font-light tracking-[0.26em] text-black/42 sm:text-[28px] lg:text-[34px]">
              ]
            </span>
          </div>

          <p className="mt-7 max-w-[820px] text-balance text-[15px] leading-8 text-black/66 sm:text-[18px] sm:leading-9">
            {t.intro}
          </p>
        </motion.div>
      </section>

      {/* Show skeleton while loading */}
      {isLoading && posts.length > 0 ? (
        <BlogSkeletonGrid />
      ) : (
        <>
          {/* Featured section */}
          <section className="relative mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-10">
            {featured ? (
              <FeaturedPost post={featured} lang={lang} />
            ) : (
              <div className="rounded-[34px] border border-white/70 bg-white/55 px-8 py-16 text-center backdrop-blur-xl shadow-[0_24px_90px_rgba(0,0,0,0.07)]">
                <p className="text-[16px] text-black/60">{t.empty}</p>
              </div>
            )}
          </section>

          {/* Secondary section */}
          {secondary.length > 0 ? (
            <section className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-10 sm:px-6 lg:px-10 lg:pt-16">
              <div className="mb-8 flex items-center gap-4 sm:mb-10">
                <span className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                  {t.selected}
                </span>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {secondary.map((post, index) => (
                  <SecondaryPostCard key={post.id} post={post} lang={lang} index={index} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Grid section */}
          {rest.length > 0 ? (
            <section className="relative mx-auto max-w-[1600px] px-4 pb-24 pt-10 sm:px-6 lg:px-10 lg:pb-32 lg:pt-18">
              <div className="mb-8 flex items-center gap-4 sm:mb-10">
                <span className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                  {t.latest}
                </span>
                <div className="h-px flex-1 bg-black/10" />
              </div>

              <PostGrid posts={rest} lang={lang} />
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
