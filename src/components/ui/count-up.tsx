"use client";

import { useEffect, useRef, useState } from "react";
import { n0 } from "@/lib/format";

/** Compteur animé (ease-out). Respecte `prefers-reduced-motion`. */
export function CountUp({
  value,
  duration = 900,
  format = n0,
  start = 0,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  start?: number;
}) {
  const [v, setV] = useState(value);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(value);
      return;
    }
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(start + (value - start) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration, start]);

  return <span className="num">{format(Math.round(v))}</span>;
}
