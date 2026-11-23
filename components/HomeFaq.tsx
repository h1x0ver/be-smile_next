import Link from "next/link";
import Reveal from "./Reveal";

type Lang = "en" | "ru" | "az";

const COPY: Record<
  Lang,
  { eyebrow: string; title: string; intro: string; cta: string; phoneLabel: string }
> = {
  ru: {
    eyebrow: "Вопросы и ответы",
    title: "Частые вопросы о стоматологии BeSmile в Баку",
    intro:
      "Коротко о том, что чаще всего спрашивают пациенты перед первым визитом. Не нашли ответ — напишите нам, и мы подскажем.",
    cta: "Записаться на консультацию",
    phoneLabel: "Позвонить",
  },
  en: {
    eyebrow: "Questions & answers",
    title: "Frequently asked questions about BeSmile Dental Clinic",
    intro:
      "What patients usually ask before their first visit. Didn't find your answer? Message us and we'll help.",
    cta: "Book a consultation",
    phoneLabel: "Call us",
  },
  az: {
    eyebrow: "Suallar və cavablar",
    title: "BeSmile stomatologiyası haqqında tez-tez verilən suallar",
    intro:
      "Pasiyentlərin ilk vizitdən əvvəl ən çox verdiyi suallar. Cavab tapmadınız? Bizə yazın, kömək edək.",
    cta: "Konsultasiyaya yazılın",
    phoneLabel: "Zəng edin",
  },
};

export default function HomeFaq({
  lang,
  items,
}: {
  lang: Lang;
  items: Array<{ question: string; answer: string }>;
}) {
  const t = COPY[lang] ?? COPY.ru;

  if (!items.length) return null;

  return (
    <section
      data-home="faq"
      id="faq"
      aria-labelledby="home-faq-title"
      className="relative mx-auto max-w-[1520px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      <div data-home="faq-grid" className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/45 sm:text-[11px]">
                {t.eyebrow}
              </span>
            </div>

            <h2
              id="home-faq-title"
              className="mt-5 text-balance text-[30px] font-[300] leading-[1.05] text-[#111111] sm:text-[40px] lg:text-[40px] xl:text-[48px]"
            >
              {t.title}
            </h2>

            <p className="mt-5 max-w-[460px] text-[15px] leading-7 text-black/55">
              {t.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}/book-online`}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#111111] px-7 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_16px_36px_rgba(17,17,17,0.16)]"
              >
                {/* globals.css forces `a { color: inherit }`, so the colour lives on the span */}
                <span className="text-white">{t.cta}</span>
              </Link>
              <a
                href="tel:+994704210204"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-black/10 bg-white/80 px-7 text-[11px] font-medium uppercase tracking-[0.22em] text-[#111111] transition-all duration-300 hover:-translate-y-[1px] hover:bg-white"
              >
                {t.phoneLabel} · +994 70 421 02 04
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="divide-y divide-black/[0.07] overflow-hidden rounded-[30px] border border-[#b08b57]/20 bg-white/60 shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            {items.map((item, index) => (
              <Reveal key={item.question} delay={index * 70}>
              <details className="group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-5 px-6 py-6 transition-colors duration-300 hover:bg-white/70 sm:px-8 sm:py-7 [&::-webkit-details-marker]:hidden">
                  <span className="mt-[3px] shrink-0 text-[11px] font-medium tracking-[0.18em] text-[#b08b57]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 text-[16px] font-[400] leading-[1.45] text-[#111111] sm:text-[18px]">
                    {item.question}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="relative mt-1 h-5 w-5 shrink-0 rounded-full border border-black/12 transition-transform duration-300 group-open:rotate-45"
                  >
                    <span className="absolute left-1/2 top-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-[#111111]" />
                    <span className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-[#111111]" />
                  </span>
                </summary>
                <div className="px-6 pb-7 pl-[60px] sm:px-8 sm:pl-[68px]">
                  <p className="max-w-[640px] text-[15px] leading-7 text-black/60">{item.answer}</p>
                </div>
              </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
