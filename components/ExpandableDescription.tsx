"use client";

import { useState } from "react";

/** Only the disclosure control needs hydration; the surrounding cards are HTML. */
export default function ExpandableDescription({ id, description, wide, moreLabel, hideLabel }: {
  id: string;
  description: string;
  wide: boolean;
  moreLabel: string;
  hideLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p id={id} className={`text-[14px] leading-6 text-black/66 transition-all duration-300 sm:text-[16px] sm:leading-7 sm:text-black/68 sm:line-clamp-none ${open ? "" : wide ? "line-clamp-3" : "line-clamp-2"}`}>
        {description}
      </p>
      {description.length > 90 && (
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={id} className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/78 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-black/55 transition hover:bg-white/90 sm:hidden">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c9ae7b]" />
          {open ? hideLabel : moreLabel}
        </button>
      )}
    </>
  );
}
