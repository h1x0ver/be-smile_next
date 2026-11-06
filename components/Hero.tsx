import Link from "next/link";

type Lang = "ru" | "en" | "az";

const HERO_CONTENT: Record<
  Lang,
  {
    badge: string;
    eyebrow: string;
    titleDesktop1: string;
    titleDesktop2: string;
    titleDesktop3?: string;
    titleMobile1: string;
    titleMobile2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    plaqueLabel: string;
    plaqueTitle: string;
    plaqueText: string;
    topLeftLabel: string;
    topRightLabel: string;
    imageAlt: string;
    stats: {
      value: string;
      label: string;
    }[];
  }
> = {
  ru: {
    badge: "СТОМАТОЛОГИЯ В БАКУ · BESMILE DENTAL CLINIC",
    eyebrow: "Эстетика здоровой улыбки",
    titleDesktop1: "Стоматология",
    titleDesktop2: "в Баку",
    titleMobile1: "Стоматология",
    titleMobile2: "в Баку",
    description:
      "Современная стоматология в Баку с premium-подходом: точная диагностика, лечение зубов, имплантация, виниры, коронки и естественная эстетика улыбки.",
    primaryCta: "ЗАПИСАТЬСЯ НА ПРИЁМ",
    secondaryCta: "ПОСМОТРЕТЬ УСЛУГИ",
    plaqueLabel: "BESPOKE EXPERIENCE",
    plaqueTitle: "Эстетика здоровой улыбки",
    plaqueText:
      "Индивидуальный план лечения, аккуратная диагностика и результат, который выглядит естественно.",
    topLeftLabel: "BESMILE",
    topRightLabel: "BAKU · PREMIUM DENTAL",
    imageAlt:
      "Стоматология в Баку BeSmile Dental Clinic — эстетика здоровой улыбки",
    stats: [
      { value: "10+", label: "лет опыта" },
      { value: "5000+", label: "счастливых улыбок" },
      { value: "3D", label: "цифровая диагностика" },
    ],
  },
  en: {
    badge: "DENTIST IN BAKU · BESMILE DENTAL CLINIC",
    eyebrow: "The art of a healthy smile",
    titleDesktop1: "Dentist",
    titleDesktop2: "in Baku",
    titleMobile1: "Dentist",
    titleMobile2: "in Baku",
    description:
      "BeSmile Dental Clinic in Baku offers dental treatment, implants, veneers, crowns, whitening and cosmetic dentistry with a precise, premium and personal approach.",
    primaryCta: "BOOK AN APPOINTMENT",
    secondaryCta: "EXPLORE SERVICES",
    plaqueLabel: "BESPOKE EXPERIENCE",
    plaqueTitle: "The art of a healthy smile",
    plaqueText:
      "Comfort-first diagnostics, precise care, and an aesthetic result that feels truly individual.",
    topLeftLabel: "BESMILE",
    topRightLabel: "BAKU · PREMIUM DENTAL",
    imageAlt:
      "Dentist in Baku BeSmile Dental Clinic — healthy smile aesthetics",
    stats: [
      { value: "10+", label: "years of experience" },
      { value: "5000+", label: "happy smiles" },
      { value: "3D", label: "digital diagnostics" },
    ],
  },
  az: {
    badge: "BAKIDA STOMATOLOGIYA · BESMILE DENTAL CLINIC",
    eyebrow: "Sağlam təbəssüm estetikası",
    titleDesktop1: "Bakıda",
    titleDesktop2: "stomatologiya",
    titleMobile1: "Bakıda",
    titleMobile2: "stomatologiya",
    description:
      "BeSmile Dental Clinic Bakıda diş müalicəsi, implantasiya, vinirlər, diş qapaqları, ağartma və estetik stomatologiya xidmətlərini fərdi yanaşma ilə təqdim edir.",
    primaryCta: "QƏBULA YAZILIN",
    secondaryCta: "XİDMƏTLƏRƏ BAXIN",
    plaqueLabel: "BESPOKE EXPERIENCE",
    plaqueTitle: "Sağlam təbəssüm estetikası",
    plaqueText:
      "Rahat diaqnostika, dəqiq müalicə və standart görünməyən estetik nəticə.",
    topLeftLabel: "BESMILE",
    topRightLabel: "BAKU · PREMIUM DENTAL",
    imageAlt:
      "Bakıda stomatologiya BeSmile Dental Clinic — sağlam təbəssüm estetikası",
    stats: [
      { value: "10+", label: "il təcrübə" },
      { value: "5000+", label: "xoş təbəssüm" },
      { value: "3D", label: "rəqəmsal diaqnostika" },
    ],
  },
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return "az";
}

function LuxuryButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        prefetch={false}
        className="group relative inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-full border border-[#111111] bg-[#111111] px-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_16px_36px_rgba(17,17,17,0.16)] sm:min-h-[56px] sm:px-7 lg:min-h-[58px] lg:px-8"
      >
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),transparent_34%,transparent_66%,rgba(255,255,255,0.05))]" />
        <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.16)_44%,transparent_78%)] transition-transform duration-700 group-hover:translate-x-[120%]" />
        <span className="relative z-10 text-[10px] font-medium uppercase tracking-[0.22em] text-white sm:text-[11px]">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group inline-flex min-h-[52px] items-center justify-center rounded-full border border-black/10 bg-white/82 px-6 shadow-[0_8px_24px_rgba(0,0,0,0.045)] transition-all duration-300 hover:-translate-y-[1px] hover:bg-white/95 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] sm:min-h-[56px] sm:px-7 lg:min-h-[58px] lg:px-8 supports-[backdrop-filter:blur(0px)]:bg-white/70 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#111111] sm:text-[11px]">
        {children}
      </span>
      <span className="ml-3 h-px w-7 bg-black/18 transition-all duration-300 group-hover:w-9 group-hover:bg-black/32" />
    </Link>
  );
}

export default function Hero({ lang }: { lang?: Lang }) {
  const safeLang = normalizeLang(lang);
  const t = HERO_CONTENT[safeLang];
  // Pre-encoded, responsive AVIF assets avoid a cold image-optimizer request.
  const heroImage = {
    src: "/images/hero/clinic-750.avif",
    srcSet: [480, 750, 1200, 1600].map((width) => `/images/hero/clinic-${width}.avif ${width}w`).join(", "),
    sizes: "(max-width: 640px) calc(100vw - 50px), (max-width: 1024px) 650px, (max-width: 1280px) 760px, 820px",
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#f8f6f1]">
      <link rel="preload" as="image" imageSrcSet={heroImage.srcSet} imageSizes={heroImage.sizes} fetchPriority="high" />
      {/* Atelier backdrop: one deliberate gold glow + fine dot texture, not a blob cluster */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(150deg,#fbfaf7_0%,#f8f6f1_45%,#f1ebdf_100%)]" />

        <div className="hero-ambient-light absolute right-[-18%] top-[-18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(176,139,87,0.16),transparent_68%)] sm:h-[680px] sm:w-[680px]" />
        <div className="absolute bottom-[-22%] left-[-10%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_70%)] sm:h-[460px] sm:w-[460px]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(17,17,17,0.9) 0.7px, transparent 0.7px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* Signature element: a drawn smile-arc tying the two columns together */}
      <svg
        className="pointer-events-none absolute left-[6%] right-[4%] top-[54%] hidden h-[120px] w-[90%] lg:block"
        viewBox="0 0 1200 120"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 10 Q 600 150 1200 10"
          stroke="#b08b57"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          className="hero-arc-path"
        />
        <circle cx="4" cy="10" r="3" fill="#b08b57" className="hero-arc-dot" />
        <circle
          cx="1196"
          cy="10"
          r="3"
          fill="#b08b57"
          className="hero-arc-dot"
        />
      </svg>

      <div className="relative mx-auto max-w-[1680px] px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 md:px-8 lg:px-10 lg:pb-14 xl:px-12 2xl:px-14">
        <div className="grid min-h-[calc(100svh-120px)] grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-0">
          <div className="relative z-20 order-1 self-start pt-2 lg:col-span-5 lg:pt-0 xl:pr-4 2xl:pr-6">
            <div className="hero-reveal hero-reveal-1 mb-5 inline-flex max-w-full items-center gap-3 rounded-full border border-[#b08b57]/35 bg-white/50 px-4 py-2 sm:mb-7 supports-[backdrop-filter:blur(0px)]:bg-white/34 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inset-0 motion-safe:animate-[ping_3s_ease-out_2] rounded-full bg-[#b08b57]/60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
              </span>
              <span className="truncate text-[9px] font-medium uppercase tracking-[0.22em] text-black/54 sm:text-[10px] sm:tracking-[0.26em]">
                {t.badge}
              </span>
            </div>

            <div>
              <p className="hero-reveal hero-reveal-2 mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-black/42 sm:mb-5 sm:text-[11px]">
                {t.eyebrow}
              </p>

              <h1 className="max-w-[560px] text-[44px] font-[320] leading-[1] text-[#111111] sm:text-[64px] md:text-[76px] lg:text-[clamp(48px,4.7vw,84px)]">
                <span className="hero-reveal hero-reveal-3 block">
                  {t.titleDesktop1}
                </span>
                <span className="hero-reveal hero-reveal-4 relative block text-black/82">
                  {t.titleDesktop2}
                  <svg
                    className="absolute left-0 top-[100%] h-[10px] w-[70%] max-w-[220px]"
                    viewBox="0 0 220 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6 Q 60 0 110 5 T 218 4"
                      stroke="#b08b57"
                      strokeOpacity="0.55"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      className="hero-arc-path"
                      style={{ strokeDasharray: 240, animationDelay: "0.75s" }}
                    />
                  </svg>
                </span>
                {t.titleDesktop3 && (
                  <span className="hero-reveal hero-reveal-5 mt-2 block text-[0.42em] uppercase tracking-[0.36em] text-black/34">
                    {t.titleDesktop3}
                  </span>
                )}
              </h1>
            </div>

            <div className="mt-8 max-w-[520px] sm:mt-9">
              <p className="hero-reveal hero-reveal-5 max-w-[500px] text-[15px] leading-8 text-black/60 sm:text-[16px] sm:leading-8">
                {t.description}
              </p>

              <div className="hero-reveal hero-reveal-6 mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
                <LuxuryButton href={`/${safeLang}/book-online`} variant="primary">
                  {t.primaryCta}
                </LuxuryButton>

                <LuxuryButton href={`/${safeLang}/services`} variant="secondary">
                  {t.secondaryCta}
                </LuxuryButton>
              </div>

              <div className="hero-reveal hero-reveal-7 mt-8 max-w-[500px] border-t border-black/8 pt-6 sm:mt-10 sm:pt-7">
                <div className="grid grid-cols-3 gap-4 sm:gap-7">
                  {t.stats.map((item) => (
                    <div key={item.label} className="group min-w-0">
                      <div className="text-[19px] font-[300] leading-none tracking-[0.01em] text-[#111111] sm:text-[23px]">
                        {item.value}
                      </div>
                      <div className="mt-2 text-[9px] uppercase leading-[1.35] tracking-[0.16em] text-black/42 sm:text-[10px] sm:tracking-[0.18em]">
                        {item.label}
                      </div>
                      <div className="mt-2 h-px w-5 bg-[#b08b57]/45 transition-all duration-300 group-hover:w-9" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 order-2 lg:col-span-7 lg:-ml-8 xl:-ml-12 2xl:-ml-16">
            <div className="hero-reveal-media relative mx-auto w-full max-w-[560px] sm:max-w-[650px] lg:max-w-[760px] xl:max-w-[820px]">
              {/* Gallery-label hairline frame instead of a heavy glass blob */}
              <div className="relative overflow-hidden rounded-[28px] border border-[#b08b57]/25 bg-white/30 p-2 shadow-[0_24px_60px_rgba(17,17,17,0.10)] sm:rounded-[34px] sm:p-3 lg:rounded-[40px] supports-[backdrop-filter:blur(0px)]:bg-white/14 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md">
                {/* corner ticks */}
                <span className="pointer-events-none absolute left-3 top-3 z-20 h-4 w-4 rounded-tl-[6px] border-l border-t border-[#b08b57]/60 sm:left-4 sm:top-4" />
                <span className="pointer-events-none absolute right-3 top-3 z-20 h-4 w-4 rounded-tr-[6px] border-r border-t border-[#b08b57]/60 sm:right-4 sm:top-4" />
                <span className="pointer-events-none absolute bottom-3 left-3 z-20 h-4 w-4 rounded-bl-[6px] border-b border-l border-[#b08b57]/60 sm:bottom-4 sm:left-4" />
                <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-4 w-4 rounded-br-[6px] border-b border-r border-[#b08b57]/60 sm:bottom-4 sm:right-4" />

                <div className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] lg:rounded-[36px]">
                  <div className="relative h-[340px] w-full overflow-hidden sm:h-[450px] md:h-[540px] lg:h-[610px] xl:h-[660px]">
                    <div className="hero-parallax absolute inset-[-6%_0]">
                    <div className="hero-kenburns absolute inset-0">
                      {/* Responsive assets are encoded before deployment. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img {...heroImage} alt={t.imageAlt} loading="eager" fetchPriority="high" decoding="sync" className="absolute inset-0 h-full w-full object-cover object-center" />
                    </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.05),rgba(17,17,17,0.00)_28%,rgba(17,17,17,0.12)_100%)]" />
                  <div className="absolute inset-y-0 left-0 w-[16%] bg-[linear-gradient(90deg,rgba(248,246,241,0.18),transparent)] lg:w-[11%]" />

                  <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between rounded-full border border-white/20 bg-black/20 px-3 py-2.5 sm:left-5 sm:right-5 sm:top-5 sm:px-4 sm:py-3 lg:left-6 lg:right-6 lg:top-6 supports-[backdrop-filter:blur(0px)]:bg-black/10 supports-[backdrop-filter:blur(0px)]:backdrop-blur-md">
                    <span className="text-[8px] uppercase tracking-[0.24em] text-white/80 sm:text-[10px] sm:tracking-[0.28em]">
                      {t.topLeftLabel}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.24em] text-white/80 sm:text-[10px] sm:tracking-[0.28em]">
                      {t.topRightLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ animationDelay: "1s" }} className="hero-reveal relative -mt-6 ml-auto w-[92%] sm:-mt-10 sm:w-[82%] lg:absolute lg:bottom-[32px] lg:left-[-56px] lg:ml-0 lg:w-[320px] xl:bottom-[36px] xl:left-[-78px] xl:w-[372px] 2xl:left-[-92px] 2xl:w-[400px]">
                <div className="hero-float relative rounded-[24px] border border-[#b08b57]/30 bg-white/88 px-4 py-4 shadow-[0_18px_44px_rgba(17,17,17,0.09)] sm:rounded-[30px] sm:px-6 sm:py-6 supports-[backdrop-filter:blur(0px)]:bg-white/78 supports-[backdrop-filter:blur(0px)]:backdrop-blur-lg">
                  <span className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 rounded-tl-[4px] border-l border-t border-[#b08b57]/50 sm:left-3.5 sm:top-3.5" />
                  <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 rounded-br-[4px] border-b border-r border-[#b08b57]/50 sm:bottom-3.5 sm:right-3.5" />

                  <div className="flex items-center gap-3">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#b08b57]" />
                    <span className="text-[9px] uppercase tracking-[0.22em] text-black/46 sm:text-[10px] sm:tracking-[0.24em]">
                      {t.plaqueLabel}
                    </span>
                  </div>

                  <div className="mt-3 text-[20px] font-[300] leading-[1.08] tracking-[0.015em] text-[#111111] sm:mt-4 sm:text-[25px] xl:text-[27px]">
                    {t.plaqueTitle}
                  </div>

                  <div className="mt-2.5 text-[13px] leading-6 text-black/60 sm:mt-3 sm:text-[14px] sm:leading-7">
                    {t.plaqueText}
                  </div>

                  <div className="mt-4 h-px w-full bg-[linear-gradient(90deg,rgba(176,139,87,0.28),rgba(176,139,87,0.08),transparent)] sm:mt-5" />
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-2 left-[14%] right-[6%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(176,139,87,0.3),transparent)] lg:block" />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
          <span className="h-8 w-px bg-[linear-gradient(180deg,rgba(176,139,87,0.5),transparent)]" />
          <span className="hero-scrollcue-dot h-1.5 w-1.5 rounded-full bg-[#b08b57]/70" />
        </div>
      </div>
    </section>
  );
}
