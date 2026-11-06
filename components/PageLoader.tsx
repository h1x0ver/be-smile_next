"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
type Lang = "ru" | "en" | "az";
type Stage = "draw" | "loop" | "complete";

const LOOP_CAPTION: Record<Lang, string> = {
  ru: "Наводим финальный блеск",
  en: "Adding the final polish",
  az: "Son toxunuşları edirik",
};

const WELCOME_CAPTION: Record<Lang, string> = {
  ru: "Добро пожаловать",
  en: "Welcome",
  az: "Xoş gəlmisiniz",
};

const ARIA_LABEL: Record<Lang, string> = {
  ru: "Загрузка страницы",
  en: "Page loading",
  az: "Səhifə yüklənir",
};

function normalizeLang(lang?: string): Lang {
  if (lang === "ru" || lang === "en" || lang === "az") return lang;
  return "az";
}

// Exact path data from the real BeSmile logo SVG.
const ARC_PATH =
  "M249.33,19.99c-4.02-1.32-8.96,0-10.64,5.09c-7.33,22.32-26.85,36.91-48.69,36.41c-20.88-0.51-39.52-15.1-46.4-36.29c-0.96-2.95-3.1-4.91-6.02-5.53c-0.64-0.14-1.29-0.2-1.93-0.2c-2.54,0-5.04,1.01-6.62,2.76c-1.17,1.3-2.34,3.57-1.23,6.98c9.35,28.81,33.69,47.88,62,48.57c28.93,0.68,54.86-18.66,64.57-48.21C255.99,24.63,253.01,21.2,249.33,19.99z";

const B_PATH =
  "M30.23,28.38h19.48c9.8,0,17.07,2.22,17.07,11.59c0,4.13-1.85,7.15-5.3,9.31c4.19,1.48,7.09,4.62,7.09,10.05c0,10.05-7.21,13.75-18.06,13.75H30.23V28.38z M40.77,46.25h9.31c3.7,0,5.73-1.79,5.73-4.56c0-2.77-2.03-4.44-5.73-4.44h-9.31V46.25z M40.77,64.19h9.86c4.5,0,6.78-1.91,6.78-5.05c0-3.14-2.28-5.05-6.78-5.05h-9.86V64.19z";

const E1_PATH =
  "M77.13,28.38h34.27v9.25H87.67v7.83h22.44v9.31H87.67v9h23.73v9.31H77.13V28.38z";

const S_PATH =
  "M59.06,140.43c9.52,1.91,21.91,5.12,21.91,17.62c0,12.5-12.26,18.1-24.77,18.1c-15.24,0-23.58-7.86-25.96-19.88h2.62c2.38,10.95,9.52,17.62,23.46,17.62c9.05,0,21.91-4.05,21.91-15.48c0-10.72-10.12-13.93-19.29-15.48l-9.17-1.67c-9.64-1.91-18.22-5.83-18.22-16.08c0-10.83,13.22-15.72,23.34-15.72c12.74,0,21.67,5.36,24.17,16.79h-2.62c-2.86-11.07-11.55-14.53-21.67-14.53c-7.26,0-20.6,3.57-20.6,13.45c0,7.98,6.31,11.91,16.19,13.69L59.06,140.43z";

const M_PATH =
  "M103.95,174.61h-2.38v-64.06h2.38v17.86c2.14-8.45,9.17-18.93,22.98-18.93c11.91,0,18.69,5.71,20,19.17c2.86-9.52,9.76-19.17,23.22-19.17c13.22,0,20.24,7.02,20.24,24.17v40.96h-2.38v-39.53c0-14.76-4.29-23.34-18.22-23.34c-14.65,0-22.62,13.57-22.62,31.32v31.55h-2.38v-39.53c0-14.76-4.29-23.34-18.22-23.34c-14.65,0-22.62,13.57-22.62,31.32V174.61z";

const I_PATH = "M217.67,110.55v64.06h-2.38v-64.06H217.67z";
const L_PATH = "M244.84,174.61h-2.38V88.28h2.38V174.61z";

