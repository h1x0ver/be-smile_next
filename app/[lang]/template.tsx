import type { ReactNode } from "react";

/**
 * BeSmile — route transition
 * ------------------------------------------------------------------
 * `template.tsx` remounts on every navigation, so the entrance replays
 * between pages. Pure CSS (see `.page-enter` in globals.css): no JS,
 * and server-rendered HTML is never hidden while waiting for hydration,
 * which keeps LCP fast on the first visit.
 * ------------------------------------------------------------------
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden="true" className="page-shine" />
      <div className="page-enter">{children}</div>
    </>
  );
}
