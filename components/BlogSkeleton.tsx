"use client";

import { motion } from "framer-motion";

function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`skeleton-loading ${className}`} />;
}

export function FeaturedPostSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/58 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.08)]">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-0">
          {/* Image skeleton */}
          <div className="relative min-h-[340px] p-3 sm:min-h-[440px] lg:min-h-[620px]">
            <SkeletonPulse className="h-full min-h-[320px] sm:min-h-[420px] lg:min-h-[596px] rounded-[30px]" />
          </div>

          {/* Content skeleton */}
          <div className="relative flex flex-col justify-between px-6 pb-7 pt-2 sm:px-9 sm:pb-9 sm:pt-3 lg:px-12 lg:pb-12 lg:pt-10">
            <div className="space-y-7">
              {/* Badge skeleton */}
              <div className="space-y-4">
                <SkeletonPulse className="h-9 w-40 rounded-full" />
                <div className="flex items-center gap-3">
                  <SkeletonPulse className="h-3 w-20 rounded-full" />
                  <SkeletonPulse className="h-1 w-1 rounded-full" />
                  <SkeletonPulse className="h-3 w-20 rounded-full" />
                </div>
              </div>

              <SkeletonPulse className="h-px w-full" />

              {/* Title skeleton */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <SkeletonPulse className="h-12 w-full rounded-lg" />
                  <SkeletonPulse className="h-12 w-4/5 rounded-lg" />
                  <SkeletonPulse className="h-12 w-3/4 rounded-lg" />
                </div>

                {/* Excerpt skeleton */}
                <div className="space-y-2 pt-2">
                  <SkeletonPulse className="h-4 w-full rounded-lg" />
                  <SkeletonPulse className="h-4 w-full rounded-lg" />
                  <SkeletonPulse className="h-4 w-2/3 rounded-lg" />
                </div>
              </div>
            </div>

            {/* CTA skeleton */}
            <div className="mt-10 h-5 w-32 rounded-lg skeleton-loading" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SecondaryPostCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className="group h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/65 bg-white/60 p-3 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
        {/* Image skeleton */}
        <SkeletonPulse className="relative h-[260px] w-full rounded-[28px]" />

        {/* Content skeleton */}
        <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
          <div className="space-y-4">
            {/* Badge skeleton */}
            <SkeletonPulse className="h-8 w-32 rounded-full" />

            {/* Meta skeleton */}
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-3 w-20 rounded-full" />
              <SkeletonPulse className="h-1 w-1 rounded-full" />
              <SkeletonPulse className="h-3 w-20 rounded-full" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2">
              <SkeletonPulse className="h-7 w-full rounded-lg" />
              <SkeletonPulse className="h-7 w-4/5 rounded-lg" />
            </div>

            {/* Excerpt skeleton */}
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-full rounded-lg" />
              <SkeletonPulse className="h-4 w-5/6 rounded-lg" />
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="mt-8 h-4 w-24 rounded-lg skeleton-loading" />
        </div>
      </div>
    </motion.div>
  );
}

export function PostGridCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.03 * index }}
      className="group h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/58 p-3 backdrop-blur-xl shadow-[0_18px_70px_rgba(0,0,0,0.07)]">
        {/* Image skeleton */}
        <SkeletonPulse className="relative h-[220px] w-full rounded-[24px]" />

        {/* Content skeleton */}
        <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
          <div className="space-y-3">
            {/* Meta skeleton */}
            <div className="flex items-center gap-3">
              <SkeletonPulse className="h-3 w-20 rounded-full" />
              <SkeletonPulse className="h-1 w-1 rounded-full" />
              <SkeletonPulse className="h-3 w-20 rounded-full" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2">
              <SkeletonPulse className="h-6 w-full rounded-lg" />
              <SkeletonPulse className="h-6 w-4/5 rounded-lg" />
            </div>

            {/* Excerpt skeleton */}
            <div className="space-y-2">
              <SkeletonPulse className="h-4 w-full rounded-lg" />
              <SkeletonPulse className="h-4 w-5/6 rounded-lg" />
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="mt-7 h-4 w-24 rounded-lg skeleton-loading" />
        </div>
      </div>
    </motion.div>
  );
}

export function BlogSkeletonGrid() {
  const secondaryCount = 2;
  const gridCount = 6;

  return (
    <>
      {/* Featured skeleton */}
      <section className="relative mx-auto max-w-[1600px] px-4 pb-8 sm:px-6 lg:px-10">
        <FeaturedPostSkeleton />
      </section>

      {/* Secondary skeleton grid */}
      {secondaryCount > 0 && (
        <section className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-10 sm:px-6 lg:px-10 lg:pt-16">
          <div className="mb-8 flex items-center gap-4 sm:mb-10">
            <SkeletonPulse className="h-4 w-32 rounded-lg" />
            <SkeletonPulse className="h-px flex-1 bg-black/10" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: secondaryCount }).map((_, i) => (
              <SecondaryPostCardSkeleton key={i} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Grid skeleton */}
      <section className="relative mx-auto max-w-[1600px] px-4 pb-24 pt-10 sm:px-6 lg:px-10 lg:pb-32 lg:pt-18">
        <div className="mb-8 flex items-center gap-4 sm:mb-10">
          <SkeletonPulse className="h-4 w-32 rounded-lg" />
          <SkeletonPulse className="h-px flex-1 bg-black/10" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: gridCount }).map((_, i) => (
            <PostGridCardSkeleton key={i} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
