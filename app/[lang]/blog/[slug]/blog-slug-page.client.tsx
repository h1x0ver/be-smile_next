"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Lang } from "@/lib/directus";

type BlogPostView = {
  id: number;
  slug: string;
  cover_image: string | null;
  published_at: string | null;
  reading_time: number | null;
  is_featured: boolean;
  is_secondary_featured: boolean;
  title: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
};

type Props = {
  post: BlogPostView;
  lang: Lang;
  bookingHref?: string;
  phone?: string;
};

const copy = {
  ru: {
    back: "Назад к журналу",
    journal: "BESMILE JOURNAL",
    minRead: "мин чтения",
    allArticles: "Все статьи",
    bookEyebrow: "Консультация",
    bookTitle: "Запишитесь на консультацию",
    bookFree: "Первичная консультация — бесплатно",
    bookSubtitle:
      "Врач разберёт именно ваш случай и предложит план лечения — без давления и лишних процедур.",
    bookCta: "Записаться на консультацию",
    bookCallCta: "Позвонить клинике",
    bookNote: "Ответим в течение рабочего дня",
    bookFeatures: [
      "Первичный осмотр и план лечения",
      "Панорамный снимок при необходимости",
      "Прозрачная стоимость до начала",
    ],
  },
  en: {
    back: "Back to journal",
    journal: "BESMILE JOURNAL",
    minRead: "min read",
    allArticles: "All articles",
    bookEyebrow: "Consultation",
    bookTitle: "Book a consultation",
    bookFree: "First consultation is free",
    bookSubtitle:
      "A dentist reviews your case and proposes a treatment plan — no pressure, no unnecessary procedures.",
    bookCta: "Book a consultation",
    bookCallCta: "Call the clinic",
    bookNote: "We reply within the same business day",
    bookFeatures: [
      "Initial exam and treatment plan",
      "Panoramic scan if needed",
      "Clear pricing before we start",
    ],
  },
  az: {
    back: "Jurnala qayıt",
    journal: "BESMILE JOURNAL",
    minRead: "dəq oxu",
    allArticles: "Bütün məqalələr",
    bookEyebrow: "Konsultasiya",
    bookTitle: "Konsultasiyaya yazılın",
    bookFree: "İlkin konsultasiya pulsuzdur",
    bookSubtitle:
      "Həkim sizin vəziyyətinizi araşdırır və müalicə planı təklif edir — təzyiq və lazımsız prosedur olmadan.",
    bookCta: "Konsultasiyaya yazıl",
    bookCallCta: "Klinikaya zəng et",
    bookNote: "İş günü ərzində cavab veririk",
    bookFeatures: [
      "İlkin baxış və müalicə planı",
      "Lazım olduqda panoramik şəkil",
      "Başlamazdan əvvəl aydın qiymət",
    ],
  },
} as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getAssetUrl(fileId: string | null) {
  if (!fileId) return null;

  const base = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az").replace(/\/$/, "");
  if (!base) return null;

  return `${base}/assets/${fileId}?width=1800&quality=96&format=webp`;
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

function normalizeRichTextHtml(html: string) {
  if (!html) return "";

  return html
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/<div>(\s|&nbsp;|<br\s*\/?>)*<\/div>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
}

function ArticleMeta({
  lang,
  publishedAt,
  readingTime,
}: {
  lang: Lang;
  publishedAt: string | null;
  readingTime: number | null;
}) {
  const t = copy[lang];
  const date = formatDate(publishedAt, lang);

  if (!date && !readingTime) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-[11px]">
      {date ? <span>{date}</span> : null}
      {date && readingTime ? (
        <span className="h-[3px] w-[3px] rounded-full bg-black/20" />
      ) : null}
      {readingTime ? (
        <span>
          {readingTime} {t.minRead}
        </span>
      ) : null}
    </div>
  );
}

