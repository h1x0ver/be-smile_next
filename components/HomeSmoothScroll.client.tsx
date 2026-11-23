"use client";
import { useEffect } from "react";
import "lenis/dist/lenis.css";

export default function HomeSmoothScroll() {
 useEffect(() => {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(hover: hover) and (pointer: fine)");
  let disposed = false;
  let generation = 0;
  let teardown = () => {};
  async function configure() {
   const current = ++generation;
   teardown(); teardown = () => {};
   if (motion.matches || !desktop.matches) return;
   const { default: Lenis } = await import("lenis");
   if (disposed || current !== generation) return;
   const lenis = new Lenis({ autoRaf:true, smoothWheel:true, syncTouch:false, lerp:.1, anchors:{offset:-100}, prevent:node => !!node.closest('dialog, [role="dialog"], #bs-mobile-menu, [data-lenis-prevent]') });
   const syncLock = () => {
    const locked = !!document.querySelector('dialog[open]') || [document.documentElement,document.body].some(el => el.style.overflow === "hidden" || el.style.overflow === "clip");
    if (locked) lenis.stop(); else lenis.start();
   };
   const locks = new MutationObserver(syncLock);
   for(const element of [document.documentElement,document.body]) locks.observe(element,{attributes:true,attributeFilter:["style"]});
   const dialogs = new MutationObserver(syncLock);
   dialogs.observe(document.body,{subtree:true,attributes:true,attributeFilter:["open"]});
   syncLock();
   teardown = () => { locks.disconnect(); dialogs.disconnect(); lenis.destroy(); };
  }
  configure().catch(() => {});
  const change = () => { configure().catch(() => {}); };
  motion.addEventListener("change",change); desktop.addEventListener("change",change);
  return () => { disposed=true; generation++; teardown(); motion.removeEventListener("change",change); desktop.removeEventListener("change",change); };
 },[]);
 return null;
}
