'use client';

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { directusImage, retryImageOnce } from "@/lib/directusImage";

export default function GallerySlider({ images }: { images: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const check = () => {
    if (!ref.current) return;
    setLeft(ref.current.scrollLeft > 0);
    setRight(
      ref.current.scrollLeft <
      ref.current.scrollWidth - ref.current.clientWidth - 10
    );
  };

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
    setTimeout(check, 300);
  };

  return (
    <>
      {/* ✅ SLIDER */}
      <section className="w-full px-6 sm:px-8 lg:px-12 pb-24 mt-auto py-30">
        <div className="relative">
          <div
            ref={ref}
            onScroll={check}
            className="flex gap-6 overflow-x-auto scrollbar-hide items-end"
          >
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() =>
                  setActiveImage(
                    directusImage(img.directus_files_id, 1800, 82)
                  )
                }
                className="cursor-pointer group flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
                style={{
                  width: `${260 + (i % 3) * 60}px`,
                  height: `${180 + (i % 3) * 40}px`,
                }}
              >
                <img
                  src={directusImage(img.directus_files_id, 760, 75)}
                  onError={retryImageOnce}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt=""
                />
              </div>
            ))}
          </div>

          {/* ✅ LEFT BUTTON */}
          {(left || right) && (
            <div
              className="
      absolute z-20 flex gap-2 

      top-[-56px] right-6

      sm:top-[-64px]
      lg:top-[-80px] lg:right-12
    "
            >
              <button
                onClick={() => scroll("left")}
                disabled={!left}
                className="
        h-9 w-9
        rounded-full
        border border-black
        bg-white
        text-black
        flex items-center justify-center
        transition
        hover:bg-black hover:text-white
        disabled:opacity-30 disabled:cursor-not-allowed
      "
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 19L8 12L15 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!right}
                className="
        h-9 w-9
        rounded-full
        border border-black
        bg-white
        text-black
        flex items-center justify-center
        transition
        hover:bg-black hover:text-white
        disabled:opacity-30 disabled:cursor-not-allowed
      "
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}


        </div>
      </section>

      {/* ✅ FULLSCREEN PREVIEW */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center px-4"
        >
          {/* ✅ CLOSE BUTTON */}
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>

          {/* ✅ IMAGE */}
          <img
            src={activeImage}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl animate-fadeIn"
          />
        </div>
      )}
    </>
  );
}