function BookingCard({
  lang,
  bookingHref,
  phone,
  variant = "sidebar",
}: {
  lang: Lang;
  bookingHref: string;
  phone?: string;
  variant?: "sidebar" | "inline";
}) {
  const t = copy[lang];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[30px] border border-white/70 bg-white/68 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.07)] backdrop-blur-2xl sm:p-8",
        variant === "inline" && "p-6 sm:p-7"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,174,123,0.16),transparent_45%)]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#d9c7a2]/26 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/76 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-black/54 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
            {t.bookEyebrow}
          </div>
        </div>

        <svg
          viewBox="0 0 120 40"
          className="mt-6 h-8 w-20 text-[#b08b57]"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6C22 34 98 34 116 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <h3 className="mt-4 text-balance text-[22px] font-[300] leading-[1.14] tracking-[-0.03em] text-[#111111] sm:text-[24px]">
          {t.bookTitle}
        </h3>

        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#b08b57]/12 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8a6a3f]">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.4 7.4a1 1 0 0 1-1.4 0L3.3 9.5a1 1 0 1 1 1.4-1.4l3.6 3.6 6.7-6.7a1 1 0 0 1 1.4 0Z" />
          </svg>
          {t.bookFree}
        </div>

        <p className="mt-3 text-[14px] leading-6 text-black/60">{t.bookSubtitle}</p>

        <ul className="mt-6 space-y-2.5">
          {t.bookFeatures.map((feature) => (
            <li
              key={feature}
              className="relative pl-5 text-[13px] leading-5 text-black/62"
            >
              <span className="absolute left-0 top-[0.5em] h-1 w-1 rounded-full bg-[#b08b57]" />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href={bookingHref}
          className={cn(
            "mt-7 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-center",
            " border-[2px] text-[12px] uppercase tracking-[0.2em] text-white transition-all duration-300",
            "hover:-translate-y-0.5 hover:bg-[#b08b57] hover:shadow-[0_18px_50px_rgba(176,139,87,0.35)]"
          )}
        >
          {t.bookCta}
        </Link>

      {phone ? (
          <a
            href={`tel:${phone.replace(/[^+\d]/g, "")}`}
            className={cn(
              "mt-3 flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3",
              "text-[11px] uppercase tracking-[0.2em] text-black/64 backdrop-blur-xl transition-all duration-300",
              "hover:-translate-y-0.5 hover:bg-white/90"
            )}
          >
            {t.bookCallCta}
          </a>
        ) : null}

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.16em] text-black/38">
          {t.bookNote}
        </p>
      </div>
    </div>
  );
}

