"use client";
import { useEffect } from "react";

/** One observer, no scroll handlers, no hidden server content or layout shifts. */
export default function HomeMotion() {
 useEffect(() => {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  if (media.matches) return;
  const root = document.querySelector("[data-home-page]");
  if (!root) return;
  const animations = new Set<Animation>();
  const observed = new WeakSet<Element>();
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    observer.unobserve(entry.target);
    if (media.matches) continue;
    const animation = entry.target.animate([
     { opacity: .35, transform: "translate3d(0,24px,0)" },
     { opacity: 1, transform: "translate3d(0,0,0)" },
    ], { duration: 700, easing: "cubic-bezier(.2,.7,.2,1)" });
    animations.add(animation);
    animation.onfinish = () => animations.delete(animation);
   }
  }, { threshold: .06, rootMargin: "0px 0px 30px 0px" });
  function scan() {
   root!.querySelectorAll('[data-home="section-header"], [data-home="why-reasons"], [data-home="services"] > div > div > a, #patient-stories-title').forEach(element => {
    if (observed.has(element)) return;
    observed.add(element);
    // Leave the initial viewport and existing Reveal animations untouched.
    if (element.closest(".bs-rv") || element.getBoundingClientRect().top < innerHeight) return;
    observer.observe(element);
   });
  }
  scan();
  const mutations = new MutationObserver(scan);
  mutations.observe(root, { childList: true, subtree: true });
  const reduce = () => { if (media.matches) { observer.disconnect(); animations.forEach(animation => animation.cancel()); } };
  media.addEventListener("change", reduce);
  return () => { observer.disconnect(); mutations.disconnect(); animations.forEach(animation => animation.cancel()); media.removeEventListener("change", reduce); };
 }, []);
 return null;
}
