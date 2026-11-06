"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { directusImage, retryImageOnce } from "@/lib/directusImage";

type Lang = "ru" | "en" | "az";

type DoctorTranslation = {
  language?: Lang | string;
  firstname?: string;
  lastname?: string;
  profession?: string;
  description?: string;
};

type DoctorItem = {
  id?: string | number;
  image?: string | { id?: string };
  translations?: DoctorTranslation[];
};

interface Props {
  lang: Lang;
  title: string;
  intro: string;
  doctors: DoctorItem[];
}

const UI = {
  ru: {
    premiumTeam: "Премиальная команда стоматологов",
    team: "команда",
    specialist: "специалист",
    expertise: "Экспертиза",
    aesthetics: "Эстетика",
    care: "Забота",
    trustTitle: "Профессионалы, которым доверяют улыбки",
    trustText:
      "Каждый врач BeSmile сочетает клиническую точность, современный подход и глубокое внимание к деталям, чтобы создавать результат, которому действительно доверяют.",
    premiumCare: "Премиальный подход",
    personalApproach: "Индивидуальная работа",
    doctorsNotFound: "Врачи не найдены",
    expTitle: "Опыт. Точность. Доверие.",
    expText:
      "Команда BeSmile объединяет профессионализм, современные методы лечения и внимание к деталям, чтобы каждый пациент чувствовал уверенность в результате.",
    doctorsExperience: "опыт врачей",
    bookOnline: "Записаться",
    bookDoctor: "Записаться к врачу",
    aboutClinic: "О клинике",
    services: "Услуги",
    contacts: "Контакты",
    doctorSectionLabel: "Команда врачей BeSmile",
    doctorImageAlt: "Фото врача",
    biography: "О враче",
    emptyDescription:
      "Информация о специалисте скоро будет добавлена. Вы можете записаться на консультацию, чтобы получить персональную рекомендацию и план лечения.",
  },
  en: {
    premiumTeam: "Premium dental team",
    team: "team",
    specialist: "specialist",
    expertise: "Expertise",
    aesthetics: "Aesthetics",
    care: "Care",
    trustTitle: "Professionals trusted with smiles",
    trustText:
      "Each BeSmile doctor combines clinical precision, a modern approach, and deep attention to detail to create results patients truly trust.",
    premiumCare: "Premium care",
    personalApproach: "Personal approach",
    doctorsNotFound: "Doctors not found",
    expTitle: "Experience. Precision. Trust.",
    expText:
      "The BeSmile team combines professionalism, modern treatment methods, and attention to detail so every patient feels confident in the result.",
    doctorsExperience: "doctors experience",
    bookOnline: "Book online",
    bookDoctor: "Book this doctor",
    aboutClinic: "About clinic",
    services: "Services",
    contacts: "Contacts",
    doctorSectionLabel: "BeSmile doctors team",
    doctorImageAlt: "Doctor photo",
    biography: "About doctor",
    emptyDescription:
      "Information about this specialist will be added soon. You can book a consultation to receive a personal recommendation and treatment plan.",
  },
  az: {
    premiumTeam: "Premium stomatoloji komanda",
    team: "komanda",
    specialist: "mütəxəssis",
    expertise: "Peşəkarlıq",
    aesthetics: "Estetika",
    care: "Qayğı",
    trustTitle: "Gülümsəmələri etibar edilən peşəkarlar",
    trustText:
      "BeSmile həkimlərinin hər biri klinik dəqiqliyi, müasir yanaşmanı və detallara xüsusi diqqəti birləşdirərək etibar yaradan nəticələr təqdim edir.",
    premiumCare: "Premium yanaşma",
    personalApproach: "Fərdi yanaşma",
    doctorsNotFound: "Həkimlər tapılmadı",
    expTitle: "Təcrübə. Dəqiqlik. Etibar.",
    expText:
      "BeSmile komandası peşəkarlığı, müasir müalicə metodlarını və detallara diqqəti birləşdirir ki, hər pasiyent nəticəyə inam hiss etsin.",
    doctorsExperience: "həkim təcrübəsi",
    bookOnline: "Onlayn yazıl",
    bookDoctor: "Həkimə yazıl",
    aboutClinic: "Klinika haqqında",
    services: "Xidmətlər",
    contacts: "Əlaqə",
    doctorSectionLabel: "BeSmile həkim komandası",
    doctorImageAlt: "Həkim şəkli",
    biography: "Həkim haqqında",
    emptyDescription:
      "Bu mütəxəssis haqqında məlumat tezliklə əlavə olunacaq. Fərdi tövsiyə və müalicə planı üçün konsultasiyaya yazıla bilərsiniz.",
  },
} as const;

