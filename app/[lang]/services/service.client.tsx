

import Link from "next/link";
import Image from "next/image";

import { ArrowUpRight } from "lucide-react";

type Lang = "ru" | "en" | "az";

type ServiceTranslation = {
  title?: string | null;
  description?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

type ServiceItem = {
  id: string | number;
  slug?: string | null;
  cover?: string | null;
  order?: number | string | null;
  t?: ServiceTranslation | null;
};

interface Props {
  lang: Lang;
  title: string;
  services: ServiceItem[];
}

const copy = {
  eyebrow: {
    ru: "ПРЕМИАЛЬНЫЙ ПОДХОД",
    en: "PREMIUM CARE",
    az: "PREMIUM YANAŞMA",
  },
  intro: {
    ru: "От диагностики до финального результата — каждая услуга выстроена вокруг точности, комфорта и естественной эстетики.",
    en: "From diagnostics to the final result — every service is built around precision, comfort and natural aesthetics.",
    az: "Diaqnostikadan yekun nəticəyə qədər — hər xidmət dəqiqlik, komfort və təbii estetika üzərində qurulub.",
  },
  trust: {
    ru: ["Точная диагностика", "Индивидуальный план", "Комфортная атмосфера"],
    en: ["Precise diagnostics", "A personal plan", "A comfortable atmosphere"],
    az: ["Dəqiq diaqnostika", "Fərdi plan", "Rahat mühit"],
  },
  processEyebrow: {
    ru: "КАК ЭТО ПРОХОДИТ",
    en: "HOW IT WORKS",
    az: "NECƏ İŞLƏYİR",
  },
  processTitle: {
    ru: "Путь пациента",
    en: "The patient journey",
    az: "Pasiyentin yolu",
  },
  processSteps: {
    ru: [
      { title: "Консультация", text: "Обсуждаем цели и ожидания, отвечаем на все вопросы." },
      { title: "Диагностика", text: "3D-сканирование и точная клиническая оценка." },
      { title: "Лечение", text: "Комфортные протоколы и контроль на каждом этапе." },
      { title: "Результат", text: "Естественная эстетика и долгосрочный эффект." },
    ],
    en: [
      { title: "Consultation", text: "We discuss goals and expectations, answer every question." },
      { title: "Diagnostics", text: "3D scanning and a precise clinical assessment." },
      { title: "Treatment", text: "Comfortable protocols with control at every stage." },
      { title: "Result", text: "Natural aesthetics and a lasting effect." },
    ],
    az: [
      { title: "Konsultasiya", text: "Məqsədləri müzakirə edir, bütün suallara cavab veririk." },
      { title: "Diaqnostika", text: "3D skan və dəqiq klinik qiymətləndirmə." },
      { title: "Müalicə", text: "Rahat protokollar və hər mərhələdə nəzarət." },
      { title: "Nəticə", text: "Təbii estetika və uzunmüddətli effekt." },
    ],
  },
  statsTitle: {
    ru: "BeSmile в цифрах",
    en: "BeSmile in numbers",
    az: "Rəqəmlərdə BeSmile",
  },
  stats: {
    ru: [
      { value: 10, suffix: "+", label: "лет практики" },
      { value: 5000, suffix: "+", label: "довольных пациентов" },
      { value: 3, suffix: "D", label: "цифровая диагностика" },
    ],
    en: [
      { value: 10, suffix: "+", label: "years in practice" },
      { value: 5000, suffix: "+", label: "happy patients" },
      { value: 3, suffix: "D", label: "digital diagnostics" },
    ],
    az: [
      { value: 10, suffix: "+", label: "il təcrübə" },
      { value: 5000, suffix: "+", label: "məmnun pasiyent" },
      { value: 3, suffix: "D", label: "rəqəmsal diaqnostika" },
    ],
  },
  ctaTitle: {
    ru: "Не уверены, какая услуга подойдёт?",
    en: "Not sure which service fits?",
    az: "Hansı xidmətin uyğun olduğundan əmin deyilsiniz?",
  },
  ctaText: {
    ru: "Запишитесь на бесплатную консультацию — врач поможет подобрать план лечения индивидуально.",
    en: "Book a free consultation — our doctor will help you choose a personal treatment plan.",
    az: "Pulsuz konsultasiyaya yazılın — həkim sizə fərdi müalicə planı seçməyə kömək edəcək.",
  },
  ctaButton: {
    ru: "Записаться на консультацию",
    en: "Book a consultation",
    az: "Konsultasiyaya yazıl",
  },
  empty: {
    ru: "Услуги пока недоступны",
    en: "No services available yet",
    az: "Hələ xidmət mövcud deyil",
  },
  cta: {
    ru: "Подробнее",
    en: "Discover",
    az: "Ətraflı",
  },
};

function cleanText(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function buildImageUrl(cover?: string | null) {
  const cleanCover = cleanText(cover);

  if (!cleanCover) return "";
  if (cleanCover.startsWith("http")) return cleanCover;

  return `https://portal.besmile.az/assets/${cleanCover}`;
}

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cheap ambient glow — a radial-gradient background instead of
 * `filter: blur(120px)`. The old version ran heavily-blurred blobs on
 * an infinite animation loop for the entire time the page was open —
 * one of the most expensive things a GPU can be asked to redo forever.
 * A gradient fades out on its own with zero filter cost, so the
 * floating motion stays but the paint cost drops to nearly nothing.
 */
function Glow({
  backgroundImage,
  className = "",
}: {
  backgroundImage: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ backgroundImage }}
    />
  );
}

