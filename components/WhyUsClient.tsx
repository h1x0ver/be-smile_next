

import Reveal from "./Reveal";
import ExpandableDescription from "./ExpandableDescription";

export type Lang = "en" | "ru" | "az";

export interface WhyUsItem {
  id?: string | number;
  number?: string;
  translations?: Array<{
    language?: string;
    languages_code?: string;
    title?: string;
    description?: string;
  }>;
}

interface Props {
  lang?: Lang;
  items?: WhyUsItem[];
}

const CONTENT: Record<
  Lang,
  {
    eyebrow: string;
    title1: string;
    title2: string;
    intro: string;
    mobileIntro: string;
    manifesto: string;
    featuredReason: string;
    featuredBadge: string;
    cardBadge: string;
    moreLabel: string;
    hideLabel: string;
    values: Array<{ label: string; value: string }>;
    detailRows: Array<{ title: string; text: string }>;
  }
> = {
  en: {
    eyebrow: "Why BeSmile",
    title1: "WHY",
    title2: "PATIENTS CHOOSE US",
    intro:
      "A premium dental experience built around precision, calm atmosphere and aesthetic confidence.",
    mobileIntro:
      "Precision, comfort and aesthetic confidence — in one premium treatment experience.",
    manifesto:
      "Every detail — from diagnostics and equipment to comfort and doctor expertise — is designed to make patients feel assured, calm and cared for at the highest level.",
    featuredReason: "Featured Reason",
    featuredBadge: "Premium Standard",
    cardBadge: "BeSmile Care",
    moreLabel: "Open more",
    hideLabel: "Hide",
    values: [
      { label: "Approach", value: "Precision" },
      { label: "Atmosphere", value: "Comfort" },
    ],
    detailRows: [
      {
        title: "Technology & expertise",
        text: "Advanced diagnostics, modern treatment protocols and carefully selected specialists.",
      },
      {
        title: "Calm premium experience",
        text: "A refined environment where comfort, trust and aesthetics are part of the treatment journey.",
      },
    ],
  },
  ru: {
    eyebrow: "Почему BeSmile",
    title1: "ПОЧЕМУ",
    title2: "ВЫБИРАЮТ НАС",
    intro:
      "Премиальный стоматологический опыт, выстроенный вокруг точности, спокойствия и эстетического результата.",
    mobileIntro:
      "Точность, комфорт и эстетика — в одном премиальном опыте лечения.",
    manifesto:
      "Каждая деталь — от диагностики и оборудования до уровня комфорта и экспертизы врачей — собрана так, чтобы пациент чувствовал уверенность, спокойствие и высокий стандарт care.",
    featuredReason: "Ключевое преимущество",
    featuredBadge: "Премиальный стандарт",
    cardBadge: "Забота BeSmile",
    moreLabel: "Открыть подробнее",
    hideLabel: "Скрыть",
    values: [
      { label: "Подход", value: "Точность" },
      { label: "Атмосфера", value: "Комфорт" },
    ],
    detailRows: [
      {
        title: "Технологии и экспертиза",
        text: "Современная диагностика, продуманные протоколы лечения и команда сильных специалистов.",
      },
      {
        title: "Спокойный premium-опыт",
        text: "Пространство, где комфорт, доверие и эстетика становятся частью всего пути лечения.",
      },
    ],
  },
  az: {
    eyebrow: "Why BeSmile",
    title1: "NİYƏ",
    title2: "BİZİ SEÇİRLƏR",
    intro:
      "Dəqiqlik, rahat atmosfer və estetik nəticə üzərində qurulmuş premium stomatoloji təcrübə.",
    mobileIntro:
      "Dəqiqlik, rahatlıq və estetika — vahid premium müalicə təcrübəsində.",
    manifesto:
      "Diaqnostikadan avadanlığa, komfortdan həkim peşəkarlığına qədər hər detal pasiyentə güvən, rahatlıq və yüksək səviyyəli qayğı hissi vermək üçün düşünülüb.",
    featuredReason: "Əsas üstünlük",
    featuredBadge: "Premium standart",
    cardBadge: "BeSmile qayğısı",
    moreLabel: "Ətraflı bax",
    hideLabel: "Gizlət",
    values: [
      { label: "Yanaşma", value: "Dəqiqlik" },
      { label: "Atmosfer", value: "Rahatlıq" },
    ],
    detailRows: [
      {
        title: "Texnologiya və peşəkarlıq",
        text: "Müasir diaqnostika, düşünülmüş müalicə protokolları və güclü mütəxəssis komandası.",
      },
      {
        title: "Sakit premium təcrübə",
        text: "Komfort, güvən və estetikanın bütün müalicə yolunun bir hissəsinə çevrildiyi mühit.",
      },
    ],
  },
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return "az";
}

