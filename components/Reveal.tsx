"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Time-based "rise in" for content below the fold.
 * - Server HTML is never hidden (SEO, no-JS, fast LCP).
 * - Anything already on screen when the page loads is left alone.
 * - Plays once; one shared IntersectionObserver for the whole page.
 * - Only animates transform + opacity (GPU-friendly). See .bs-rv in globals.css.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.rv = "in";
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
  );
  return observer;
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  style,
  dataCard = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
  style?: CSSProperties;
  dataCard?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible

    el.dataset.rv = "out";
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-card={dataCard ? "" : undefined}
      className={`bs-rv ${className}`}
      style={{ ...style, ...(delay ? { "--rv-delay": `${delay}ms` } : {}) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
