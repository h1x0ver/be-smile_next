"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Lang = "ru" | "en" | "az";

const COPY: Record<Lang, { title: string; text: string; home: string; book: string }> = {
  ru: {
    title: "Страница не найдена",
    text: "Возможно, ссылка устарела или страница была перемещена.",
    home: "На главную",
    book: "Записаться на приём",
  },
  en: {
    title: "Page not found",
    text: "The link may be outdated or the page has been moved.",
    home: "Go home",
    book: "Book an appointment",
  },
  az: {
    title: "Səhifə tapılmadı",
    text: "Ola bilər ki, keçid köhnəlib və ya səhifə başqa ünvana köçürülüb.",
    home: "Ana səhifə",
    book: "Qəbula yazılın",
  },
};

export default function NotFound() {
  const pathname = usePathname() || "";
  const seg = pathname.split("/")[1];
  const lang: Lang = seg === "ru" || seg === "en" || seg === "az" ? seg : "ru";
  const t = COPY[lang];

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center bg-[#f8f6f1] px-6 py-24 text-center">
      <div className="max-w-[560px]">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#b08b57]">404</p>
        <h1 className="mt-5 text-[38px] font-[300] leading-[1.05] text-[#111111] sm:text-[52px]">
          {t.title}
        </h1>
        <p className="mt-5 text-[15px] leading-7 text-black/55">{t.text}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${lang}`}
            className="inline-flex min-h-[52px] items-center rounded-full bg-[#111111] px-7 text-[11px] font-medium uppercase tracking-[0.22em] transition hover:-translate-y-[1px]"
          >
            <span className="text-white">{t.home}</span>
          </Link>
          <Link
            href={`/${lang}/book-online`}
            className="inline-flex min-h-[52px] items-center rounded-full border border-black/10 bg-white px-7 text-[11px] font-medium uppercase tracking-[0.22em] text-[#111111] transition hover:-translate-y-[1px]"
          >
            {t.book}
          </Link>
        </div>
      </div>
    </section>
  );
}
