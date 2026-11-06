'use client';

import { memo, useId, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { ChevronDown, CalendarDays } from 'lucide-react';
import Link from 'next/link';

interface AccordionCardProps {
  id: string;
  index: number;
  title: string;
  price: string;
  description?: string;
  accentColor: string;
  bookHref: string;
  bookLabel: string;
  isLast: boolean;
}

export const AccordionCard = memo(function AccordionCard({
  id,
  index,
  title,
  price,
  description,
  accentColor,
  bookHref,
  bookLabel,
  isLast,
}: AccordionCardProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const canExpand = Boolean(description);
  // Descriptions are only sanitized when opened, never on scroll or search.
  const safeDescription = useMemo(() => open && description ? DOMPurify.sanitize(description) : '', [open, description]);

  return (
    <article
      id={id}
      className={`w-full scroll-mt-24 border-black/10 ${!isLast ? 'border-b' : ''}`}
    >
      <div className="grid grid-cols-1 gap-2 px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 md:grid-cols-[auto_minmax(0,1fr)_auto_auto] md:items-center md:gap-4">
        <div className="text-[11px] font-medium tabular-nums text-black/25 sm:text-xs md:text-sm">
          {String(index + 1).padStart(2, '0')}
        </div>

        <button
          type="button"
          onClick={() => canExpand && setOpen((prev) => !prev)}
          aria-expanded={canExpand ? open : undefined}
          aria-controls={canExpand ? contentId : undefined}
          className="min-w-0 rounded-lg text-left transition-colors hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2"
        >
          <div className="min-w-0">
            <h3 className="break-words text-sm font-light leading-snug tracking-tight text-black sm:text-base md:text-lg lg:text-xl">
              {title}
            </h3>

            <div className="mt-1 md:hidden">
              <span className="text-sm font-light tabular-nums text-black/75 sm:text-base">
                <Price value={price} />
              </span>
            </div>
          </div>
        </button>

        <div className="hidden md:block">
          <span className="whitespace-nowrap text-base font-light tabular-nums text-black/80 lg:text-xl xl:text-2xl">
            <Price value={price} />
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link
            href={bookHref}
            aria-label={`${bookLabel}: ${title}`}
            prefetch={false}
            className="relative inline-flex h-8 min-h-[44px] w-8 min-w-[44px] items-center justify-center overflow-hidden rounded-full text-white sm:h-9 sm:w-9 lg:h-10 lg:w-10"
            style={{ backgroundColor: accentColor }}
          >
            <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5" strokeWidth={1.5} />
          </Link>

          {canExpand && (
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={title}
              aria-expanded={open}
              aria-controls={contentId}
              className="inline-flex h-8 min-h-[44px] w-8 min-w-[44px] items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
            >
              <div className={`transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}>
                <ChevronDown className="h-4 w-4 lg:h-5 lg:w-5" strokeWidth={2.5} />
              </div>
            </button>
          )}
        </div>
      </div>

      <>
        {open && canExpand && (
          <div
            id={contentId}
            className="overflow-hidden"
          >
            <div className="px-3 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6 md:pl-[3.25rem]">
              <div
                className="max-w-none break-words text-xs leading-relaxed text-black/60 sm:text-sm md:text-[15px] lg:text-base [&>p]:mb-3 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{  __html: safeDescription,}}
              />
            </div>
          </div>
        )}
      </>
    </article>
  );
});

function Price({ value }: { value: string }) {
  if (!value) return null;

  const match = value.match(
    /^(.*?)((?:\d[\d\s.,]*)(?:\s*[-–—]\s*\d[\d\s.,]*)?)\s*(₼|AZN)?\s*(.*)$/i
  );
  if (!match) return <>{value}</>;
  const [, prefix, number, , suffix] = match;

  if (!number) return <>{value}</>;

  return (
    <>
      {prefix}
      {number}
      <span style={{ fontFamily: "system-ui, Arial, sans-serif" }}> ₼</span>
      {suffix}
    </>
  );
}

