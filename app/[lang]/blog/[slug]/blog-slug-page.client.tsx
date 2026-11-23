"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, type SyntheticEvent } from "react";
import type { Lang } from "@/lib/directus";
import { ArrowLeft, ArrowUpRight, ArrowDown, CalendarDays, Phone, List, ChevronDown } from "lucide-react";
import { decodeHtmlEntities, formatBlogDate } from "@/lib/displayText";
import styles from "./article.module.css";

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

type RelatedPost = Pick<BlogPostView, "id" | "slug" | "title" | "cover_image" | "reading_time">;

type Props = {
  relatedPosts?: RelatedPost[];
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

const editorial = {
  ru: { article: "Статья", contents: "В этой статье", by: "Редакция BeSmile", role: "О стоматологии — понятно", read: "Перейти к чтению", next: "Продолжить чтение", note: "Материал носит информационный характер и не заменяет консультацию стоматолога.", clinic: "Здоровье вашей улыбки", prices: "Стоимость лечения", top: "К началу статьи" },
  en: { article: "Article", contents: "In this article", by: "BeSmile editorial team", role: "Dentistry, made clear", read: "Read the article", next: "Continue reading", note: "This article is for information and does not replace a consultation with a dentist.", clinic: "Your smile, thoughtfully cared for", prices: "Treatment prices", top: "Back to the top" },
  az: { article: "Məqalə", contents: "Bu məqalədə", by: "BeSmile redaksiyası", role: "Stomatologiya — aydın dildə", read: "Məqaləni oxuyun", next: "Oxumağa davam edin", note: "Material məlumat xarakterlidir və stomatoloq konsultasiyasını əvəz etmir.", clinic: "Gülüşünüzün sağlamlığı", prices: "Müalicə qiymətləri", top: "Məqalənin əvvəlinə" },
};

function getAssetUrl(fileId: string | null, width = 1400) {
  if (!fileId) return null;
  const base = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az").replace(/\/$/, "");
  return `${base}/assets/${fileId}?width=${width}&quality=78&format=webp`;
}

function retryCover(event: SyntheticEvent<HTMLImageElement>, fileId: string | null) {
  const image = event.currentTarget;
  if (image.dataset.retried || !fileId) {
    image.style.opacity = "0";
    return;
  }
  image.dataset.retried = "true";
  image.removeAttribute("srcset");
  image.src = getAssetUrl(fileId, 900)!;
}

function prepareArticle(content: string) {
  const headings: { id: string; title: string }[] = [];
  const html = (content || "").replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "").replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (_match, attrs: string, body: string) => {
    const id = attrs.match(/\bid=["']([^"']+)["']/i)?.[1] || `article-section-${headings.length + 1}`;
    headings.push({ id, title: decodeHtmlEntities(body.replace(/<[^>]*>/g, "")).trim() });
    return `<h2${attrs.replace(/\s+id=["'][^"']*["']/i, "")} id="${id}">${body}</h2>`;
  }).replace(/<table\b/gi, '<div class="article-table-scroll" tabindex="0"><table').replace(/<\/table>/gi, '</table></div>');
  return { html, headings };
}

function BookingCard({ lang, bookingHref, phone }: { lang: Lang; bookingHref: string; phone?: string }) {
  const t = copy[lang];
  return <div className={styles.booking}>
    <div className={styles.bookingTop}><span>{t.bookEyebrow}</span><CalendarDays size={21} strokeWidth={1.3} aria-hidden="true" /></div>
    <svg className={styles.smile} viewBox="0 0 160 100" fill="none" aria-hidden="true"><path d="M8 15C30 110 130 110 152 15" stroke="currentColor" /></svg>
    <h2>{t.bookTitle}</h2><span className={styles.free}>{t.bookFree}</span><p>{t.bookSubtitle}</p>
    <Link href={bookingHref} className={styles.bookLink}><span>{t.bookCta}</span><ArrowUpRight size={18} aria-hidden="true" /></Link>
    {phone && <a className={styles.call} href={`tel:${phone.replace(/[^+\d]/g, "")}`}><Phone size={14} aria-hidden="true" />{t.bookCallCta}</a>}
    <Link href={`/${lang}/prices`} className={styles.priceLink}>{editorial[lang].prices}<ArrowUpRight size={15} aria-hidden="true" /></Link>
  </div>;
}

