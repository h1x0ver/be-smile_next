'use client';
import { decodeHtmlEntities } from "@/lib/displayText";
import Reveal from "./Reveal";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';



import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,

  type CSSProperties,

  Suspense,
  lazy,
} from 'react';

import { directusImage, directusSrcSet, retryImageOnce } from "@/lib/directusImage";

type Lang = 'en' | 'ru' | 'az';

type DoctorTranslation = {
  language?: string;
  languages_code?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  description?: string;
  specialization?: string;
  position?: string;
};

type Doctor = {
  id: string | number;
  image?: {
    id?: string;
  };
  translations?: DoctorTranslation[];
  image_position?: string;
};

type SlideDoctor = {
  id: string | number;
  imageId: string;
  imagePosition: string;
  name: string;
  role: string;
  shortDescription: string;
  fullDescription: string;
  plainDescription: string;
  number: string;
};

const COPY: Record<
  Lang,
  {
    eyebrow: string;
    titleTop: string;
    titleBottom: string;
    intro: string;
    introSmall: string;
    cta: string;
    badge: string;
    more: string;
    modalLabel: string;
    close: string;
    specialization: string;
    profile: string;
    expert: string;
    fallbackDescription: string;
    note: string;
    sideLabel: string;
    search: string;
    searchPlaceholder: string;
    noDoctors: string;
  }
> = {
  en: {
    eyebrow: 'Medical Experts',
    titleTop: 'OUR',
    titleBottom: 'DOCTORS',
    intro: 'A BeSmile medical team where precision, aesthetics and calm premium care work as one system.',
    introSmall: 'Selected specialists with a modern clinical approach and refined patient care.',
    cta: 'All Doctors',
    badge: 'BeSmile Team',
    more: 'Open Profile',
    modalLabel: 'Doctor Profile',
    close: 'Close',
    specialization: 'Specialization',
    profile: 'Profile',
    expert: 'BeSmile Expert',
    fallbackDescription:
      'A BeSmile specialist focused on precise treatment, aesthetic results and a calm premium patient experience.',
    note: 'Selected specialists with a calm premium approach',
    sideLabel: 'BeSmile Clinic',
    search: 'Search doctors',
    searchPlaceholder: 'Search by name or specialization...',
    noDoctors: 'No doctors found',
  },
  ru: {
    eyebrow: 'Команда экспертов',
    titleTop: 'НАШИ',
    titleBottom: 'ВРАЧИ',
    intro: 'Команда врачей BeSmile, где точность, эстетика и спокойный premium-подход работают как единая система.',
    introSmall: 'Отобранные специалисты с современным клиническим подходом и высоким уровнем care.',
    cta: 'Все врачи',
    badge: 'Команда BeSmile',
    more: 'Открыть профиль',
    modalLabel: 'Профиль врача',
    close: 'Закрыть',
    specialization: 'Специализация',
    profile: 'Профиль',
    expert: 'Эксперт BeSmile',
    fallbackDescription:
      'Специалист BeSmile с внимательным подходом к лечению, эстетическому результату и спокойному премиальному опыту пациента.',
    note: 'Отобранные специалисты с клинической точностью и эстетическим подходом',
    sideLabel: 'BeSmile Clinic',
    search: 'Поиск врачей',
    searchPlaceholder: 'Поиск по имени или специализации...',
    noDoctors: 'Врачи не найдены',
  },
  az: {
    eyebrow: 'Ekspert Komanda',
    titleTop: 'BİZİM',
    titleBottom: 'HƏKİMLƏR',
    intro: 'BeSmile həkim komandası — dəqiqlik, estetika və sakit premium yanaşmanın vahid sistemi.',
    introSmall: 'Müasir klinik yanaşma və yüksək care səviyyəsi ilə seçilən mütəxəssislər.',
    cta: 'Bütün həkimlər',
    badge: 'BeSmile komandası',
    more: 'Profili aç',
    modalLabel: 'Həkim profili',
    close: 'Bağla',
    specialization: 'İxtisas',
    profile: 'Profil',
    expert: 'BeSmile eksperti',
    fallbackDescription:
      'Müalicə dəqiqliyi, estetik nəticə və sakit premium pasiyent təcrübəsinə yönəlmiş BeSmile mütəxəssisi.',
    note: 'Sakit premium yanaşma ilə seçilmiş mütəxəssislər',
    sideLabel: 'BeSmile Clinic',
    search: 'Həkimlər axtarışı',
    searchPlaceholder: 'Ad və ya ixtisas üzrə axtarış...',
    noDoctors: 'Həkim tapılmadı',
  },
};