function stripHtml(html?: string): string {
  if (!html) return "";

  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHtml(html?: string): string {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, "</p><p>")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .trim();
}

function getTranslation(
  doctor: DoctorItem,
  lang: Lang
): DoctorTranslation | null {
  const translations = Array.isArray(doctor.translations)
    ? doctor.translations
    : [];

  return (
    translations.find((tr) => tr.language === lang) ||
    translations.find((tr) => tr.language === "en") ||
    translations[0] ||
    null
  );
}

function getImageUrl(image?: string | { id?: string }): string | null {
  const imageId = typeof image === "string" ? image : image?.id;
  if (!imageId) return null;

  return directusImage(imageId, 1200, 82);
}

export default function DoctorsClient({ lang, title, intro, doctors }: Props) {
  const reduceMotion = useReducedMotion();
  const t = UI[lang];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f6f1] text-[#111111]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.188),transparent)] scale-[1.6]" />
        <div className="absolute right-[-8%] top-[14%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.112),transparent)] scale-[1.6]" />
        <div className="absolute bottom-[8%] left-[18%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent_26%,rgba(255,255,255,0.4))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
      </div>

      <div>
        <section className="relative z-10 px-4 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-28">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              initial={{
                opacity: 0,
                y: reduceMotion ? 0 : 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 flex items-baseline justify-center gap-4 text-center sm:mb-14 sm:gap-8 lg:mb-16 lg:gap-[90px]"
            >
              <span className="text-[42px] font-light text-black sm:text-[64px] lg:text-[92px]">
                [
              </span>

              <h1 className="font-manrope text-[42px] font-light tracking-[0.22em] text-black sm:text-[64px] lg:text-[92px]">
                {title}
              </h1>

              <span className="text-[42px] font-light text-black sm:text-[64px] lg:text-[92px]">
                ]
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto flex max-w-[980px] flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#b08b57] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-black/60 sm:text-xs">
                  {t.premiumTeam}
                </span>
              </div>

              <p className="mx-auto mt-8 max-w-[820px] text-center text-[16px] leading-[1.8] text-black/70 sm:text-[18px] lg:text-[22px]">
                {intro}
              </p>
            </motion.div>

            <div className="mt-12 grid items-stretch gap-5 sm:mt-16 lg:mt-20 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6),rgba(255,255,255,0.15))]" />
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#c9ae7b]/15 blur-3xl transition-transform duration-700 group-hover:scale-125" />

                <div className="relative z-10">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-black/45 sm:text-xs">
                    {t.team}
                  </p>

                  <h2 className="mt-5 max-w-[760px] text-[30px] font-light leading-[1.05] tracking-[-0.03em] text-black sm:text-[40px] lg:text-[54px]">
                    {t.trustTitle}
                  </h2>

                  <p className="mt-6 max-w-[720px] text-[15px] leading-[1.9] text-black/65 sm:text-[16px] lg:text-[18px]">
                    {t.trustText}
                  </p>
                </div>
              </div>

              <div className="grid gap-5">
                {[
                  { num: "01", label: t.expertise },
                  { num: "02", label: t.aesthetics },
                  { num: "03", label: t.care },
                ].map((item, idx) => (
                  <motion.div
                    key={item.num}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.65,
                      delay: idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-[28px] border border-black/8 bg-white/60 px-6 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-[translate,box-shadow,background-color,border-color,color] duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-[13px] uppercase tracking-[0.25em] text-black/45">
                        {item.label}
                      </span>
                      <span className="text-[28px] font-light tracking-[-0.04em] text-black/85">
                        {item.num}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label={t.doctorSectionLabel}
          className="relative z-10 px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-10 lg:pb-36 lg:pt-28"
        >
          <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16 lg:space-y-24">
            {doctors.map((doc, i) => {
              const isEven = i % 2 === 0;
              const tr = getTranslation(doc, lang);

              const fullName = `${tr?.firstname ?? ""} ${tr?.lastname ?? ""}`
                .replace(/\s+/g, " ")
                .trim();

              const profession = (tr?.profession ?? "").trim();
              const rawDescription = tr?.description ?? "";
              const cleanDescription = stripHtml(rawDescription);
              const descriptionHtml =
                normalizeHtml(rawDescription) || `<p>${t.emptyDescription}</p>`;
              const imageUrl = getImageUrl(doc.image);

              const altText = fullName
                ? `${fullName}${profession ? ` — ${profession}` : ""}`
                : t.doctorImageAlt;

              return (
                <motion.article
                  key={doc.id ?? i}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 36,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-[34px] border border-white/60 bg-white/64 p-4 shadow-[0_24px_100px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-6 lg:p-8"
                  itemScope
                  itemType="https://schema.org/Physician"
                >
                  <meta itemProp="name" content={fullName || ""} />
                  <meta
                    itemProp="description"
                    content={cleanDescription || t.emptyDescription}
                  />
                  {profession ? (
                    <meta itemProp="medicalSpecialty" content={profession} />
                  ) : null}

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(255,255,255,0.46))]" />
                  <div className="pointer-events-none absolute -top-10 right-[-40px] h-[180px] w-[180px] rounded-full bg-[#d7bd92]/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
                  <div className="pointer-events-none absolute bottom-[-40px] left-[-20px] h-[160px] w-[160px] rounded-full bg-[#f2eadb] blur-3xl" />

                  <div className="relative z-10 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
                    <div
                      className={isEven ? "order-2 lg:order-1" : "order-2 lg:order-2"}
                    >
                      <div className="relative h-full min-h-[420px] overflow-hidden rounded-[28px] bg-[#ece7dd] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)] sm:min-h-[520px] lg:min-h-[620px]">
                        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.22),transparent_42%),linear-gradient(to_right,rgba(255,255,255,0.08),transparent)]" />

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            onError={retryImageOnce}
                            alt={altText}
                            itemProp="image"
                            loading={i === 0 ? "eager" : "lazy"}
                            fetchPriority={i === 0 ? "high" : "auto"}
                            className="h-[420px] w-full object-cover object-[50%_15%] transition-transform duration-700 ease-out group-hover:scale-[1.045] sm:h-[520px] lg:h-[800px]"
                          />
                        ) : (
                          <div className="flex h-[420px] items-center justify-center text-black/30 sm:h-[520px] lg:h-full">
                            No image
                          </div>
                        )}

                        <div className="absolute left-4 top-4 z-20 rounded-full border border-white/30 bg-white/20 px-4 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md">
                          <span className="text-[11px] uppercase tracking-[0.3em] text-white">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        isEven
                          ? "order-1 px-1 sm:px-2 lg:order-2 lg:px-6"
                          : "order-1 px-1 sm:px-2 lg:order-1 lg:px-6"
                      }
                    >
                      <div
                        className={`flex h-full max-w-[760px] flex-col ${
                          isEven ? "lg:ml-auto" : "lg:mr-auto"
                        }`}
                      >
                        <div>
                          <p className="mb-4 text-[11px] uppercase tracking-[0.36em] text-black/40 sm:text-xs">
                            {t.specialist} / {String(i + 1).padStart(2, "0")}
                          </p>

                          <h2
                            className="text-balance text-[31px] font-light leading-[1.04] tracking-[-0.05em] text-black sm:text-[42px] lg:text-[58px] xl:text-[64px]"
                            itemProp="name"
                          >
                            {fullName}
                          </h2>

                          {profession ? (
                            <p
                              className="mt-4 text-[15px] font-[350] uppercase leading-[1.55] tracking-[0.22em] text-black/56 sm:text-[17px] lg:text-[19px]"
                              itemProp="medicalSpecialty"
                            >
                              {profession}
                            </p>
                          ) : null}

                          <div className="mt-7 h-px w-24 bg-black/14" />
                        </div>

                        <div className="mt-8 rounded-[28px] border border-white/70 bg-white/72 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.055)] backdrop-blur-xl sm:p-6 lg:p-7">
                          <div className="mb-5 flex items-center justify-between gap-4">
                            <div className="inline-flex items-center gap-3">
                              <span className="h-2 w-2 rounded-full bg-[#b08b57]" />
                              <span className="text-[10px] uppercase tracking-[0.3em] text-black/42">
                                {t.biography}
                              </span>
                            </div>

                            <span className="hidden text-[11px] uppercase tracking-[0.24em] text-black/28 sm:block">
                              BeSmile
                            </span>
                          </div>

                          <div
                            className="doctor-bio about-rich max-w-[680px] text-[16px] leading-[1.95] text-black/72 sm:text-[17px] lg:max-h-[390px] lg:overflow-y-auto lg:pr-4 lg:text-[18px]"
                            itemProp="description"
                            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                          />
                        </div>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                          <Link
                            href={`/${lang}/book-online`}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#ffffff] px-5 py-3 text-[13px] font-medium text-white shadow-[0_12px_30px_rgba(17,17,17,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(17,17,17,0.20)]"
                          >
                            <CalendarDays className="h-4 w-4" />
                            {t.bookDoctor}
                          </Link>

                          <span className="rounded-full border border-black/10 bg-white/62 px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-black/54 backdrop-blur-md">
                            {t.premiumCare}
                          </span>

                          <span className="rounded-full border border-black/10 bg-white/62 px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-black/54 backdrop-blur-md">
                            {t.personalApproach}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}

            {doctors.length === 0 && (
              <div className="rounded-[28px] border border-black/8 bg-white/70 px-6 py-16 text-center text-black/50 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl">
                {t.doctorsNotFound}
              </div>
            )}
          </div>
        </section>

        <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10 lg:pb-28">
          <div className="mx-auto max-w-[1600px]">
            <div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-[#111111] px-6 py-12 shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:px-10 sm:py-14 lg:px-14 lg:py-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,182,129,0.28),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />

              <div className="relative z-10 max-w-[1000px]">
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/45 sm:text-xs">
                  {t.doctorsExperience}
                </p>

                <h2 className="mt-5 max-w-[980px] text-[30px] font-light leading-[1.05] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[64px]">
                  {t.expTitle}
                </h2>

                <p className="mt-6 max-w-[760px] text-[15px] leading-[1.9] text-white/68 sm:text-[17px] lg:text-[19px]">
                  {t.expText}
                </p>

                <nav aria-label="Related pages" className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/${lang}/book-online`}
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-[13px] font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f2ede5]"
                  >
                    {t.bookOnline}
                  </Link>

                  <Link
                    href={`/${lang}/about`}
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-[13px] font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.09]"
                  >
                    {t.aboutClinic}
                  </Link>

                  <Link
                    href={`/${lang}/services`}
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-[13px] font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.09]"
                  >
                    {t.services}
                  </Link>

                  <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-[13px] font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.09]"
                  >
                    {t.contacts}
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .about-rich p {
          margin-bottom: 1.15em;
        }

        .about-rich p:last-child {
          margin-bottom: 0;
        }

        .about-rich strong,
        .about-rich b {
          color: rgba(17, 17, 17, 0.96);
          font-weight: 560;
        }

        .about-rich ul,
        .about-rich ol {
          margin: 1.15em 0;
          padding-left: 1.2em;
        }

        .about-rich li {
          margin-bottom: 0.65em;
        }

        .doctor-bio {
          scrollbar-width: thin;
          scrollbar-color: rgba(17, 17, 17, 0.18) transparent;
        }

        .doctor-bio::-webkit-scrollbar {
          width: 8px;
        }

        .doctor-bio::-webkit-scrollbar-track {
          background: transparent;
        }

        .doctor-bio::-webkit-scrollbar-thumb {
          background: rgba(17, 17, 17, 0.16);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .doctor-bio::-webkit-scrollbar-thumb:hover {
          background: rgba(17, 17, 17, 0.28);
          background-clip: padding-box;
        }

        .text-balance {
          text-wrap: balance;
        }

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