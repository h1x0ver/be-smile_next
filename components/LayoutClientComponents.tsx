'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';


// ⚡ Динамические импорты только на клиенте с ssr: false
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), {
  loading: () => null,
  ssr: false,
});



// ⚡ Floating widgets aren't needed for the first paint: load them when the
// browser is idle or on the first user interaction, whichever comes first.
// This keeps their JS off the critical path of the first page load.
export function LayoutClientComponents() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 4000 })
      : window.setTimeout(start, 2500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, start));
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      {/* ⚡ WhatsApp справа */}
      <WhatsAppButton />


    </>
  );
}