function stripHtml(html?: string) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}



function truncateText(text: string, maxLength = 110) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

function resolveTranslation(doctor: Doctor, lang: Lang) {
  const translations = Array.isArray(doctor.translations) ? doctor.translations : [];
  return (
    translations.find((tr) => (tr.language || tr.languages_code) === lang) ||
    translations[0]
  );
}



function useLowEndMode() {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 767px)');

    const update = () => {
      const mobile = media.matches;
      setIsMobile(mobile);

      const nav = navigator as Navigator & {
        deviceMemory?: number;
        hardwareConcurrency?: number;
        connection?: { saveData?: boolean };
      };

      const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
      const lowCpu =
        typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
      const saveData = Boolean(nav.connection?.saveData);

      setIsLowEnd(mobile || lowMemory || lowCpu || saveData);
    };

    update();

    const onChange = () => update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return { isLowEnd, isMobile };
}

const cardBaseStyle: CSSProperties = {
  transform: 'translate3d(0,0,0)',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  perspective: 1000,
  WebkitPerspective: 1000,
  contain: 'layout paint style',
};

const DoctorCard = memo(function DoctorCard({
  doctor,
  copy,
  onOpen,
  lowEndMode,
  index,
}: {
  doctor: SlideDoctor;
  copy: (typeof COPY)[Lang];
  onOpen: (doctor: SlideDoctor) => void;
  lowEndMode: boolean;
  index: number;
}) {
  const handleOpen = useCallback(() => onOpen(doctor), [doctor, onOpen]);

  return (
    <CarouselItem
      key={doctor.id}
      className="home-doctor-slide pl-5 shrink-0 basis-[88%] sm:basis-[72%] lg:basis-[46%] xl:basis-[38%] [transform:translate3d(0,0,0)]"
    >
      <Reveal as="article" delay={Math.min(index * 65, 195)}

        className="home-doctor-card group relative isolate overflow-hidden rounded-[34px] border border-white/60 bg-white/30 shadow-[0_18px_60px_rgba(0,0,0,0.07)] transition-[translate,box-shadow,background-color,border-color,color] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
        style={cardBaseStyle}
      >
        <div data-home="doctor-photo" className="relative h-[520px] overflow-hidden sm:h-[560px] lg:h-[620px]">
          <img
            src={directusImage(doctor.imageId, 720)}
            srcSet={directusSrcSet(doctor.imageId, [480, 720, 960])}
            onError={retryImageOnce}
            sizes="(min-width: 1280px) 38vw, (min-width: 1024px) 46vw, (min-width: 640px) 72vw, 88vw"
            alt={doctor.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            style={{
              objectPosition: doctor.imagePosition,
              transform: 'translate3d(0,0,0) scale(1.001)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.82)_0%,rgba(17,17,17,0.38)_34%,rgba(17,17,17,0.10)_60%,rgba(17,17,17,0.03)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,0.28),transparent_72%)]" />

          {!lowEndMode && (
            <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[180px] w-[180px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.075),transparent)] scale-[1.6]" />
          )}

          <div className="absolute left-5 right-5 top-5 flex items-start justify-between">
            <div

              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-2 "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/70">
                {copy.badge}
              </span>
            </div>

            <div className="text-[34px] font-[300] leading-none text-white/30 sm:text-[42px]">
              {doctor.number}
            </div>
          </div>

          <div data-home="doctor-info" className="absolute inset-x-5 bottom-5">
            <button
              type="button"
              onClick={handleOpen}
              className="w-full text-left"
              aria-label={copy.more}
            >
              <div

                className={[
                  'rounded-[28px] border border-white/15 bg-white/10 p-4 transition-transform duration-500',
                  'group-hover:bg-white/12 sm:p-5',
                  lowEndMode
                    ? 'shadow-[0_14px_34px_rgba(0,0,0,0.16)]'
                    : 'shadow-[0_20px_60px_rgba(0,0,0,0.18)] group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.22)]',
                ].join(' ')}
                style={cardBaseStyle}
              >
                <div className="mb-3 h-px w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.34),rgba(255,255,255,0.08),transparent)]" />

                <h3 className="max-w-[320px] text-[22px] font-[300] uppercase leading-[1.02] tracking-[0.05em] text-white sm:text-[27px]">
                  {doctor.name}
                </h3>

                <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/58">
                  {doctor.role}
                </div>

                <p className="mt-3 max-w-[420px] text-[13px] leading-6 text-white/72 sm:text-[14px] sm:leading-7">
                  {doctor.shortDescription}
                </p>

                <div data-home="doctor-actions" className="mt-5 flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-white/58">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                    {copy.modalLabel}
                  </div>

                  <span
                    
                    className="text-[11px] uppercase tracking-[0.26em] text-white/50 transition-transform duration-300"
                  >
                    {copy.more}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </Reveal>
    </CarouselItem>
  );
});

DoctorCard.displayName = 'DoctorCard';

// Динамический импорт модального окна для оптимизации
const DoctorModal = lazy(() =>
  import('../components/doctor-modal').then((module) => ({
    default: module.DoctorModal,
  }))
);

export default function DoctorsCarousel({
  lang,
  doctors: initialDoctors,
}: {
  lang: Lang;
  doctors?: unknown[];
}) {
  // Doctors are fetched on the server (see components/Doctors.tsx) so they're in the HTML for Google
  const doctors = useMemo(
    () => (Array.isArray(initialDoctors) ? (initialDoctors as Doctor[]) : []),
    [initialDoctors]
  );
  const [selectedDoctor, setSelectedDoctor] = useState<SlideDoctor | null>(null);



  const copy = COPY[lang] ?? COPY.en;
  const { isLowEnd, isMobile } = useLowEndMode();

  

  const slides = useMemo(() => {
    return doctors
      .map((doctor, index) => {
        const t = resolveTranslation(doctor, lang);
        if (!t || !doctor.image?.id) return null;

        const rawHtml = (t.description || '').trim();
        const plainText = decodeHtmlEntities(stripHtml(rawHtml)) || copy.fallbackDescription;
        const safeHtml = rawHtml ? rawHtml : `<p>${plainText}</p>`;

        return {
          id: doctor.id,
          imageId: doctor.image.id,
          imagePosition: doctor.image_position || '50% 14%',
          name: t.name || [t.firstname, t.lastname].filter(Boolean).join(' ') || copy.expert,
          role: t.specialization || t.position || copy.badge,
          shortDescription: truncateText(plainText, 105),
          fullDescription: safeHtml,
          plainDescription: plainText,
          number: String(index + 1).padStart(2, '0'),
        };
      })
      .filter(Boolean) as SlideDoctor[];
  }, [doctors, lang, copy.badge, copy.expert, copy.fallbackDescription]);

  const filteredSlides = slides;

  const handleOpenDoctor = useCallback((doctor: SlideDoctor) => {
    setSelectedDoctor(doctor);
  }, []);

  const handleCloseDoctor = useCallback(() => {
    setSelectedDoctor(null);
  }, []);



  return (
    <>
      <>
        <>
          <section data-home="doctors" className="relative overflow-hidden bg-[#f8f6f1] px-4 pb-20 pt-12 sm:px-6 md:px-10 lg:px-16 xl:px-20 lg:pb-28 lg:pt-16">
            <div className="pointer-events-none absolute inset-0">
              <div
                className={[
                  'absolute left-[-10%] top-[-8%] h-[360px] w-[360px] scale-[1.6] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.75),transparent)]',
                ].join(' ')}
              />
              <div
                className={[
                  'absolute right-[-8%] top-[4%] h-[320px] w-[320px] scale-[1.6] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.3),transparent)]',
                ].join(' ')}
              />
              <div
                className={[
                  'absolute bottom-[-10%] left-[28%] h-[320px] w-[320px] scale-[1.6] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.6),transparent)]',
                ].join(' ')}
              />
              <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:90px_90px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_26%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.48),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.18),transparent_28%,rgba(255,255,255,0.12))]" />
            </div>

            <div className="relative mx-auto max-w-[1480px]">
              <div className="mb-8 lg:mb-10">
                <div

                  className={[
                    'home-section-header relative overflow-hidden rounded-[28px] border border-white/60 bg-white/58 px-5 py-5 sm:rounded-[32px] sm:px-7 sm:py-6 lg:px-8 lg:py-7',
                    isLowEnd
                      ? ' shadow-[0_16px_50px_rgba(0,0,0,0.06)]'
                      : ' shadow-[0_20px_80px_rgba(0,0,0,0.07)]',
                  ].join(' ')}
                >
                  <div className="pointer-events-none absolute inset-0">
                    {!isLowEnd && (
                      <>
                        <div className="absolute left-[-8%] top-[-50%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.12),transparent)] scale-[1.6]" />
                        <div className="absolute right-[-6%] top-[10%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.562),transparent)] scale-[1.6]" />
                      </>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,255,255,0.16))]" />
                  </div>

                  <div className="relative z-10 max-w-[980px]">
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/76 px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-[#c9ae7b]" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-black/48">
                        {copy.eyebrow}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h2 className="text-balance text-[26px] font-[300] uppercase leading-[0.95] tracking-[0.12em] text-[#111111] sm:text-[38px] lg:text-[52px]">
                        {copy.titleTop}{' '}
                        <span className="tracking-[0.08em]">{copy.titleBottom}</span>
                      </h2>
                    </div>

                    <div className="mt-4 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.14),rgba(17,17,17,0.04),transparent)]" />

                    <div data-home="header-notes" className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div
                          className={[
                            'inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/78 px-4 py-2.5',
                            isLowEnd
                              ? ' shadow-[0_8px_20px_rgba(0,0,0,0.025)]'
                              : ' shadow-[0_10px_30px_rgba(0,0,0,0.03)]',
                          ].join(' ')}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                          <span className="text-[10px] uppercase tracking-[0.24em] text-black/50">
                            {copy.note}
                          </span>
                        </div>

                        <div
                          className={[
                            'inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/78 px-4 py-2.5',
                            isLowEnd
                              ? ' shadow-[0_8px_20px_rgba(0,0,0,0.025)]'
                              : ' shadow-[0_10px_30px_rgba(0,0,0,0.03)]',
                          ].join(' ')}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                          <span className="text-[10px] uppercase tracking-[0.24em] text-black/46">
                            Precision / Aesthetics / Care
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Carousel opts={{ align: 'start', loop: true, duration: 32 }} className="relative select-none touch-pan-y [transform:translate3d(0,0,0)]">
                  <div data-home="doctor-toolbar" className="mb-5 flex items-center justify-between gap-3">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-black/36">
                      {copy.eyebrow}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/${lang}/doctors`}>
                        <Button className="group rounded-full border border-[#111111] bg-[#111111] px-6 py-5 text-[10px] uppercase tracking-[0.26em] text-white shadow-[0_14px_38px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-black">
                          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                            {copy.cta}
                          </span>
                        </Button>
                      </Link>

                      <div
                        className={[
                          'inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/72 p-2',
                          isLowEnd
                            ? ' shadow-[0_10px_24px_rgba(0,0,0,0.05)]'
                            : ' shadow-[0_18px_40px_rgba(0,0,0,0.06)]',
                        ].join(' ')}
                      >
                        <CarouselPrevious className="static h-11 w-11 translate-y-0 rounded-full border border-black/8 bg-white text-black/70 shadow-none transition-transform duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:bg-[#111111] hover:text-white" />
                        <CarouselNext className="static h-11 w-11 translate-y-0 rounded-full border border-black/8 bg-white text-black/70 shadow-none transition-transform duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:bg-[#111111] hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {filteredSlides.length > 0 ? (
                    <CarouselContent className="-ml-5 [transform:translate3d(0,0,0)] will-change-transform">
                      {filteredSlides.map((doctor, index) => (
                        <DoctorCard
                          key={doctor.id}
                          doctor={doctor}
                          copy={copy}
                          onOpen={handleOpenDoctor}
                          lowEndMode={isLowEnd}
                          index={index}
                        />
                      ))}
                    </CarouselContent>
                  ) : (
                    <div className="flex items-center justify-center py-16">
                      <p className="text-[16px] text-black/50">{copy.noDoctors}</p>
                    </div>
                  )}
                </Carousel>
              </div>
            </div>
          </section>

          {selectedDoctor ? (
            <Suspense fallback={null}>
              <DoctorModal
                selectedDoctor={selectedDoctor}
                isMobile={isMobile}
                lowEndMode={isLowEnd}
                copy={copy}
                onClose={handleCloseDoctor}
              />
            </Suspense>
          ) : null}
        </>
      </>
    </>
  );
}
