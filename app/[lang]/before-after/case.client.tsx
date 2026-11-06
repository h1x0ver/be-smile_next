"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { directusImage } from "@/lib/directusImage";

type Lang = "ru" | "en" | "az";

function asset(file: any) {
  const id = typeof file === "string" ? file : file?.id ? String(file.id) : null;
  return id ? directusImage(id, 1400, 80) : "";
}

function pickTranslation(translations: any[] | undefined, lang: Lang) {
  if (!Array.isArray(translations) || translations.length === 0) return null;
  return (
    translations.find((t) => t?.lang === lang) ||
    translations.find((t) => t?.lang === "ru") ||
    translations[0] ||
    null
  );
}

/** ====== i18n (ВСЁ статичное тут) ====== */
const UI: Record<
  Lang,
  {
    heroTitle: string;
    intro: string;

    allCases: string;
    saved: string;
    searchPlaceholder: string;

    featured: string;
    openFeatured: string;
    copyLink: string;
    copiedLink: string;

    dragToCompare: string;
    dragTip: string;

    save: string;
    savedBtn: string;

    seeMore: string;

    noCasesTitle: string;
    noCasesDesc: string;
    reset: string;

    ctaTitle: string;
    ctaDesc: string;
    bookAppointment: string;
    contacts: string;

    modalSubtitle: string;
    close: string;

    result: string;
    focus: string;
    comfort: string;
    aftercare: string;

    visibleImprovement: string;
    aestheticsSymmetry: string;
    gentleProtocol: string;
    homeMaintenance: string;

    tip: string;
    prev: string;
    next: string;

    beforeLabel: string;
    afterLabel: string;

    stats: Array<{ k: string; label: string }>;
    highlights: string[];
  }
