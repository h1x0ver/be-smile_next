'use client';

import { useEffect, useMemo, useState } from 'react';

type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
  order: number;
};

type Lang = 'ru' | 'en' | 'az';

const COPY = {
  ru: {
    eyebrow: 'Отзывы пациентов',
    title: 'Patient Reviews',
    description:
      'Реальные впечатления пациентов о лечении, внимании к деталям и общем опыте в клинике BeSmile.',
    empty: 'Пока нет отзывов',
    featured: 'Выбранный отзыв',
    readMore: 'Читать полностью',
    close: 'Закрыть',
    allReviews: 'Отзывы',
    verified: 'Patient Testimonial',
    summaryA: 'Спокойный премиальный сервис',
    summaryB: 'Точное лечение',
    summaryC: 'Доверие пациентов',
  },
  en: {
    eyebrow: 'Patient Reviews',
    title: 'Patient Reviews',
    description:
      'Real patient impressions about treatment quality, attention to detail and the overall BeSmile experience.',
    empty: 'No reviews yet',
    featured: 'Featured Review',
    readMore: 'Read Full Review',
    close: 'Close',
    allReviews: 'Reviews',
    verified: 'Patient Testimonial',
    summaryA: 'Calm premium care',
    summaryB: 'Precision treatment',
    summaryC: 'Trusted results',
  },
  az: {
    eyebrow: 'Pasiyent rəyləri',
    title: 'Patient Reviews',
    description:
      'Müalicə keyfiyyəti, incə yanaşma və BeSmile təcrübəsi haqqında real pasiyent fikirləri.',
    empty: 'Hələ rəy yoxdur',
    featured: 'Seçilmiş rəy',
    readMore: 'Tam oxu',
    close: 'Bağla',
    allReviews: 'Rəylər',
    verified: 'Patient Testimonial',
    summaryA: 'Premium xidmət',
    summaryB: 'Dəqiq müalicə',
    summaryC: 'Pasiyent etibarı',
  },
};

