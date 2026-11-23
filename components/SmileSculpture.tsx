"use client";

import { useRef, type PointerEvent } from "react";
import styles from "./hero.module.css";

/** Pointer motion stays local to the sculpture and never triggers React renders. */
export default function SmileSculpture() {
  const scene = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    scene.current?.style.setProperty("--tilt-x", `${-y * 9}deg`);
    scene.current?.style.setProperty("--tilt-y", `${x * 12}deg`);
  }
  function reset() {
    scene.current?.style.setProperty("--tilt-x", "0deg");
    scene.current?.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <div className={styles.scene} onPointerMove={move} onPointerLeave={reset}>
    <div className={styles.sceneInner} ref={scene}>
    <svg viewBox="0 0 640 660" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="smile-pearl" cx=".28" cy=".2" r=".85"><stop stopColor="#ffffff"/><stop offset=".48" stopColor="#f3f5f6"/><stop offset=".8" stopColor="#cdd3d7"/><stop offset="1" stopColor="#99a4ad"/></radialGradient>
        <linearGradient id="smile-gold" x1="130" y1="270" x2="510" y2="460" gradientUnits="userSpaceOnUse"><stop stopColor="#56636e"/><stop offset=".18" stopColor="#c5cfd5"/><stop offset=".35" stopColor="#f7fcff"/><stop offset=".5" stopColor="#a6b4bd"/><stop offset=".7" stopColor="#60717e"/><stop offset=".86" stopColor="#e2ebf1"/><stop offset="1" stopColor="#8194a2"/></linearGradient>
        <linearGradient id="smile-edge" x1="200" y1="160" x2="480" y2="500" gradientUnits="userSpaceOnUse"><stop stopColor="white"/><stop offset="1" stopColor="#9eabb4"/></linearGradient>
        <linearGradient id="smile-inset" x1="300" y1="250" x2="300" y2="440" gradientUnits="userSpaceOnUse"><stop stopColor="#d8dfe3"/><stop offset="1" stopColor="#fbfdff"/></linearGradient>
        <filter id="smile-shadow" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="18"/></filter>
        <filter id="smile-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
        <radialGradient id="smile-satellite" cx=".28" cy=".22" r=".8"><stop stopColor="#fff8df"/><stop offset=".22" stopColor="#e7cf99"/><stop offset=".55" stopColor="#a7874d"/><stop offset=".8" stopColor="#70532f"/><stop offset="1" stopColor="#d5bb80"/></radialGradient>
        <radialGradient id="smile-glaze" cx=".25" cy=".15" r=".8"><stop stopColor="#fff" stopOpacity=".65"/><stop offset=".45" stopColor="#fff" stopOpacity="0"/><stop offset=".9" stopColor="#637987" stopOpacity=".09"/><stop offset="1" stopColor="#fff" stopOpacity=".4"/></radialGradient>
      </defs>
      <ellipse cx="336" cy="593" rx="167" ry="17" fill="#53616b" opacity=".18" filter="url(#smile-shadow)"/>
      <circle cx="329" cy="300" r="267" stroke="#93a4b0" strokeOpacity=".22" strokeWidth=".8"/>
      <circle cx="329" cy="300" r="259" stroke="#ffffff" strokeOpacity=".65" strokeWidth="1"/>
      <g transform="rotate(-16 320 310)">
        <ellipse cx="331" cy="328" rx="202" ry="213" fill="#7e8e9a" opacity=".12" filter="url(#smile-shadow)"/>
        <ellipse cx="325" cy="308" rx="204" ry="213" fill="url(#smile-edge)"/>
        <ellipse cx="319" cy="301" rx="199" ry="208" fill="url(#smile-pearl)"/>
        <path d="M154 270C178 474 458 493 490 265C446 358 214 362 154 270Z" fill="#5c6e7b" opacity=".2" transform="translate(0 12)" filter="url(#smile-soft)"/>
        <path d="M153 264C178 484 462 487 491 262C430 350 218 351 153 264Z" fill="url(#smile-gold)"/>
        <path d="M158 269C222 352 429 352 486 268C452 428 203 431 158 269Z" fill="url(#smile-inset)"/>
        <path d="M153 264C218 351 430 350 491 262" stroke="#f7fcff" strokeWidth="2" strokeOpacity=".9"/>
        <path d="M178 360C241 475 419 470 473 356" stroke="#dbe9f2" strokeWidth="1.3" strokeOpacity=".7"/>
        <ellipse cx="252" cy="162" rx="69" ry="28" fill="white" opacity=".3" transform="rotate(-28 252 162)" filter="url(#smile-soft)"/>
        <ellipse cx="319" cy="301" rx="199" ry="208" fill="url(#smile-glaze)"/>
        <path d="M143 237C163 141 236 91 306 94" stroke="white" strokeWidth="1.5" strokeOpacity=".65"/>
      </g>
      <path d="M73 360C9 470 210 548 424 436C568 360 630 241 563 208" stroke="#8ca1b0" strokeWidth="1" strokeOpacity=".65"/>
    </svg>
    </div>
    </div>
  );
}