> = {
  en: {
    heroTitle: "Before / After",
    intro:
      "Explore real transformations — compare results, open details, and choose the treatment that fits your smile goals.",

    allCases: "All cases",
    saved: "Saved",
    searchPlaceholder: "Search cases...",

    featured: "Featured",
    openFeatured: "Open featured case",
    copyLink: "Copy link",
    copiedLink: "Copied",

    dragToCompare: "Drag to compare",
    dragTip: "Drag slider to compare precisely",

    save: "Save",
    savedBtn: "Saved",

    seeMore: "See more",

    noCasesTitle: "No cases found",
    noCasesDesc: "Try changing category or search query.",
    reset: "Reset",

    ctaTitle: "Ready for your transformation?",
    ctaDesc: "Book a consultation — we’ll suggest the best option for your smile.",
    bookAppointment: "Book appointment",
    contacts: "Contacts",

    modalSubtitle: "Before / After comparison",
    close: "Close",

    result: "Result",
    focus: "Focus",
    comfort: "Comfort",
    aftercare: "Aftercare",

    visibleImprovement: "Visible improvement",
    aestheticsSymmetry: "Aesthetics + symmetry",
    gentleProtocol: "Gentle protocol",
    homeMaintenance: "Home maintenance",

    tip: "Tip: drag the slider to compare before/after precisely.",
    prev: "Prev",
    next: "Next",

    beforeLabel: "Before",
    afterLabel: "After",

    stats: [
      { k: "5000+", label: "Happy patients" },
      { k: "10+", label: "Years experience" },
      { k: "4.9", label: "Average rating" },
      { k: "100%", label: "Sterile protocol" },
    ],

    highlights: [
      "Natural-looking result",
      "Modern implant system",
      "Gentle protocol",
      "Fast recovery support",
    ],

  },
  ru: {
    heroTitle: "До / После",
    intro:
      "Посмотрите реальные трансформации — сравнивайте результаты, открывайте детали и выбирайте лечение под вашу цель.",

    allCases: "Все кейсы",
    saved: "Сохранённые",
    searchPlaceholder: "Поиск кейсов...",

    featured: "Лучшее",
    openFeatured: "Открыть кейс",
    copyLink: "Скопировать",
    copiedLink: "Скопировано",

    dragToCompare: "Потяните, чтобы сравнить",
    dragTip: "Перетяните ползунок для точного сравнения",

    save: "Сохранить",
    savedBtn: "Сохранено",

    seeMore: "Подробнее",

    noCasesTitle: "Ничего не найдено",
    noCasesDesc: "Попробуйте изменить категорию или запрос.",
    reset: "Сбросить",

    ctaTitle: "Готовы к трансформации?",
    ctaDesc: "Запишитесь на консультацию — подберём лучший вариант для вашей улыбки.",
    bookAppointment: "Записаться",
    contacts: "Контакты",

    modalSubtitle: "Сравнение До / После",
    close: "Закрыть",

    result: "Результат",
    focus: "Фокус",
    comfort: "Комфорт",
    aftercare: "Уход",

    visibleImprovement: "Заметное улучшение",
    aestheticsSymmetry: "Эстетика + симметрия",
    gentleProtocol: "Бережный протокол",
    homeMaintenance: "Домашний уход",

    tip: "Подсказка: перетащите ползунок для точного сравнения.",
    prev: "Назад",
    next: "Вперёд",

    beforeLabel: "До",
    afterLabel: "После",

    stats: [
      { k: "5000+", label: "Довольных пациентов" },
      { k: "10+", label: "Лет опыта" },
      { k: "4.9", label: "Средняя оценка" },
      { k: "100%", label: "Стерильный протокол" },
    ],
    highlights: [
      "Естественный результат",
      "Премиум-импланты",
      "Бережный протокол",
      "Быстрое восстановление",
    ],
  },
  az: {
    heroTitle: "Əvvəl / Sonra",
    intro:
      "Real dəyişiklikləri kəşf edin — nəticələri müqayisə edin, detallara baxın və məqsədinizə uyğun müalicəni seçin.",

    allCases: "Bütün keyslər",
    saved: "Seçilənlər",
    searchPlaceholder: "Keyslərdə axtarış...",

    featured: "Seçilmiş",
    openFeatured: "Seçilmiş kesi aç",
    copyLink: "Linki kopyala",
    copiedLink: "Kopyalandı",

    dragToCompare: "Müqayisə üçün sürüşdürün",
    dragTip: "Dəqiq müqayisə üçün sürüşdürün",

    save: "Yadda saxla",
    savedBtn: "Yadda saxlanıb",

    seeMore: "Daha çox",

    noCasesTitle: "Heç nə tapılmadı",
    noCasesDesc: "Kateqoriyanı və ya axtarışı dəyişin.",
    reset: "Sıfırla",

    ctaTitle: "Dəyişiklik üçün hazırsınız?",
    ctaDesc: "Konsultasiyaya yazılın — gülümsəməniz üçün ən uyğun variantı seçək.",
    bookAppointment: "Qəbula yazıl",
    contacts: "Əlaqə",

    modalSubtitle: "Əvvəl / Sonra müqayisəsi",
    close: "Bağla",

    result: "Nəticə",
    focus: "Fokus",
    comfort: "Rahatlıq",
    aftercare: "Baxım",

    visibleImprovement: "Görünən yaxşılaşma",
    aestheticsSymmetry: "Estetika + simmetriya",
    gentleProtocol: "Zərif protokol",
    homeMaintenance: "Ev baxımı",

    tip: "İpucu: dəqiq müqayisə üçün sürüşdürün.",
    prev: "Əvvəlki",
    next: "Növbəti",

    beforeLabel: "Əvvəl",
    afterLabel: "Sonra",

    stats: [
      { k: "5000+", label: "Məmnun pasiyent" },
      { k: "10+", label: "İl təcrübə" },
      { k: "4.9", label: "Orta reytinq" },
      { k: "100%", label: "Steril protokol" },
    ],
    highlights: [
      "Təbii görünüşlü nəticə",
      "Müasir implant sistemi",
      "Zərif protokol",
      "Sürətli bərpa dəstəyi",
    ],
  },
};

