// components/BlogCarouselPremium.tsx
"use client";

import Image from "next/image";
import { formatBlogDate } from "@/lib/displayText";
import Reveal from "./Reveal";
import Link from "next/link";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { Lang } from "@/lib/directus";
import { Button } from "@/components/ui/button"; // поправьте путь под ваш проект

type BlogPost = {
  id: number;
  slug: string;
  cover_image: string | null;
  published_at: string | null;
  reading_time: number | null;
  sort: number | null;
  is_active: boolean;
  title: string;
  excerpt: string | null;
};

type Props = {
  posts: BlogPost[];
  lang: Lang;
  limit?: number;
};

const copyByLang = {
  ru: {
    eyebrow: "ЖУРНАЛ BESMILE",
    titleTop: "БЛОГ",
    titleBottom: "",
    intro:
      "Статьи о стоматологии, эстетике улыбки и современных протоколах лечения — от команды BeSmile.",
    note: "Экспертный контент",
    quality: "Обновляется регулярно",
    subtitle: "СВЕЖИЕ МАТЕРИАЛЫ ИЗ НАШЕГО БЛОГА",
    cta: "Все статьи",
    readMore: "Читать",
    minRead: "мин чтения",
  },
  en: {
    eyebrow: "BESMILE JOURNAL",
    titleTop: "BLOG",
    titleBottom: "",
    intro:
      "Articles on dentistry, smile aesthetics and modern treatment protocols — from the BeSmile team.",
    note: "Expert content",
    quality: "Updated regularly",
    subtitle: "LATEST FROM OUR BLOG",
    cta: "All articles",
    readMore: "Read",
    minRead: "min read",
  },
  az: {
    eyebrow: "BESMILE JURNALI",
    titleTop: "BLOG",
    titleBottom: "",
    intro:
      "Stomatologiya, gülüş estetikası və müasir müalicə protokolları haqqında məqalələr — BeSmile komandasından.",
    note: "Ekspert kontenti",
    quality: "Müntəzəm yenilənir",
    subtitle: "BLOQUMUZDAN ƏN SON MATERİALLAR",
    cta: "Bütün məqalələr",
    readMore: "Oxu",
    minRead: "dəq oxu",
  },
} as const;