function Stars({ rating }: { rating: number }) {
  const safe = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < safe ? 'text-[#c9a56a]' : 'text-[#c9a56a]/25'}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReviewCard({
  review,
  index,
  onOpen,
  readMoreLabel,
  verifiedLabel,
}: {
  review: Review;
  index: number;
  onOpen: (review: Review) => void;
  readMoreLabel: string;
  verifiedLabel: string;
}) {
  return (
    <article className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-white/72 p-4 shadow-[0_18px_60px_rgba(17,17,17,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:rounded-[28px] sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-20%] h-[180px] w-[180px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.09),transparent)] scale-[1.6]" />
        <div className="absolute right-[-10%] bottom-[-18%] h-[180px] w-[180px] rounded-full bg-[radial-gradient(closest-side,rgba(239,228,210,0.6),transparent)] scale-[1.6]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.14))]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/6 bg-white/80 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c7aa78]" />
            <span className="text-[9px] uppercase tracking-[0.28em] text-black/42">
              Review {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <Stars rating={review.rating} />
        </div>

        <div className="mt-5 flex-1">
          <p
            className="text-[14px] leading-[1.85] text-[#111111]/68 sm:text-[15px]"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 8,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {review.text}
          </p>
        </div>

        <div className="mt-5 h-px w-full bg-[linear-gradient(to_right,rgba(17,17,17,0.14),rgba(17,17,17,0.04),transparent)]" />

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-[#111111]">
              {review.author}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-black/38">
              {verifiedLabel}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpen(review)}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white/82 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#111111] transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>{readMoreLabel}</span>
            <ArrowIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

function ReviewModal({
  review,
  lang,
  onClose,
}: {
  review: Review | null;
  lang: Lang;
  onClose: () => void;
}) {
  const copy = COPY[lang];

  useEffect(() => {
    if (!review) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [review, onClose]);

  if (!review) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/35 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 z-[110] w-[calc(100%-24px)] max-w-[860px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/70 bg-[#f8f6f1]/96 shadow-[0_30px_120px_rgba(0,0,0,0.16)] backdrop-blur-2xl sm:w-[calc(100%-48px)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8%] top-[-10%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.105),transparent)] scale-[1.6]" />
          <div className="absolute right-[-6%] top-[10%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(237,226,207,0.525),transparent)] scale-[1.6]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.36),rgba(255,255,255,0.16))]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 border-b border-black/8 px-5 py-5 sm:px-6 lg:px-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c9ae7b]" />
                <span className="text-[9px] uppercase tracking-[0.28em] text-black/42">
                  {copy.featured}
                </span>
              </div>

              <h3 className="mt-4 text-[20px] font-[300] uppercase leading-[1] tracking-[0.12em] text-[#111111] sm:text-[26px]">
                {review.author}
              </h3>

              <div className="mt-3">
                <Stars rating={review.rating} />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/10 bg-white/82 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-[#111111] transition-all duration-300 hover:-translate-y-0.5"
            >
              {copy.close}
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6 lg:px-7 lg:py-6">
            <p className="whitespace-pre-line text-[15px] leading-[1.95] text-[#111111]/72 sm:text-[16px]">
              {review.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumReviewsPage({
  reviews,
  lang = 'ru',
}: {
  reviews: Review[];
  lang?: Lang;
}) {
  const copy = COPY[lang];

  const sortedReviews = useMemo(() => {
    return [...(reviews || [])].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return b.rating - a.rating;
    });
  }, [reviews]);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const featuredReview = sortedReviews[0] || null;
  const gridReviews = sortedReviews.slice(1);

  const averageRating = useMemo(() => {
    if (!sortedReviews.length) return 0;
    return (
      sortedReviews.reduce((acc, item) => acc + item.rating, 0) /
      sortedReviews.length
    );
  }, [sortedReviews]);

  if (!sortedReviews.length) {
    return (
      <section className="bg-[#f8f6f1] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[70px]">
          <div className="rounded-[28px] border border-white/60 bg-white/70 px-6 py-16 text-center shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <div className="text-[10px] uppercase tracking-[0.30em] text-black/42">
              {copy.eyebrow}
            </div>
            <h2 className="mt-4 text-[24px] font-[300] uppercase tracking-[0.12em] text-[#111111]">
              {copy.empty}
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#f8f6f1] py-12 sm:py-14 lg:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[-8%] top-[5%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.105),transparent)] scale-[1.6]" />
          <div className="absolute right-[-6%] top-[12%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.562),transparent)] scale-[1.6]" />
          <div className="absolute bottom-[-12%] left-[18%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(241,235,224,0.75),transparent)] scale-[1.6]" />
        </div>

        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-[70px]">
          <div className="mb-5 sm:mb-6 lg:mb-8">
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/60 px-5 py-5 shadow-[0_18px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:px-6 sm:py-6 lg:px-8 lg:py-7">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[-8%] top-[-45%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.12),transparent)] scale-[1.6]" />
                <div className="absolute right-[-6%] top-[10%] h-[220px] w-[220px] rounded-full bg-[radial-gradient(closest-side,rgba(237,227,208,0.562),transparent)] scale-[1.6]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.42),rgba(255,255,255,0.16))]" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9ae7b]" />
                  <span className="text-[9px] uppercase tracking-[0.30em] text-black/44">
                    {copy.eyebrow}
                  </span>
                </div>

                <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div className="max-w-[760px]">
                    <h1 className="text-[24px] font-[300] uppercase leading-[0.95] tracking-[0.14em] text-[#111111] sm:text-[34px] lg:text-[46px]">
                      {copy.title}
                    </h1>

                    <p className="mt-4 max-w-[720px] text-[14px] leading-[1.9] text-black/56 sm:text-[15px]">
                      {copy.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 lg:justify-end">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/80 px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#b08b57]" />
                      <span className="text-[10px] uppercase tracking-[0.24em] text-black/50">
                        {averageRating.toFixed(1)} / 5
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                      <span className="text-[10px] uppercase tracking-[0.24em] text-black/46">
                        {sortedReviews.length} {copy.allReviews}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {featuredReview && (
            <div className="mb-5 sm:mb-6 lg:mb-8">
              <article className="relative overflow-hidden rounded-[30px] border border-white/60 bg-[#111111] p-5 text-white shadow-[0_24px_90px_rgba(17,17,17,0.14)] sm:rounded-[34px] sm:p-6 lg:p-8">
                <div className="absolute inset-0">
                  <div className="absolute left-[-10%] top-[-20%] h-[280px] w-[280px] rounded-full bg-[radial-gradient(closest-side,rgba(217,199,162,0.09),transparent)] scale-[1.6]" />
                  <div className="absolute right-[-5%] bottom-[-20%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.06),transparent)] scale-[1.6]" />
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                </div>

                <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d7bd92]" />
                      <span className="text-[10px] uppercase tracking-[0.28em] text-white/72">
                        {copy.featured}
                      </span>
                    </div>

                    <p className="mt-6 max-w-[900px] text-[18px] font-[300] leading-[1.6] text-white/90 sm:text-[22px] lg:text-[30px]">
                      “{featuredReview.text}”
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <div>
                        <div className="text-[15px] font-medium text-white">
                          {featuredReview.author}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/42">
                          {copy.verified}
                        </div>
                      </div>

                      <div className="h-8 w-px bg-white/12" />

                      <Stars rating={featuredReview.rating} />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between rounded-[24px] border border-white/10 bg-white/6 p-4 sm:p-5">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-white/46">
                        BeSmile
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-white/72">
                          {copy.summaryA}
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-white/72">
                          {copy.summaryB}
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-white/72">
                          {copy.summaryC}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedReview(featuredReview)}
                      className="group mt-6 inline-flex items-center justify-between rounded-full border border-white/14 bg-white/8 px-5 py-3 text-[10px] uppercase tracking-[0.24em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <span>{copy.readMore}</span>
                      <ArrowIcon />
                    </button>
                  </div>
                </div>
              </article>
            </div>
          )}

          {gridReviews.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
              {gridReviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={index + 1}
                  onOpen={setSelectedReview}
                  readMoreLabel={copy.readMore}
                  verifiedLabel={copy.verified}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ReviewModal
        review={selectedReview}
        lang={lang}
        onClose={() => setSelectedReview(null)}
      />
    </>
  );
}