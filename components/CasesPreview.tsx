"use client";

import Link from "next/link";

type Lang = "en" | "ru" | "az";

type CaseItem = {
  id: string | number;
  slug?: string;
  before_image?: string | { id?: string };
  after_image?: string | { id?: string };
  translations?: Array<{
    lang?: string;
    languages_code?: string;
    title?: string;
    description?: string;
  }>;
};

const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "https://portal.besmile.az/";

const COPY = {
  en: {
    eyebrow: "Real Results",
    title: "BEFORE / AFTER",
    subtitle:
      "Selected smile transformations with precise, aesthetic and natural-looking outcomes.",
    cta: "All Cases",
    more: "Open case",
    before: "Before",
    after: "After",
  },
  ru: {
    eyebrow: "Реальные результаты",
    title: "ДО / ПОСЛЕ",
    subtitle:
      "Избранные трансформации улыбки с точным, эстетичным и естественным результатом.",
    cta: "Все кейсы",
    more: "Открыть кейс",
    before: "До",
    after: "После",
  },
  az: {
    eyebrow: "Real nəticələr",
    title: "ƏVVƏL / SONRA",
    subtitle:
      "Dəqiq, estetik və təbii görünən nəticələrlə seçilmiş gülüş transformasiyaları.",
    cta: "Bütün keyslər",
    more: "Keysi aç",
    before: "Əvvəl",
    after: "Sonra",
  },
};

function asset(file: any) {
  const id = typeof file === "string" ? file : file?.id ? String(file.id) : null;
  return id ? `${DIRECTUS_URL}assets/${id}` : "";
}

function pickTranslation(translations: any[] | undefined, lang: Lang) {
  if (!Array.isArray(translations) || translations.length === 0) return null;
  return (
    translations.find((t) => t?.lang === lang || t?.languages_code === lang) ||
    translations.find((t) => t?.lang === "ru" || t?.languages_code === "ru") ||
    translations[0] ||
    null
  );
}

export default function CasesPreview({
  lang,
  cases,
}: {
  lang: Lang;
  cases: CaseItem[];
}) {
  const copy = COPY[lang] ?? COPY.en;

  const items = (cases ?? [])
    .map((item) => {
      const t = pickTranslation(item.translations, lang);

      return {
        id: item.id,
        slug: item.slug,
        title: t?.title || "Case",
        description: t?.description || "",
        before: asset(item.before_image),
        after: asset(item.after_image),
      };
    })
    .filter((item) => item.slug && item.before && item.after)
    .slice(0, 3);

  if (!items.length) return null;

  return (
    <section className="relative px-4 pb-20 pt-8 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/76 px-4 py-2 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#c9ae7b]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-black/48">
                {copy.eyebrow}
              </span>
            </div>

            <h2 className="mt-4 text-[26px] font-[300] uppercase leading-[0.95] tracking-[0.12em] text-[#111111] sm:text-[38px] lg:text-[52px]">
              {copy.title}
            </h2>

            <p className="mt-4 max-w-[680px] text-[14px] leading-7 text-black/62 sm:text-[15px]">
              {copy.subtitle}
            </p>
          </div>

          <Link
            href={`/${lang}/before-after`}
            className="hidden rounded-full border border-[#111111] bg-[#111111] px-6 py-4 text-[10px] uppercase tracking-[0.26em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black lg:inline-flex"
          >
            {copy.cta}
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[32px] border border-white/60 bg-white/40 shadow-[0_25px_90px_rgba(0,0,0,0.08)]"
            >
              <div className="relative grid grid-cols-2">
                <div className="relative h-[280px] overflow-hidden">
                  <img
                    src={item.before}
                    alt={copy.before}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
                    {copy.before}
                  </div>
                </div>

                <div className="relative h-[280px] overflow-hidden">
                  <img
                    src={item.after}
                    alt={copy.after}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur">
                    {copy.after}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-[22px] font-[300] uppercase leading-[1.02] tracking-[0.05em] text-[#111111]">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-[14px] leading-7 text-black/65">
                  {item.description}
                </p>

                <Link
                  href={`/${lang}/before-after?case=${item.slug}`}
                  className="mt-5 inline-flex text-[11px] uppercase tracking-[0.24em] text-black/52 transition-transform duration-300 group-hover:translate-x-1"
                >
                  {copy.more}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 lg:hidden">
          <Link
            href={`/${lang}/before-after`}
            className="inline-flex rounded-full border border-[#111111] bg-[#111111] px-6 py-4 text-[10px] uppercase tracking-[0.26em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.14)]"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}