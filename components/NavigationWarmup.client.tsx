"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Warm only the route the visitor is about to open, never the entire menu. */
export default function NavigationWarmup() {
 const router = useRouter();
 useEffect(() => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return;
  const warmed = new Set<string>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const prepare = (event: Event) => {
   const anchor = (event.target as Element)?.closest?.("a[href]");
   if (!anchor) return;
   const url = new URL(anchor.getAttribute("href")!, location.href);
   if (url.origin !== location.origin || !/^\/(ru|az|en)(\/|$)/.test(url.pathname) || url.pathname === location.pathname) return;
   const path = url.pathname + url.search;
   if (warmed.has(path)) return;
   clearTimeout(timer);
   timer = setTimeout(() => { warmed.add(path); router.prefetch(path); }, event.type === "focusin" ? 0 : 100);
  };
  const cancel = () => clearTimeout(timer);
  document.addEventListener("pointerover", prepare, { passive: true });
  document.addEventListener("focusin", prepare);
  document.addEventListener("pointerout", cancel, { passive: true });
  return () => { cancel(); document.removeEventListener("pointerover", prepare); document.removeEventListener("focusin", prepare); document.removeEventListener("pointerout", cancel); };
 }, [router]);
 return null;
}
