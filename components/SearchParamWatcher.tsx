"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function Watcher({ name, onValue }: { name: string; onValue: (value: string) => void }) {
  const value = useSearchParams().get(name);

  // onValue must be stable (a state setter or useCallback)
  useEffect(() => {
    if (value) onValue(value);
  }, [value, onValue]);

  return null;
}

/**
 * Reads a query param without opting the whole page out of server rendering.
 * (Calling useSearchParams in a page component makes Next render it only in the
 * browser, so Google would get an empty page.)
 */
export default function SearchParamWatcher(props: {
  name: string;
  onValue: (value: string) => void;
}) {
  return (
    <Suspense fallback={null}>
      <Watcher {...props} />
    </Suspense>
  );
}
