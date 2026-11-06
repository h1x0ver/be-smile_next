"use client";

import { useCallback, useEffect, useState } from "react";
import { INTRO_DURATION_MS } from "@/lib/intro";

type Lang = "ru" | "en" | "az";
const CAPTIONS = {
  ru: { polish: "Наводим финальный блеск", welcome: "Добро пожаловать", skip: "Пропустить" },
  en: { polish: "Adding the final polish", welcome: "Welcome", skip: "Skip" },
  az: { polish: "Son toxunuşları edirik", welcome: "Xoş gəlmisiniz", skip: "Keç" },
};

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

export default function PageLoader({ lang = "az" }: { lang?: Lang }) {
  const [visible, setVisible] = useState(true);
  const copy = CAPTIONS[lang];
  const finish = useCallback(() => {
    document.documentElement.dataset.bsIntro = "done";
    setVisible(false);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const playing = root.dataset.bsIntro === "play";
    const started = Number(root.dataset.bsIntroStarted);
    const elapsed = Number.isFinite(started) ? performance.now() - started : 0;
    const timer = window.setTimeout(finish, playing ? Math.max(0, INTRO_DURATION_MS - elapsed) : 0);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    if (playing) window.addEventListener("keydown", onKey);
    return () => { window.clearTimeout(timer); window.removeEventListener("keydown", onKey); };
  }, [finish]);

  if (!visible) return null;

  return (
    <section className="bs-intro" aria-label={copy.welcome}>
      <div className="bs-intro-content">
        <div className="bs-intro-mark" aria-hidden="true">
          <svg viewBox="118 10 148 78" className="bs-intro-arc" fill="none">
            <defs>
              <clipPath id="bs-intro-arc-clip"><path d={ARC_PATH} /></clipPath>
              <linearGradient id="bs-intro-shine"><stop stopColor="#fff" stopOpacity="0"/><stop offset=".5" stopColor="#f2ddb0" stopOpacity=".9"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
            </defs>
            <path className="bs-intro-outline" d={ARC_PATH} stroke="#16698a" strokeWidth="2" pathLength="1" />
            <path className="bs-intro-fill" d={ARC_PATH} fill="#16698a" />
            <g clipPath="url(#bs-intro-arc-clip)"><rect className="bs-intro-shine" x="80" y="0" width="42" height="90" fill="url(#bs-intro-shine)"/></g>
          </svg>
          <svg viewBox="0 0 377.68 223.46" className="bs-intro-logo">
            <path fill="#8b8a8a" d={B_PATH}/><path fill="#8b8a8a" d={E1_PATH}/>
            <path fill="#16698a" d={ARC_PATH}/><path fill="#8b8a8a" d={DOT_PATH}/>
            <path fill="#231f20" d={S_PATH}/><path fill="#231f20" d={M_PATH}/>
            <path fill="#231f20" d={I_PATH}/><path fill="#231f20" d={L_PATH}/><path fill="#231f20" d={E2_PATH}/>
            <text transform="translate(244.08 210.69)" fill="#525252" fontFamily="Manrope,sans-serif" fontWeight="700" fontSize="14.6">DENTAL CLINIC</text>
          </svg>
        </div>
        <div className="bs-intro-caption" aria-hidden="true">
          <span className="bs-intro-polish">{copy.polish}</span>
          <span className="bs-intro-welcome">{copy.welcome}</span>
        </div>
        <div className="bs-intro-progress" aria-hidden="true"><span /></div>
      </div>
      <button type="button" className="bs-intro-skip" onClick={finish}>{copy.skip}<span aria-hidden="true"> ↗</span></button>
    </section>
  );
}
