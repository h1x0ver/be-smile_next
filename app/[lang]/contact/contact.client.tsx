"use client";

import { motion, type Variants } from "framer-motion";

type Lang = "ru" | "en" | "az";

/* ===================== TRANSLATIONS ===================== */

const HERO_TITLE: Record<Lang, string> = {
  en: "CONTACT US",
  ru: "СВЯЖИТЕСЬ С НАМИ",
  az: "BİZİMLƏ ƏLAQƏ",
};

const DESCRIPTION: Record<Lang, string> = {
  en: "Have a question or need an appointment? Contact us in any convenient way — we’re always here to help.",
  ru: "Есть вопрос или хотите записаться на приём? Свяжитесь с нами удобным способом — мы всегда готовы помочь.",
  az: "Sualınız var və ya qəbula yazılmaq istəyirsiniz? Bizimlə rahat üsulla əlaqə saxlayın — hər zaman kömək etməyə hazırıq.",
};

const EYEBROW: Record<Lang, string> = {
  en: "BeSmile Clinic",
  ru: "BeSmile Clinic",
  az: "BeSmile Clinic",
};

const CONTACT_BLOCKS = {
  call: {
    title: {
      en: "Give us a call",
      ru: "Позвоните нам",
      az: "Bizə zəng edin",
    },
    value: {
      en: "070 421 02 04",
      ru: "070 421 02 04",
      az: "070 421 02 04",
    },
    href: "tel:+994704210204",
    icon: "/Frame_831.png",
  },
  email: {
    title: {
      en: "Send us an email",
      ru: "Напишите нам",
      az: "Bizə e-poçt göndərin",
    },
    value: {
      en: "info@besmile.az",
      ru: "info@besmile.az",
      az: "info@besmile.az",
    },
    href: "mailto:info@besmile.az",
    icon: "/mail.png",
  },
  visit: {
    title: {
      en: "Visit us",
      ru: "Наш адрес",
      az: "Ünvanımız",
    },
    value: {
      en: "24 Khan Shushinski, Baku 1007",
      ru: "24 Khan Shushinski, Baku 1007",
      az: "24 Khan Shushinski, Baku 1007",
    },
    href: null,
    icon: "/loc.png",
  },
} as const;

type ContactKey = keyof typeof CONTACT_BLOCKS;

interface ContactClientProps {
  lang: Lang;
}

const premiumEase = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: premiumEase,
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

export default function ContactClient({ lang }: ContactClientProps) {
  return (
    <section className="relative overflow-hidden bg-[#f8f6f1]">
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />

      <div className="pointer-events-none absolute left-[-140px] top-[-100px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />
      <div className="pointer-events-none absolute right-[-120px] top-[70px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(215,189,146,0.262),transparent)] scale-[1.6]" />
      <div className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.525),transparent)] scale-[1.6]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.28),rgba(255,255,255,0))]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-8 md:pb-24 md:pt-20 lg:px-10 lg:pb-28 lg:pt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mx-auto mb-12 flex max-w-[980px] flex-col items-center text-center sm:mb-14 lg:mb-16"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center rounded-full border border-white/70 bg-white/65 px-4 py-2 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/50 sm:text-[11px]">
              {EYEBROW[lang]}
            </span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mb-6 flex items-baseline justify-center gap-4 sm:gap-8 lg:gap-12"
          >
            <span className="hidden text-[64px] font-light text-black md:block lg:text-[88px]">
              [
            </span>

            <h1 className="text-balance font-manrope text-[42px] font-[300] uppercase leading-[0.95] tracking-[0.16em] text-black sm:text-[62px] lg:text-[86px] lg:tracking-[0.22em] xl:whitespace-nowrap">
              {HERO_TITLE[lang]}
            </h1>

            <span className="hidden text-[64px] font-light text-black md:block lg:text-[88px]">
              ]
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-[680px] text-balance text-[19px] font-[350] leading-[1.6] text-black/68 sm:text-[22px] lg:text-[26px]"
          >
            {DESCRIPTION[lang]}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: premiumEase, delay: 0.15 },
          }}
          className="relative overflow-hidden rounded-[34px] border border-white/60 bg-white/50 p-4 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] sm:p-5 lg:p-6"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4),rgba(255,255,255,0.14))]" />
          <div className="pointer-events-none absolute left-10 top-10 h-28 w-28 rounded-full bg-[#ede3d0]/70 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-32 w-32 rounded-full bg-white/60 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col gap-4"
            >
              {(Object.keys(CONTACT_BLOCKS) as ContactKey[]).map((key) => {
                const item = CONTACT_BLOCKS[key];
                const isLink = Boolean(item.href);

                return (
                  <motion.div
                    key={key}
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/72 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition-[translate,box-shadow,background-color,border-color,color] duration-500 hover:-translate-y-1 sm:p-7"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.45),rgba(255,255,255,0.12))]" />
                    <div className="pointer-events-none absolute right-[-35px] top-[-35px] h-24 w-24 rounded-full bg-[#d9c7a2]/20 blur-3xl" />

                    <div className="relative flex items-start gap-5">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[18px] border border-white/80 bg-white/80 shadow-[0_10px_20px_rgba(0,0,0,0.04)]">
                        <img
                          src={item.icon}
                          alt={key}
                          className="h-7 w-7 object-contain opacity-90"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/42 sm:text-[11px]">
                            Contact
                          </span>
                          <div className="h-px flex-1 bg-black/10" />
                        </div>

                        <h3 className="mb-3 text-[24px] font-[500] leading-tight text-black sm:text-[26px]">
                          {item.title[lang]}
                        </h3>

                        {isLink ? (
                          <a
                            href={item.href ?? undefined}
                            className="inline-block text-[18px] leading-relaxed text-black/72 underline decoration-[#c9ae7b] underline-offset-4 transition-colors duration-300 hover:text-black sm:text-[20px]"
                          >
                            {item.value[lang]}
                          </a>
                        ) : (
                          <p className="max-w-[420px] text-[18px] leading-relaxed text-black/68 sm:text-[20px]">
                            {item.value[lang]}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.85, ease: premiumEase, delay: 0.24 },
              }}
              className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/72 shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-6">
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-black/42 sm:text-[11px]">
                    Location
                  </p>
                  <h3 className="text-[20px] font-[500] text-black sm:text-[24px]">
                    BeSmile Clinic
                  </h3>
                </div>

                <div className="hidden rounded-full border border-[#d9c7a2]/40 bg-[#f7f1e6] px-3 py-1.5 sm:block">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#8f7346]">
                    Baku
                  </span>
                </div>
              </div>

              <div className="h-[360px] sm:h-[420px] lg:h-full lg:min-h-[520px]">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3038.503579803598!2d49.836185455322266!3d40.3976936340332!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307dc383638a31%3A0xd4bc992c9ad68a63!2zQmVTbWlsZSDQodGC0L7QvNCw0YLQvtC70L7Qs9C40YfQtdGB0LrQsNGPINC60LvQuNC90LjQutCw!5e0!3m2!1sru!2saz!4v1765093947765!5m2!1sru!2saz"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-full w-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}