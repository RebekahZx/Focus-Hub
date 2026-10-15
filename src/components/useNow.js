"use client";
import { useEffect, useState } from "react";

/** Current time, refreshed every `interval` ms (null until mounted, to avoid hydration mismatches). */
export function useNow(interval = 250) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}
