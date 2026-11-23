"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import SearchParamWatcher from "@/components/SearchParamWatcher";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { ArrowUpRight, CalendarDays, Search, X, ChevronDown, ShieldCheck } from "lucide-react";
import { AccordionCard } from "@/components/accordion-card";
import styles from "./prices.module.css";


type Lang = "ru" | "en" | "az";

interface Translation {
  language?: Lang;
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

function pickTranslation<T extends { language?: Lang }>(
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

  const [q, setQ] = useState("");
  const deferredQuery = useDeferredValue(q);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [highlight, setHighlight] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
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
    <div className={styles.page} data-prices-page>
      <SearchParamWatcher name="highlight" onValue={setHighlight} />
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <nav className={styles.breadcrumb} aria-label={t("Навигация", "Breadcrumb", "Naviqasiya")}>
              <Link href={`/${lang}`}>{t("Главная", "Home", "Ana səhifə")}</Link><span aria-hidden="true">/</span><span>{t("Цены", "Prices", "Qiymətlər")}</span>
            </nav>
            <div className={styles.eyebrow}><span />BeSmile Dental Clinic · Baku</div>
            <PageHeading>{t("Прайс-лист", "Price list", "Qiymət siyahısı")}</PageHeading>
            <p className={styles.intro}>{t(
              "Прозрачная стоимость лечения — без скрытых платежей. Точный план и полная смета уже на первой консультации.",
              "Transparent treatment pricing — no hidden costs. A precise plan and full estimate from your very first visit.",
              "Şəffaf müalicə qiyməti — gizli ödənişlər olmadan. İlk baxışdan dəqiq plan və smeta."
            )}</p>
            <div className={styles.heroDetails}>
            <div className={styles.stats}>
              <div><strong>{String(normalized.length).padStart(2, "0")}</strong><span>{t("услуг в прайсе", "services listed", "xidmət")}</span></div>
              <div><strong>{categoryOrder.length}</strong><span>{t("направлений заботы", "areas of care", "istiqamət")}</span></div>

            </div>
            <div className={styles.planNote}><ShieldCheck size={24} strokeWidth={1.3} aria-hidden="true" /><p><strong>{t("Индивидуальный план", "Personalised treatment", "Fərdi müalicə planı")}</strong><span>{t("Стоимость после диагностики", "Costs confirmed after diagnostics", "Diaqnostikadan sonra dəqiq qiymət")}</span></p></div>
            </div>
          </div>
          <aside className={styles.consultation}>
            <svg className={styles.smile} viewBox="0 0 260 160" fill="none" aria-hidden="true"><path d="M15 25C55 165 205 165 245 25" stroke="currentColor" strokeWidth="1"/><path d="M40 20C75 130 185 130 220 20" stroke="currentColor" strokeWidth=".6"/></svg>
            <div className={styles.cardTop}><span className={styles.cardLabel}>{t("ПЕРВЫЙ ВИЗИТ В BESMILE", "YOUR FIRST VISIT TO BESMILE", "BESMILE-A İLK VİZİTİNİZ")}</span><span className={styles.consultIcon}><CalendarDays size={22} strokeWidth={1.3} aria-hidden="true" /></span></div>
            <div className={styles.cardContent}>
              <h2>{t("Консультация и план лечения", "Consultation & treatment plan", "Konsultasiya və müalicə planı")}</h2>
              <p>{t("Врач подберёт план лечения и уточнит стоимость на бесплатной консультации.", "Your doctor will tailor your treatment plan and confirm the cost at a free consultation.", "Həkim pulsuz konsultasiyada müalicə planını hazırlayacaq və qiyməti dəqiqləşdirəcək.")}</p>
            </div>
            <Link href={bookHref} prefetch={false} className={styles.primaryLink}><span>{t("Бесплатная консультация", "Free consultation", "Pulsuz konsultasiya")}</span><ArrowUpRight size={19} aria-hidden="true" /></Link>
          </aside>
        </header>

        <div className={styles.catalog} id="price-catalog">
          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <div className={styles.sidebarHeading}><span>{t("Направления", "Categories", "İstiqamətlər")}</span><span>{String(groups.length).padStart(2, "0")}</span></div>
              <nav aria-label={t("Категории услуг", "Service categories", "Xidmət kateqoriyaları")} className={styles.categoryNav}>
                {groups.map((group, index) => <button key={group.slug} type="button" onClick={() => scrollToCat(group.slug)} aria-current={activeCat === group.slug ? "true" : undefined}>
                  <span className={styles.categoryIndex}>{String(index + 1).padStart(2, "0")}</span><span>{group.name}</span><span className={styles.categoryCount}>{group.items.length}</span>
                </button>)}
              </nav>
              <div className={styles.sidebarHelp}><p>{t("Каждая улыбка индивидуальна. План лечения — тоже.", "Every smile is individual. Your treatment plan is too.", "Hər gülüş fərdidir. Müalicə planınız da elə.")}</p><a href="tel:+994704210204">+994 70 421 02 04<ArrowUpRight size={16} aria-hidden="true" /></a></div>
            </div>
          </aside>

          <main className={styles.main} aria-label={t("Стоимость услуг", "Service prices", "Xidmət qiymətləri")}>
            <div className={styles.searchTools}>
              <div className={styles.searchBox}><Search size={20} strokeWidth={1.5} aria-hidden="true" /><input id="price-search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t("Найти услугу в прайсе", "Find a service", "Xidmət axtarın")} aria-label={t("Поиск услуги", "Search a service", "Xidmət axtar")} />{q && <button type="button" onClick={() => setQ("")} aria-label={t("Сбросить поиск", "Clear search", "Axtarışı sıfırla")}><X size={18} aria-hidden="true" /></button>}</div>
              <div className={styles.mobileCategories}><label htmlFor="price-category">{t("Направление", "Category", "İstiqamət")}</label><div><select id="price-category" value={groups.some(g => g.slug === activeCat) ? activeCat : ""} onChange={e => scrollToCat(e.target.value)}><option value="" disabled>{t("Выбрать направление", "Choose a category", "İstiqamət seçin")}</option>{groups.map(g => <option key={g.slug} value={g.slug}>{g.name} ({g.items.length})</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div></div>
            </div>
            <div className={styles.resultsLine}><p role="status" aria-live="polite" aria-atomic="true">{t("Найдено услуг", "Services found", "Tapılan xidmətlər")}: <strong>{filtered.length}</strong></p><span>{t("СТОИМОСТЬ В AZN", "PRICES IN AZN", "QİYMƏTLƏR AZN İLƏ")}</span></div>
            <div aria-busy={q !== deferredQuery} className={styles.groups}>
              {groups.length === 0 ? <div className={styles.empty}><Search size={28} strokeWidth={1.2} aria-hidden="true" /><h2>{t("Услуги не найдены", "No services found", "Xidmət tapılmadı")}</h2><p>{t("Попробуйте другое название или сбросьте поиск.", "Try a different name or clear your search.", "Başqa ad sınayın və ya axtarışı sıfırlayın.")}</p><button type="button" onClick={() => setQ("")}>{t("Сбросить поиск", "Clear search", "Axtarışı sıfırla")}</button></div> : groups.map((group, groupIndex) => {
                const accent = accentBySlug.get(group.slug);
                return <section key={group.slug} ref={el => { sectionRefs.current[group.slug] = el; }} data-slug={group.slug} className={styles.priceGroup} aria-labelledby={`category-${makeAnchor(group.slug)}`}>
                  <header className={styles.groupHeader}><div><span className={styles.groupIndex}>{String(groupIndex + 1).padStart(2, "0")}</span><h2 id={`category-${makeAnchor(group.slug)}`}>{group.name}</h2></div><span className={styles.groupCount}>{group.items.length}</span></header>
                  <div className={styles.priceTable}>
                    {group.items.map((item, index) => {
                      const tr = getTranslation(item);
                      return <AccordionCard key={item.id} id={`price-${item.anchor}`} index={index} title={tr.service_name} price={formatPrice(item.price, item.is_from_price)} description={tr.description || undefined} accentColor={accent?.solid ?? "#b08b57"} bookHref={`${bookHref}?message=${encodeURIComponent(buildBookingMessage(tr.service_name))}`} bookLabel={bookLabel} isLast={index === group.items.length - 1} />;
                    })}
                  </div>
                </section>;
              })}
            </div>
            <div className={styles.priceNote}><span aria-hidden="true">*</span><p>{t("Окончательная стоимость зависит от клинической ситуации и определяется после диагностики. Уточнить детали и составить индивидуальный план можно на консультации.", "The final cost depends on your clinical situation and is confirmed after diagnostics. Your consultation is an opportunity to discuss the details and create an individual treatment plan.", "Yekun qiymət klinik vəziyyətdən asılıdır və diaqnostikadan sonra müəyyən edilir. Konsultasiyada ətraflı məlumat və fərdi müalicə planı əldə edə bilərsiniz.")}</p></div>
          </main>
        </div>
      </div>
    </div>
  );
}
