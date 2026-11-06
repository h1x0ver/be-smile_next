"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Search, X, ArrowUpRight, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Lang = "en" | "ru" | "az";

type SearchResultItem = {
  type: "page" | "service" | "doctor" | "price" | "case" | "blog";
  title: string;
  description?: string;
  href: string;
  badge?: string;
  score: number;
};

interface Props {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}

const COPY: Record<
  Lang,
  {
    label: string;
    placeholder: string;
    searching: string;
    emptyTitle: string;
    emptyText: string;
    startTitle: string;
    startText: string;
    hint: string;
    close: string;
    clear: string;
    open: string;
    keyboardHint: string;
    popular: string;
    quickLinks: Array<{
      label: string;
      query: string;
    }>;
    groups: Record<SearchResultItem["type"], string>;
    badges: Record<SearchResultItem["type"], string>;
  }
> = {
  ru: {
    label: "Поиск по сайту",
    placeholder: "Введите услугу, врача, цену или вопрос...",
    searching: "Ищем подходящие результаты...",
    emptyTitle: "Ничего не найдено",
    emptyText:
      "Попробуйте написать проще: например “виниры”, “имплантация”, “цены” или “врачи”.",
    startTitle: "Что хотите найти?",
    startText:
      "Можно искать услуги, врачей, цены, кейсы, статьи и страницы сайта.",
    hint: "Например: имплантация, виниры, отбеливание, цены, врач",
    close: "Закрыть",
    clear: "Очистить",
    open: "Открыть",
    keyboardHint: "↑ ↓ выбрать · Enter открыть · Esc закрыть",
    popular: "Популярное",
    quickLinks: [
      { label: "Имплантация", query: "имплантация" },
      { label: "Виниры", query: "виниры" },
      { label: "Цены", query: "цены" },
      { label: "Врачи", query: "врачи" },
      { label: "Отбеливание", query: "отбеливание" },
    ],
    groups: {
      service: "Услуги",
      doctor: "Врачи",
      price: "Цены",
      case: "Кейсы",
      blog: "Блог",
      page: "Страницы",
    },
    badges: {
      service: "Услуга",
      doctor: "Врач",
      price: "Цена",
      case: "Кейс",
      blog: "Статья",
      page: "Страница",
    },
  },
  en: {
    label: "Site search",
    placeholder: "Search service, doctor, price or question...",
    searching: "Searching for the best results...",
    emptyTitle: "No results found",
    emptyText:
      "Try simpler words: for example “veneers”, “implants”, “prices” or “doctors”.",
    startTitle: "What are you looking for?",
    startText:
      "Search services, doctors, prices, cases, articles and website pages.",
    hint: "For example: implants, veneers, whitening, prices, doctor",
    close: "Close",
    clear: "Clear",
    open: "Open",
    keyboardHint: "↑ ↓ select · Enter open · Esc close",
    popular: "Popular",
    quickLinks: [
      { label: "Implants", query: "implants" },
      { label: "Veneers", query: "veneers" },
      { label: "Prices", query: "prices" },
      { label: "Doctors", query: "doctors" },
      { label: "Whitening", query: "whitening" },
    ],
    groups: {
      service: "Services",
      doctor: "Doctors",
      price: "Prices",
      case: "Cases",
      blog: "Blog",
      page: "Pages",
    },
    badges: {
      service: "Service",
      doctor: "Doctor",
      price: "Price",
      case: "Case",
      blog: "Article",
      page: "Page",
    },
  },
  az: {
    label: "Sayt üzrə axtarış",
    placeholder: "Xidmət, həkim, qiymət və ya sual yazın...",
    searching: "Uyğun nəticələr axtarılır...",
    emptyTitle: "Nəticə tapılmadı",
    emptyText:
      "Daha sadə yazmağa çalışın: məsələn “implantasiya”, “vinirlər”, “qiymətlər” və ya “həkimlər”.",
    startTitle: "Nə axtarırsınız?",
    startText:
      "Xidmətlər, həkimlər, qiymətlər, keyslər, məqalələr və sayt səhifələri üzrə axtarın.",
    hint: "Məsələn: implantasiya, vinirlər, ağartma, qiymətlər, həkim",
    close: "Bağla",
    clear: "Təmizlə",
    open: "Aç",
    keyboardHint: "↑ ↓ seç · Enter aç · Esc bağla",
    popular: "Populyar",
    quickLinks: [
      { label: "İmplantasiya", query: "implantasiya" },
      { label: "Vinirlər", query: "vinirlər" },
      { label: "Qiymətlər", query: "qiymətlər" },
      { label: "Həkimlər", query: "həkimlər" },
      { label: "Ağartma", query: "ağartma" },
    ],
    groups: {
      service: "Xidmətlər",
      doctor: "Həkimlər",
      price: "Qiymətlər",
      case: "Keyslər",
      blog: "Bloq",
      page: "Səhifələr",
    },
    badges: {
      service: "Xidmət",
      doctor: "Həkim",
      price: "Qiymət",
      case: "Keys",
      blog: "Məqalə",
      page: "Səhifə",
    },
  },
};