function getAssetUrl(fileId: string | null, width = 900, quality = 78) {
  if (!fileId) return null;
  const base = (process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az").replace(/\/$/, "");
  if (!base) return null;
  return `${base}/assets/${fileId}?width=${width}&quality=${quality}&format=webp`;
}


function ArrowBtn({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className={[
        "grid h-11 w-11 place-items-center rounded-full bg-white/78 ring-1 ring-black/10 ",
        "shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300",
        disabled ? "opacity-30 pointer-events-none" : "hover:bg-white hover:-translate-y-0.5",
      ].join(" ")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {dir === "left" ? (
          <path d="M14.5 6.5L9 12l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9.5 6.5L15 12l-5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function BlogCard({ post, lang, index }: { post: BlogPost; lang: Lang; index: number }) {
  const t = copyByLang[lang];
  const image = getAssetUrl(post.cover_image);
  const date = formatBlogDate(post.published_at, lang);

  return (
    <Reveal
      dataCard
      delay={Math.min(index * 65, 195)}

      className="group w-[300px] flex-none snap-start sm:w-[360px] lg:w-[400px] xl:w-[430px] transition-[translate,box-shadow,background-color,border-color,color] duration-400"
    >
      <Link href={`/${lang}/blog/${post.slug}`} className="block h-full" draggable={false}>
        <div
          className={[
            "relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/60 bg-white/60 p-2.5",
            " shadow-[0_18px_60px_rgba(0,0,0,0.07)] transition-all duration-400",
            "group-hover:shadow-lg]",
          ].join(" ")}
        >
          <div className="relative h-[210px] w-full overflow-hidden rounded-[20px] bg-white/50 sm:h-[240px] lg:h-[260px]">
            {image ? (
              <Image
                src={image}
                alt={post.title}
                fill
                loading="lazy"
                draggable={false}
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 430px"
                className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(217,199,162,0.26),rgba(255,255,255,0.78),rgba(201,174,123,0.18))]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.18),transparent_45%)]" />
          </div>

          <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-black/45">
              {date ? <span>{date}</span> : null}
              {date && post.reading_time ? <span className="h-[3px] w-[3px] rounded-full bg-black/25" /> : null}
              {post.reading_time ? (
                <span>
                  {post.reading_time} {t.minRead}
                </span>
              ) : null}
            </div>

            <h3 className="mt-3 line-clamp-2 text-[19px] font-light leading-[1.2] tracking-[-0.02em] text-[#111111] sm:text-[21px]">
              {post.title}
            </h3>

            {post.excerpt ? (
              <p className="mt-2 line-clamp-2 text-[13.5px] leading-6 text-black/60 sm:text-[14px]">{post.excerpt}</p>
            ) : null}

            <div className="mt-auto flex items-center gap-2.5 pt-6 text-[10px] uppercase tracking-[0.2em] text-black/65">
              <span>{t.readMore}</span>
              <span className="h-px w-7 bg-black/35 transition-all duration-500 group-hover:w-10" />
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/** Drag-to-scroll: слушаем move/up на window, а не на самом контейнере,
 *  иначе при быстром свайпе курсор выходит за границы блока, срабатывает
 *  onMouseLeave и драг обрывается на середине жеста. */
function useDragScroll(scrollerRef: React.RefObject<HTMLDivElement | null>) {
  const [isDragging, setIsDragging] = useState(false);
  const stateRef = useRef({ startX: 0, startScroll: 0, moved: false });

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const el = scrollerRef.current;
      if (!el) return;
      e.preventDefault();
      stateRef.current = { startX: e.clientX, startScroll: el.scrollLeft, moved: false };
      setIsDragging(true);
    },
    [scrollerRef]
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      const el = scrollerRef.current;
      if (!el) return;
      const dx = e.clientX - stateRef.current.startX;
      if (Math.abs(dx) > 3) stateRef.current.moved = true;
      el.scrollLeft = stateRef.current.startScroll - dx;
    };

    const onUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, scrollerRef]);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (stateRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return { isDragging, onMouseDown, onClickCapture };
}

export default function BlogCarouselPremium({ posts, lang, limit = 10 }: Props) {
  const copy = copyByLang[lang];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const { isDragging, onMouseDown, onClickCapture } = useDragScroll(scrollerRef);

  const items = useMemo(() => {
    return posts
      .filter((p) => p.is_active)
      .sort((a, b) => {
        const sa = a.sort ?? 9999;
        const sb = b.sort ?? 9999;
        if (sa !== sb) return sa - sb;
        return (b.published_at ?? "").localeCompare(a.published_at ?? "");
      })
      .slice(0, limit);
  }, [posts, limit]);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, items.length]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const gap = 24;
    const step = card ? card.offsetWidth + gap : 380;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      {/* ===== ХЕДЕР ===== */}
      <div className="mb-8 lg:mb-10">
        <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/58 px-5 py-5 shadow-[0_20px_80px_rgba(0,0,0,0.07)] sm:rounded-[34px] sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-8%] top-[-50%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.12),transparent)] scale-[1.6]" />
            <div className="absolute right-[-6%] top-[10%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.562),transparent)] scale-[1.6]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.44),rgba(255,255,255,0.16))]" />
          </div>

          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/78 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#c9ae7b]" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/48">
                  {copy.eyebrow}
                </span>
              </div>

              <h2 className="mt-5 text-balance text-[28px] font-[300] uppercase leading-[0.92] tracking-[0.14em] text-[#111111] sm:text-[40px] lg:text-[56px] xl:text-[64px]">
                [ {copy.titleTop}{" "}
                <span className="tracking-[0.08em]">{copy.titleBottom}</span> ]
              </h2>
            </div>

            <div className="lg:justify-self-end lg:text-right">
              <p className="max-w-[620px] text-[14px] leading-7 text-black/65 sm:text-[15px] sm:leading-8">
                {copy.intro}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5 lg:justify-end">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/78 px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                  <span className="text-[10px] uppercase tracking-[0.24em] text-black/50">
                    {copy.note}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/78 px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                  <span className="text-[10px] uppercase tracking-[0.24em] text-black/46">
                    {copy.quality}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.14),rgba(17,17,17,0.04),transparent)]" />

          <div className="relative z-10 mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[740px] text-[11px] uppercase tracking-[0.24em] text-black/42">
              {copy.subtitle}
            </p>

            <div className="flex items-center gap-3">
              <Link href={`/${lang}/blog`}>
                <Button className="group rounded-full border border-[#111111] bg-[#111111] px-6 py-5 text-[10px] uppercase tracking-[0.26em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black">
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    {copy.cta}
                  </span>
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <ArrowBtn dir="left" onClick={() => scrollByCards(-1)} disabled={!canPrev} />
                <ArrowBtn dir="right" onClick={() => scrollByCards(1)} disabled={!canNext} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== КАРУСЕЛЬ ===== */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#f8f6f1] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#f8f6f1] to-transparent sm:w-16" />

        <div
          ref={scrollerRef}
          onMouseDown={onMouseDown}
          onClickCapture={onClickCapture}
          className={[
            "flex gap-6 overflow-x-auto scroll-smooth px-1 pb-3",
            "select-none",
            isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory",
            "[scrollbar-width:none] [-ms-overflow-style:none]",
            "[&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          {items.map((post, i) => (
            <BlogCard key={post.id} post={post} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
