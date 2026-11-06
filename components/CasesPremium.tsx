"use client";
import { decodeHtmlEntities } from "@/lib/displayText";
import Reveal from "./Reveal";

import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { ArrowUpRight, X } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { createPortal } from "react-dom";
import { directusImage } from "@/lib/directusImage";

type Lang = "en" | "ru" | "az";

type CaseTranslation = {
  lang?: string;
  languages_code?: string;
  title?: string;
  description?: string;
  details?: string;
};

type CaseItem = {
  id: string | number;
  slug?: string;
  featured?: boolean;
  sort?: number;
  before_image?: string | { id?: string };
  after_image?: string | { id?: string };
  translations?: CaseTranslation[];
};

type SlideCase = {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  details: string;
  before: string;
  after: string;
  number: string;
};

const COPY: Record<
  Lang,
  {
    eyebrow: string;
    titleTop: string;
    titleBottom: string;
    intro: string;
    cta: string;
    more: string;
    close: string;
    modalLabel: string;
    before: string;
    after: string;
    note: string;
    badge: string;
    openDetails: string;
    quality: string;
    subtitle: string;
  }
> = {
  en: {
    eyebrow: "Selected Smile Transformations",
    titleTop: "BEFORE",
    titleBottom: "AFTER",
    intro:
      "A curated selection of aesthetic cases with visible improvement, natural harmony and a refined clinical approach.",
    cta: "All Cases",
    more: "Open Case",
    close: "Close",
    modalLabel: "Case Details",
    before: "Before",
    after: "After",
    note: "Selected aesthetic transformations",
    badge: "BeSmile Cases",
    openDetails: "View Details",
    quality: "Aesthetics / Precision / Care",
    subtitle: "Premium clinical results with refined visual balance",
  },
  ru: {
    eyebrow: "Избранные трансформации улыбки",
    titleTop: "ДО",
    titleBottom: "ПОСЛЕ",
    intro:
      "Подборка эстетических кейсов с заметным улучшением, естественной гармонией и премиальным клиническим подходом.",
    cta: "Все кейсы",
    more: "Открыть кейс",
    close: "Закрыть",
    modalLabel: "Детали кейса",
    before: "До",
    after: "После",
    note: "Избранные эстетические трансформации",
    badge: "Кейсы BeSmile",
    openDetails: "Смотреть детали",
    quality: "Эстетика / Точность / Уход",
    subtitle: "Премиальные клинические результаты с выверенной визуальной гармонией",
  },
  az: {
    eyebrow: "Seçilmiş gülüş transformasiyaları",
    titleTop: "ƏVVƏL",
    titleBottom: "SONRA",
    intro:
      "Görünən yaxşılaşma, təbii harmoniya və premium klinik yanaşma ilə seçilmiş estetik keyslər.",
    cta: "Bütün keyslər",
    more: "Keysi aç",
    close: "Bağla",
    modalLabel: "Keys detalları",
    before: "Əvvəl",
    after: "Sonra",
    note: "Seçilmiş estetik transformasiyalar",
    badge: "BeSmile keysləri",
    openDetails: "Detallara bax",
    quality: "Estetika / Dəqiqlik / Qayğı",
    subtitle: "Vizual balansla premium klinik nəticələr",
  },
};

function asset(file: unknown) {
  const id =
    typeof file === "string"
      ? file
      : typeof file === "object" && file !== null && "id" in file
        ? String((file as { id?: string }).id ?? "")
        : "";

  return id ? directusImage(id, 1400, 80) : "";
}

function pickTranslation(
  translations: CaseTranslation[] | undefined,
  lang: Lang,
) {
  if (!Array.isArray(translations) || translations.length === 0) return null;

  return (
    translations.find((t) => t?.lang === lang || t?.languages_code === lang) ||
    translations.find((t) => t?.lang === "ru" || t?.languages_code === "ru") ||
    translations[0] ||
    null
  );
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}



function truncateText(text: string, maxLength = 128) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function PremiumCaseModal({
  open,
  onClose,
  title,
  subtitle,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open, onClose]);

  // The modal only opens in response to a browser interaction.
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/60 p-3 sm:p-5 lg:p-8"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex min-h-screen items-start justify-center pt-[4vh]">
        <div

          onMouseDown={(e) => e.stopPropagation()}