export default function BlogSlugPageClient({
  post,
  lang,
  bookingHref = `/${lang}/book-online`,
  phone,
}: Props) {
  const t = copy[lang];
  const image = getAssetUrl(post.cover_image);

  const html = useMemo(() => normalizeRichTextHtml(post.content || ""), [post.content]);
  const articleJsonLd = useMemo(() => {
    const siteUrl = "https://besmile.az";
    const directusUrl = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az").replace(/\/$/, "");
    const imageUrl =
      post.cover_image && directusUrl
        ? `${directusUrl}/assets/${post.cover_image}?width=1600&quality=92&format=webp`
        : undefined;

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.seo_description || post.excerpt,
      image: imageUrl ? [imageUrl] : undefined,
      datePublished: post.published_at || undefined,
      dateModified: post.published_at || undefined,
      author: {
        "@type": "Organization",
        name: "BeSmile",
        url: siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "BeSmile",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}/${lang}/blog/${post.slug}`,
      },
      inLanguage: lang,
    };
  }, [post, lang]);

  return (
    <div className="relative overflow-x-clip bg-[#f8f6f1] text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,227,208,0.95),transparent_28%),radial-gradient(circle_at_top_right,rgba(201,174,123,0.14),transparent_24%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.92),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.56),rgba(255,255,255,0.2))]" />

      <div className="pointer-events-none absolute -left-20 top-[-30px] h-[300px] w-[300px] rounded-full bg-[#d9c7a2]/24 blur-3xl sm:h-[380px] sm:w-[380px]" />
      <div className="pointer-events-none absolute right-[-50px] top-[90px] h-[280px] w-[280px] rounded-full bg-[#c9ae7b]/14 blur-3xl sm:h-[360px] sm:w-[360px]" />
      <div className="pointer-events-none absolute bottom-[-110px] left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-white/80 blur-3xl sm:h-[440px] sm:w-[440px]" />

      <section className="relative mx-auto max-w-[1520px] px-4 pb-8 pt-24 sm:px-6 lg:px-10 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-4"
        >
          <Link
            href={`/${lang}/blog`}
            className={cn(
              "inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/62 px-4 py-2.5",
              "text-[10px] uppercase tracking-[0.24em] text-black/62 backdrop-blur-xl transition-all duration-300",
              "hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
            )}
          >
            <span className="text-black/55">←</span>
            <span>{t.back}</span>
          </Link>

          <div className="hidden rounded-full border border-white/70 bg-white/56 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-black/50 backdrop-blur-xl md:inline-flex">
            {t.journal}
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-[1520px] px-4 pb-10 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/58 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.84),transparent_36%)]" />
          <div className="pointer-events-none absolute -left-12 top-8 h-44 w-44 rounded-full bg-[#d9c7a2]/24 blur-3xl" />
          <div className="pointer-events-none absolute -right-8 bottom-0 h-52 w-52 rounded-full bg-[#ede3d0]/48 blur-3xl" />

          <div className="grid items-center gap-0 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="relative p-3 sm:p-4">
              <div className="group relative overflow-hidden rounded-[30px] border border-white/60 bg-white/40 aspect-[4/4.25] sm:aspect-[4/4.35] xl:aspect-auto xl:min-h-[660px]">
                {image ? (
                  <Image
                    src={image}
                    alt={post.title}
                    fill
                    priority
                    quality={96}
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 1280px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,199,162,0.18),rgba(255,255,255,0.92),rgba(201,174,123,0.10))]" />
                )}
              </div>
            </div>

            <div className="flex items-center px-6 pb-8 pt-4 sm:px-10 sm:pb-10 xl:px-14 xl:pb-14 xl:pt-14">
              <div className="mx-auto w-full max-w-[560px]">
                <div className="inline-flex items-center rounded-full border border-black/10 bg-white/72 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-black/56 backdrop-blur-xl">
                  {t.journal}
                </div>

                <div className="mt-5">
                  <ArticleMeta
                    lang={lang}
                    publishedAt={post.published_at}
                    readingTime={post.reading_time}
                  />
                </div>

                <div className="mt-7 h-px w-full bg-gradient-to-r from-black/10 via-black/7 to-transparent" />

                <h1 className="mt-7 max-w-[520px] text-balance text-[24px] font-[300] leading-[1.04] tracking-[-0.04em] text-[#111111] sm:text-[30px] lg:text-[38px] xl:text-[44px]">
                  {post.title}
                </h1>

                {post.excerpt ? (
                  <p className="mt-4 max-w-[500px] text-balance text-[13px] leading-6 text-black/60 sm:text-[14px] sm:leading-7">
                    {post.excerpt}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-black/48 backdrop-blur-xl">
                    Premium Editorial
                  </div>
                  <div className="rounded-full border border-white/70 bg-white/66 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-black/44 backdrop-blur-xl">
                    BeSmile Journal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto max-w-[1320px] px-4 pb-24 pt-6 sm:px-6 lg:pb-32 lg:px-10">
        <div className="mx-auto grid w-full max-w-[720px] grid-cols-1 gap-8 sm:max-w-[920px] xl:mx-0 xl:max-w-none xl:grid-cols-[minmax(0,920px)_320px] xl:items-start xl:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/64 px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.06)] backdrop-blur-2xl sm:px-10 sm:py-10 lg:px-14 lg:py-14 xl:mx-0"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_32%)]" />

            <article
              className={cn(
                "relative max-w-none text-black/78",
                "[&_h1]:mt-0 [&_h1]:text-[30px] [&_h1]:font-[300] [&_h1]:leading-[1.04] [&_h1]:tracking-[-0.045em] sm:[&_h1]:text-[40px]",
                "[&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:text-[24px] [&_h2]:font-[300] [&_h2]:leading-[1.08] [&_h2]:tracking-[-0.04em] [&_h2]:text-[#111111] sm:[&_h2]:text-[30px] lg:[&_h2]:text-[34px]",
                "[&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[20px] [&_h3]:font-[300] [&_h3]:leading-[1.12] [&_h3]:tracking-[-0.03em] [&_h3]:text-[#111111] sm:[&_h3]:text-[24px]",
                "[&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:text-[18px] [&_h4]:font-medium [&_h4]:leading-[1.2] [&_h4]:text-[#111111]",
                "[&_p]:m-0 [&_p]:text-[16px] [&_p]:leading-8 [&_p]:text-black/76 sm:[&_p]:text-[18px] sm:[&_p]:leading-9",
                "[&_p+p]:mt-7",
                "[&_h2+p]:mt-0",
                "[&_h3+p]:mt-0",
                "[&_div]:text-[16px] [&_div]:leading-8 [&_div]:text-black/76 sm:[&_div]:text-[18px] sm:[&_div]:leading-9",
                "[&_div+div]:mt-7",
                "[&_div>p]:m-0",
                "[&_div>p+p]:mt-7",
                "[&_strong]:font-medium [&_strong]:text-[#111111]",
                "[&_a]:text-[#111111] [&_a]:underline [&_a]:decoration-black/20 [&_a]:underline-offset-[5px] hover:[&_a]:decoration-black/40",
                "[&_ul]:my-8 [&_ul]:space-y-3 [&_ul]:pl-0",
                "[&_ol]:my-8 [&_ol]:space-y-3 [&_ol]:pl-0",
                "[&_ul>li]:relative [&_ul>li]:pl-7 [&_ul>li]:text-[16px] [&_ul>li]:leading-8 [&_ul>li]:text-black/76 sm:[&_ul>li]:text-[18px] sm:[&_ul>li]:leading-9",
                "[&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.82em] [&_ul>li]:before:h-1.5 [&_ul>li]:before:w-1.5 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-[#b08b57]",
                "[&_ol>li]:ml-5 [&_ol>li]:pl-2 [&_ol>li]:text-[16px] [&_ol>li]:leading-8 [&_ol>li]:text-black/76 sm:[&_ol>li]:text-[18px] sm:[&_ol>li]:leading-9",
                "[&_blockquote]:my-12 [&_blockquote]:rounded-[28px] [&_blockquote]:border [&_blockquote]:border-white/70 [&_blockquote]:bg-white/72 [&_blockquote]:px-6 [&_blockquote]:py-6 [&_blockquote]:text-[20px] [&_blockquote]:font-[300] [&_blockquote]:leading-9 [&_blockquote]:text-black/70 [&_blockquote]:shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:[&_blockquote]:px-8 sm:[&_blockquote]:text-[24px] sm:[&_blockquote]:leading-10",
                "[&_hr]:my-12 [&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-gradient-to-r [&_hr]:from-black/10 [&_hr]:via-black/6 [&_hr]:to-transparent",
                "[&_img]:my-12 [&_img]:rounded-[28px] [&_img]:border [&_img]:border-white/65 [&_img]:shadow-[0_20px_70px_rgba(0,0,0,0.10)]",
                "[&_figure]:my-12",
                "[&_figure_img]:my-0 [&_figure_img]:rounded-[28px] [&_figure_img]:border [&_figure_img]:border-white/65 [&_figure_img]:shadow-[0_20px_70px_rgba(0,0,0,0.10)]",
                "[&_figcaption]:mt-4 [&_figcaption]:text-[12px] [&_figcaption]:uppercase [&_figcaption]:tracking-[0.18em] [&_figcaption]:text-black/42",
                "[&_table]:my-12 [&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-[24px] [&_table]:border [&_table]:border-white/70 [&_table]:bg-white/74 [&_table]:shadow-[0_16px_50px_rgba(0,0,0,0.05)]",
                "[&_thead]:bg-black/[0.03]",
                "[&_th]:border-b [&_th]:border-black/8 [&_th]:px-4 [&_th]:py-4 [&_th]:text-left [&_th]:text-[11px] [&_th]:uppercase [&_th]:tracking-[0.22em] [&_th]:text-black/54",
                "[&_td]:border-t [&_td]:border-black/8 [&_td]:px-4 [&_td]:py-4 [&_td]:align-top [&_td]:text-[15px] [&_td]:leading-7 [&_td]:text-black/72 sm:[&_td]:text-[16px]",
                "[&_.align-center]:text-center",
                "[&_.align-right]:text-right"
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="xl:sticky xl:top-28"
          >
            <BookingCard lang={lang} bookingHref={bookingHref} phone={phone} />
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex justify-center"
        >
          <Link
            href={`/${lang}/blog`}
            className={cn(
              "inline-flex items-center gap-4 rounded-full border border-white/70 bg-white/66 px-6 py-3",
              "text-[11px] uppercase tracking-[0.24em] text-black/68 backdrop-blur-xl transition-all duration-300",
              "hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_18px_50px_rgba(0,0,0,0.06)]"
            )}
          >
            <span>{t.allArticles}</span>
            <span className="h-px w-10 bg-black/35" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}