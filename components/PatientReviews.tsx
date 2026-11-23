"use client";

import { useRef, useState } from "react";
import styles from "./patient-reviews.module.css";
import PatientVideo from "./PatientVideo";

type Lang = "ru" | "az" | "en";
// Add the uploaded video URL and its poster here; no video downloads before opening.
const VIDEOS: { src: string; poster?: string }[] = [{ src: "B2B00kwBo5WlaL17kdqXWZUlKlkFchzpzXHt9QGH015Es", poster: "https://image.mux.com/B2B00kwBo5WlaL17kdqXWZUlKlkFchzpzXHt9QGH015Es/thumbnail.jpg?time=1&width=640" }, { src: "1t9GzlAumyvccMdAqBTmdEvRrXQlimnfge3OENzvcFg", poster: "https://image.mux.com/1t9GzlAumyvccMdAqBTmdEvRrXQlimnfge3OENzvcFg/thumbnail.jpg?time=1&width=640" }, { src: "MkQzcX55PQ2qjHKyuCzYXJhm02iNcY9dHAhS8MEQ6bu00", poster: "https://image.mux.com/MkQzcX55PQ2qjHKyuCzYXJhm02iNcY9dHAhS8MEQ6bu00/thumbnail.jpg?time=1&width=640" }];
const COPY = {
 ru: { label: "ОПЫТ ПАЦИЕНТОВ", title: "ОТЗЫВЫ", accent: "ПАЦИЕНТОВ", intro: "Личный опыт, эмоции и впечатления о BeSmile — от наших пациентов.", watch: "Смотреть видео", soon: "Видео скоро появится", story: "История пациента", close: "Закрыть", note: "Скоро здесь появятся видеоистории наших пациентов." },
 az: { label: "PASİYENT TƏCRÜBƏSİ", title: "PASİYENT", accent: "RƏYLƏRİ", intro: "Pasiyentlərimizin BeSmile haqqında şəxsi təcrübələri, hissləri və təəssüratları.", watch: "Videoya baxın", soon: "Video tezliklə", story: "Pasiyentin hekayəsi", close: "Bağla", note: "Pasiyentlərimizin videohekayələri tezliklə burada olacaq." },
 en: { label: "PATIENT EXPERIENCES", title: "PATIENT", accent: "REVIEWS", intro: "Personal experiences, emotions and impressions of BeSmile, shared by our patients.", watch: "Watch video", soon: "Video coming soon", story: "Patient story", close: "Close", note: "Our patients’ video stories will appear here soon." },
};
export default function PatientReviews({ lang }: { lang: Lang }) {
 const t = COPY[lang];
 const dialog = useRef<HTMLDialogElement>(null);

 const [active, setActive] = useState<number | null>(null);
 function open(index: number) { setActive(index); dialog.current?.showModal(); }
 function close() { dialog.current?.close(); setActive(null); }
 return <section className={styles.section} aria-labelledby="patient-stories-title">
  <div className={styles.container}>
   <div className={styles.heading} data-home="section-header"><div><p className={styles.label}>{t.label}</p><h2 id="patient-stories-title">[ {t.title} <span>{t.accent}</span> ]</h2></div><p className={styles.intro}>{t.intro}</p></div>
   <div className={styles.cards}>{VIDEOS.map((video, index) => <button key={index} type="button" className={styles.card} onClick={() => open(index)} aria-label={`${video.src ? t.watch : t.soon} — ${t.story} ${index + 1}`}>
    {video.poster && <img className={styles.poster} src={video.poster} alt="" loading="lazy" />}
    <div className={styles.art} hidden={!!video.poster} aria-hidden="true"><div className={styles.orbit}/><div className={styles.pearl}/><div className={styles.smile}/></div>
    <span className={styles.brand}>BeSmile<span>DENTAL CLINIC</span></span>
    <span className={styles.play} aria-hidden="true"><svg width="22" height="24" viewBox="0 0 22 24" fill="none"><path d="M6 4L18 12L6 20V4Z" fill="currentColor"/></svg></span>
    <span className={styles.bottom}><span className={styles.story}>{t.story}</span><span className={styles.watch}>{video.src ? t.watch : t.soon}<span aria-hidden="true">↗</span></span></span>
   </button>)}</div>
  </div>
  <dialog ref={dialog} className={styles.dialog} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }} onClose={() => { setActive(null); }}>
   <div className={styles.modal}><button className={styles.close} onClick={close} aria-label={t.close}>×</button>{active !== null && VIDEOS[active].src ? <PatientVideo key={active} id={VIDEOS[active].src} title={`${t.story} ${active + 1}`} /> : <div className={styles.empty}><span className={styles.emptyIcon} aria-hidden="true">▷</span><h3>{t.soon}</h3><p>{t.note}</p></div>}</div>
  </dialog>
 </section>;
}
