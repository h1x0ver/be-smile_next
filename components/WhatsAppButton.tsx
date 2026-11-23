"use client";

import { useState } from "react";

const whatsappItems = [
  {
    title: "Be Smile International",
    subtitle: "English-speaking patients",
    phoneLabel: "+994 99 841 65 85",
    phone: "994998416585",
    message: "Hello, I would like to contact Be Smile International.",
  },
  {
    title: "Be Smile Azerbaijan",
    subtitle: "Local WhatsApp line",
    phoneLabel: "+994 70 421 02 04",
    phone: "994704210204",
    message: "Salam, Be Smile ilə əlaqə saxlamaq istəyirəm.",
  },
];

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 .4C7.2.4 0 7.6 0 16.4c0 2.8.7 5.5 2 7.9L.1 32l7.8-2A16 16 0 0016 32c8.8 0 16-7.2 16-16S24.8.4 16 .4zm0 29.2c-2.2 0-4.4-.6-6.3-1.7l-.5-.3-4.6 1.2 1.2-4.5-.3-.5A13.2 13.2 0 012.8 16c0-7.3 5.9-13.2 13.2-13.2S29.2 8.7 29.2 16 23.3 29.6 16 29.6zm7.2-9.8c-.4-.2-2.3-1.1-2.7-1.2-.3-.1-.6-.2-.8.2s-1 1.2-1.2 1.4c-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.8-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.7.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6s-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-1 .5-.3.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.7c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.2.8.9.3 1.7.2 2.3.2.7-.1 2.2-.9 2.5-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.7-.5z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  const getWhatsappUrl = (phone: string, message: string) =>
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div data-contact="whatsapp" className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none sm:bottom-6 sm:right-6">
      {/* Menu */}
      <div
        inert={!open}
        aria-hidden={!open}
        className={`
 pointer-events-auto
 w-[calc(100vw-40px)] max-w-[335px] overflow-hidden rounded-[28px]
 border border-white/70 bg-[#f8f6f1]/92 
 shadow-[0_28px_80px_rgba(17,17,17,0.18)]
 transition-all duration-500 ease-out
 sm:max-w-[340px]
 ${
 open
 ? "translate-y-0 scale-100 opacity-100"
 : "pointer-events-none translate-y-4 scale-95 opacity-0"
 }
 `}
      >
        <div className="relative p-3">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#c7a76c]/25 blur-3xl" />

          <div className="relative px-4 pb-2 pt-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c7a76c]" />
              <p className="text-[10px] uppercase tracking-[0.28em] text-black/35">
                WhatsApp Contact
              </p>
            </div>

            <h3 className="mt-2 text-[17px] font-medium tracking-[-0.02em] text-[#111111]">
              Choose WhatsApp number
            </h3>
          </div>

          <div className="relative space-y-2">
            {whatsappItems.map((item) => (
              <a
                key={item.phone}
                href={getWhatsappUrl(item.phone, item.message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="
                  group flex items-center gap-3 rounded-[22px]
                  border border-white/70 bg-white/65 px-3 py-3
                  shadow-[0_10px_30px_rgba(17,17,17,0.07)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-white/90
                  hover:shadow-[0_18px_45px_rgba(17,17,17,0.12)]
                  active:scale-[0.98]
                "
              >
                <span
                  className="
                    flex h-11 w-11 aspect-square shrink-0 items-center justify-center rounded-full
                    bg-[#111111] text-white
                    shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),0_10px_24px_rgba(0,0,0,0.18)]
                  "
                >
                  <WhatsAppIcon className="h-[22px] w-[22px]" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium tracking-[-0.01em] text-[#111111]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-black/45">
                    {item.subtitle}
                  </span>
                  <span className="mt-1 block text-[12px] font-medium text-black/60">
                    {item.phoneLabel}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open WhatsApp contacts"
        aria-expanded={open}
        className="
          pointer-events-auto
          group relative flex h-14 w-14 aspect-square items-center justify-center rounded-full
          border border-white/70 bg-[#f8f6f1]/97
          shadow-[0_18px_55px_rgba(17,17,17,0.18)]
          transition-all duration-500 ease-out
          hover:-translate-y-0.5 hover:shadow-[0_26px_80px_rgba(17,17,17,0.22)]
          active:translate-y-0 active:scale-[0.94]
          sm:h-[64px] sm:w-auto sm:justify-start sm:gap-3 sm:py-2 sm:pl-2 sm:pr-6
        "
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/75 via-[#c7a76c]/15 to-white/55" />
        <span className="pointer-events-none absolute -inset-1 rounded-full border border-[#c7a76c]/35 opacity-80 animate-ping" />
        <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-[#c7a76c]/24 blur-2xl opacity-90" />

        <span
          className="
            relative flex h-11 w-11 aspect-square shrink-0 items-center justify-center rounded-full
            bg-[#111111] text-white
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),0_10px_30px_rgba(0,0,0,0.24)]
            transition-transform duration-500 group-hover:scale-105
            sm:h-12 sm:w-12
          "
        >
          <WhatsAppIcon className="h-[22px] w-[22px] sm:h-[23px] sm:w-[23px]" />
        </span>

        <span className="relative hidden flex-col text-left sm:flex">
          <span className="text-[9px] uppercase tracking-[0.38em] text-black/35">
            Be Smile
          </span>
          <span className="mt-0.5 text-[15px] font-medium tracking-[-0.02em] text-[#111111]">
            WhatsApp
          </span>
        </span>

        <span
          className={`
            relative ml-1 hidden h-7 w-7 items-center justify-center rounded-full
            border border-black/5 bg-white/45 text-black/45
            transition-all duration-300
            group-hover:bg-white/75 group-hover:text-black/70
            sm:flex
            ${open ? "rotate-180" : "rotate-0"}
          `}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
    </div>
  );
}