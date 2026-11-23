"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { NavServiceGroup } from "@/lib/navigation";
import { directusImage } from "@/lib/directusImage";

// Search UI is only needed after the user opens it — keep it out of the initial bundle
const GlobalSearch = dynamic(() => import("../GlobalSearch"), { ssr: false });

type Lang = "en" | "ru" | "az";
type MenuKey = "services" | "clinic" | null;

const LANGS: Lang[] = ["az", "ru", "en"];
const PHONE = "+994704210204";
const PHONE_LABEL = "+994 70 421 02 04";
const WHATSAPP = "https://wa.me/994704210204";
const INSTAGRAM = "https://www.instagram.com/besmile_dental/";

const T: Record<
  Lang,
  {
    services: string;
    clinic: string;
    prices: string;
    blog: string;
    contact: string;
    book: string;
    allServices: string;
    address: string;
    hours: string;
    openNow: string;
    closedNow: string;
    menu: string;
    close: string;
    search: string;
    call: string;
    message: string;
    consultTitle: string;
    consultText: string;
    more: string;
    servicesIntro: string;
    clinicLinks: Array<{ href: string; label: string; note: string }>;
  }
> = {
  ru: {
    services: "Услуги",
    clinic: "Клиника",
    prices: "Цены",
    blog: "Блог",
    contact: "Контакты",
    book: "Записаться",
    allServices: "Все услуги",
    address: "Баку, ул. Хана Шушинского 24",
    hours: "Пн–Сб 09:00–19:00",
    openNow: "Открыто сейчас",
    closedNow: "Сейчас закрыто",
    menu: "Меню",
    close: "Закрыть",
    search: "Поиск",
    call: "Звонок",
    message: "Написать",
    consultTitle: "Консультация стоматолога",
    consultText: "Осмотр, диагностика и понятный план лечения.",
    more: "Подробнее",
    servicesIntro: "Стоматология полного цикла в Баку",
    clinicLinks: [
      { href: "about", label: "О клинике", note: "Философия, технологии, подход" },
      { href: "doctors", label: "Врачи", note: "Команда специалистов BeSmile" },
      { href: "before-after", label: "До и после", note: "Реальные результаты лечения" },
      { href: "reviews", label: "Отзывы", note: "Что говорят наши пациенты" },
    ],
  },
  en: {
    services: "Services",
    clinic: "Clinic",
    prices: "Prices",
    blog: "Blog",
    contact: "Contact",
    book: "Book now",
    allServices: "All services",
    address: "Baku, 24 Khan Shushinski St.",
    hours: "Mon–Sat 09:00–19:00",
    openNow: "Open now",
    closedNow: "Closed now",
    menu: "Menu",
    close: "Close",
    search: "Search",
    call: "Call",
    message: "Message us",
    consultTitle: "Dentist consultation",
    consultText: "Examination, diagnostics and a clear treatment plan.",
    more: "Learn more",
    servicesIntro: "Full-cycle dentistry in Baku",
    clinicLinks: [
      { href: "about", label: "About the clinic", note: "Philosophy, technology, approach" },
      { href: "doctors", label: "Doctors", note: "The BeSmile specialist team" },
      { href: "before-after", label: "Before & after", note: "Real treatment results" },
      { href: "reviews", label: "Reviews", note: "What our patients say" },
    ],
  },
  az: {
    services: "Xidmətlər",
    clinic: "Klinika",
    prices: "Qiymətlər",
    blog: "Bloq",
    contact: "Əlaqə",
    book: "Qəbula yazıl",
    allServices: "Bütün xidmətlər",
    address: "Bakı, Xan Şuşinski küç. 24",
    hours: "B.e.–Ş. 09:00–19:00",
    openNow: "İndi açıqdır",
    closedNow: "İndi bağlıdır",
    menu: "Menyu",
    close: "Bağla",
    search: "Axtarış",
    call: "Zəng",
    message: "Yazın",
    consultTitle: "Diş həkimi konsultasiyası",
    consultText: "Müayinə, diaqnostika və aydın müalicə planı.",
    more: "Ətraflı",
    servicesIntro: "Bakıda tam dövrəli stomatologiya",
    clinicLinks: [
      { href: "about", label: "Klinika haqqında", note: "Fəlsəfə, texnologiya, yanaşma" },
      { href: "doctors", label: "Həkimlər", note: "BeSmile mütəxəssis komandası" },
      { href: "before-after", label: "Əvvəl və sonra", note: "Real müalicə nəticələri" },
      { href: "reviews", label: "Rəylər", note: "Pasiyentlərimiz nə deyir" },
    ],
  },
};