/** ===== utils ===== */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function cx(...a: Array<string | false | undefined | null>) {
  return a.filter(Boolean).join(" ");
}

/** ===== icons ===== */
function ArrowIcon({ dir = "left" as const }: { dir?: "left" | "right" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {dir === "left" ? (
        <path
          d="M14.5 6.5L9 12l5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 6.5L15 12l-5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {dir === "left" ? (
        <path
          d="M14.5 6.5L9 12l5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 6.5L15 12l-5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 5.1L18 8.3l-4.3 2.3L12 16l-1.7-5.4L6 8.3l4.8-1.2L12 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 13l.6 2.1 2.1.6-2.1.6-.6 2.1-.6-2.1-2.1-.6 2.1-.6.6-2.1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s-7-4.4-9.3-8.6C.7 8.8 3.1 6 6.3 6c1.7 0 3.3.9 4.2 2.2C11.4 6.9 13 6 14.7 6c3.2 0 5.6 2.8 3.6 6.4C19 16.6 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** ===== UI atoms ===== */
function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
        "ring-1 ring-black/10",
        active ? "bg-black text-white shadow-sm" : "bg-white text-black hover:bg-gray-50"
      )}
    >
      {children}
    </button>
  );
}

function Cinematic({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cx(
        className,
        "will-change-transform will-change-opacity",
        "transition duration-700 ease-out",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** ===== Stats counter (0 -> target) ===== */
function parseStat(raw: string) {
  const s = String(raw ?? "").trim();
  const numPart = (s.match(/[0-9]+(?:\.[0-9]+)?/) || ["0"])[0];
  const value = Number(numPart);
  const suffix = s.replace(numPart, "");
  const decimals = (numPart.split(".")[1] || "").length;
  return { value: Number.isFinite(value) ? value : 0, suffix, decimals };
}

function StatCounter({ raw, label }: { raw: string; label: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [display, setDisplay] = useState("0");

  const info = useMemo(() => parseStat(raw), [raw]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shown) return;

    if (reduceMotion) {
      setDisplay(`${info.value.toFixed(info.decimals)}${info.suffix}`);
      return;
    }

    setDisplay(`0${info.suffix}`);

    const controls = animate(0, info.value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => {
        const n = info.decimals > 0 ? v.toFixed(info.decimals) : String(Math.round(v));
        setDisplay(`${n}${info.suffix}`);
      },
      onComplete: () => {
        setDisplay(`${info.value.toFixed(info.decimals)}${info.suffix}`);
      },
    });

    return () => controls?.stop?.();
  }, [shown, reduceMotion, info.value, info.decimals, info.suffix]);

  return (
    <div
      ref={ref}
      className="rounded-3xl bg-white/40 shadow-sm ring-1 ring-black/5 px-6 py-5"
    >
      <div className="text-2xl font-semibold tracking-tight tabular-nums">{display}</div>
      <div className="mt-1 text-sm text-gray-600">{label}</div>
    </div>
  );
}

/** ===== Slider ===== */
export function BeforeAfterSlider({
  before,
  after,
  className = "h-64",
  initial = 50,
  showLabels = true,
  rounded = "rounded-2xl",
  autoplayHint = true,
  labels,
}: {
  before: string;
  after: string;
  className?: string;
  initial?: number;
  showLabels?: boolean;
  rounded?: string;
  autoplayHint?: boolean;
  labels?: { before: string; after: string };
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(initial);
  const posRef = useRef(initial);
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState(true);

  const reduceMotion = useReducedMotion();
  const playedRef = useRef(false);

  const clip = useMemo(() => `inset(0 ${100 - pos}% 0 0 round 16px)`, [pos]);

  const setPosSafe = useCallback((v: number) => {
    if (Math.abs(v - posRef.current) < 0.15) return;
    posRef.current = v;
    setPos(v);
  }, []);

  const setFromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const next = clamp((x / rect.width) * 100, 0, 100);
    setPosSafe(next);
  };

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 2200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!autoplayHint) return;
    if (reduceMotion) return;
    if (playedRef.current) return;
    playedRef.current = true;

    const a = clamp(initial - 12, 10, 90);
    const b = clamp(initial + 8, 10, 90);

    const c1 = animate(initial, a, { duration: 0.55, ease: "easeInOut", onUpdate: (v) => setPosSafe(v) });
    const c2 = animate(a, b, { delay: 0.6, duration: 0.55, ease: "easeInOut", onUpdate: (v) => setPosSafe(v) });
    const c3 = animate(b, initial, { delay: 1.2, duration: 0.55, ease: "easeInOut", onUpdate: (v) => setPosSafe(v) });

    return () => {
      c1?.stop?.();
      c2?.stop?.();
      c3?.stop?.();
    };
  }, [autoplayHint, reduceMotion, initial, setPosSafe]);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;

      if ("touches" in e && e.touches?.[0]) {
        e.preventDefault?.();
        setFromClientX(e.touches[0].clientX);
      } else if ("clientX" in e) {
        setFromClientX((e as MouseEvent).clientX);
      }
    };

    const onUp = () => setDragging(false);

    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove as any, { passive: false });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging]);

  return (
    <div
      ref={wrapRef}
      className={cx("relative group", className, rounded, "overflow-hidden select-none bg-black/5")}
      style={{ touchAction: "none" }}
      onMouseDown={(e) => {
        setDragging(true);
        setHint(false);
        setFromClientX(e.clientX);
      }}
      onTouchStart={(e) => {
        setDragging(true);
        setHint(false);
        setFromClientX(e.touches[0].clientX);
      }}
      role="group"
      aria-label="Before and after comparison"
    >
      <img src={before} alt={labels?.before ?? "Before"} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      <img
        src={after}
        alt={labels?.after ?? "After"}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover will-change-[clip-path]"
        style={{ clipPath: clip, WebkitClipPath: clip }}
      />

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {showLabels && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {labels?.before ?? "Before"}
          </div>
          <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {labels?.after ?? "After"}
          </div>
        </>
      )}

      {hint && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full bg-white/85 px-4 py-2 text-xs font-medium text-gray-900 shadow-lg ring-1 ring-black/10 backdrop-blur">
            Drag to compare
          </div>
        </div>
      )}

      <div className="absolute top-0 bottom-0 w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" style={{ left: `${pos}%` }} />

      <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pos}%` }}>
        <div className="-translate-x-1/2">
          <div
            className={cx(
              "grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/10 backdrop-blur",
              "transition-transform duration-200",
              dragging ? "scale-80" : "group-hover:scale-70"
            )}
          >
            <div className="flex items-center gap-1 text-gray-800">
              <span className="opacity-70">
                <ArrowIcon dir="left" />
              </span>
              <span className="opacity-70">
                <ArrowIcon dir="right" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ===== Premium background / Hero / Spotlight / Modal ===== */
function PremiumBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#f8f6f1]" />

      <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.188),transparent)] scale-[1.6]" />
      <div className="absolute right-[-8%] top-[14%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.112),transparent)] scale-[1.6]" />
      <div className="absolute bottom-[8%] left-[18%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent_26%,rgba(255,255,255,0.4))]" />

      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
    </div>
  );
}


function SpotlightCard({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) return;

    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.style.setProperty("--op", `1`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--op", `0`);
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove as any);
      el.removeEventListener("mouseleave", onLeave as any);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cx(
        "relative group overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5",
        "transition hover:shadow-xl",
        className
      )}
      style={{
        // @ts-ignore
        "--mx": "50%",
        // @ts-ignore
        "--my": "50%",
        // @ts-ignore
        "--op": 0,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200"
        style={{
          opacity: "var(--op)" as any,
          background:
            "radial-gradient(260px 220px at var(--mx) var(--my), rgba(14,165,233,0.16), transparent 60%), radial-gradient(360px 260px at var(--mx) var(--my), rgba(20,184,166,0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.0] group-hover:opacity-[1] transition"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55), transparent 40%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/78 p-4 md:p-8"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex min-h-[100svh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90svh]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="min-w-0">
              <h3 className="text-lg md:text-xl font-semibold truncate">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="rounded-xl px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 transition shrink-0"
            >
              {closeLabel}
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90svh-72px)]">{children}</div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}

/** ===== MAIN ===== */
export default function BlogClient({
  lang,
  cases,
  categories,
}: {
  lang: Lang;
  cases: any[];
  categories: any[];
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const ui = UI[lang];

  /**  1) build category map: id -> {slug,name} */
  const categoryMap = useMemo(() => {
    const map = new Map<number, { slug: string; name: string }>();

    (categories ?? []).forEach((c) => {
      const t = pickTranslation(c?.case_categories_translations, lang);
      const name = t?.name ?? c?.slug ?? "Category";
      const id = Number(c?.id);
      if (!Number.isNaN(id)) {
        map.set(id, { slug: c?.slug ?? String(id), name });
      }
    });

    return map;
  }, [categories, lang]);

  /**  2) normalize cases ONCE (title/desc/details + category name + images) */
  const normalizedCases = useMemo(() => {
    return (cases ?? [])
      .map((item) => {
        const t = pickTranslation(item?.translations, lang);

        const categoryId = Number(item?.category?.id ?? item?.category ?? NaN);
        const cat = categoryMap.get(categoryId);

        const categorySlug = cat?.slug ?? (item?.category?.slug ?? "uncategorized");
        const categoryName = cat?.name ?? categorySlug;

        return {
          id: item.id,
          slug: item.slug,
          featured: !!item.featured,
          before: asset(item.before_image),
          after: asset(item.after_image),

          title: t?.title ?? "",
          description: t?.description ?? "",
          details: t?.details ?? "",

          categoryId,
          categorySlug,
          categoryName,
        };
      })
      .filter((c) => c.slug && c.before && c.after);
  }, [cases, lang, categoryMap]);

  const [active, setActive] = useState<null | (typeof normalizedCases)[number]>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"All" | "Saved" | string>("All");

  // sticky
  const stickySentinelRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const el = stickySentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setIsStuck(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // favorites
  const [saved, setSaved] = useState<Record<string, true>>({});
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ba_saved");
      if (raw) setSaved(JSON.parse(raw));
    } catch { }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("ba_saved", JSON.stringify(saved));
    } catch { }
  }, [saved]);

  const toggleSaved = (slug: string) => {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[slug]) delete next[slug];
      else next[slug] = true;
      return next;
    });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return normalizedCases.filter((c) => {
      const inSaved = cat === "Saved" ? !!saved[c.slug] : true;
      const inCat = cat === "All" || cat === "Saved" ? true : c.categorySlug === cat;
      const inQ =
        needle.length === 0
          ? true
          : (c.title + " " + c.description + " " + (c.details ?? "")).toLowerCase().includes(needle);

      return inSaved && inCat && inQ;
    });
  }, [normalizedCases, q, cat, saved]);

  const featured = useMemo(() => {
    const explicit = normalizedCases.find((c) => c.featured);
    return explicit ?? filtered[0] ?? normalizedCases[0] ?? null;
  }, [normalizedCases, filtered]);

  // deep-link ?case=slug
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const slug = sp.get("case");
    if (!slug) return;
    const found = normalizedCases.find((c) => c.slug === slug);
    if (found) setActive(found);
  }, [normalizedCases]);

  const setActiveWithUrl = (item: typeof active) => {
    setActive(item);
    const url = new URL(window.location.href);
    if (item) url.searchParams.set("case", item.slug);
    else url.searchParams.delete("case");
    window.history.replaceState({}, "", url.toString());
  };

  const activeIndex = useMemo(() => {
    if (!active) return -1;
    return normalizedCases.findIndex((c) => c.id === active.id);
  }, [active, normalizedCases]);

  const goNext = useCallback(() => {
    if (activeIndex === -1 || normalizedCases.length === 0) return;
    const next = normalizedCases[(activeIndex + 1) % normalizedCases.length];
    setActiveWithUrl(next);
  }, [activeIndex, normalizedCases]);

  const goPrev = useCallback(() => {
    if (activeIndex === -1 || normalizedCases.length === 0) return;
    const prev = normalizedCases[(activeIndex - 1 + normalizedCases.length) % normalizedCases.length];
    setActiveWithUrl(prev);
  }, [activeIndex, normalizedCases]);

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, goNext, goPrev]);

  /**  Copy button -> "Copied" */
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const copiedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const copyLink = async (slug: string) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("case", slug);
      await navigator.clipboard.writeText(url.toString());

      setCopiedSlug(slug);
      if (copiedTimerRef.current) window.clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = window.setTimeout(() => setCopiedSlug(null), 1600);
    } catch { }
  };

  /**  category pills (из Directus) */
  const categoryPills = useMemo(() => {
    const arr =
      (categories ?? [])
        .map((c) => {
          const t = pickTranslation(c?.case_categories_translations, lang);
          return {
            slug: c?.slug ?? String(c?.id),
            name: t?.name ?? c?.slug ?? "Category",
          };
        })
        .filter((x) => x.slug) ?? [];
    return arr;
  }, [categories, lang]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-white">
      <PremiumBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14">
        <section className="relative">

          <div className="mb-8 sm:mb-20 lg:mb-8 flex items-baseline justify-center gap-6 sm:gap-12 lg:gap-[90px]">
            <span className="text-[42px] sm:text-[64px] lg:text-[92px] font-light text-black">[</span>
            <h1 className="font-manrope text-[42px] sm:text-[64px] lg:text-[92px] tracking-[0.22em] font-light text-black">
              {ui.heroTitle}
            </h1>
            <span className="text-[42px] sm:text-[64px] lg:text-[92px] font-light text-black">]</span>
          </div>

          <Cinematic className="mx-auto max-w-3xl text-center" delay={0.05}>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{ui.intro}</p>
          </Cinematic>

          {/*  Animated stats */}
          <Cinematic delay={0.12} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ui.stats.map((s) => (
              <StatCounter key={s.label} raw={s.k} label={s.label} />
            ))}
          </Cinematic>

          <div ref={stickySentinelRef} className="h-1 mt-10" />

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={cx(
              "sticky top-20 z-40 rounded-3xl",
              "bg-white/70 backdrop-blur-xl ring-1 ring-black/5",
              "p-4 sm:p-5 transition-all",
              isStuck ? "shadow-xl ring-black/10" : "shadow-sm"
            )}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <Pill active={cat === "All"} onClick={() => setCat("All")}>
                  <SparkleIcon />
                  {ui.allCases}
                </Pill>

                <Pill active={cat === "Saved"} onClick={() => setCat("Saved")}>
                  <HeartIcon filled={cat === "Saved"} />
                  {ui.saved}
                </Pill>

                {categoryPills.map((c) => (
                  <Pill key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                    {c.name}
                  </Pill>
                ))}
              </div>

              <div className="relative w-full md:w-[340px]">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <SearchIcon />
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={ui.searchPlaceholder}
                  className="w-full rounded-2xl bg-white px-11 py-3 text-sm ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Featured */}
        {featured && (
          <Cinematic delay={0.18} className="mt-10">
            <SpotlightCard className="rounded-[32px] bg-white/85 backdrop-blur ring-1 ring-black/5 shadow-lg overflow-hidden">
              <div className="p-5 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                  <div className="lg:flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2">
                        <span className="rounded-full bg-black text-white px-3 py-1 text-xs font-medium">
                          {ui.featured}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                          {featured.categoryName}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleSaved(featured.slug)}
                        className={cx(
                          "rounded-2xl px-3 py-2 text-sm transition inline-flex items-center gap-2",
                          saved[featured.slug] ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                        )}
                      >
                        <HeartIcon filled={!!saved[featured.slug]} />
                        {saved[featured.slug] ? ui.savedBtn : ui.save}
                      </button>
                    </div>

                    <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-2 text-gray-600 leading-relaxed">
                      {featured.description}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setActiveWithUrl(featured)}
                        className="rounded-2xl px-6 py-3 text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
                      >
                        {ui.openFeatured}
                      </button>

                      <button
                        onClick={() => copyLink(featured.slug)}
                        className="rounded-2xl px-6 py-3 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition inline-flex items-center justify-center gap-2"
                      >
                        <LinkIcon />
                        {copiedSlug === featured.slug ? ui.copiedLink : ui.copyLink}
                      </button>
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-3 text-sm text-gray-600">
                      {ui.highlights.map((txt) => (
                        <div key={txt} className="flex items-center gap-2">
                          <span className="text-emerald-600">✓</span>
                          <span>{txt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:w-[520px]">
                    <BeforeAfterSlider
                      before={featured.before}
                      after={featured.after}
                      className="h-72 sm:h-[360px]"
                      rounded="rounded-3xl"
                      showLabels={false}
                      autoplayHint={!reduceMotion}
                      labels={{ before: ui.beforeLabel, after: ui.afterLabel }}
                    />
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>{ui.dragTip}</span>
                      <span>Slug: {featured.slug}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Cinematic>
        )}

        {/* cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="h-full" style={{ willChange: "transform" }}>
              <SpotlightCard className="h-full">
                <div className="p-4">
                  <div className="relative">
                    <BeforeAfterSlider
                      before={item.before}
                      after={item.after}
                      className="h-56"
                      rounded="rounded-2xl"
                      showLabels={false}
                      autoplayHint={!reduceMotion}
                      labels={{ before: ui.beforeLabel, after: ui.afterLabel }}
                    />

                    <div className="pointer-events-none absolute left-4 bottom-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-gray-900 ring-1 ring-black/10 backdrop-blur">
                        {item.categoryName}
                        <span className="h-1 w-1 rounded-full bg-black/40" />
                        {ui.dragToCompare}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaved(item.slug)}
                      className={cx(
                        "absolute right-4 top-4 rounded-2xl px-3 py-2 text-xs transition ring-1 ring-black/10 backdrop-blur",
                        saved[item.slug] ? "bg-black text-white" : "bg-white/85 text-gray-900 hover:bg-white"
                      )}
                      aria-label="Save case"
                    >
                      <span className="inline-flex items-center gap-2">
                        <HeartIcon filled={!!saved[item.slug]} />
                        {saved[item.slug] ? ui.savedBtn : ui.save}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="px-6 pb-6 flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-semibold line-clamp-2 min-h-[3.5rem]">
                      {item.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      Case #{item.id}
                    </span>
                  </div>

                  <p className=" min-h-[4rem] text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveWithUrl(item)}
                      className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium bg-black text-white transition hover:bg-gray-800 active:scale-[0.99]"
                    >
                      {ui.seeMore}
                    </button>

                    <button
                      onClick={() => copyLink(item.slug)}
                      className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition"
                    >
                      {copiedSlug === item.slug ? ui.copiedLink : ui.copyLink}
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white ring-1 ring-black/5 p-8 text-center">
            <div className="text-lg font-semibold">{ui.noCasesTitle}</div>
            <p className="mt-2 text-sm text-gray-600">{ui.noCasesDesc}</p>
            <button
              className="mt-5 rounded-2xl px-5 py-3 text-sm bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => {
                setQ("");
                setCat("All");
              }}
            >
              {ui.reset}
            </button>
          </div>
        )}

        <Reveal delay={120} className="mt-16">
          <div className="rounded-[32px] bg-black text-white p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold">{ui.ctaTitle}</h3>
                <p className="mt-2 text-white/80 text-sm sm:text-base">{ui.ctaDesc}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* routes */}
                <button
                  onClick={() => router.push("/book-online")}
                  className="rounded-2xl px-6 py-3 text-sm font-medium bg-white text-black hover:bg-gray-100 transition"
                >
                  {ui.bookAppointment}
                </button>
                <button
                  onClick={() => router.push("/contact")}
                  className="rounded-2xl px-6 py-3 text-sm font-medium bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15 transition"
                >
                  {ui.contacts}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="h-10" />
      </div>

      {/* modal */}
      <Modal
        open={!!active}
        onClose={() => setActiveWithUrl(null)}
        title={active?.title ?? ""}
        subtitle={ui.modalSubtitle}
        closeLabel={ui.close}
      >
        {active && (
          <div className="grid gap-6 lg:grid-cols-2">
            <BeforeAfterSlider
              before={active.before}
              after={active.after}
              className="h-72 md:h-[420px]"
              rounded="rounded-3xl"
              showLabels
              autoplayHint={false}
              labels={{ before: ui.beforeLabel, after: ui.afterLabel }}
            />

            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{active.categoryName}</span>
                  <span className="text-xs text-gray-500">Case #{active.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    className="rounded-xl px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 transition inline-flex items-center gap-2"
                    aria-label="Previous case"
                  >
                    <ChevronIcon dir="left" />
                  </button>
                  <button
                    onClick={goNext}
                    className="rounded-xl px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 transition inline-flex items-center gap-2"
                    aria-label="Next case"
                  >
                    <ChevronIcon dir="right" />
                  </button>
                </div>
              </div>

              <h4 className="mt-3 text-2xl font-semibold">{active.title}</h4>
              <p className="text-gray-600 mt-2 leading-relaxed">{active.description}</p>

              {active.details ? (
                <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-black/5">
                  <div dangerouslySetInnerHTML={{ __html: active.details }} />
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {activeIndex + 1} / {normalizedCases.length} — use ← →
                </span>
                <span className="text-xs text-gray-500">Slug: {active.slug}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => copyLink(active.slug)}
                  className="rounded-2xl px-5 py-3 text-sm bg-gray-100 hover:bg-gray-200 transition inline-flex items-center justify-center gap-2"
                >
                  <LinkIcon />
                  {copiedSlug === active.slug ? ui.copiedLink : ui.copyLink}
                </button>

                <button
                  onClick={() => toggleSaved(active.slug)}
                  className={cx(
                    "rounded-2xl px-5 py-3 text-sm transition inline-flex items-center justify-center gap-2",
                    saved[active.slug] ? "bg-black text-white hover:bg-gray-800" : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  <HeartIcon filled={!!saved[active.slug]} />
                  {saved[active.slug] ? ui.savedBtn : ui.save}
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setActiveWithUrl(null)}
                  className="rounded-2xl px-5 py-3 text-sm bg-gray-100 hover:bg-gray-200 transition"
                >
                  {ui.close}
                </button>

                {/* route */}
                <button
                  onClick={() => router.push("/book-online")}
                  className="rounded-2xl px-5 py-3 text-sm bg-black text-white hover:bg-gray-800 transition"
                >
                  {ui.bookAppointment}
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-500">{ui.tip}</p>
            </div>
          </div>
        )}
      </Modal>
      <style jsx global>{`
  @keyframes floatSlow {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(0, -18px, 0) scale(1.04);
    }
  }

  @keyframes floatDelayed {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(0, 22px, 0) scale(1.06);
    }
  }

  .animate-float-slow {
    animation: floatSlow 10s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: floatDelayed 12s ease-in-out infinite;
  }
`}</style>
    </div>
  );
}