"use client";

import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { responsiveAssetSrcSet, retryImageOnce } from "@/lib/directusImage";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ArrowIcon({ dir = "left" }: { dir?: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {dir === "left" ? (
        <path
          d="M14.5 6.5L9 12l5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 6.5L15 12l-5.5 5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

type BeforeAfterSliderProps = {
  before: string;
  after: string;
  className?: string;
  initial?: number;
  showLabels?: boolean;
  rounded?: string;
  autoplayHint?: boolean;
  labels?: {
    before: string;
    after: string;
  };
  sizes?: string;
};

export function BeforeAfterSlider({
  before,
  after,
  className = "h-64",
  initial = 50,
  showLabels = true,
  rounded = "rounded-2xl",
  autoplayHint = true,
  labels,
  sizes = "100vw",
}: BeforeAfterSliderProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(initial);
  const posRef = useRef(initial);
  const [dragging, setDragging] = useState(false);
  const [hint, setHint] = useState(true);

  const reduceMotion = usePrefersReducedMotion();
  const playedRef = useRef(false);

  const clip = useMemo(
    () => `inset(0 ${100 - pos}% 0 0 round 16px)`,
    [pos]
  );

  const setPosSafe = useCallback((v: number) => {
    if (Math.abs(v - posRef.current) < 0.15) return;
    posRef.current = v;
    setPos(v);
  }, []);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = wrapRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const next = clamp((x / rect.width) * 100, 0, 100);
      setPosSafe(next);
    },
    [setPosSafe]
  );

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 2200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element || !autoplayHint || reduceMotion || playedRef.current) return;
    let frame = 0;
    let start = 0;
    const values = [initial, clamp(initial - 12, 10, 90), clamp(initial - 12, 10, 90), clamp(initial + 8, 10, 90), clamp(initial + 8, 10, 90), initial];
    const times = [0, 550, 600, 1150, 1200, 1750];
    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = Math.min(now - start, 1750);
      let segment = 0;
      while (segment < times.length - 2 && elapsed > times[segment + 1]) segment++;
      const progress = Math.min((elapsed - times[segment]) / (times[segment + 1] - times[segment]), 1);
      const eased = (1 - Math.cos(Math.PI * progress)) / 2;
      setPosSafe(values[segment] + (values[segment + 1] - values[segment]) * eased);
      if (elapsed < 1750) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || playedRef.current) return;
      playedRef.current = true;
      observer.disconnect();
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [autoplayHint, reduceMotion, initial, setPosSafe]);


  return (
    <div
      ref={wrapRef}
      className={[
        "relative group overflow-hidden select-none bg-black/5",
        className,
        rounded,
      ].join(" ")}
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        setHint(false);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromClientX(e.clientX);
      }}
      onPointerUp={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
        setDragging(false);
      }}
      onPointerCancel={() => setDragging(false)}
      onLostPointerCapture={() => setDragging(false)}
      onKeyDown={(e) => {
        const next = e.key === "ArrowLeft" ? posRef.current - 5
          : e.key === "ArrowRight" ? posRef.current + 5
          : e.key === "Home" ? 0 : e.key === "End" ? 100 : null;
        if (next === null) return;
        e.preventDefault();
        setHint(false);
        setPosSafe(clamp(next, 0, 100));
      }}
      tabIndex={0}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-label="Before and after comparison"
    >
      <img
        src={before}
        srcSet={responsiveAssetSrcSet(before, [480, 768, 1024, 1400])}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onError={retryImageOnce}
        alt={labels?.before ?? "Before"}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <img
        src={after}
        srcSet={responsiveAssetSrcSet(after, [480, 768, 1024, 1400])}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onError={retryImageOnce}
        alt={labels?.after ?? "After"}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover will-change-[clip-path]"
        style={{ clipPath: clip, WebkitClipPath: clip }}
      />

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.12),transparent_38%,transparent)]" />

      {showLabels && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/88 backdrop-blur-md">
            {labels?.before ?? "Before"}
          </div>
          <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/88 backdrop-blur-md">
            {labels?.after ?? "After"}
          </div>
        </>
      )}

      {hint && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full border border-white/20 bg-white/88 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl">
            Drag
          </div>
        </div>
      )}

      <div
        className="pointer-events-none absolute bottom-0 top-0 w-px bg-white/92 shadow-[0_0_0_1px_rgba(0,0,0,0.10)]"
        style={{ left: `${pos}%` }}
      />

      <div className="absolute bottom-0 top-0" style={{ left: `${pos}%` }}>
        <div className="flex h-full -translate-x-1/2 items-center justify-center">
          <div
            className={[
              "grid h-11 w-11 place-items-center rounded-full border border-white/30",
              "bg-white/95 text-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl",
              "transition-transform duration-200",
              dragging ? "scale-110" : "group-hover:scale-105",
            ].join(" ")}
          >
            <div className="flex items-center gap-0.5">
              <span className="opacity-70">
                <ArrowIcon dir="left" />
              </span>
              <span className="opacity-70">
                <ArrowIcon dir="right" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeforeAfterSlider;
