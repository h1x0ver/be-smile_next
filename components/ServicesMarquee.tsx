import Link from "next/link";
import type { NavServiceGroup } from "@/lib/navigation";

type Lang = "en" | "ru" | "az";

/**
 * Endless ribbon of services under the hero. Pure CSS animation (pauses on
 * hover), every item is a real link — good for users and internal linking.
 */
export default function ServicesMarquee({
  lang,
  groups,
}: {
  lang: Lang;
  groups: NavServiceGroup[];
}) {
  const items = groups.flatMap((g) => g.items);
  if (items.length < 3) return null;

  const row = (copy: number) => (
    <ul className="bs-marquee-row flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {items.map((item) => (
        <li key={`${copy}-${item.slug}`} className="flex items-center">
          <Link
            href={`/${lang}/services/${item.slug}`}
            prefetch={false}
            tabIndex={copy > 0 ? -1 : undefined}
            className="group flex items-center gap-3 px-6 py-5 sm:px-8"
          >
            <span className="text-[22px] font-[300] tracking-[-0.01em] text-[#111111]/70 transition-colors duration-300 group-hover:text-[#111111] sm:text-[28px] lg:text-[34px]">
              {item.title}
            </span>
          </Link>
          <svg viewBox="0 0 24 12" className="h-3 w-6 shrink-0 text-[#b08b57]" fill="none" aria-hidden="true">
            <path d="M2 3c3 5 17 5 20 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label={lang === "ru" ? "Услуги клиники" : lang === "az" ? "Klinikanın xidmətləri" : "Clinic services"}
      className="relative overflow-hidden border-y border-black/[0.06] bg-white/40"
    >
      <div className="bs-marquee flex w-max">
        {row(0)}
        {row(1)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f8f6f1] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f8f6f1] to-transparent sm:w-32" />
    </section>
  );
}
