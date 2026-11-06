"use client";

import { useEffect } from "react";

export default function SearchProvider() {
  useEffect(() => {
    (window as any).__SEARCH_DATA__ = {
      prices: [],
      services: [],
      doctors: [],
      gallery: [],
    };
  }, []);

  return null;
}