export default function BlogSlugPageClient({
  post,
  lang,
  relatedPosts = [],
  bookingHref = `/${lang}/book-online`,
  phone,
}: Props) {
  const t = copy[lang];
  const image = getAssetUrl(post.cover_image);

  const { html, headings } = useMemo(() => prepareArticle(post.content), [post.content]);
  const e = editorial[lang];
  const date = formatBlogDate(post.published_at, lang);
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

  return <div className={styles.page} data-article-page id="article-top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label={t.back}><Link href={`/${lang}/blog`}><ArrowLeft size={15} aria-hidden="true" />{t.back}</Link><span aria-hidden="true">/</span><span>{e.article}</span></nav>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}><span />{t.journal}</span>
          <h1>{post.title}</h1>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          <div className={styles.meta}>{date && <time dateTime={post.published_at!}>{date}</time>}{date && !!post.reading_time && <span aria-hidden="true">·</span>}{!!post.reading_time && <span>{post.reading_time} {t.minRead}</span>}</div>
          <a href="#article-body" className={styles.readLink}>{e.read}<ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <div className={styles.cover}>
          <div className={styles.placeholder} aria-hidden="true">be<span>smile.</span></div>
          {image ? <Image src={image} alt={post.title} onError={event => retryCover(event, post.cover_image)} fill priority quality={78} sizes="(max-width: 899px) 100vw, 45vw" className={styles.coverPhoto} /> : <div className={styles.placeholder} aria-hidden="true">be<span>smile.</span></div>}
          <div className={styles.coverCaption}><span>BeSmile</span><div><strong>{e.clinic}</strong><span>Dental Clinic · Baku</span></div></div>
        </div>
      </header>

      <div className={styles.readingLayout}>
        <aside className={styles.contents} aria-label={e.contents}>
          <div className={styles.author}><span className={styles.authorMark} aria-hidden="true">b.</span><div><strong>{e.by}</strong><span>{e.role}</span></div></div>
          {headings.length > 0 && <div className={styles.toc}>
            <div className={styles.desktopToc}><div className={styles.tocHeading}><List size={16} aria-hidden="true" />{e.contents}</div><nav>{headings.map((heading,index) => <a key={`${heading.id}-${index}`} href={`#${heading.id}`}><span>{String(index + 1).padStart(2,"0")}</span>{heading.title}</a>)}</nav></div>
            <details className={styles.mobileToc}><summary><List size={16} aria-hidden="true" />{e.contents}<ChevronDown size={14} aria-hidden="true" /></summary><nav>{headings.map((heading,index) => <a key={`${heading.id}-${index}`} href={`#${heading.id}`}><span>{String(index + 1).padStart(2,"0")}</span>{heading.title}</a>)}</nav></details>
          </div>}
          <a href="#article-top" className={styles.topLink}>{e.top} ↑</a>
        </aside>
        <main className={styles.readingMain}>
          <article id="article-body" className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
          <div className={styles.articleEnd}><p>{e.note}</p></div>
          <Link href={`/${lang}/blog`} className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" />{t.allArticles}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </main>
        <aside className={styles.bookingAside}><BookingCard lang={lang} bookingHref={bookingHref} phone={phone} /></aside>
      </div>

      {relatedPosts.length > 0 && <section className={styles.related} aria-labelledby="related-title"><header><div><span className={styles.eyebrow}>{t.journal}</span><h2 id="related-title">{e.next}</h2></div><Link href={`/${lang}/blog`}>{t.allArticles}<ArrowUpRight size={18} aria-hidden="true" /></Link></header><div className={styles.relatedGrid}>{relatedPosts.map(item => {
        const cover = getAssetUrl(item.cover_image, 900);
        return <article key={item.id}><Link href={`/${lang}/blog/${item.slug}`}><div className={styles.relatedImage}><div className={styles.placeholder} aria-hidden="true">be<span>smile.</span></div>{cover ? <Image src={cover} alt={item.title} onError={event => retryCover(event, item.cover_image)} fill sizes="(max-width: 639px) 100vw, 33vw" className={styles.coverPhoto} /> : <div className={styles.placeholder} aria-hidden="true">be<span>smile.</span></div>}<span><ArrowUpRight size={21} aria-hidden="true" /></span></div>{!!item.reading_time && <p>{item.reading_time} {t.minRead}</p>}<h3>{item.title}</h3></Link></article>;
      })}</div></section>}
    </div>
  </div>;
}