className="relative w-full max-w-[960px] overflow-hidden rounded-[30px] border border-white/20 bg-[rgba(248,246,241,0.94)] shadow-[0_40px_140px_rgba(0,0,0,0.30)] sm:rounded-[34px]"        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-8%] top-[-10%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.18),transparent)] scale-[1.6]" />
            <div className="absolute right-[-6%] top-[10%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.105),transparent)] scale-[1.6]" />
            <div className="absolute bottom-[-10%] left-[30%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />
            <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.18),transparent_30%,rgba(255,255,255,0.08))]" />
          </div>

          <div className="relative z-10 border-b border-black/8 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/72 px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                  <span className="text-[10px] uppercase tracking-[0.28em] text-black/46">
                    {subtitle}
                  </span>
                </div>

                <h3 className="mt-3 max-w-[760px] text-balance text-[22px] font-[300] uppercase leading-[0.98] tracking-[0.05em] text-[#111111] sm:text-[28px] lg:text-[36px]">
                  {title}
                </h3>
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:text-white sm:h-12 sm:w-12"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative z-10 overflow-y-auto max-h-[calc(85vh-92px)] px-1 pb-10 pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function CasesPremium({
  lang,
  cases,
}: {
  lang: Lang;
  cases: CaseItem[];
}) {
  const copy = COPY[lang] ?? COPY.en;
  const [selectedCase, setSelectedCase] = useState<SlideCase | null>(null);

  const items = useMemo(() => {
    const preferredSortOrder = [5, 3, 1];

    return preferredSortOrder
      .map((sortValue, index) => {
        const item = (cases ?? []).find(
          (entry) => Number(entry.sort) === sortValue,
        );

        if (!item) return null;

        const t = pickTranslation(item.translations, lang);
        const before = asset(item.before_image);
        const after = asset(item.after_image);

        return {
          id: item.id,
          slug: item.slug || "",
          title: decodeHtmlEntities(t?.title || "Case"),
          description: truncateText(
            decodeHtmlEntities(stripHtml(t?.description || "")),
            126,
          ),
          details: decodeHtmlEntities(
            stripHtml(t?.details || t?.description || ""),
          ),
          before,
          after,
          number: String(index + 1).padStart(2, "0"),
        };
      })
      .filter(
        (item): item is SlideCase =>
          Boolean(item?.slug && item?.before && item?.after),
      );
  }, [cases, lang]);

  if (!items.length) return null;

  return (
    <>
      <section className="relative overflow-hidden bg-[#f8f6f1] px-4 pb-20 pt-12 sm:px-6 sm:pt-14 md:px-10 lg:px-16 lg:pb-28 lg:pt-16 xl:px-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[-6%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />
          <div className="absolute right-[-10%] top-[2%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.3),transparent)] scale-[1.6]" />
          <div className="absolute bottom-[-12%] left-[28%] h-[340px] w-[340px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.6),transparent)] scale-[1.6]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.5),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.22),transparent_28%,rgba(255,255,255,0.1))]" />
        </div>

        <div className="relative mx-auto max-w-[1480px]">
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

                <Link href={`/${lang}/before-after`}>
                  <Button className="group rounded-full border border-[#111111] bg-[#111111] px-6 py-5 text-[10px] uppercase tracking-[0.26em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black">
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      {copy.cta}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item, index) => (
              <Reveal as="article" delay={Math.min(index * 70, 140)}
                key={item.id}

                className="group relative flex h-full flex-col overflow-hidden rounded-[34px] border border-white/60 bg-white/36 shadow-[0_25px_90px_rgba(0,0,0,0.08)] transition-[translate,box-shadow,background-color,border-color,color] duration-500 hover:-translate-y-1.5 hover:shadow-[0_35px_110px_rgba(0,0,0,0.12)]"
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-[-20%] top-[-14%] h-[180px] w-[180px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.45),transparent)] scale-[1.6]" />
                  <div className="absolute right-[-14%] top-[18%] h-[170px] w-[170px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.525),transparent)] scale-[1.6]" />
                </div>

                <div className="relative h-[320px] overflow-hidden sm:h-[360px] lg:h-[390px]">
                  <BeforeAfterSlider
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, calc(100vw - 32px)"
                    before={item.before}
                    after={item.after}
                    className="h-full w-full"
                    rounded="rounded-none"
                    showLabels={false}
                    autoplayHint={false}
                    labels={{ before: copy.before, after: copy.after }}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.18)_0%,rgba(17,17,17,0.05)_28%,rgba(17,17,17,0)_60%)]" />

                  <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/35 px-3 py-2 ">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                      <span className="text-[10px] uppercase tracking-[0.28em] text-white/72">
                        {copy.badge}
                      </span>
                    </div>

                    <div className="text-[34px] font-[300] leading-none text-white/28 sm:text-[42px]">
                      {item.number}
                    </div>
                  </div>

                  <div className="absolute left-5 top-[72px] flex items-center gap-2">
                    <span className="rounded-full border border-white/14 bg-black/39 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/76 ">
                      {copy.before}
                    </span>
                    <span className="rounded-full border border-white/14 bg-black/39 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/76 ">
                      {copy.after}
                    </span>
                  </div>
                </div>

                <div className="relative flex flex-1 flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.76))] p-5 sm:p-6">
                  <div className="mb-4 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.12),transparent)]" />

                  <h3 className="max-w-[420px] text-balance text-[22px] font-[300] uppercase leading-[1.02] tracking-[0.05em] text-[#111111] sm:text-[26px]">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[520px] text-[14px] leading-7 text-black/62">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCase(item)}
                        className="inline-flex items-center rounded-full border border-[#111111] bg-[#111111] px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-white shadow-[0_14px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black"
                      >
                        {copy.openDetails}
                      </button>

                      <Link
                        href={`/${lang}/before-after?case=${item.slug}`}
                        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-black/46 transition-all duration-300 hover:text-black/72 group-hover:translate-x-0.5"
                      >
                        <span>{copy.more}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PremiumCaseModal
        open={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        title={selectedCase?.title ?? ""}
        subtitle={copy.modalLabel}
        closeLabel={copy.close}
      >
        {selectedCase && (
          <div className="px-6 pb-12 pt-6 sm:px-6 sm:pb-10 sm:pt-5 lg:px-8 lg:pb-12">
            <div className="overflow-hidden rounded-[24px] border border-white/60 bg-white/56 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:rounded-[28px]">
              <BeforeAfterSlider
                before={selectedCase.before}
                after={selectedCase.after}
                className="h-[220px] sm:h-[320px] md:h-[380px] lg:h-[420px]"
                rounded="rounded-[24px] sm:rounded-[28px]"
                showLabels
                autoplayHint={false}
                labels={{ before: copy.before, after: copy.after }}
              />
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[26px] border border-white/60 bg-white/72 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:rounded-[30px] sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-black/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                    {copy.before} / {copy.after}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-black/44">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                    {copy.quality}
                  </span>
                </div>

                <div className="mt-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.12),transparent)]" />

                <p className="mt-5 max-w-[920px] text-[14px] leading-7 text-black/72 sm:text-[15px] sm:leading-8">
                  {selectedCase.details}
                </p>
              </div>

              <div className="rounded-[26px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.8),rgba(255,255,255,0.66))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:rounded-[30px] sm:p-6">
                <div className="text-[10px] uppercase tracking-[0.28em] text-black/44">
                  BeSmile
                </div>

                <div className="mt-3 text-[22px] font-[300] uppercase leading-[1] tracking-[0.05em] text-[#111111] sm:text-[28px]">
                  Premium Case View
                </div>

                <p className="mt-4 text-[14px] leading-7 text-black/62">
                  {copy.intro}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/${lang}/cases?case=${selectedCase.slug}`}
                    className="inline-flex items-center rounded-full border border-[#1a1a1a]  px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3222]"
                  >
                    {copy.more}
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedCase(null)}
                    className="inline-flex items-center rounded-full border border-black/8 bg-white/92 px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-black/58 shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    {copy.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PremiumCaseModal>
    </>
  );
}
