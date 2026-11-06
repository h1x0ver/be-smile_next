"use client";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
  return `${text.slice(0, max).trim()}…`;
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
    translationsMap[lang] || translationsMap.en || data.translations?.[0];

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

  // Короткий локализованный хелпер — только для нового блока консультации,
  // остальной UI в этом файле хардкожен на английском и намеренно не тронут.
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
    <div className="relative min-h-screen overflow-hidden bg-[#f8f6f1] text-[#111111]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-5%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(233,220,196,0.45),transparent)] scale-[1.6]" />
        <div className="absolute right-[-6%] top-[10%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(215,189,146,0.18),transparent)] scale-[1.6]" />
        <div className="absolute bottom-[-12%] left-[20%] h-[340px] w-[340px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.525),transparent)] scale-[1.6]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-[1]">
        <section className="px-4 pb-8 pt-8 md:px-8 md:pb-12 md:pt-10 lg:px-12 lg:pb-16 lg:pt-12">
          <div className="mx-auto max-w-[1680px]">
            <div className="relative mx-auto max-w-[1320px] rounded-[40px] border border-white/60 bg-white/52 px-6 py-8 shadow-[0_18px_56px_rgba(0,0,0,0.05)] backdrop-blur-md md:px-10 md:py-12 lg:px-14 lg:py-16">
              <div className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.413),transparent)] scale-[1.6]" />

              <div className="relative text-center">
                <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/74 px-4 py-2 shadow-[0_8px_22px_rgba(0,0,0,0.03)]">
                  <span className="h-2 w-2 rounded-full bg-[#b08b57]" />
                  <span className="text-[10px] uppercase tracking-[0.32em] text-black/55 md:text-[11px]">
                    BeSmile Premium Care
                  </span>
                </div>

                <h1 className="mx-auto max-w-[980px] text-balance text-center text-[42px] font-[300] uppercase leading-[0.93] tracking-[0.14em] text-[#111111] sm:text-[64px] lg:text-[96px]">
                  {title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-4 md:px-8 md:py-6 lg:px-12 lg:py-8">
          <div className="mx-auto max-w-[1680px]">
            <div className="rounded-[40px] border border-white/60 bg-white/50 p-4 shadow-[0_18px_56px_rgba(0,0,0,0.05)] backdrop-blur-md md:p-5 lg:p-6">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div />
              </div>

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

                  <div className="overflow-hidden rounded-[32px] border border-[#1d1d1d] bg-[#111111] px-6 py-6 shadow-[0_18px_52px_rgba(0,0,0,0.14)] md:px-7 md:py-7">
                    <div className="mb-4 text-[10px] uppercase tracking-[0.32em] text-white/40 md:text-[11px]">
                      Service Overview
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
          <section className="px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14 lg:px-12  lg:pt-18 [content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
            <div className="mx-auto max-w-[1680px]">
              <div className="mb-8 md:mb-10 lg:mb-12">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/72 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#b08b57]" />
                  <span className="text-[10px] uppercase tracking-[0.32em] text-black/50 md:text-[11px]">
                    Premium Details
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
                    className="space-y-4 md:space-y-5"
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
                            "group overflow-hidden rounded-[32px] border transition-all duration-500",
                            isOpen
                              ? "border-[#d9c09a]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,241,232,0.96))] shadow-[0_26px_64px_rgba(0,0,0,0.06)]"
                              : "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.68))] shadow-[0_10px_22px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
                          )}
                        >
                          <AccordionTrigger className="w-full px-6 py-6 text-left no-underline hover:no-underline md:px-8 md:py-7 lg:px-10 lg:py-8 [&>svg]:hidden">
                            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_140px] lg:items-start">
                              <div className="min-w-0">
                                <div className="mb-4 flex items-center gap-3">
                                  <span className="inline-flex h-[7px] w-[7px] rounded-full bg-[#b08b57]" />
                                  <span className="text-[10px] uppercase tracking-[0.34em] text-black/42 md:text-[11px]">
                                    Besmile Signature Detail
                                  </span>
                                </div>

                                <h3
                                  className={cn(
                                    "max-w-[980px] text-balance font-[300] leading-[1.04] tracking-[-0.035em] text-[#111111] transition-all duration-300",
                                    isOpen
                                      ? "text-[28px] md:text-[40px] lg:text-[52px]"
                                      : "text-[24px] md:text-[34px] lg:text-[44px]"
                                  )}
                                >
                                  {accTitle}
                                </h3>
                              </div>

                              <div className="flex items-center justify-start lg:justify-end">
                                <div
                                  className={cn(
                                    "inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-[11px] uppercase tracking-[0.24em] transition-all duration-500",
                                    isOpen
                                      ? "border-[#c8ab77]/60 bg-[#111111] text-white shadow-[0_14px_30px_rgba(17,17,17,0.14)]"
                                      : "border-[#dac7a4]/55 bg-white/72 text-black/55"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "block h-[1px] w-5 bg-current transition-all duration-500",
                                      isOpen ? "rotate-0" : ""
                                    )}
                                  />
                                  <span>{isOpen ? "Opened" : "Open"}</span>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="overflow-hidden px-6 pb-6 pt-0 md:px-8 md:pb-8 lg:px-10 lg:pb-10">
                            <div className="border-t border-black/7 pt-6 md:pt-8">
                              <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.72))] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] backdrop-blur-md md:p-7 lg:p-8">
                                <div className="pointer-events-none absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#d8bc8c] via-[#b08b57] to-transparent" />
                                <div
                                  className={cn(
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
            href="/services"
            className="group inline-flex items-center gap-3 rounded-full border border-[#d9c7a2]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,238,228,0.92))] px-5 py-2.5 text-[11px] uppercase tracking-[0.28em] text-[#111111] shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_14px_36px_rgba(0,0,0,0.06)]"
          >
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-black/10 bg-white/80 transition-all duration-500 group-hover:-translate-x-0.5">
              <ArrowLeft className="h-[14px] w-[14px]" />
            </span>

            <span className="relative">
              Back to Services
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
