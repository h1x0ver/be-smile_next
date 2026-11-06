"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import SearchParamWatcher from "@/components/SearchParamWatcher";
import Link from "next/link";
import { CalendarDays, Search } from "lucide-react";
import { AccordionCard } from "@/components/accordion-card";


type Lang = "ru" | "en" | "az";

interface Translation {
  language: Lang;
  service_name: string;
  description?: string;
}

interface CategoryTranslation {
  language: Lang;
  name: string;
}

interface PriceItem {
  id: number;
  slug?: string;
  price: string;
  is_from_price: boolean;
  category?: { id: number; slug: string };
  translations: Translation[];
}

interface Category {
  id: number;
  slug: string;
  translations?: CategoryTranslation[];
}

const ACCENTS = [
  { solid: "#b08b57", soft: "#f5eee0" },
  { solid: "#7c9885", soft: "#eef2ee" },
  { solid: "#8a7ca8", soft: "#f1eef5" },
  { solid: "#c17f59", soft: "#f6ece4" },
  { solid: "#5f8fa6", soft: "#eaf1f3" },
  { solid: "#a3785f", soft: "#f3ece7" },
];

function StatNumber({ value, pad }: { value: number; pad?: boolean }) {
  return <>{pad ? String(value).padStart(2, "0") : String(value)}</>;
}

function pickTranslation<T extends { language: Lang }>(
  arr: T[] | undefined,
  lang: Lang
): T | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return (
    arr.find((tr) => tr.language === lang) ??
    arr.find((tr) => tr.language === "ru") ??
    arr[0] ??
    null
  );
}

function makeAnchor(value?: string) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

interface PricesClientProps {
  prices?: PriceItem[];
  categories?: Category[];
  lang: Lang;
}

export default function PricesClient(props: PricesClientProps) {
  return <PricesClientInner {...props} />;
}