/** Counts up from 0 to `value` once the element scrolls into view. */
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) { return <span>{value}{suffix}</span>; }

/** Full-width block between card rows: a four-step patient journey with
 *  a hairline that draws itself in as it scrolls into view. */
function ProcessBlock({ lang }: { lang: Lang }) {
  
  const steps = copy.processSteps[lang];

  return (
    <div
      
      className="relative overflow-hidden rounded-[30px] border border-black/8 bg-white/55 p-6 backdrop-blur-md sm:p-8 md:col-span-2 lg:p-10"
    >
      <Glow
        className="right-[-6%] top-[-30%] h-[280px] w-[280px]"
        backgroundImage="radial-gradient(circle, rgba(217,199,162,0.28), transparent 70%)"
      />

      <div className="relative z-10">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9ae7b]" />
              <span className="text-[10px] uppercase tracking-[0.26em] text-black/50">
                {copy.processEyebrow[lang]}
              </span>
            </div>
            <h2 className="text-[24px] font-[300] uppercase tracking-[0.04em] text-[#111111] sm:text-[30px]">
              {copy.processTitle[lang]}
            </h2>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {/* connecting hairline — draws in on scroll, desktop only */}
          <svg
            className="pointer-events-none absolute left-0 top-[26px] hidden h-[2px] w-full md:block"
            viewBox="0 0 800 2"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="60"
              y1="1"
              x2="740"
              y2="1"
              stroke="rgba(17,17,17,0.12)"
              strokeWidth="1"

            />
          </svg>

          {steps.map((step, index) => (
            <div key={step.title}  className="relative">
              <div className="relative z-10 flex flex-col items-start">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[12px] font-medium text-black/60 shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
                  {formatIndex(index)}
                </div>
                <div className="text-[15px] font-[400] uppercase tracking-[0.04em] text-[#111111] sm:text-[16px]">
                  {step.title}
                </div>
                <p className="mt-1.5 text-[13px] leading-6 text-black/58 sm:text-[13.5px]">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Full-width block: dark stats band with a scroll-triggered count-up. */
function StatsBlock({ lang }: { lang: Lang }) {
  
  const stats = copy.stats[lang];

  return (
    <div
      
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111111] px-6 py-10 sm:px-8 sm:py-12 md:col-span-2"
    >
      <Glow
        className="left-[-8%] top-[-40%] h-[300px] w-[300px]"
        backgroundImage="radial-gradient(circle, rgba(215,189,146,0.18), transparent 70%)"
      />
      <Glow
        className="right-[-6%] bottom-[-40%] h-[260px] w-[260px]"
        backgroundImage="radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)"
      />

      <div className="relative z-10">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 sm:mb-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
          <span className="text-[10px] uppercase tracking-[0.26em] text-white/55">
            {copy.statsTitle[lang]}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} >
              <div className="font-manrope text-[44px] font-[300] leading-none text-white sm:text-[52px]">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-white/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PremiumServiceCard({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <div className={`group relative ${className}`}>{children}</div>; }

type IndexedService = ServiceItem & { _index: number };

function ServiceCard({
  service,
  lang,
}: {
  service: IndexedService;
  lang: Lang;
}) {
  
  const title = cleanText(service.t?.title);
  const description = stripHtml(service.t?.description);
  const slug = cleanText(service.slug);
  const imageSrc = buildImageUrl(service.cover);
  const index = service._index;

  return (
    <article  className="relative h-full">
      <PremiumServiceCard className="h-full">
        <Link
          href={`/${lang}/services/${slug}`}
          className="relative block h-full overflow-hidden rounded-[30px] bg-[#ebe6de] shadow-[0_24px_80px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
        >
          <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] xl:h-[540px]">
            <div className="absolute inset-0">
              <div
                className="h-full w-full"

              >
                <Image
                  src={imageSrc}
                  alt={title || "Service image"}
                  fill
                  quality={78}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  preload={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-black/5" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.14),transparent_20%,transparent_72%,rgba(0,0,0,0.12))]" />
            <div className="absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/18" />

            <Glow
              className="right-[-30px] top-[-40px] h-[180px] w-[180px] transition-transform duration-700 group-hover:scale-125"
              backgroundImage="radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%)"
            />
            <Glow
              className="bottom-[-50px] left-[-20px] h-[160px] w-[160px]"
              backgroundImage="radial-gradient(circle, rgba(215,189,146,0.28), transparent 70%)"
            />

            <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-5 pt-5 sm:px-6 sm:pt-6 lg:px-7 lg:pt-7">
              <div className="flex h-9 min-w-[52px] items-center justify-center rounded-full border border-white/20 bg-black/18 px-3 backdrop-blur-md">
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/80">
                  {formatIndex(index)}
                </span>
              </div>

              <div

                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/[0.08] text-white/90 backdrop-blur-md"
              >
                <ArrowUpRight className="h-4 w-4 stroke-[1.7]" />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 lg:p-7">
              <div

                className="rounded-[24px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] px-5 pb-5 pt-5 backdrop-blur-[14px] sm:px-6 sm:pb-6 sm:pt-6 lg:px-7 lg:pb-7 lg:pt-6"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/62 sm:text-[11px]">
                    Besmile
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-white/62 sm:text-[11px]">
                    {copy.cta[lang]}
                  </span>
                </div>

                <h3 className="line-clamp-2 text-[22px] font-[300] uppercase leading-[1.1] tracking-[0.03em] text-white sm:text-[26px] lg:text-[30px] xl:text-[32px]">
                  {title}
                </h3>

                {description ? (
                  <p className="mt-3 line-clamp-1 text-[13px] leading-6 text-white/60 sm:text-[13.5px]">
                    {description}
                  </p>
                ) : null}

                <div className="mt-5 flex items-center gap-3">
                  <span className="h-px w-10 bg-white/30 transition-all duration-500 group-hover:w-14" />
                  <span className="text-[11px] uppercase tracking-[0.24em] text-white/70">
                    {copy.cta[lang]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </PremiumServiceCard>
    </article>
  );
}

function ClosingCta({ lang }: { lang: Lang }) {
  return (
    <article  className="relative h-full md:col-span-2">
      <div className="relative flex h-full min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-[#111111] px-6 py-14 text-center shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:py-16">
        <Glow
          className="left-[-8%] top-[-30%] h-[320px] w-[320px]"
          backgroundImage="radial-gradient(circle, rgba(215,189,146,0.2), transparent 70%)"
        />
        <Glow
          className="right-[-8%] bottom-[-30%] h-[320px] w-[320px]"
          backgroundImage="radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)"
        />

        <div className="relative z-10 mx-auto max-w-[560px]">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
            <span className="text-[10px] uppercase tracking-[0.26em] text-white/55">
              {copy.eyebrow[lang]}
            </span>
          </div>

          <h3 className="text-[24px] font-[300] uppercase leading-[1.15] tracking-[0.03em] text-white sm:text-[30px]">
            {copy.ctaTitle[lang]}
          </h3>

          <p className="mx-auto mt-4 max-w-[440px] text-[14px] leading-7 text-white/62 sm:text-[15px]">
            {copy.ctaText[lang]}
          </p>

          <Link
            href={`/${lang}/book-online`}
            className="group mt-8 inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-white px-7 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7bd92]"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#111111]">
              {copy.ctaButton[lang]}
            </span>
            <ArrowUpRight className="h-4 w-4 stroke-[1.7] text-[#111111] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ServicesClient({ lang, title, services }: Props) {

  const validServices: IndexedService[] = services
    .filter(
      (service) =>
        cleanText(service?.t?.title) &&
        cleanText(service?.cover) &&
        cleanText(service?.slug)
    )
    .map((service, index) => ({ ...service, _index: index }));

  // Interstitial blocks are woven between fixed-size chunks of cards so the
  // page reads as a sequence of distinct moments instead of one long grid,
  // regardless of how many services the CMS returns.
  const chunkOne = validServices.slice(0, 4);
  const chunkTwo = validServices.slice(4, 8);
  const chunkThree = validServices.slice(8);

  return (
    <section className="relative overflow-hidden bg-[#f8f6f1] text-neutral-950">
      {/* premium background — gradients only, no filter:blur() */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Glow
          className="left-[-10%] top-[-8%] h-[420px] w-[420px]"
          backgroundImage="radial-gradient(circle, rgba(217,199,162,0.4), transparent 70%)"
        />
        <Glow
          className="right-[-8%] top-[14%] h-[360px] w-[360px]"
          backgroundImage="radial-gradient(circle, rgba(176,139,87,0.22), transparent 70%)"
        />
        <Glow
          className="bottom-[8%] left-[18%] h-[300px] w-[300px]"
          backgroundImage="radial-gradient(circle, rgba(237,227,208,0.9), transparent 70%)"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent_26%,rgba(255,255,255,0.4))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 md:px-8 md:pb-24 md:pt-20 xl:px-12 xl:pb-32 xl:pt-24">
        {/* eyebrow + heading + intro */}
        <div

          className="mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9ae7b]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-black/55">
              {copy.eyebrow[lang]}
            </span>
          </div>
        </div>

        <div

          className="flex items-center justify-center"
        >
          <div className="flex items-baseline gap-4 sm:gap-6 lg:gap-10">
            <span className="text-[42px] font-[200] text-black/80 sm:text-[64px] lg:text-[92px]">
              [
            </span>
            <h1 className="font-manrope text-[38px] font-[300] leading-[0.95] tracking-[0.18em] text-black sm:text-[56px] lg:text-[86px] xl:text-[96px]">
              {title}
            </h1>
            <span className="text-[42px] font-[200] text-black/80 sm:text-[64px] lg:text-[92px]">
              ]
            </span>
          </div>
        </div>

        <p

          className="mx-auto mt-6 max-w-[560px] text-center text-[15px] leading-7 text-black/62 sm:text-[16px]"
        >
          {copy.intro[lang]}
        </p>

        <div

          className="mb-14 mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:mb-16 lg:mb-20"
        >
          {copy.trust[lang].map((label) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/70 px-3.5 py-2 backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-black/55">
                {label}
              </span>
            </div>
          ))}
        </div>

        {validServices.length === 0 ? (
          <div className="rounded-[28px] border border-black/8 bg-white/70 px-6 py-16 text-center text-black/50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
            {copy.empty[lang]}
          </div>
        ) : (
          <div

            className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 xl:grid-cols-2 xl:gap-8"
          >
            {chunkOne.map((service) => (
              <ServiceCard key={service.id} service={service} lang={lang}  />
            ))}

            <ProcessBlock lang={lang} />

            {chunkTwo.map((service) => (
              <ServiceCard key={service.id} service={service} lang={lang}  />
            ))}

            <StatsBlock lang={lang} />

            {chunkThree.map((service) => (
              <ServiceCard key={service.id} service={service} lang={lang}  />
            ))}

            <ClosingCta lang={lang}  />
          </div>
        )}
      </div>

      <style >{`
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

        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-delayed {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
