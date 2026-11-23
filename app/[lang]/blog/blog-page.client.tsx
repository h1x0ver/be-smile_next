"use client";

import Image from "next/image";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { useMemo } from "react";
import type { Lang } from "@/lib/directus";
import styles from "./blog.module.css";
import { ArrowDown, ArrowUpRight } from "lucide-react";

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

const editorial = {
  ru: { label: "Журнал о здоровье улыбки", selected: "Выбор редакции", all: "Все статьи", explore: "К материалам", note: "Знания, с которых начинается забота о себе.", issue: "СТОМАТОЛОГИЯ / ЭСТЕТИКА / ЗАБОТА" },
  en: { label: "The smile health journal", selected: "Editor's selection", all: "All articles", explore: "Explore articles", note: "Good care begins with understanding.", issue: "DENTISTRY / AESTHETICS / CARE" },
  az: { label: "Gülüş sağlamlığı jurnalı", selected: "Redaksiya seçimi", all: "Bütün məqalələr", explore: "Məqalələrə keç", note: "Özünüzə qayğı bilikdən başlayır.", issue: "STOMATOLOGİYA / ESTETİKA / QAYĞI" },
};

function PostMeta({ post, lang }: { post: BlogPost; lang: Lang }) {
  const date = formatDate(post.published_at, lang);
  return <div className={styles.meta}>
    {date && <time dateTime={post.published_at!}>{date}</time>}
    {date && !!post.reading_time && <span aria-hidden="true">·</span>}
    {!!post.reading_time && <span>{post.reading_time} {copy[lang].minRead}</span>}
  </div>;
}

function Article({ post, lang, featured = false, index = 0 }: {
  post: BlogPost; lang: Lang; featured?: boolean; index?: number;
}) {
  const image = getAssetUrl(post.cover_image, featured ? 1400 : 900, 78);
  return <article className={featured ? styles.featured : styles.card}>
    <Link href={`/${lang}/blog/${post.slug}`} className={styles.articleLink}>
      <div className={styles.image}>
        {image ? <Image src={image} alt={post.title} fill priority={featured}
          sizes={featured ? "(max-width: 900px) 100vw, 60vw" : "(max-width: 600px) 100vw, (max-width: 900px) 50vw, 40vw"}
          className={styles.photo} /> : <div className={styles.placeholder} aria-hidden="true">be<span>smile.</span></div>}
        <span className={styles.imageTag}>{featured ? editorial[lang].selected : String(index + 1).padStart(2, "0")}</span>
        <span className={styles.imageArrow} aria-hidden="true"><ArrowUpRight size={22} /></span>
      </div>
      <div className={styles.articleBody}>
        <PostMeta post={post} lang={lang} />
        {featured ? <h2>{post.title}</h2> : <h3>{post.title}</h3>}
        {post.excerpt && <p>{post.excerpt}</p>}
        <span className={styles.readMore}>{copy[lang].readMore}<ArrowUpRight size={17} aria-hidden="true" /></span>
      </div>
    </Link>
  </article>;
}

export default function BlogPageClient({ posts, lang }: BlogPageClientProps) {
  const t = copy[lang];
  const e = editorial[lang];
  const activePosts = useMemo(() => posts.filter(post => post.is_active), [posts]);
  const featured = activePosts.find(post => post.is_featured) ?? activePosts[0];
  const remaining = activePosts.filter(post => post.id !== featured?.id);
  const ordered = [...remaining.filter(post => post.is_secondary_featured), ...remaining.filter(post => !post.is_secondary_featured)];

  return <div className={styles.page}>
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.eyebrow}><span className={styles.dot} />BeSmile Journal<span className={styles.edition}>{e.issue}</span></div>
        <div className={styles.headingRow}>
          <div><span className={styles.subtitle}>{e.label}</span><PageHeading>{t.title}</PageHeading></div>
          <div className={styles.intro}><p>{t.intro}</p>{featured && <a href="#articles" className={styles.explore}>{e.explore}<ArrowDown size={16} aria-hidden="true" /></a>}</div>
        </div>
      </header>
      {featured ? <section className={styles.lead} aria-label={e.selected}><Article post={featured} lang={lang} featured /></section> : <p className={styles.empty}>{t.empty}</p>}
      {ordered.length > 0 && <section id="articles" className={styles.articles} aria-labelledby="articles-title">
        <div className={styles.sectionHeader}><h2 id="articles-title">{e.all}<sup>{String(activePosts.length).padStart(2, "0")}</sup></h2><span>{e.note}</span></div>
        <div className={styles.grid}>{ordered.map((post, index) => <Article key={post.id} post={post} lang={lang} index={index} />)}</div>
      </section>}
      {featured && !ordered.length && <div id="articles" />}
      <div className={styles.endnote}><span>BeSmile</span><p>{e.note}</p></div>
    </div>
  </div>;
}