const E2_PATH =
  "M267.1,142.7c0-20,11.31-33.22,29.17-33.22c17.5,0,28.22,13.34,28.22,32.39h-54.65v0.71c0,21.31,12.98,31.32,26.67,31.32c12.86,0,21.91-5.83,24.65-18.1h2.5c-2.5,12.86-12.74,20.36-27.15,20.36C278.29,176.16,267.1,162.46,267.1,142.7z M269.84,139.6h51.91c0-14.88-9.64-27.86-25.6-27.86C280.79,111.74,270.79,122.81,269.84,139.6z";

const DOT_PATH = "M340.48,175.46v-16.21h15.99v16.21H340.48z";

const DRAW_MS = 1100;
const MIN_LOOP_MS = 1400;
const MAX_TOTAL_MS = 8000;
const HOLD_ON_COMPLETE_MS = 900;

const gpuStyle = {
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden" as const,
};

function ArcMark({ stage, reduceMotion }: { stage: Stage; reduceMotion: boolean }) {
  
  const shineTransition = useMemo<Transition | undefined>(() => {
    if (reduceMotion) return undefined;

    if (stage === "complete") {
      return {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      };
    }

    return {
      duration: 1.8,
      repeat: Infinity,
      repeatDelay: 0.45,
      ease: "linear",
      delay: 0.9,
    };
  }, [stage, reduceMotion]);

  return (
    <motion.div
      style={gpuStyle}
      animate={
        reduceMotion
          ? undefined
          : stage === "loop"
            ? { scale: [1, 1.012, 1] }
            : stage === "complete"
              ? { scale: 1.02 }
              : { scale: 1 }
      }
      transition={
        reduceMotion
          ? undefined
          : stage === "loop"
            ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
      }
      className="relative"
    >
      <svg
        viewBox="118 10 148 78"
        className="h-[92px] w-auto sm:h-[112px]"
        fill="none"
        style={gpuStyle}
      >
        <defs>
          <clipPath id="bs-arc-clip">
            <path d={ARC_PATH} />
          </clipPath>

          <linearGradient id="bs-arc-fill" x1="126" y1="22" x2="250" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B7698" />
            <stop offset="55%" stopColor="#16698A" />
            <stop offset="100%" stopColor="#12566F" />
          </linearGradient>

          <linearGradient id="bs-shine-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#c9a24d" stopOpacity="0" />
            <stop offset="20%" stopColor="#d7b56a" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#f2ddb0" stopOpacity={stage === "complete" ? "0.98" : "0.8"} />
            <stop offset="80%" stopColor="#d7b56a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c9a24d" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d={ARC_PATH}
          fill="none"
          stroke="#16698A"
          strokeWidth={2.1}
          strokeLinecap="round"
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.82,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        <motion.path
          d={ARC_PATH}
          fill="url(#bs-arc-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: reduceMotion ? 0 : 0.48,
            duration: reduceMotion ? 0 : 0.52,
            ease: "easeOut",
          }}
        />

        {!reduceMotion && (
          <>
            <motion.path
              d={ARC_PATH}
              fill="none"
              stroke="#ffffff"
              strokeWidth={1.1}
              strokeOpacity={stage === "complete" ? 0.22 : 0.14}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.16, 0.05] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.rect
              y={0}
              height={90}
              width={44}
              clipPath="url(#bs-arc-clip)"
              fill="url(#bs-shine-gradient)"
              initial={{ x: 92 }}
              animate={{ x: stage === "complete" ? 305 : [92, 305] }}
              transition={shineTransition}
              style={gpuStyle}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

function FullLogo({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      style={gpuStyle}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <svg viewBox="0 0 377.68 223.46" className="h-[104px] w-auto sm:h-[124px]" style={gpuStyle}>
        <path fill="#8B8A8A" d={B_PATH} />
        <path fill="#8B8A8A" d={E1_PATH} />
        <path fill="#16698A" d={ARC_PATH} />
        <path fill="#8B8A8A" d={DOT_PATH} />
        <path fill="#231F20" d={S_PATH} />
        <path fill="#231F20" d={M_PATH} />
        <path fill="#231F20" d={I_PATH} />
        <path fill="#231F20" d={L_PATH} />
        <path fill="#231F20" d={E2_PATH} />
        <text
          transform="matrix(1 0 0 1 244.0802 210.6861)"
          fill="#525252"
          fontFamily="'MarkPro-Heavy','Manrope',sans-serif"
          fontWeight={700}
          fontSize={14.6072}
          letterSpacing="0.3"
        >
          DENTAL CLINIC
        </text>
      </svg>
    </motion.div>
  );
}

export default function PageLoader({ lang }: { lang?: Lang } = {}) {
  const safeLang = normalizeLang(lang);
  const reduceMotion = useReducedMotion() ?? false;

  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState<Stage>("draw");

  useEffect(() => {
    const t = window.setTimeout(() => {
      setStage((s) => (s === "draw" ? "loop" : s));
    }, reduceMotion ? 0 : DRAW_MS);

    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  useEffect(() => {
    const startedAt = performance.now();
    let settled = false;
    let completeTimer = 0;

    const goComplete = () => {
      if (settled) return;
      settled = true;

      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(MIN_LOOP_MS - elapsed, 0);

      completeTimer = window.setTimeout(() => {
        setStage("complete");
      }, remaining);
    };

    if (document.readyState === "complete") {
      goComplete();
    } else {
      window.addEventListener("load", goComplete, { once: true });
    }

    const hardCap = window.setTimeout(goComplete, MAX_TOTAL_MS);

    return () => {
      window.removeEventListener("load", goComplete);
      window.clearTimeout(hardCap);
      window.clearTimeout(completeTimer);
    };
  }, []);

  useEffect(() => {
    if (stage !== "complete") return;

    const t = window.setTimeout(() => {
      setIsLoading(false);
    }, reduceMotion ? 0 : HOLD_ON_COMPLETE_MS);

    return () => window.clearTimeout(t);
  }, [stage, reduceMotion]);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="bs-page-loader"
          role="status"
          aria-live="polite"
          aria-label={ARIA_LABEL[safeLang]}
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#f8f6f1]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: reduceMotion ? 0.2 : 0.65,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          style={gpuStyle}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 46%, rgba(22,105,138,0.10), rgba(201,162,77,0.07) 28%, rgba(248,246,241,0) 62%)",
              ...gpuStyle,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: [0.9, 1, 0.92],
                    scale: [1, 1.03, 1],
                  }
            }
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(22,105,138,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(22,105,138,0.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(circle at center, black 28%, transparent 72%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 28%, transparent 72%)",
            }}
          />

          <motion.div
            exit={reduceMotion ? undefined : { scale: 0.985, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center px-6"
            style={gpuStyle}
          >
            <div className="relative flex min-h-[124px] items-center justify-center">
              <motion.div
                animate={{
                  opacity: stage === "complete" ? 0 : 1,
                  scale: stage === "complete" ? 1.04 : 1,
                  y: stage === "complete" ? -2 : 0,
                }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={gpuStyle}
              >
                <ArcMark stage={stage} reduceMotion={reduceMotion} />
              </motion.div>

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: stage === "complete" ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: stage === "complete" ? 0.12 : 0,
                }}
                style={gpuStyle}
              >
                <FullLogo reduceMotion={reduceMotion} />
              </motion.div>
            </div>

            <motion.div
              key={stage === "complete" ? "welcome" : "loop"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.42,
                delay: stage === "complete" ? 0.42 : 0.18,
              }}
              className="mt-6 text-center text-[11px] uppercase tracking-[0.35em] text-black/45 sm:text-[12px]"
              style={gpuStyle}
            >
              {stage === "complete" ? WELCOME_CAPTION[safeLang] : LOOP_CAPTION[safeLang]}
            </motion.div>

            {stage !== "complete" && (
              <div className="mt-5 h-[3px] w-[132px] overflow-hidden rounded-full bg-[#16698A]/10">
                <motion.div
                  className="h-full w-[34%] rounded-full"
                  style={{
                    background: "linear-gradient(90deg, rgba(201,162,77,0.15), #c9a24d, rgba(201,162,77,0.15))",
                    willChange: "transform",
                    transform: "translateZ(0)",
                  }}
                  animate={{ x: reduceMotion ? "98px" : ["-40%", "265%"] }}
                  transition={{
                    duration: reduceMotion ? 0 : 1.25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
