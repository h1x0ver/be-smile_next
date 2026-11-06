"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { directusImage, directusSrcSet, retryImageOnce } from "@/lib/directusImage";

type Lang = "ru" | "en" | "az";

type AboutTranslation = {
  language?: Lang | string;
  title?: string;
  description?: string;
};

type AboutBlock = {
  id?: string | number;
  image?: string | { id?: string };
  translations?: AboutTranslation[];
  translitions?: AboutTranslation[];
};

interface Props {
  lang: Lang;
  title: string;
  aboutBlocks: AboutBlock[];
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
}

const HERO_TITLE: Record<Lang, { line1: string; line2: string }> = {
  en: { line1: "ABOUT US", line2: "DOCTORS" },
  ru: { line1: "О НАС", line2: "ВРАЧИ" },
  az: { line1: "HAQQIMIZDA", line2: "HƏKİMLƏR" },
};

function PremiumGlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.4 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden ${className}`}
    >
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(280px circle at ${x}px ${y}px, #16698a7e, transparent 55%)`
            ),
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

export default function AboutClient({ lang, title, aboutBlocks, faqItems = [], }: Props) {
  const reduceMotion = useReducedMotion();

  const finalRotateX = useMotionValue(0);
  const finalRotateY = useMotionValue(0);

  const springRotateX = useSpring(finalRotateX, {
    stiffness: 120,
    damping: 18,
    mass: 0.5,
  });
  const springRotateY = useSpring(finalRotateY, {
    stiffness: 120,
    damping: 18,
    mass: 0.5,
  });

  const handleFinalMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    finalRotateY.set((px - 0.5) * 4);
    finalRotateX.set((0.5 - py) * 4);
  };

  const resetFinalMove = () => {
    finalRotateX.set(0);
    finalRotateY.set(0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f6f1] text-[#111111]">
      {/* ===== PREMIUM BACKGROUND ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.188),transparent)] scale-[1.6]" />
        <div className="absolute right-[-8%] top-[14%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(176,139,87,0.112),transparent)] scale-[1.6]" />
        <div className="absolute bottom-[8%] left-[18%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)] scale-[1.6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.35),transparent_26%,rgba(255,255,255,0.4))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
      </div>

      {/* ===== HERO ===== */}
      <section className="relative z-10 px-4 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex items-baseline justify-center gap-4 text-center sm:mb-14 sm:gap-8 lg:mb-16 lg:gap-[90px]"
          >
            <span className="text-[42px] font-light text-black sm:text-[64px] lg:text-[92px]">
              [
            </span>

            <h1 className="font-manrope text-[42px] font-light tracking-[0.22em] text-black sm:text-[64px] lg:text-[92px]">
              {HERO_TITLE[lang].line1 || title}
            </h1>

            <span className="text-[42px] font-light text-black sm:text-[64px] lg:text-[92px]">
              ]
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex max-w-[980px] flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
              <span className="h-2 w-2 rounded-full bg-[#b08b57] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-black/60 sm:text-xs">
                Premium healthcare experience
              </span>
            </div>

            <p className="mx-auto mt-8 max-w-[820px] text-center text-[16px] leading-[1.8] text-black/70 sm:text-[18px] lg:text-[22px]">
              {lang === "ru" &&
                "Мы создали пространство, где профессионализм врачей, эстетика, доверие и комфорт пациента ощущаются в каждой детали."}
              {lang === "en" &&
                "We created a space where medical expertise, aesthetics, trust, and patient comfort are felt in every detail."}
              {lang === "az" &&
                "Biz elə bir məkan yaratdıq ki, burada həkim peşəkarlığı, estetika, etibar və pasiyent rahatlığı hər detalda hiss olunur."}
            </p>
          </motion.div>

          {/* Premium intro panel */}
          <div className="mt-12 grid items-stretch gap-5 sm:mt-16 lg:mt-20 lg:grid-cols-[1.2fr_0.8fr]">
            <PremiumGlowCard className="rounded-[32px] border border-white/60 bg-white/70 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] sm:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6),rgba(255,255,255,0.15))]" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#c9ae7b]/15 blur-3xl transition-transform duration-700 group-hover:scale-125" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <p className="text-[11px] uppercase tracking-[0.35em] text-black/45 sm:text-xs">
                  {lang === "ru" && "философия"}
                  {lang === "en" && "philosophy"}
                  {lang === "az" && "fəlsəfə"}
                </p>

                <div className="mt-5">
                  <h2 className="max-w-[760px] text-[30px] font-light leading-[1.05] tracking-[-0.03em] text-black sm:text-[40px] lg:text-[54px]">
                    {lang === "ru" && (
                      <>
                        Современная медицина
                        <br />
                        с премиальным ощущением
                      </>
                    )}
                    {lang === "en" && (
                      <>
                        Modern medicine
                        <br />
                        with a premium feel
                      </>
                    )}
                    {lang === "az" && (
                      <>
                        Müasir tibbi yanaşma
                        <br />
                        premium hiss ilə
                      </>
                    )}
                  </h2>

                  <p className="mt-6 max-w-[720px] text-[15px] leading-[1.9] text-black/65 sm:text-[16px] lg:text-[18px]">
                    {lang === "ru" &&
                      "BeSmile — это пространство современной стоматологии в Баку, где экспертный подход, эстетика улыбки и комфорт пациента соединяются в каждой детали."}
                    {lang === "en" &&
                      "BeSmile is a modern dental space in Baku where expertise, smile aesthetics, and patient comfort come together in every detail."}
                    {lang === "az" &&
                      "BeSmile Bakıda müasir stomatologiya məkanıdır, burada peşəkar yanaşma, gülüş estetikası və pasiyent rahatlığı hər detalda birləşir."}
                  </p>
                </div>
              </div>
            </PremiumGlowCard>

            <div className="grid gap-5">
              {[
                {
                  num: "01",
                  label:
                    lang === "ru"
                      ? "Эстетика"
                      : lang === "az"
                        ? "Estetika"
                        : "Aesthetics",
                },
                {
                  num: "02",
                  label:
                    lang === "ru"
                      ? "Точность"
                      : lang === "az"
                        ? "Dəqiqlik"
                        : "Precision",
                },
                {
                  num: "03",
                  label:
                    lang === "ru"
                      ? "Доверие"
                      : lang === "az"
                        ? "Etibar"
                        : "Trust",
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.65,
                    delay: idx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <PremiumGlowCard className="rounded-[28px] border border-black/8 bg-white/60 px-6 py-5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                    <div className="relative z-10 flex items-end justify-between gap-4">
                      <span className="text-[13px] uppercase tracking-[0.25em] text-black/45">
                        {item.label}
                      </span>
                      <span className="text-[28px] font-light tracking-[-0.04em] text-black/85">
                        {item.num}
                      </span>
                    </div>
                  </PremiumGlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTENT BLOCKS ===== */}
      <section className="relative z-10 px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-10 lg:pb-36 lg:pt-28">
        <div className="mx-auto max-w-[1600px] space-y-12 sm:space-y-16 lg:space-y-24">
          {aboutBlocks.map((block: any, index: number) => {
            const isImageLeft = index % 2 === 0;

            const translations = Array.isArray(block.translations)
              ? block.translations
              : Array.isArray(block.translitions)
                ? block.translitions
                : [];

            const t =
              translations.find((tr: any) => tr.language === lang) ||
              translations.find((tr: any) => tr.language === "en") ||
              translations[0] ||
              null;

            const blockTitle = t?.title ?? "";
            const description = t?.description ?? "";

            const imageId =
              typeof block.image === "string"
                ? block.image
                : block.image?.id || null;

            return (
              <motion.article
                key={block.id ?? index}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <PremiumGlowCard className="rounded-[34px] border border-white/60 bg-white/65 p-4 backdrop-blur-xl shadow-[0_24px_100px_rgba(0,0,0,0.08)] sm:p-6 lg:p-8">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(255,255,255,0.45))]" />
                  <div className="pointer-events-none absolute -top-10 right-[-40px] h-[180px] w-[180px] rounded-full bg-[#d7bd92]/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />
                  <div className="pointer-events-none absolute bottom-[-40px] left-[-20px] h-[160px] w-[160px] rounded-full bg-[#f2eadb] blur-3xl" />

                  <div className="relative z-10 grid items-center gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
                    {/* IMAGE */}
                    <div
                      className={
                        isImageLeft ? "order-2 lg:order-1" : "order-2 lg:order-2"
                      }
                    >
                      <div className="relative overflow-hidden rounded-[28px] bg-[#ece7dd]">
                        <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.18),transparent_38%),linear-gradient(to_right,rgba(255,255,255,0.08),transparent)]" />
                        {imageId ? (
                          <motion.img
                            whileHover={reduceMotion ? undefined : { scale: 1.045 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            src={directusImage(imageId, 1400, 82)}
                            srcSet={directusSrcSet(imageId, [640, 1000, 1400], 82)}
                            onError={retryImageOnce}
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            loading="lazy"
                            decoding="async"
                            alt={blockTitle}
                            className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[560px]"
                          />
                        ) : (
                          <div className="flex h-[320px] items-center justify-center text-black/30 sm:h-[420px] lg:h-[560px]">
                            No image
                          </div>
                        )}

                        <div className="absolute left-4 top-4 z-20 rounded-full border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                          <span className="text-[11px] uppercase tracking-[0.3em] text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TEXT */}
                    <div
                      className={
                        isImageLeft
                          ? "order-1 lg:order-2 px-2 sm:px-3 lg:px-6"
                          : "order-1 lg:order-1 px-2 sm:px-3 lg:px-6"
                      }
                    >
                      <div
                        className={`max-w-[720px] ${isImageLeft ? "lg:ml-auto" : "lg:mr-auto"
                          }`}
                      >
                        <p className="mb-4 text-[11px] uppercase tracking-[0.36em] text-black/40 sm:text-xs">
                          {lang === "ru" && "раздел"}
                          {lang === "en" && "section"}
                          {lang === "az" && "bölmə"} /{" "}
                          {String(index + 1).padStart(2, "0")}
                        </p>

                        <h2 className="text-balance text-[28px] font-light leading-[1.05] tracking-[-0.04em] text-black sm:text-[38px] lg:text-[54px] xl:text-[62px]">
                          {blockTitle}
                        </h2>

                        <div className="mt-6 h-px w-20 bg-black/15" />

                        <div
                          className="about-rich mt-8 max-w-[640px] text-[15px] leading-[1.95] text-black/68 sm:text-[16px] lg:text-[18px]"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />

                        <div className="mt-10 flex flex-wrap gap-3">
                          <span className="rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-black/55 transition-colors duration-300 hover:bg-black/[0.05]">
                            {lang === "ru" && "Премиальный сервис"}
                            {lang === "en" && "Premium care"}
                            {lang === "az" && "Premium xidmət"}
                          </span>
                          <span className="rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-black/55 transition-colors duration-300 hover:bg-black/[0.05]">
                            {lang === "ru" && "Профессиональная команда"}
                            {lang === "en" && "Expert team"}
                            {lang === "az" && "Peşəkar komanda"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PremiumGlowCard>
              </motion.article>
            );
          })}
        </div>
      </section>
      {/* ===== SEO FAQ ===== */}
      {faqItems.length > 0 && (
        <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10 lg:pb-28">
          <div className="mx-auto max-w-[1200px]">
            <motion.div
              initial={{
                opacity: 0,
                y: reduceMotion ? 0 : 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 text-center"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
                <span className="h-2 w-2 rounded-full bg-[#b08b57]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-black/55 sm:text-xs">
                  {lang === "ru" && "FAQ"}
                  {lang === "en" && "FAQ"}
                  {lang === "az" && "FAQ"}
                </span>
              </div>

              <h2 className="mx-auto mt-5 max-w-[820px] text-[34px] font-light leading-[1.04] tracking-[-0.045em] text-black sm:text-[48px] lg:text-[64px]">
                {lang === "ru" && "Вопросы о BeSmile"}
                {lang === "en" && "Questions about BeSmile"}
                {lang === "az" && "BeSmile haqqında suallar"}
              </h2>

              <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.9] text-black/60 sm:text-[17px]">
                {lang === "ru" &&
                  "Коротко о клинике, услугах, подходе к лечению и записи на консультацию."}
                {lang === "en" &&
                  "A quick guide to the clinic, services, treatment approach and consultation booking."}
                {lang === "az" &&
                  "Klinika, xidmətlər, müalicə yanaşması və konsultasiya haqqında qısa məlumat."}
              </p>
            </motion.div>

            <div className="grid gap-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={item.question}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 18,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <PremiumGlowCard className="rounded-[28px] border border-white/60 bg-white/68 px-6 py-6 backdrop-blur-xl shadow-[0_14px_48px_rgba(0,0,0,0.055)] sm:px-8 sm:py-7">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,255,255,0.42))]" />

                    <div className="relative z-10 grid gap-4 md:grid-cols-[90px_1fr] md:gap-8">
                      <div className="text-[13px] uppercase tracking-[0.28em] text-black/34">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <h3 className="text-[22px] font-light leading-[1.16] tracking-[-0.035em] text-black sm:text-[28px]">
                          {item.question}
                        </h3>

                        <p className="mt-4 max-w-[820px] text-[15px] leading-[1.85] text-black/62 sm:text-[16px]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </PremiumGlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ===== FINAL PREMIUM CTA / SIGNATURE ===== */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            onMouseMove={handleFinalMove}
            onMouseLeave={resetFinalMove}
            style={
              reduceMotion
                ? undefined
                : {
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                  transformPerspective: 1400,
                  transformStyle: "preserve-3d",
                }
            }
            className="relative overflow-hidden rounded-[36px] border border-white/60 bg-[#111111] px-6 py-12 shadow-[0_30px_100px_rgba(0,0,0,0.18)] sm:px-10 sm:py-14 lg:px-14 lg:py-20"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,182,129,0.28),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
            <div className="absolute inset-0 opacity-70 [background:linear-gradient(115deg,transparent,rgba(255,255,255,0.05),transparent)]" />
            <div className="relative z-10 max-w-[1000px]">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/45 sm:text-xs">
                {lang === "ru" && "about experience"}
                {lang === "en" && "about experience"}
                {lang === "az" && "təcrübə haqqında"}
              </p>

              <h3 className="mt-5 max-w-[980px] text-[30px] font-light leading-[1.05] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[64px]">
                {lang === "ru" && "Спокойствие. Доверие. Уверенность."}
                {lang === "en" && "Calm. Trust. Confidence."}
                {lang === "az" && "Sakitlik. Etibar. Güvən."}
              </h3>

              <p className="mt-6 max-w-[760px] text-[15px] leading-[1.9] text-white/68 sm:text-[17px] lg:text-[19px]">
                {lang === "ru" &&
                  "С первого момента в BeSmile вы ощущаете внимание к деталям и высокий уровень заботы. Здесь профессионализм, эстетика и комфорт соединяются в единую систему, создавая премиальный опыт лечения."}
                {lang === "en" &&
                  "From the very first moment at BeSmile, you feel attention to detail and a high level of care. Here, expertise, aesthetics, and comfort come together as one, creating a premium treatment experience."}
                {lang === "az" &&
                  "BeSmile-da ilk andan etibarən detallara diqqəti və yüksək qayğını hiss edirsiniz. Burada peşəkarlıq, estetika və rahatlıq bir sistemdə birləşərək premium müalicə təcrübəsi yaradır."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .about-rich p {
          margin-bottom: 1.2em;
        }

        .about-rich strong,
        .about-rich b {
          color: rgba(17, 17, 17, 0.95);
          font-weight: 600;
        }

        .about-rich ul,
        .about-rich ol {
          margin: 1.2em 0;
          padding-left: 1.2em;
        }

        .about-rich li {
          margin-bottom: 0.65em;
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