function useDebouncedValue<T>(value: T, delay = 260) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function cleanHtml(text?: string) {
  if (!text) return "";

  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&hellip;/g, "…")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, length = 135) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export default function GlobalSearch({ open, onClose, lang }: Props) {
  const copy = COPY[lang];
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 280);

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasQuery = query.trim().length >= 2;

  const go = useCallback(
    (item: SearchResultItem) => {
      setQuery("");
      setResults([]);
      onClose();
      router.push(item.href);
    },
    [onClose, router]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus(), 20);
  }, []);

  useEffect(() => {
    if (!open) return;

    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          Math.min(prev + 1, Math.max(results.length - 1, 0))
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        go(results[activeIndex]);
      }
    };

    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, activeIndex, go, onClose]);

  useEffect(() => {
    if (!open) return;

    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setActiveIndex(0);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}&lang=${lang}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`Search request failed: ${res.status}`);
        }

        const json = await res.json();

        setResults(Array.isArray(json.results) ? json.results : []);
        setActiveIndex(0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("GLOBAL SEARCH ERROR:", error);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => controller.abort();
  }, [debouncedQuery, lang, open]);

  const preparedResults = useMemo(() => {
    return results.map((item, index) => ({
      ...item,
      group: copy.groups[item.type],
      safeBadge: item.badge || copy.badges[item.type],
      safeDescription: item.description
        ? truncate(cleanHtml(item.description))
        : "",
      flatIndex: index,
    }));
  }, [results, copy.groups, copy.badges]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof preparedResults>();

    for (const item of preparedResults) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }

    return Array.from(map.entries());
  }, [preparedResults]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999]">
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/48 backdrop-blur-[6px] sm:backdrop-blur-[8px]"
          />

          <div className="relative z-10 flex min-h-screen items-start justify-center px-3 pt-[7vh] sm:px-6 sm:pt-[9vh]">
            <motion.div
              key="search-panel"
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[940px] overflow-hidden rounded-[28px] border border-white/24 bg-[#f8f6f1]/96 shadow-[0_28px_90px_rgba(0,0,0,0.24)] supports-[backdrop-filter:blur(0px)]:backdrop-blur-xl sm:rounded-[34px]"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-8%] top-[-10%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.165),transparent)] scale-[1.6]" />
                <div className="absolute right-[-6%] top-[12%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.09),transparent)] scale-[1.6]" />
                <div className="absolute bottom-[-10%] left-[34%] h-[240px] w-[240px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />
                <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.78),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.22),transparent_34%,rgba(255,255,255,0.10))]" />
              </div>

              <div className="relative z-10 border-b border-black/8 px-4 py-4 sm:px-7 sm:py-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 shadow-[0_8px_22px_rgba(0,0,0,0.035)] supports-[backdrop-filter:blur(0px)]:bg-white/68 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#b08b57]" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-black/52">
                      {copy.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={copy.close}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/82 text-black/68 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:text-white supports-[backdrop-filter:blur(0px)]:bg-white/70 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-[24px] border border-white/70 bg-white/78 px-4 py-3 shadow-[0_12px_34px_rgba(0,0,0,0.045)] supports-[backdrop-filter:blur(0px)]:bg-white/64 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md sm:px-5 sm:py-4">
                  <Search className="h-5 w-5 shrink-0 text-black/42" />

                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={copy.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-[17px] font-[350] tracking-[-0.01em] text-[#111111] outline-none placeholder:text-black/34 sm:text-[22px]"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="hidden shrink-0 rounded-full border border-black/8 bg-white px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-black/48 transition hover:bg-[#111111] hover:text-white sm:inline-flex"
                    >
                      {copy.clear}
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] leading-5 text-black/46 sm:text-[13px]">
                    {copy.hint}
                  </p>

                  <p className="hidden text-[11px] uppercase tracking-[0.18em] text-black/34 sm:block">
                    {copy.keyboardHint}
                  </p>
                </div>
              </div>

              <div className="relative z-10 max-h-[68vh] overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
                {loading && (
                  <div className="rounded-[24px] border border-white/70 bg-white/72 px-5 py-7 supports-[backdrop-filter:blur(0px)]:bg-white/62 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md">
                    <div className="flex items-center justify-center gap-3 text-[14px] text-black/52">
                      <Loader2 className="h-5 w-5 animate-spin text-[#b08b57]" />
                      <span>{copy.searching}</span>
                    </div>
                  </div>
                )}

                {!loading && !hasQuery && (
                  <div className="rounded-[26px] border border-white/70 bg-white/72 px-5 py-7 supports-[backdrop-filter:blur(0px)]:bg-white/62 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md sm:px-7 sm:py-8">
                    <div className="mx-auto max-w-[620px] text-center">
                      <div className="mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-full border border-black/8 bg-white shadow-[0_10px_28px_rgba(0,0,0,0.04)]">
                        <Search className="h-5 w-5 text-black/45" />
                      </div>

                      <h3 className="text-[24px] font-[300] tracking-[-0.035em] text-[#111111] sm:text-[30px]">
                        {copy.startTitle}
                      </h3>

                      <p className="mx-auto mt-3 max-w-[520px] text-[14px] leading-7 text-black/56 sm:text-[15px]">
                        {copy.startText}
                      </p>
                    </div>

                    <div className="mt-7">
                      <div className="mb-3 text-center text-[10px] uppercase tracking-[0.26em] text-black/38">
                        {copy.popular}
                      </div>

                      <div className="flex flex-wrap justify-center gap-2.5">
                        {copy.quickLinks.map((item) => (
                          <button
                            key={item.query}
                            type="button"
                            onClick={() => setQuery(item.query)}
                            className="rounded-full border border-black/8 bg-white/82 px-4 py-2.5 text-[13px] text-black/64 shadow-[0_8px_22px_rgba(0,0,0,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:text-white"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!loading && hasQuery && results.length === 0 && (
                  <div className="rounded-[26px] border border-white/70 bg-white/72 px-5 py-9 text-center supports-[backdrop-filter:blur(0px)]:bg-white/62 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md sm:px-7">
                    <h3 className="text-[24px] font-[300] tracking-[-0.035em] text-[#111111] sm:text-[30px]">
                      {copy.emptyTitle}
                    </h3>

                    <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-7 text-black/56 sm:text-[15px]">
                      {copy.emptyText}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                      {copy.quickLinks.slice(0, 4).map((item) => (
                        <button
                          key={item.query}
                          type="button"
                          onClick={() => setQuery(item.query)}
                          className="rounded-full border border-black/8 bg-white/82 px-4 py-2.5 text-[13px] text-black/64 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111111] hover:text-white"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && preparedResults.length > 0 && (
                  <div className="space-y-6">
                    {grouped.map(([group, items]) => (
                      <div key={group}>
                        <div className="mb-3 flex items-center justify-between gap-4 px-2">
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                            <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-black/46">
                              {group}
                            </span>
                          </div>

                          <span className="text-[12px] text-black/34">
                            {items.length}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {items.map((item) => {
                            const active = item.flatIndex === activeIndex;

                            return (
                              <button
                                key={`${item.type}-${item.href}-${item.title}`}
                                type="button"
                                onMouseEnter={() => setActiveIndex(item.flatIndex)}
                                onClick={() => go(item)}
                                className={`group w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-300 sm:px-5 sm:py-5 ${
                                  active
                                    ? "border-[#111111]/14 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.07)]"
                                    : "border-white/70 bg-white/70 hover:border-[#111111]/10 hover:bg-white/88 supports-[backdrop-filter:blur(0px)]:bg-white/58"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0 flex-1">
                                    <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/92 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-black/48">
                                      <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                                      {item.safeBadge}
                                    </div>

                                    <div className="text-[18px] font-[350] leading-[1.16] tracking-[-0.025em] text-[#111111] sm:text-[22px]">
                                      {item.title}
                                    </div>

                                    {item.safeDescription && (
                                      <p className="mt-2.5 max-w-[740px] text-[13px] leading-6 text-black/58 sm:text-[14px] sm:leading-7">
                                        {item.safeDescription}
                                      </p>
                                    )}
                                  </div>

                                  <div className="hidden shrink-0 items-center gap-2 rounded-full border border-black/8 bg-white/92 px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-black/46 transition-all duration-300 group-hover:bg-[#111111] group-hover:text-white sm:inline-flex">
                                    {copy.open}
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                  </div>

                                  <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white/92 text-black/54 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#111111] group-hover:text-white sm:hidden">
                                    <ArrowUpRight className="h-4 w-4" />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}