/** Mon–Sat 09:00–19:00 in Baku (UTC+4, no DST). */
function isClinicOpen(now = new Date()) {
  const baku = new Date(now.getTime() + (now.getTimezoneOffset() + 240) * 60000);
  const day = baku.getDay();
  const minutes = baku.getHours() * 60 + baku.getMinutes();
  return day !== 0 && minutes >= 9 * 60 && minutes < 19 * 60;
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="none" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="5.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <path
        d="M6.6 3.5H4.8c-.7 0-1.3.6-1.2 1.3.5 6 5.3 10.8 11.3 11.3.7.1 1.3-.5 1.3-1.2v-1.8c0-.5-.4-1-.9-1.1l-2.4-.6c-.4-.1-.8 0-1.1.3l-.9.9a9.4 9.4 0 0 1-4.2-4.2l.9-.9c.3-.3.4-.7.3-1.1l-.6-2.4c-.1-.5-.6-.9-1.1-.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header({
  lang,
  serviceGroups,
}: {
  lang: Lang;
  serviceGroups: NavServiceGroup[];
}) {
  const pathname = usePathname() || `/${lang}`;
  const t = T[lang];

  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [menuEverOpened, setMenuEverOpened] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Stays mounted while the close animation plays
  const [mobileMounted, setMobileMounted] = useState(false);
  const [mobileSection, setMobileSection] = useState<"services" | "clinic" | null>(null);
  const mobileTimer = useRef<number | undefined>(undefined);
  const [searchOpen, setSearchOpen] = useState(false);
  // Mount the search once it has been opened, so its close animation still plays
  const [searchMounted, setSearchMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState<boolean | null>(null);

  const allServices = serviceGroups.flatMap((g) => g.items);
  const [preview, setPreview] = useState(allServices[0]?.slug ?? "");
  const previewService = allServices.find((s) => s.slug === preview) ?? allServices[0];

  const closeTimer = useRef<number | undefined>(undefined);
  const navigationHoverLock = useRef(false);

  const href = (path: string) => (path ? `/${lang}/${path}` : `/${lang}`);
  const isActive = (path: string) =>
    path ? pathname === href(path) || pathname.startsWith(`${href(path)}/`) : pathname === href("");

  const buildLangUrl = (target: Lang) => {
    const rest = pathname.split("/").slice(2).join("/");
    return rest ? `/${target}/${rest}` : `/${target}`;
  };

  const showMenu = useCallback((key: Exclude<MenuKey, null>) => {
    if (navigationHoverLock.current) return;
    window.clearTimeout(closeTimer.current);
    setMenuEverOpened(true);
    setOpenMenu(key);
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const openMobile = useCallback(() => {
    window.clearTimeout(mobileTimer.current);
    setMobileMounted(true);
    setMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    window.clearTimeout(mobileTimer.current);
    mobileTimer.current = window.setTimeout(() => {
      setMobileMounted(false);
      setMobileSection(null);
    }, 420);
  }, []);

  const openSearch = useCallback(() => {
    setMobileOpen(false);
    setMobileMounted(false);
    setSearchMounted(true);
    setSearchOpen(true);
  }, []);

  // Close on link activation as well as route changes: clicking the current
  // URL or changing only query/hash does not necessarily change pathname.
  const closeForNavigation = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(mobileTimer.current);
    navigationHoverLock.current = true;
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileMounted(false);
    setMobileSection(null);
    setSearchOpen(false);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(mobileTimer.current);
  }, []);

  // Close everything on navigation (state reset during render, React's recommended pattern)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileMounted(false);
    setMobileSection(null);
  }

  // Page-change effects (route shine) only after the first page, never on initial load
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== firstPath.current) document.documentElement.dataset.nav = "1";
  }, [pathname]);

  // Opening hours status is time-dependent, so it's only computed in the browser
  useEffect(() => {
    const update = () => setOpen(isClinicOpen());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Accumulate deliberate movement instead of toggling on trackpad jitter.
  useEffect(() => {
    let lastY = Math.max(0, window.scrollY);
    let travel = 0;
    let direction = 0;
    let frame = 0;
    let compact = false;
    let concealed = false;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;
      const nextCompact = compact ? y > 8 : y > 32;
      if (nextCompact !== compact) { compact = nextCompact; setScrolled(compact); }
      if (Math.abs(delta) < 1) return;
      const nextDirection = Math.sign(delta);
      if (nextDirection !== direction) { travel = 0; direction = nextDirection; }
      travel += Math.abs(delta);
      const nextHidden = y < 160 ? false : direction > 0 && y > 320 && travel > 64 ? true : direction < 0 && travel > 24 ? false : concealed;
      if (nextHidden !== concealed) { concealed = nextHidden; setHidden(concealed); }
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        closeMobile();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu, mobileOpen, closeMobile]);

  // Lock page scroll behind the mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [mobileOpen]);

  const headerHidden = hidden && !openMenu && !mobileOpen;

  const topLinks = [
    { key: "prices", label: t.prices },
    { key: "blog", label: t.blog },
    { key: "contact", label: t.contact },
  ];

  return (
    <>
      {/* Reserves the space of the fixed header */}
      <div className="h-[72px] w-full xl:h-[120px]" aria-hidden="true" />

      {/* Dim the page behind an open mega menu (outside the header: its transform would trap a fixed child) */}
      <div
        aria-hidden="true"
        data-open={openMenu !== null}
        className="bs-scrim pointer-events-none fixed inset-0 z-[998] hidden bg-[#111111]/20 backdrop-blur-[2px] xl:block"
      />

      <header
        onPointerMove={() => { navigationHoverLock.current = false; }}

        data-scrolled={scrolled}
        data-hidden={headerHidden}
        data-menu={mobileOpen ? "open" : undefined}
        className="bs-header fixed inset-x-0 top-0 z-[999]"
      >
        {/* ===== Utility bar (desktop) ===== */}
        <div className="hidden h-9 border-b border-black/[0.06] bg-[#111111] text-white/70 xl:block">
          <div className="mx-auto flex h-full max-w-[1520px] items-center justify-between px-8 text-[11px] tracking-[0.06em]">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${open === false ? "bg-white/35" : "bg-[#7fd1a6]"}`}
                >
                  {open && <span className="absolute inset-0 animate-ping rounded-full bg-[#7fd1a6]/70" />}
                </span>
                <span className="text-white/85">
                  {open === null ? t.hours : open ? t.openNow : t.closedNow}
                </span>
                {open !== null && <span className="text-white/45">· {t.hours}</span>}
              </span>
              <span className="h-3 w-px bg-white/15" />
              <a
                href="https://maps.google.com/?cid=15329295648517687907"
                target="_blank"
                rel="noopener"
                className="transition-colors hover:text-white"
              >
                {t.address}
              </a>
            </div>

            <div className="flex items-center gap-6">
              <a href={`tel:${PHONE}`} className="transition-colors hover:text-white">
                {PHONE_LABEL}
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener" className="transition-colors hover:text-white">
                WhatsApp
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" className="transition-colors hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* ===== Main bar ===== */}
        <div className="bs-header-bar relative" onPointerLeave={scheduleClose}>
          <div className="relative mx-auto flex h-[72px] max-w-[1520px] items-center justify-between gap-6 px-4 sm:px-6 xl:h-[84px] xl:px-8">
            {/* Logo */}
            <Link onClick={closeForNavigation} href={href("")} prefetch={false} className="group relative flex shrink-0 items-center" aria-label="BeSmile Dental Clinic">
              <img
                src="/logo2.svg"
                width="146"
                height="86"
                alt="BeSmile Dental Clinic"
                className="h-auto w-[104px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] sm:w-[116px] xl:w-[124px]"
                fetchPriority="high"
              />
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Main" className="hidden h-full items-center xl:flex">
              <ul className="flex h-full items-center gap-1">
                {(["services", "clinic"] as const).map((key) => {
                  const active =
                    key === "services"
                      ? isActive("services")
                      : t.clinicLinks.some((l) => isActive(l.href));
                  return (
                    <li key={key} className="h-full">
                      <button
                        type="button"
                        aria-expanded={openMenu === key}
                        aria-controls={`bs-menu-${key}`}
                        onPointerEnter={(e) => e.pointerType === "mouse" && showMenu(key)}
                        onClick={() => { navigationHoverLock.current = false; if (openMenu === key) setOpenMenu(null); else showMenu(key); }}
                        className="bs-nav-link group relative flex h-full items-center gap-1.5 px-4 text-[13px] font-medium tracking-[0.02em]"
                        data-active={active || openMenu === key}
                      >
                        <span>{key === "services" ? t.services : t.clinic}</span>
                        <ChevronDown
                          className={`h-3 w-3 transition-transform duration-300 ${openMenu === key ? "rotate-180" : ""}`}
                        />
                      </button>
                    </li>
                  );
                })}
                {topLinks.map((item) => (
                  <li key={item.key} className="h-full" onPointerEnter={scheduleClose}>
                    <Link onClick={closeForNavigation}
                      href={href(item.key)}
                      className="bs-nav-link relative flex h-full items-center px-4 text-[13px] font-medium tracking-[0.02em]"
                      data-active={isActive(item.key)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={openSearch}
                aria-label={t.search}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.08] bg-white/70 text-[#111111] transition-all duration-300 hover:border-black/20 hover:bg-white xl:h-11 xl:w-11"
              >
                <SearchIcon className="h-[18px] w-[18px]" />
              </button>

              <div className="hidden items-center rounded-full border border-black/[0.08] bg-white/70 p-1 xl:flex">
                {LANGS.map((l) => (
                  <Link onClick={closeForNavigation}
                    key={l}
                    href={buildLangUrl(l)} prefetch={false}
                    hrefLang={l}
                    className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                      l === lang ? "bg-[#111111]" : "hover:bg-black/[0.05]"
                    }`}
                  >
                    {/* globals.css forces `a { color: inherit }`, so colours live on the span */}
                    <span className={l === lang ? "text-white" : "text-black/45"}>{l}</span>
                  </Link>
                ))}
              </div>

              <Link onClick={closeForNavigation}
                href={href("book-online")} prefetch={false}
                className="bs-cta group relative hidden h-11 items-center gap-2 overflow-hidden rounded-full bg-[#111111] pl-5 pr-4 sm:inline-flex"
              >
                <span className="relative z-10 text-[12px] font-semibold tracking-[0.04em] text-white">{t.book}</span>
                <ArrowRight className="relative z-10 h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => (mobileOpen ? closeMobile() : openMobile())}
                aria-expanded={mobileOpen}
                aria-controls="bs-mobile-menu"
                aria-label={mobileOpen ? t.close : t.menu}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] xl:hidden"
              >
                <span className="bs-burger" data-open={mobileOpen}>
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>

          {/* Scroll progress (pure CSS, see .bs-progress) */}
          <span className="bs-progress" aria-hidden="true" />

          {/* ===== Mega menu: services ===== */}
          <div
            id="bs-menu-services"
            data-open={openMenu === "services"}
            onPointerEnter={() => showMenu("services")}
            className="bs-mega absolute inset-x-0 top-full hidden xl:block"
          >
            <div className="mx-auto max-w-[1520px] px-8 pb-8">
              <div className="grid grid-cols-12 gap-6 rounded-[32px] border border-black/[0.06] bg-white/95 p-8 shadow-[0_40px_120px_rgba(17,17,17,0.14)] backdrop-blur-xl">
                <div className="col-span-8 grid grid-cols-3 gap-x-8 gap-y-8">
                  {serviceGroups.map((group, gi) => (
                    <div key={group.key} className="bs-mega-col" style={{ ["--i" as string]: gi }}>
                      <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b08b57]">
                        <span className="h-px w-5 bg-[#b08b57]/60" />
                        {group.title}
                      </p>
                      <ul className="space-y-0.5">
                        {group.items.map((item) => (
                          <li key={item.slug}>
                            <Link onClick={closeForNavigation}
                              href={href(`services/${item.slug}`)}
                              onPointerEnter={() => setPreview(item.slug)}
                              onFocus={() => setPreview(item.slug)}
                              className="group/item -mx-3 flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-200 hover:bg-[#f6f1e8]"
                            >
                              <span className="text-[15px] leading-snug text-[#111111]/80 transition-colors group-hover/item:text-[#111111]">
                                {item.title}
                              </span>
                              <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-[#b08b57] opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="col-span-3 flex items-center justify-between border-t border-black/[0.06] pt-6">
                    <p className="text-[13px] text-black/50">{t.servicesIntro}</p>
                    <Link onClick={closeForNavigation}
                      href={href("services")}
                      className="group/all inline-flex items-center gap-2 text-[13px] font-semibold text-[#111111]"
                    >
                      {t.allServices}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/all:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Live preview of the hovered service */}
                <div className="col-span-4 flex flex-col gap-4">
                  {previewService && (
                    <Link onClick={closeForNavigation}
                      href={href(`services/${previewService.slug}`)}
                      className="group/preview relative block flex-1 overflow-hidden rounded-[24px] bg-[#ece6db]"
                    >
                      {menuEverOpened &&
                        allServices.map((s) =>
                          s.cover ? (
                            <img
                              key={s.slug}
                              src={directusImage(s.cover, 640, 72)}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/preview:scale-[1.04]"
                              style={{ opacity: s.slug === previewService.slug ? 1 : 0 }}
                            />
                          ) : null
                        )}
                      <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.65))]" />
                      <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                        <span className="text-[20px] font-[300] leading-tight text-white">{previewService.title}</span>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#111111]">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </span>
                    </Link>
                  )}

                  <div className="rounded-[24px] bg-[#111111] p-5">
                    <p className="text-[15px] text-white">{t.consultTitle}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/55">{t.consultText}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Link onClick={closeForNavigation}
                        href={href("book-online")} prefetch={false}
                        className="inline-flex h-10 items-center rounded-full bg-white px-4 text-[12px] font-semibold"
                      >
                        <span className="text-[#111111]">{t.book}</span>
                      </Link>
                      <a
                        href={`tel:${PHONE}`}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[12px]"
                      >
                        <PhoneIcon className="h-4 w-4 text-white/80" />
                        <span className="text-white/85">{PHONE_LABEL}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Dropdown: clinic ===== */}
          <div
            id="bs-menu-clinic"
            data-open={openMenu === "clinic"}
            onPointerEnter={() => showMenu("clinic")}
            className="bs-mega absolute inset-x-0 top-full hidden xl:block"
          >
            <div className="mx-auto max-w-[1520px] px-8 pb-8">
              <div className="ml-[calc(50%-330px)] grid w-[640px] grid-cols-2 gap-2 rounded-[28px] border border-black/[0.06] bg-white/95 p-3 shadow-[0_40px_120px_rgba(17,17,17,0.14)] backdrop-blur-xl">
                {t.clinicLinks.map((item, i) => (
                  <Link onClick={closeForNavigation}
                    key={item.href}
                    href={href(item.href)}
                    className="bs-mega-col group/item flex items-start gap-4 rounded-[20px] p-4 transition-colors duration-200 hover:bg-[#f6f1e8]"
                    style={{ ["--i" as string]: i }}
                  >
                    <span className="mt-0.5 text-[11px] font-semibold tracking-[0.12em] text-[#b08b57]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[15px] text-[#111111]">{item.label}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-relaxed text-black/45">{item.note}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 -translate-x-1 text-[#b08b57] opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                  </Link>
                ))}
                <Link onClick={closeForNavigation}
                  href={href("book-online")} prefetch={false}
                  className="flex items-center justify-between gap-3 rounded-[20px] bg-[#111111] p-4"
                >
                  <span className="text-[14px] text-white">{t.book}</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Mobile menu ===== */}
        {mobileMounted && (
          <div
            id="bs-mobile-menu"
            data-state={mobileOpen ? "open" : "closing"}
            className="bs-mobile absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain bg-[#0e0e0e] text-white xl:hidden"
          >
            {/* Decor: warm glow + the BeSmile smile arc as a watermark */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(201,163,95,0.22),transparent)]" />
              <div className="absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(22,105,138,0.24),transparent)]" />
              <svg viewBox="0 0 200 80" className="bs-m-arc absolute -right-10 bottom-24 w-[110%] text-white/[0.035]" fill="none">
                <path d="M6 10c22 62 166 62 188 0" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
              </svg>
            </div>

            <div className="relative mx-auto flex min-h-full max-w-[640px] flex-col px-5 pb-8 pt-5">
              <div className="bs-m-item flex items-center justify-between" style={{ ["--i" as string]: 0 }}>
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a35f]" />
                  BeSmile · Baku
                </span>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70">
                  <span className={`relative h-1.5 w-1.5 rounded-full ${open === false ? "bg-white/30" : "bg-[#7fd1a6]"}`}>
                    {open && <span className="absolute inset-0 animate-ping rounded-full bg-[#7fd1a6]/70" />}
                  </span>
                  {open === null ? t.hours : open ? t.openNow : t.closedNow}
                </span>
              </div>

              <nav aria-label="Mobile" className="mt-6 flex-1">
                <ul>
                  {(["services", "clinic"] as const).map((key, i) => {
                    const expanded = mobileSection === key;
                    return (
                      <li key={key} className="bs-m-item border-b border-white/[0.08]" style={{ ["--i" as string]: i + 1 }}>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => setMobileSection(expanded ? null : key)}
                          className="flex w-full items-center gap-4 py-5 text-left"
                        >
                          <span className="w-6 text-[11px] font-semibold tracking-[0.1em] text-[#c9a35f]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="bs-m-label flex-1 overflow-hidden">
                            <span className="block text-[32px] font-[300] leading-[1.1] tracking-[-0.02em] text-white">
                              {key === "services" ? t.services : t.clinic}
                            </span>
                          </span>
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                              expanded ? "rotate-180 border-[#c9a35f] bg-[#c9a35f] text-[#0e0e0e]" : "border-white/15 text-white/70"
                            }`}
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </span>
                        </button>

                        <div className="bs-m-collapse" data-open={expanded}>
                          <div className="overflow-hidden">
                            {key === "services" ? (
                              <div className="space-y-6 pb-7 pl-10">
                                {serviceGroups.map((group) => (
                                  <div key={group.key}>
                                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c9a35f]/90">
                                      {group.title}
                                    </p>
                                    <ul>
                                      {group.items.map((item) => (
                                        <li key={item.slug}>
                                          <Link onClick={closeForNavigation}
                                            href={href(`services/${item.slug}`)}
                                            className="group flex items-center justify-between gap-3 border-b border-white/[0.06] py-3"
                                          >
                                            <span className="text-[16px] text-white/80 transition-colors group-active:text-white">
                                              {item.title}
                                            </span>
                                            <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-all group-active:translate-x-1 group-active:text-[#c9a35f]" />
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                                <Link onClick={closeForNavigation}
                                  href={href("services")}
                                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[13px]"
                                >
                                  <span className="text-white">{t.allServices}</span>
                                  <ArrowRight className="h-4 w-4 text-[#c9a35f]" />
                                </Link>
                              </div>
                            ) : (
                              <ul className="pb-6 pl-10">
                                {t.clinicLinks.map((item) => (
                                  <li key={item.href}>
                                    <Link onClick={closeForNavigation}
                                      href={href(item.href)}
                                      className="group flex items-center justify-between gap-3 border-b border-white/[0.06] py-3"
                                    >
                                      <span>
                                        <span className="block text-[16px] text-white/85">{item.label}</span>
                                        <span className="mt-0.5 block text-[12px] text-white/40">{item.note}</span>
                                      </span>
                                      <ArrowRight className="h-4 w-4 shrink-0 text-white/30 group-active:text-[#c9a35f]" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}

                  {topLinks.map((item, i) => (
                    <li key={item.key} className="bs-m-item border-b border-white/[0.08]" style={{ ["--i" as string]: i + 3 }}>
                      <Link onClick={closeForNavigation} href={href(item.key)} className="group flex items-center gap-4 py-5">
                        <span className="w-6 text-[11px] font-semibold tracking-[0.1em] text-[#c9a35f]">
                          {String(i + 3).padStart(2, "0")}
                        </span>
                        <span className="bs-m-label flex-1 overflow-hidden">
                          <span
                            className={`block text-[32px] font-[300] leading-[1.1] tracking-[-0.02em] ${
                              isActive(item.key) ? "text-[#c9a35f]" : "text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                        </span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors group-active:border-[#c9a35f]">
                          <ArrowRight className="h-4 w-4 text-white/70" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 space-y-3">
                <Link onClick={closeForNavigation}
                  href={href("book-online")} prefetch={false}
                  className="bs-m-item bs-m-book relative flex h-[60px] items-center justify-between overflow-hidden rounded-full pl-7 pr-2"
                  style={{ ["--i" as string]: 6 }}
                >
                  <span className="relative z-10 text-[14px] font-semibold uppercase tracking-[0.14em] text-white">
                    {t.book}
                  </span>
                  <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#0e0e0e]">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </Link>

                <div className="bs-m-item grid grid-cols-2 gap-3" style={{ ["--i" as string]: 7 }}>
                  <a
                    href={`tel:${PHONE}`}
                    className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 transition-colors active:bg-white/[0.08]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08]">
                      <PhoneIcon className="h-4 w-4 text-[#c9a35f]" />
                    </span>
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-white/40">{t.call}</span>
                      <span className="mt-0.5 block text-[13px] text-white">{PHONE_LABEL}</span>
                    </span>
                  </a>
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener"
                    className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 transition-colors active:bg-white/[0.08]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/15">
                      <svg viewBox="0 0 32 32" className="h-4 w-4 text-[#25d366]" fill="currentColor" aria-hidden="true">
                        <path d="M16 .4C7.2.4 0 7.6 0 16.4c0 2.8.7 5.5 2 7.9L.1 32l7.8-2A16 16 0 0016 32c8.8 0 16-7.2 16-16S24.8.4 16 .4zm0 29.2c-2.2 0-4.4-.6-6.3-1.7l-.5-.3-4.6 1.2 1.2-4.5-.3-.5A13.2 13.2 0 012.8 16c0-7.3 5.9-13.2 13.2-13.2S29.2 8.7 29.2 16 23.3 29.6 16 29.6zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.2-.3-.1-.6-.2-.8.2s-1 1.2-1.2 1.4c-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.8-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.2.8.9.3 1.7.2 2.3.2.7-.1 2.2-.9 2.5-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.7-.5z" />
                      </svg>
                    </span>
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-white/40">WhatsApp</span>
                      <span className="mt-0.5 block text-[13px] text-white">{t.message}</span>
                    </span>
                  </a>
                </div>

                <div className="bs-m-item flex items-center justify-between gap-3 pt-5" style={{ ["--i" as string]: 8 }}>
                  <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
                    {LANGS.map((l) => (
                      <Link onClick={closeForNavigation}
                        key={l}
                        href={buildLangUrl(l)}
                        hrefLang={l}
                        className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          l === lang ? "bg-white" : ""
                        }`}
                      >
                        <span className={l === lang ? "text-[#0e0e0e]" : "text-white/50"}>{l}</span>
                      </Link>
                    ))}
                  </div>
                  <a
                    href={INSTAGRAM}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-white/10 px-4 py-2 text-[12px]"
                  >
                    <span className="text-white/70">Instagram</span>
                  </a>
                </div>

                <p className="bs-m-item pt-3 text-[12px] leading-relaxed text-white/40" style={{ ["--i" as string]: 9 }}>
                  {t.address}
                  <br />
                  {t.hours}
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Outside the header: its transform would trap the search's fixed overlay */}
      {searchMounted && (
        <GlobalSearch lang={lang} open={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