function PricesClientInner({
  prices = [],
  categories = [],
  lang,
}: PricesClientProps) {
  const t = (ru: string, en: string, az: string) => {
    if (lang === "ru") return ru;
    if (lang === "az") return az;
    return en;
  };

  // Локализованный текст, который автоматически подставляется в поле
  // "Комментарий" на странице записи при переходе из прайс-листа.
  const buildBookingMessage = (serviceName: string) => {
    if (lang === "ru") {
      return `Здравствуйте, хочу записаться на: ${serviceName}`;
    }
    if (lang === "az") {
      return `Salam, "${serviceName}" xidmətinə yazılmaq istəyirəm`;
    }
    return `Hello, I would like to book an appointment for: ${serviceName}`;
  };

  const getTranslation = (item: PriceItem): Translation => {
    const tr = pickTranslation(item.translations, lang);
    return tr ?? { language: lang, service_name: "", description: "" };
  };

  const formatPrice = (price: string, isFrom: boolean) => {
    if (!isFrom) return price;
    if (lang === "ru") return `от ${price}`;
    if (lang === "az") return `${price}-dən başlayaraq`;
    return `from ${price}`;
  };

  const categoryMap = useMemo(() => {
    const map = new Map<number, { slug: string; name: string }>();
    categories.forEach((c) => {
      const tr = pickTranslation(c.translations, lang);
      map.set(c.id, { slug: c.slug, name: tr?.name ?? c.slug });
    });
    return map;
  }, [categories, lang]);

  const categoryOrder = useMemo(() => {
    return categories.map((c) => {
      const tr = pickTranslation(c.translations, lang);
      return { slug: c.slug, name: tr?.name ?? c.slug };
    });
  }, [categories, lang]);

  const accentBySlug = useMemo(() => {
    const map = new Map<string, (typeof ACCENTS)[number]>();
    categoryOrder.forEach((c, i) => map.set(c.slug, ACCENTS[i % ACCENTS.length]));
    return map;
  }, [categoryOrder]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    prices.forEach((item) => {
      const catData = item.category ? categoryMap.get(item.category.id) : null;
      const slug = catData?.slug ?? "uncategorized";
      map.set(slug, (map.get(slug) ?? 0) + 1);
    });
    return map;
  }, [prices, categoryMap]);

  const [q, setQ] = useState("");
  const deferredQuery = useDeferredValue(q);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [highlight, setHighlight] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isClickScrolling = useRef(false);

  const normalized = useMemo(() => {
    return prices.map((item) => {
      const tr = pickTranslation(item.translations, lang) ?? { service_name: "", description: "" };
      const catData = item.category ? categoryMap.get(item.category.id) : null;
      const anchor = makeAnchor(item.slug || tr.service_name || String(item.id));

      return {
        ...item,
        title: tr.service_name,
        description: tr.description || "",
        searchText: (tr.service_name + " " + (tr.description || "").replace(/<[^>]*>/g, " ")).toLocaleLowerCase(),
        categorySlug: catData?.slug ?? "uncategorized",
        categoryName: catData?.name ?? (lang === "ru" ? "Прочее" : lang === "az" ? "Digər" : "Other"),
        anchor,
      };
    });
  }, [prices, categoryMap, lang]);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    if (needle.length === 0) return normalized;
    return normalized.filter((item) =>
      item.searchText.includes(needle)
    );
  }, [normalized, deferredQuery]);

  const groups = useMemo(() => {
    const bySlug = new Map<string, typeof filtered>();
    filtered.forEach((item) => {
      const list = bySlug.get(item.categorySlug) ?? [];
      list.push(item);
      bySlug.set(item.categorySlug, list);
    });

    const orderedSlugs = [
      ...categoryOrder.map((c) => c.slug),
      ...Array.from(bySlug.keys()).filter(
        (s) => !categoryOrder.some((c) => c.slug === s)
      ),
    ];

    return orderedSlugs
      .filter((slug) => bySlug.has(slug))
      .map((slug) => ({
        slug,
        name: bySlug.get(slug)?.[0]?.categoryName ?? slug,
        items: bySlug.get(slug) ?? [],
      }));
  }, [filtered, categoryOrder]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target) {
          const slug = (visible.target as HTMLElement).dataset.slug;
          if (slug) setActiveCat(slug);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  const scrollToCat = (slug: string) => {
    const el = sectionRefs.current[slug];
    if (!el) return;
    isClickScrolling.current = true;
    setActiveCat(slug);
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };

  useEffect(() => {
    if (!highlight || normalized.length === 0) return;

    const targetAnchor = makeAnchor(highlight);
    const targetItem = normalized.find((item) => item.anchor === targetAnchor);
    if (!targetItem) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(`price-${targetItem.anchor}`);
      if (!el) return;

      el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
      el.classList.add("bg-[#f7f1e6]");
      setTimeout(() => el.classList.remove("bg-[#f7f1e6]"), 2200);
    }, 300);

    return () => clearTimeout(timer);
  }, [highlight, normalized]);

  const bookLabel = t("Записаться", "Book", "Yazıl");
  const bookHref = `/${lang}/book-online`;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f8f6f1] text-[#111111]">
      <SearchParamWatcher name="highlight" onValue={setHighlight} />
      <div
        className="fixed right-3 top-3 z-50 md:hidden sm:right-4 sm:top-4"
      >
        <Link
          href={bookHref} prefetch={false}
          aria-label={bookLabel}
          className="group/btn relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-12 sm:w-12"
          style={{ backgroundColor: "#b08b57" }}
        >
          <div className="absolute inset-0 rounded-full bg-black/0 transition-colors duration-300 group-hover/btn:bg-black/20" />
          <div
            className="relative z-10"
          >
            <CalendarDays className="h-5 w-5" strokeWidth={1.5} />
          </div>
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />

      <section className="relative overflow-hidden border-b border-black/8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-20%] top-[-20%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.15),transparent)] scale-[1.6] sm:left-[-8%] sm:top-[-30%] sm:h-[420px] sm:w-[420px]" />
          <div className="absolute right-[-18%] top-[8%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(201,174,123,0.105),transparent)] scale-[1.6] sm:right-[-6%] sm:top-[10%] sm:h-[360px] sm:w-[360px]" />
        </div>

        <svg
          aria-hidden
          viewBox="0 0 200 200"
          fill="none"
          className="pointer-events-none absolute -bottom-10 -left-16 h-[220px] w-[220px] opacity-[0.08] sm:-bottom-16 sm:-left-20 sm:h-[320px] sm:w-[320px] lg:-bottom-24 lg:-left-16 lg:h-[560px] lg:w-[560px]"
        >
          <path
            d="M14 82C14 82 55 152 100 152C145 152 186 82 186 82"
            stroke="#b08b57"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-16 lg:pb-16 lg:pt-24">
          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)] lg:items-stretch lg:gap-12">
            <div
              className="relative min-w-0"
            >
              <div
                className="flex min-w-0 items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-[11px] sm:tracking-[0.32em]"
              >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-[#b08b57]"
                    
                    
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                </span>
                <span className="truncate">BeSmile Dental Clinic - Baku</span>
              </div>

              <h1
                className="mt-4 max-w-full break-words text-[38px] font-light leading-[0.95] tracking-[-0.02em] text-black sm:mt-5 sm:text-[52px] md:text-[72px] lg:text-[108px]"
              >
                {t("Прайс-лист", "Price list", "Qiymət siyahısı")}
              </h1>

              <p
                className="mt-4 max-w-[560px] text-[14px] leading-relaxed text-black/60 sm:mt-6 sm:text-[15px] lg:text-[16px]"
              >
                {t(
                  "Прозрачная стоимость лечения - без скрытых платежей. Точный план и полная смета уже на первой консультации.",
                  "Transparent treatment pricing - no hidden costs. A precise plan and full estimate from your very first visit.",
                  "Şəffaf müalicə qiyməti - gizli ödənişlər olmadan. İlk baxışdan dəqiq plan və smeta."
                )}
              </p>
            </div>

            <div
              className="relative min-w-0 overflow-hidden rounded-[22px] bg-[#111111] p-4 sm:rounded-[28px] sm:p-6 lg:p-7"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-16 -top-16 h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.09),transparent)] scale-[1.6]" />
                <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/[0.06] sm:rounded-[28px]" />
              </div>

              <div className="relative min-w-0">
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 sm:tracking-[0.24em]">
                  {t("Коротко", "At a glance", "Qısaca")}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors duration-300 hover:bg-white/[0.06]">
                    <div className="text-[28px] font-light leading-none tabular-nums text-white sm:text-[30px]">
                      <StatNumber value={normalized.length} pad />
                    </div>
                    <div className="mt-1.5 text-[9px] uppercase tracking-[0.15em] text-white/40 sm:tracking-[0.18em]">
                      {t("Услуг", "Services", "Xidmət")}
                    </div>
                  </div>

                  <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors duration-300 hover:bg-white/[0.06]">
                    <div className="text-[28px] font-light leading-none tabular-nums text-white sm:text-[30px]">
                      <StatNumber value={categoryOrder.length} />
                    </div>
                    <div className="mt-1.5 text-[9px] uppercase tracking-[0.15em] text-white/40 sm:tracking-[0.18em]">
                      {t("Направлений", "Categories", "Kateqoriya")}
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-px w-full bg-white/10" />

                <div className="mt-5 flex flex-wrap gap-2">
                  {categoryOrder.map((c) => {
                    const accent = accentBySlug.get(c.slug);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => scrollToCat(c.slug)}
                        className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-3 pr-2 text-[11px] text-white/68 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.09] hover:text-white"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
                          style={{ backgroundColor: accent?.solid }}
                        />
                        <span className="max-w-[140px] truncate sm:max-w-[180px]">
                          {c.name}
                        </span>
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] tabular-nums text-white/45 transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white/70">
                          {categoryCounts.get(c.slug) ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <Link
                  href={`/${lang}/book-online`} prefetch={false}
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-center text-[10px] uppercase tracking-[0.16em] text-black transition duration-300 hover:bg-white/90 sm:text-[11px] sm:tracking-[0.2em]"
                >
                  <CalendarDays
                    className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5"
                    strokeWidth={1.8}
                  />
                  <span className="truncate">
                    {t("Бесплатная консультация", "Free consultation", "Pulsuz konsultasiya")}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto min-h-[calc(100vh-200px)] w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-16 lg:py-16">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
          <aside className="min-w-0 lg:sticky lg:top-8 lg:h-fit">
            <div className="relative w-full min-w-0">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30"
                strokeWidth={1.8}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("Поиск услуги...", "Search a service...", "Xidmət axtar...")}
                aria-label={t("Поиск услуги", "Search a service", "Xidmət axtar")}
                className="block w-full min-w-0 max-w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pl-10 text-[13px] text-black placeholder:text-black/35 outline-none transition focus:border-black/25 focus:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              />
            </div>

            <nav
              aria-label={t("Категории услуг", "Service categories", "Xidmət kateqoriyaları")}
              className="mt-4 hidden min-w-0 flex-col gap-1.5 rounded-[20px] border border-black/8 bg-white p-2 md:flex"
            >
              {groups.map((g) => {
                const isActive = activeCat === g.slug;
                const accent = accentBySlug.get(g.slug);

                return (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => scrollToCat(g.slug)}
                    aria-current={isActive ? "true" : undefined}
                    className="group relative flex min-w-0 items-center gap-3 rounded-[16px] px-3 py-3 text-left text-[13px] transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? "#111111" : "transparent",
                    }}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full transition-transform duration-300"
                      style={{
                        backgroundColor: accent?.solid,
                        transform: isActive ? "scale(1.3)" : "scale(1)",
                      }}
                    />
                    <span
                      className={`min-w-0 flex-1 truncate ${
                        isActive ? "text-white" : "text-black/62 group-hover:text-black"
                      }`}
                    >
                      {g.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] tabular-nums ${
                        isActive
                          ? "bg-white/15 text-white/70"
                          : "bg-black/[0.04] text-black/40"
                      }`}
                    >
                      {g.items.length}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {groups.map((g) => (
                <button
                  key={g.slug}
                  onClick={() => scrollToCat(g.slug)}
                  className={`flex-none rounded-full px-3 py-2 text-[11px] whitespace-nowrap transition sm:px-4 sm:text-[12px] ${
                    activeCat === g.slug
                      ? "bg-black text-white"
                      : "border border-black/10 bg-white text-black/55 hover:border-black/20"
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-[18px] border border-black/8 bg-[#111111] p-4 sm:mt-5 sm:rounded-[20px] sm:p-5 md:p-6">
              <div className="text-[12px] font-light leading-5 text-white/85 sm:text-[13px] sm:leading-6 md:text-[14px]">
                {t(
                  "Не уверены, что выбрать?",
                  "Not sure what to pick?",
                  "Nə seçəcəyinizə əminsiniz?"
                )}
              </div>
              <p className="mt-1.5 text-[11px] leading-5 text-white/40 sm:text-[12px]">
                {t(
                  "Врач подберёт план на бесплатной консультации.",
                  "Our doctor will build a plan at a free consultation.",
                  "Həkim pulsuz konsultasiyada plan hazırlayacaq."
                )}
              </p>
              <Link
                href={`/${lang}/book-online`} prefetch={false}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 py-3 text-center text-[10px] uppercase tracking-[0.18em] text-black transition hover:bg-white/90 sm:text-[10.5px] md:mt-5 md:text-[11px]"
              >
                <CalendarDays className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                <span className="truncate">
                  {t("Консультация", "Consultation", "Konsultasiya")}
                </span>
              </Link>
            </div>
          </aside>

          <div className="relative min-w-0 min-h-[600px]" aria-busy={q !== deferredQuery}>
            <div className="mb-5 flex items-center justify-between gap-3 text-[12px] text-black/50">
              <p role="status" aria-live="polite" aria-atomic="true">
                {t("Найдено услуг", "Services found", "Tapılan xidmətlər")}: {filtered.length}
              </p>
              {q && (
                <button type="button" onClick={() => setQ("")} className="min-h-11 shrink-0 rounded-full border border-black/10 bg-white px-4 text-black/70 hover:border-black/25 focus-visible:outline-2 focus-visible:outline-offset-2">
                  {t("Сбросить поиск", "Clear search", "Axtarışı sıfırla")}
                </button>
              )}
            </div>
            {groups.length === 0 ? (
              <div className="rounded-2xl border border-black/8 bg-white px-6 py-14 text-center sm:px-8 sm:py-16">
                <p className="text-[14px] text-black/50 sm:text-[15px]">
                  {t(
                    "По вашему запросу ничего не найдено.",
                    "No services found for your search.",
                    "Axtarışınız üçün heç bir xidmət tapılmadı."
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-10 lg:space-y-14">
                {groups.map((group) => {
                  const accent = accentBySlug.get(group.slug);

                  return (
                    <div
                      key={group.slug}
                      ref={(el) => {
                        sectionRefs.current[group.slug] = el;
                      }}
                      data-slug={group.slug}
                      className="min-w-0 scroll-mt-20 sm:scroll-mt-24"
                    >
                      <div
                        className="mb-5 flex min-w-0 items-center gap-3 sm:mb-6 sm:gap-4"
                      >
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[12px] font-medium text-white sm:h-11 sm:w-11 sm:rounded-2xl sm:text-[13px]"
                          style={{ backgroundColor: accent?.solid }}
                        >
                          {String(group.items.length).padStart(2, "0")}
                        </span>

                        <h2 className="min-w-0 truncate text-[20px] font-light leading-none tracking-[-0.01em] text-black sm:text-[28px] md:text-[32px] lg:text-[36px]">
                          {group.name}
                        </h2>

                        <div
                          className="h-px min-w-[20px] flex-1 origin-left bg-black/10"
                        />
                      </div>

                      <div className="overflow-hidden rounded-[16px] border border-black/8 bg-white divide-y divide-black/6 sm:rounded-[24px] lg:rounded-[28px]">
                        {group.items.map((item, index) => {
                          const tr = getTranslation(item);
                          const localBookLabel = t("Записаться", "Book", "Yazıl");
                          const localBookHref = `/${lang}/book-online?message=${encodeURIComponent(
                            buildBookingMessage(tr.service_name)
                          )}`;

                          return (
                            <AccordionCard
                              key={item.id}
                              id={`price-${item.anchor}`}
                              index={index}
                              title={tr.service_name}
                              price={formatPrice(item.price, item.is_from_price)}
                              description={
                                tr.description || undefined
                              }
                              accentColor={accent?.solid ?? "#b08b57"}
                              bookHref={localBookHref}
                              bookLabel={localBookLabel}
                              isLast={index === group.items.length - 1}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
