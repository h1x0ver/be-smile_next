"use client";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { ArrowLeft, ArrowUpRight, CalendarDays, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import styles from "./service-detail.module.css";

type Lang = "en" | "ru" | "az";

type Translation = {
  language?: string;
  languages_code?: string;
  title?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
};

type ImageItem = {
  directus_files_id: string;
};

type AccordionEntry = {
  [key: string]: string | undefined;
};

type SinglePageData = {
  translations?: Translation[];
  images?: ImageItem[];
  accordion?: AccordionEntry[];
};

function decodeHtmlEntities(input?: string) {
  if (!input) return "";
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&uuml;/g, "ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&ouml;/g, "ö")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&auml;/g, "ä")
    .replace(/&Auml;/g, "Ä")
    .replace(/&ccedil;/g, "ç")
    .replace(/&Ccedil;/g, "Ç")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&#231;/g, "ç")
    .replace(/&#252;/g, "ü")
    .replace(/&#246;/g, "ö")
    .replace(/&#214;/g, "Ö")
    .replace(/&#220;/g, "Ü");
}

function stripHtml(html?: string) {
  return decodeHtmlEntities(html)
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAssetUrl(
  id: string,
  {
    width,
    quality = 84,
    format = "webp",
  }: {
    width: number;
    quality?: number;
    format?: "webp" | "jpg" | "png";
  }
) {
  const params = new URLSearchParams({
    width: String(width),
    quality: String(quality),
    format,
    withoutEnlargement: "true",
  });

  return `https://portal.besmile.az/assets/${id}?${params.toString()}`;
}

function getMainAssetUrl(id: string, width: number) {
  return buildAssetUrl(id, {
    width,
    quality: 88,
    format: "webp",
  });
}

function getTinyPreviewUrl(id: string) {
  return buildAssetUrl(id, {
    width: 40,
    quality: 30,
    format: "webp",
  });
}

function getFallbackAssetUrl(id: string) {
  return `https://portal.besmile.az/assets/${id}`;
}

function getExcerpt(text: string, max = 220) {
  if (!text) return "";
  if (text.length <= max) return text;
  const excerpt = text.slice(0, max);
  const sentenceEnd = Math.max(excerpt.lastIndexOf("."), excerpt.lastIndexOf("!"), excerpt.lastIndexOf("?"));
  if (sentenceEnd >= max * 0.45) return excerpt.slice(0, sentenceEnd + 1);
  return `${excerpt.replace(/\s+\S*$/, "").trim()}…`;
}

export default function SinglePage({
  data,
  lang,
}: {
  data: SinglePageData;
  lang: Lang;
}) {
  const translationsMap = useMemo(() => {
    const map: Record<string, Translation> = {};

    for (const tr of data.translations || []) {
      const key = tr.language || tr.languages_code;
      if (key) map[key] = tr;
    }

    return map;
  }, [data.translations]);

  const t =
    translationsMap[lang];

  const title = decodeHtmlEntities(t?.title || "BeSmile Service");
  const summaryHtml = decodeHtmlEntities(t?.content || "");
  const cleanSummary = stripHtml(summaryHtml);
  const summaryExcerpt = getExcerpt(cleanSummary, 260);

  const heroImages = data.images || [];
  const accordionItems = data.accordion || [];

  const [activeItem, setActiveItem] = useState("acc-0");

  const leadImage = heroImages[0];
  const secondImage = heroImages[1];
  const thirdImage = heroImages[2];
  const fourthImage = heroImages[3];

  const t3 = (ru: string, en: string, az: string) => {
    if (lang === "ru") return ru;
    if (lang === "az") return az;
    return en;
  };

  const consultMessage = t3(
    `Здравствуйте! Хочу записаться на консультацию по услуге: ${title}`,
    `Hello! I would like to book a consultation for: ${title}`,
    `Salam! "${title}" xidməti üzrə konsultasiyaya yazılmaq istəyirəm`
  );
  const bookHref = `/${lang}/book-online?message=${encodeURIComponent(consultMessage)}`;

  return (
    <div data-service-page className={`${styles.page} relative min-h-screen bg-[#f8f6f1] text-[#111111]`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-5%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(233,220,196,0.45),transparent)] scale-[1.6]" />
        <div className="absolute right-[-6%] top-[10%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(215,189,146,0.18),transparent)] scale-[1.6]" />
        <div className="absolute bottom-[-12%] left-[20%] h-[340px] w-[340px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.525),transparent)] scale-[1.6]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-[1]">
        <section className={styles.hero}>
          <nav className={styles.breadcrumb} aria-label={t3("Навигация", "Breadcrumb", "Naviqasiya")}><Link href={`/${lang}/services`}><ArrowLeft size={14} aria-hidden="true" />{t3("Все услуги", "All services", "Bütün xidmətlər")}</Link><span aria-hidden="true">/</span><span>{t3("Услуга", "Treatment", "Xidmət")}</span></nav>
          <div className={styles.heroCard}>
            <div className={styles.heroTitle}><span className={styles.eyebrow}>BeSmile Dental Clinic · Baku</span><PageHeading compact>{title}</PageHeading></div>
            <div className={styles.heroIntro}>{summaryExcerpt && <p>{summaryExcerpt}</p>}<Link href={bookHref} className={styles.bookLink}><span>{t3("Записаться на консультацию", "Book a consultation", "Konsultasiyaya yazılın")}</span><ArrowUpRight size={18} aria-hidden="true" /></Link></div>
          </div>
        </section>

        <section data-service="gallery" className="px-4 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8">
          <div className="mx-auto max-w-[1680px]">
            <div className="rounded-[40px] border border-white/60 bg-white/50 p-4 shadow-[0_18px_56px_rgba(0,0,0,0.05)] backdrop-blur-md md:p-5 lg:p-6">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.06fr_0.94fr]">
                <div className="grid grid-cols-1 gap-4">
                  {leadImage && (
                    <GalleryCard
                      id={leadImage.directus_files_id}
                      alt={`${title} image 1`}
                      className="min-h-[380px] md:min-h-[600px]"
                      priority
                      imageWidth={2200}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 56vw"
                    />
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {thirdImage && (
                      <GalleryCard
                        id={thirdImage.directus_files_id}
                        alt={`${title} image 3`}
                        className="min-h-[260px] md:min-h-[340px]"
                        imageWidth={1400}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 28vw"
                      />
                    )}

                    {fourthImage && (
                      <GalleryCard
                        id={fourthImage.directus_files_id}
                        alt={`${title} image 4`}
                        className="min-h-[260px] md:min-h-[340px]"
                        imageWidth={1400}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 28vw"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {secondImage && (
                    <GalleryCard
                      id={secondImage.directus_files_id}
                      alt={`${title} image 2`}
                      className="min-h-[360px] md:min-h-[470px]"
                      imageWidth={1800}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 44vw"
                    />
                  )}

                  <div data-service="overview" className="overflow-hidden rounded-[32px] border border-[#1d1d1d] bg-[#111111] px-6 py-6 shadow-[0_18px_52px_rgba(0,0,0,0.14)] md:px-7 md:py-7">
                    <div className="mb-4 text-[10px] uppercase tracking-[0.32em] text-white/40 md:text-[11px]">
                      {t3("Об услуге", "Treatment overview", "Xidmət haqqında")}
                    </div>

                    <div
                      className={cn(
                        "[&_h1]:text-[30px] [&_h1]:font-[300] [&_h1]:leading-[1.06] [&_h1]:text-white",
                        "[&_h2]:text-[24px] [&_h2]:font-[300] [&_h2]:leading-[1.12] [&_h2]:text-white",
                        "[&_h3]:text-[20px] [&_h3]:font-medium [&_h3]:text-white",
                        "[&_p]:text-[15px] [&_p]:leading-[1.95] [&_p]:text-white/74 md:[&_p]:text-[16px]",
                        "[&_ul]:my-4 [&_ul]:space-y-3 [&_ul]:pl-5",
                        "[&_ol]:my-4 [&_ol]:space-y-3 [&_ol]:pl-5",
                        "[&_li]:text-[15px] [&_li]:leading-[1.9] [&_li]:text-white/74 md:[&_li]:text-[16px]",
                        "[&_strong]:font-medium [&_strong]:text-white",
                        "[&_a]:text-white [&_a]:underline [&_a]:underline-offset-4",
                        "[&_blockquote]:border-l [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:text-white/68"
                      )}
                      dangerouslySetInnerHTML={{ __html: summaryHtml }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {accordionItems.length > 0 && (
          <section data-service="details" className="px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14 lg:px-12  lg:pt-18 [content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
            <div className="mx-auto max-w-[1680px]">
              <div className="mb-8 md:mb-10 lg:mb-12">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/72 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#b08b57]" />
                  <span className="text-[10px] uppercase tracking-[0.32em] text-black/50 md:text-[11px]">
                    {t3("Подробнее об услуге", "Treatment details", "Xidmət haqqında ətraflı")}
                  </span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[40px] border border-white/60 bg-white/52 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-md md:p-4 lg:p-5">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(255,255,255,0.26))]" />
                <div className="pointer-events-none absolute -left-10 top-10 h-[180px] w-[180px] rounded-full bg-[radial-gradient(closest-side,rgba(234,217,187,0.225),transparent)] scale-[1.6]" />
                <div className="pointer-events-none absolute right-0 top-0 h-[200px] w-[200px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.525),transparent)] scale-[1.6]" />
                <div className="pointer-events-none absolute bottom-[-40px] left-[30%] h-[180px] w-[180px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.338),transparent)] scale-[1.6]" />

                <div className="relative">
                  <Accordion
                    type="single"
                    collapsible
                    value={activeItem}
                    onValueChange={setActiveItem}
                    className={styles.accordion}
                  >
                    {accordionItems.map((item, index) => {
                      const value = `acc-${index}`;

                      const accTitle = decodeHtmlEntities(
                        item[`title_${lang}`] ||
                        item.title_en ||
                        item.title_ru ||
                        item.title_az ||
                        ""
                      );

                      const accContent = decodeHtmlEntities(
                        item[`content_${lang}`] ||
                        item.content_en ||
                        item.content_ru ||
                        item.content_az ||
                        ""
                      );

                      const isOpen = activeItem === value;

                      return (
                        <AccordionItem
                          key={value}
                          value={value}
                          className={cn(
                            styles.accordionItem,
                            "group overflow-hidden rounded-[32px] border transition-all duration-500",
                            isOpen
                              ? "border-[#d9c09a]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.96))] shadow-[0_26px_64px_rgba(0,0,0,0.06)]"
                              : "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.68))] shadow-[0_10px_22px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
                          )}
                        >
                          <AccordionTrigger className={styles.trigger}>
                            <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            <span className={styles.accTitle}>{accTitle}</span>
                            <span className={styles.actionText}>{isOpen ? t3("Свернуть", "Close", "Bağla") : t3("Подробнее", "Read more", "Ətraflı")}</span>
                            <span className={styles.toggle} aria-hidden="true"><Plus size={20} strokeWidth={1.4} /></span>
                          </AccordionTrigger>

                          <AccordionContent className={styles.accordionContent}>
                            <div className={styles.contentBorder}>
                              <div data-service="rich-panel" className="relative overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.72))] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] backdrop-blur-md md:p-7 lg:p-8">
                                <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#d8bc8c] via-[#b08b57] to-transparent" />
                                <div
                                  className={cn(
                                    styles.richText,
                                    "[&_h1]:text-[28px] [&_h1]:font-[300] [&_h1]:leading-[1.08] [&_h1]:text-[#111111]",
                                    "[&_h2]:text-[24px] [&_h2]:font-[300] [&_h2]:leading-[1.12] [&_h2]:text-[#111111]",
                                    "[&_h3]:text-[20px] [&_h3]:font-medium [&_h3]:text-[#111111]",
                                    "[&_p]:text-[15px] [&_p]:leading-[1.95] [&_p]:text-black/72 md:[&_p]:text-[16px]",
                                    "[&_ul]:my-4 [&_ul]:space-y-3 [&_ul]:pl-5",
                                    "[&_ol]:my-4 [&_ol]:space-y-3 [&_ol]:pl-5",
                                    "[&_li]:text-[15px] [&_li]:leading-[1.85] [&_li]:text-black/72 md:[&_li]:text-[16px]",
                                    "[&_strong]:font-medium [&_strong]:text-[#111111]",
                                    "[&_a]:text-[#111111] [&_a]:underline [&_a]:underline-offset-4",
                                    "[&_blockquote]:border-l [&_blockquote]:border-black/10 [&_blockquote]:pl-4 [&_blockquote]:text-black/62"
                                  )}
                                  dangerouslySetInnerHTML={{ __html: accContent }}
                                />
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= CONSULTATION CTA =================
            Финальный призыв к записи — после того как человек прочитал
            описание услуги и раскрыл детали (аккордеон), перед тем как
            уйти со страницы. Стилистически повторяет тёмную карточку
            "Service Overview" выше по странице. */}
        <section className="px-4 pb-10 pt-2 md:px-8 md:pb-14 lg:px-12 lg:pb-16">
          <div className="mx-auto max-w-[1680px]">
            <div className="relative overflow-hidden rounded-[40px] border border-[#1d1d1d] bg-[#111111] px-6 py-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.14)] md:px-12 md:py-14">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.09),transparent)] scale-[1.6]" />
                <div className="absolute -left-16 -bottom-16 h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.06),transparent)] scale-[1.6]" />
                <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="absolute inset-0 rounded-[40px] ring-1 ring-inset ring-white/[0.06]" />
              </div>

              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                  <span className="text-[10px] uppercase tracking-[0.32em] text-white/50 md:text-[11px]">
                    BeSmile Concierge
                  </span>
                </div>

                <h2 className="mx-auto max-w-[640px] text-balance text-[26px] font-[300] leading-[1.12] text-white sm:text-[34px] md:text-[40px] lg:text-[48px]">
                  {t3(
                    "Готовы обсудить эту услугу?",
                    "Ready to discuss this treatment?",
                    "Bu xidməti müzakirə etməyə hazırsınız?"
                  )}
                </h2>

                <p className="mx-auto mt-4 max-w-[480px] text-[13.5px] leading-relaxed text-white/55 sm:text-[14px] md:text-[15px]">
                  {t3(
                    "Запишитесь на бесплатную консультацию — врач ответит на все вопросы и подберёт план лечения именно под вас.",
                    "Book a free consultation — our doctor will answer your questions and tailor a treatment plan for you.",
                    "Pulsuz konsultasiyaya yazılın — həkim bütün suallarınıza cavab verəcək və sizin üçün müalicə planı hazırlayacaq."
                  )}
                </p>

                <Link
                  href={bookHref}
                  className="group mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-black transition duration-300 hover:bg-white/90"
                >
                  <CalendarDays
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                    strokeWidth={1.8}
                  />
                  {t3("Бесплатная консультация", "Free consultation", "Pulsuz konsultasiya")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-6 flex justify-center">
          <Link
            href={`/${lang}/services`}
            className="group inline-flex items-center gap-3 rounded-full border border-[#d9c7a2]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,238,228,0.92))] px-5 py-2.5 text-[11px] uppercase tracking-[0.28em] text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_14px_36px_rgba(0,0,0,0.06)]"
          >
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-black/10 bg-white/80 transition-all duration-500 group-hover:-translate-x-0.5">
              <ArrowLeft className="h-[14px] w-[14px]" />
            </span>

            <span className="relative">
              {t3("Все услуги", "Back to services", "Bütün xidmətlər")}
              <span className="absolute left-0 bottom-0 h-[1px] w-0 bg-[#111111] transition-all duration-500 group-hover:w-full" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function GalleryCard({
  id,
  alt,
  className,
  priority = false,
  imageWidth,
  sizes,
}: {
  id: string;
  alt: string;
  className?: string;
  priority?: boolean;
  imageWidth: number;
  sizes: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const mainSrc = useMemo(() => getMainAssetUrl(id, imageWidth), [id, imageWidth]);
  const tinyPreviewSrc = useMemo(() => getTinyPreviewUrl(id), [id]);
  const fallbackSrc = useMemo(() => getFallbackAssetUrl(id), [id]);

  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-[34px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.54))] shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.09)]",
        className
      )}
      style={{
        transform: "translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-[3] rounded-[inherit] ring-1 ring-inset ring-white/55" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.08),transparent_30%),linear-gradient(to_bottom,rgba(0,0,0,0.00),rgba(0,0,0,0.10))]" />
      <div className="pointer-events-none absolute inset-x-[10%] top-0 z-[4] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      {!imageLoaded && (
        <div className="absolute inset-0 z-[0] scale-[1.05] blur-2xl">
          <Image
            src={tinyPreviewSrc}
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      <Image
        src={useFallback ? fallbackSrc : mainSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={96}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "object-cover transition-all duration-1000 ease-out group-hover:scale-[1.035]",
          imageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          if (!useFallback) {
            setUseFallback(true);
          }
        }}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[5] opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_36%,transparent_64%,rgba(255,255,255,0.06))]" />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[6] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0",
          !imageLoaded && "animate-[shimmer_1.8s_ease-in-out_infinite] opacity-100"
        )}
        style={{
          transform: "translateX(-100%) skewX(-18deg)",
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-120%) skewX(-18deg);
          }
          100% {
            transform: translateX(220%) skewX(-18deg);
          }
        }
      `}</style>
    </div>
  );
}
