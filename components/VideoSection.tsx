"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
} from "lucide-react";

type Lang = "en" | "ru" | "az";

const PLAYBACK_ID = "BaoRSXT01q6d02giHatNzwUftWQPgt5z8uA18mM7iapGY";
const HLS_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=1`;

const TEXT = {
  eyebrow: {
    en: "BESMILE",
    ru: "BESMILE",
    az: "BESMILE",
  },
  title: {
    en: "WATCH THE TRANSFORMATION",
    ru: "ПОСМОТРИТЕ ПРЕОБРАЖЕНИЕ",
    az: "DƏYİŞİMƏ BAXIN",
  },
  subtitle: {
    en: "Aesthetic dentistry with attention to every detail",
    ru: "Эстетическая стоматология с вниманием к каждой детали",
    az: "Hər detalına diqqətlə estetik stomatologiya",
  },
  button: {
    en: "Book Online",
    ru: "Записаться",
    az: "Onlayn yazıl",
  },
  soundOn: {
    en: "Enable sound",
    ru: "Включить звук",
    az: "Səsi aç",
  },
  soundOff: {
    en: "Mute sound",
    ru: "Выключить звук",
    az: "Səsi söndür",
  },
  fullscreen: {
    en: "Fullscreen",
    ru: "Полный экран",
    az: "Tam ekran",
  },
  play: {
    en: "Play video",
    ru: "Воспроизвести видео",
    az: "Videonu oynat",
  },
  pause: {
    en: "Pause video",
    ru: "Пауза",
    az: "Videonu dayandır",
  },
};

export default function VideoSection({ lang = "en" }: { lang?: Lang }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hideOverlayContent, setHideOverlayContent] = useState(false);
  const [isTemporarilyShowing, setIsTemporarilyShowing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
      setIsReady(true);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReady(true);
      });

      hlsRef.current = hls;
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const video = videoRef.current;
    if (!el || !video || !isReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        if (visible) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isReady]);

  const clearHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const scheduleHideOverlay = (delay = 5000) => {
    clearHideTimer();
    setIsTemporarilyShowing(true);

    hideTimeoutRef.current = setTimeout(() => {
      const video = videoRef.current;
      setIsTemporarilyShowing(false);

      if (!video) return;

      if (video.currentTime >= 10) {
        setHideOverlayContent(true);
      }
    }, delay);
  };

  const showOverlayTemporarily = () => {
    setHideOverlayContent(false);
    scheduleHideOverlay(5000);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (!video.duration) {
        setProgress(0);
        return;
      }

      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);

      if (isTemporarilyShowing) return;

      if (video.currentTime >= 10) {
        setHideOverlayContent(true);
      } else {
        setHideOverlayContent(false);
      }
    };

    const handleLoaded = () => {
      setProgress(0);
      setHideOverlayContent(false);
      setIsTemporarilyShowing(false);
      clearHideTimer();
    };

    const handleEnded = () => {
      setProgress(0);
      setHideOverlayContent(false);
      setIsTemporarilyShowing(false);
      clearHideTimer();
    };

    const handleSeeked = () => {
      if (isTemporarilyShowing) return;
      setHideOverlayContent(video.currentTime >= 10);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [isTemporarilyShowing]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    return () => {
      clearHideTimer();
    };
  }, []);

  const toggleSound = async () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      try {
        await video.play();
      } catch {}
    }
  };

  const togglePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch {}
  };

  const toggleFullscreen = async () => {
    const el = sectionRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const nextProgress = Number(e.target.value);
    video.currentTime = (nextProgress / 100) * video.duration;
    setProgress(nextProgress);

    if (video.currentTime < 10) {
      setHideOverlayContent(false);
      setIsTemporarilyShowing(false);
      clearHideTimer();
    } else {
      showOverlayTemporarily();
    }
  };

  return (
    <section className="w-full py-20 lg:py-24">
      <div className="px-4 sm:px-6 md:px-8 lg:px-[70px] max-w-[1920px] mx-auto">
        <div
          ref={sectionRef}
          onClick={showOverlayTemporarily}
          className={`relative overflow-hidden rounded-[36px] bg-black min-h-[540px] md:min-h-[640px] lg:min-h-[740px] transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={POSTER_SRC}
          />

          {!isReady && (
            <div className="absolute inset-0 z-[5] flex items-center justify-center bg-black/20">
              <div className="h-10 w-10 rounded-full border-2 border-white/25 border-t-white animate-spin" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/28" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/24 to-black/8" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />

          <div className="relative z-10 flex h-full min-h-[540px] md:min-h-[640px] lg:min-h-[740px] items-end p-6 sm:p-8 lg:p-14">
            <div
              className={`max-w-[860px] text-white transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                hideOverlayContent
                  ? "opacity-0 translate-y-6 blur-sm pointer-events-none"
                  : "opacity-100 translate-y-0 blur-0"
              }`}
            >
              <p className="mb-4 text-[11px] sm:text-xs uppercase tracking-[0.38em] text-white/80">
                {TEXT.eyebrow[lang]}
              </p>

              <h2 className="max-w-[820px] text-[34px] leading-[0.95] sm:text-[52px] md:text-[72px] lg:text-[88px] font-medium tracking-[-0.03em]">
                {TEXT.title[lang]}
              </h2>

              <p className="mt-4 max-w-[620px] text-[15px] sm:text-lg lg:text-[21px] leading-relaxed text-white/85">
                {TEXT.subtitle[lang]}
              </p>

              <div className="mt-7 flex items-center gap-3 flex-wrap">
                <Link
                  href={`/${lang}/book-online`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#16698A] px-6 sm:px-8 text-[15px] sm:text-base font-medium text-white shadow-[0_10px_35px_rgba(22,105,138,0.35)] transition-all duration-300 hover:bg-[#6FB0C7] hover:text-white"
                >
                  {TEXT.button[lang]}
                </Link>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  aria-label={isPlaying ? TEXT.pause[lang] : TEXT.play[lang]}
                  className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/16"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSound();
                  }}
                  aria-label={isMuted ? TEXT.soundOn[lang] : TEXT.soundOff[lang]}
                  className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/16"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  aria-label={TEXT.fullscreen[lang]}
                  className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/16"
                >
                  {isFullscreen ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )}
                </button>
              </div>

              <div className="mt-6 max-w-[260px] sm:max-w-[340px] md:max-w-[420px]">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleSeek}
                  className="video-slider"
                  aria-label="Video progress"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(255, 255, 255, 0.96) ${progress}%,
            rgba(255, 255, 255, 0.22) ${progress}%,
            rgba(255, 255, 255, 0.22) 100%
          );
        }

        .video-slider::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 9999px;
          background: transparent;
        }

        .video-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #ffffff;
          border: none;
          margin-top: -6px;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
        }

        .video-slider::-moz-range-track {
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.22);
        }

        .video-slider::-moz-range-progress {
          height: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.96);
        }

        .video-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 9999px;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </section>
  );
}