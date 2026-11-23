"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./patient-reviews.module.css";

export default function PatientVideo({ id, title }: { id: string; title: string }) {
 const ref = useRef<HTMLVideoElement>(null);
 const [failed, setFailed] = useState(false);
 const [attempt, setAttempt] = useState(0);
 useEffect(() => {
  const video = ref.current;
  if (!video) return;
  let disposed = false;
  let destroy = () => {};
  const src = `https://stream.mux.com/${id}.m3u8`;
  const play = () => { video.play().catch(() => {}); };
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) || (/Safari/.test(navigator.userAgent) && !/Chrome|Chromium/.test(navigator.userAgent))) {
   video.src = src; play();
  } else {
   import("hls.js").then(({ default: Hls }) => {
    if (disposed) return;
    if (!Hls.isSupported()) { setFailed(true); return; }
    const hls = new Hls({ capLevelToPlayerSize: false, maxBufferLength: 15, maxMaxBufferLength: 30 });
    destroy = () => hls.destroy();
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
     // Begin with a crisp 720px portrait rendition, then let ABR follow bandwidth.
     // Data Saver starts at 480px instead; never lock playback to one quality.
     const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
     const target = connection?.saveData ? 480 : 720;
     const levels = hls.levels.map((level, index) => ({ index, width: level.width }));
     const initial = levels.filter(level => level.width >= target).sort((a, b) => a.width - b.width)[0]
      ?? levels.sort((a, b) => b.width - a.width)[0];
     if (initial) hls.startLevel = initial.index;
     play();
    });
    hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal) setFailed(true); });
    hls.loadSource(src); hls.attachMedia(video);
   }).catch(() => { if (!disposed) setFailed(true); });
  }
  return () => { disposed = true; video.pause(); destroy(); video.removeAttribute("src"); video.load(); };
 }, [id, attempt]);
 return <div className={styles.videoHost}><video ref={ref} controls autoPlay playsInline preload="auto" poster={`https://image.mux.com/${id}/thumbnail.jpg?time=1&width=720`} aria-label={title} onError={() => setFailed(true)} />{failed && <button className={styles.retry} aria-label="Retry" onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>↻</button>}</div>;
}