/**
 * Cheap decorative glow — replaces the old pattern of 2–3 separate
 * `filter: blur(Npx)` circles per card. `filter: blur()` forces the
 * browser to rasterize and re-blur pixels on every paint, and it gets
 * expensive fast when stacked on top of a `` card. A
 * radial-gradient background fades out smoothly on its own with zero
 * filter cost, so visually it reads the same "soft light" but is
 * effectively free to paint. One div instead of three.
 */
function Glow({ backgroundImage }: { backgroundImage: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage }}
    />
  );
}

function getLocalizedItems(items: WhyUsItem[], safeLang: Lang) {
  return items
    .map((item, index) => {
      const translations = Array.isArray(item.translations) ? item.translations : [];
      const t =
        translations.find((tr) => (tr.language || tr.languages_code) === safeLang) ||
        translations[0];

      if (!t) return null;

      return {
        id: item.id ?? index,
        number: item.number ?? String(index + 1).padStart(2, "0"),
        title: t.title ?? "",
        description: t.description ?? "",
      };
    })
    .filter(Boolean) as Array<{
    id: string | number;
    number: string;
    title: string;
    description: string;
  }>;
}

export default function WhyUsClient({ lang, items = [] }: Props) {
  const safeLang = normalizeLang(lang);
  const content = CONTENT[safeLang];
  const localized = getLocalizedItems(items, safeLang);

  const [featured, ...rest] = localized;

  return (
    <section className="relative overflow-hidden">
      {/* Ambient background light — gradients only, no filter:blur() */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(360px circle at 50% 96px, rgba(216,193,154,0.10), transparent 70%), radial-gradient(280px circle at 100% 18%, rgba(239,228,211,0.4), transparent 70%)",
        }}
      />

      <div className="relative z-10 px-4 pb-16 pt-16 sm:px-6 md:px-10 lg:px-16 xl:px-20 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
            <Reveal

              className="lg:col-span-5"
            >
              <div className="relative h-full overflow-hidden rounded-[28px] border border-white/60 bg-white/72 p-5 shadow-[0_18px_52px_rgba(0,0,0,0.055)] supports-[backdrop-filter:blur(0px)]:bg-white/60 sm:rounded-[34px] sm:p-7 lg:min-h-[620px] lg:p-10">
                <Glow backgroundImage="radial-gradient(160px circle at -5% 0%, rgba(217,199,162,0.22), transparent 70%), radial-gradient(160px circle at 100% 100%, rgba(237,227,208,0.75), transparent 70%), linear-gradient(145deg, rgba(255,255,255,0.64), rgba(255,255,255,0.18))" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 supports-[backdrop-filter:blur(0px)]:bg-white/76 sm:mb-8">
                    <span className="h-2 w-2 rounded-full bg-[#c9ae7b]" />
                    <span className="text-[10px] uppercase tracking-[0.32em] text-black/55">
                      {content.eyebrow}
                    </span>
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <div className="leading-[0.92] text-[#111111]">
                      <div className="text-[34px] font-[300] uppercase tracking-[0.14em] sm:text-[58px] lg:text-[72px] text-balance">
                        {content.title1}
                      </div>
                      <div className="mt-2 max-w-[12ch] text-[28px] font-[300] uppercase tracking-[0.08em] sm:max-w-none sm:text-[46px] lg:text-[58px] text-balance">
                        {content.title2}
                      </div>
                    </div>

                    <p className="mt-6 hidden max-w-[520px] text-[15px] leading-7 text-black/70 sm:block sm:text-[16px]">
                      {content.intro}
                    </p>

                    <p className="mt-5 max-w-[360px] text-[14px] leading-6 text-black/68 sm:hidden">
                      {content.mobileIntro}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:hidden">
                    {content.values.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[20px] border border-white/70 bg-white/78 px-3.5 py-3.5 supports-[backdrop-filter:blur(0px)]:bg-white/72"
                      >
                        <div className="text-[9px] uppercase tracking-[0.24em] text-black/42">
                          {item.label}
                        </div>
                        <div className="mt-1.5 text-[14px] font-[300] uppercase tracking-[0.06em] text-[#111111]">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden sm:block">
                    <div className="mb-8 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.18),rgba(17,17,17,0.05),transparent)]" />

                    <div className="space-y-5">
                      {content.detailRows.map((row) => (
                        <div
                          key={row.title}
                          className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-5"
                        >
                          <div className="text-[10px] uppercase tracking-[0.28em] text-black/42">
                            {row.title}
                          </div>
                          <p className="max-w-[440px] text-[15px] leading-7 text-black/66">
                            {row.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="my-8 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.12),rgba(17,17,17,0.03),transparent)]" />

                    <p className="max-w-[520px] text-[15px] leading-7 text-black/68 sm:text-[16px]">
                      {content.manifesto}
                    </p>

                    <div className="mt-auto pt-10">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {content.values.map((item) => (
                          <div
                            key={item.label}
                            className="rounded-[24px] border border-white/60 bg-white/72 px-4 py-4 supports-[backdrop-filter:blur(0px)]:bg-white/58"
                          >
                            <div className="text-[10px] uppercase tracking-[0.28em] text-black/45">
                              {item.label}
                            </div>
                            <div className="mt-2 text-[18px] font-[300] uppercase tracking-[0.06em] text-[#111111]">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                {featured ? (
                  <Reveal as="article"

                    className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-[#111111] p-5 text-white shadow-[0_22px_64px_rgba(0,0,0,0.15)] md:col-span-2 sm:rounded-[34px] sm:p-8 lg:min-h-[320px] transition-[translate,box-shadow,background-color,border-color,color] duration-400"
                  >
                    <Glow backgroundImage="radial-gradient(170px circle at 0% 0%, rgba(215,189,146,0.22), transparent 70%), radial-gradient(200px circle at 100% 0%, rgba(255,255,255,0.12), transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.06), transparent 42%)" />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                        <div className="inline-flex rounded-full border border-white/15 bg-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-white/55 ">
                          {content.featuredReason}
                        </div>
                        <div className="text-[28px] font-[300] leading-none text-white/25 sm:text-[42px]">
                          {featured.number}
                        </div>
                      </div>

                      <h3 className="max-w-[540px] text-[26px] font-[300] uppercase leading-[1] tracking-[0.05em] text-white sm:text-[42px]">
                        {featured.title}
                      </h3>

                      <p className="mt-4 line-clamp-3 max-w-[640px] text-[14px] leading-6 text-white/72 sm:mt-6 sm:line-clamp-none sm:text-[16px] sm:leading-8">
                        {featured.description}
                      </p>

                      <div className="mt-7 sm:mt-auto sm:pt-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-white/50 ">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                          {content.featuredBadge}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ) : null}

                {rest.map((item, index) => {
                  const isWide = index === 2;

                  return (
                    <Reveal as="article"
                      key={item.id}

                      className={`group relative overflow-hidden rounded-[24px] border border-white/60 bg-white/76 p-4 shadow-[0_16px_44px_rgba(0,0,0,0.06)] supports-[backdrop-filter:blur(0px)]:bg-white/68 sm:rounded-[30px] sm:p-7 transition-all duration-400 ${
                        isWide ? "md:col-span-2" : ""
                      }`}
                    >
                      <Glow backgroundImage="radial-gradient(120px circle at -8% 0%, rgba(217,199,162,0.2), transparent 70%), radial-gradient(110px circle at 100% 100%, rgba(237,227,208,0.85), transparent 70%), linear-gradient(145deg, rgba(255,255,255,0.54), rgba(255,255,255,0.18))" />

                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
                          <div className="inline-flex rounded-full border border-black/10 bg-white/78 px-3 py-1.5 text-[9px] uppercase tracking-[0.24em] text-black/48 supports-[backdrop-filter:blur(0px)]:bg-white/70 sm:text-[10px] sm:tracking-[0.28em]">
                            {content.cardBadge}
                          </div>
                          <div className="text-[24px] font-[300] leading-none text-black/18 sm:text-[38px]">
                            {item.number}
                          </div>
                        </div>

                        <div className="mb-4 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.18),rgba(17,17,17,0.04),transparent)] sm:mb-5" />

                        <h3 className="max-w-[360px] text-[22px] font-[300] uppercase leading-[1.02] tracking-[0.04em] text-[#111111] sm:text-[30px]">
                          {item.title}
                        </h3>

                        <div className="mt-4 sm:mt-5">
                          <ExpandableDescription description={item.description} wide={isWide} moreLabel={content.moreLabel} hideLabel={content.hideLabel} />
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
