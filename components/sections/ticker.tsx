"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Bandeau défilant géant : la vitesse et le sens suivent le scroll (plus on fait défiler vite, plus il accélère).
 * Deux lignes en sens inverse, l'une pleine, l'autre en contour.
 */
export function Ticker({ words }: { words: string[] }) {
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    let lastY = window.scrollY;
    let velocity = 0;
    const offsets = [0, 0];
    const tick = () => {
      const y = window.scrollY;
      velocity = velocity * 0.9 + (y - lastY) * 0.1;
      lastY = y;
      const speed = 0.6 + Math.min(8, Math.abs(velocity) * 0.25);
      const dir = velocity < -0.5 ? -1 : 1;
      rows.current.forEach((row, i) => {
        if (!row) return;
        const half = row.scrollWidth / 2;
        offsets[i] = (offsets[i] + speed * dir * (i === 0 ? 1 : -1) + half) % half;
        row.style.transform = `translate3d(${-offsets[i]}px,0,0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const line = (outline: boolean) =>
    [...words, ...words].map((w, i) => (
      <span key={i} className="flex shrink-0 items-center">
        <span
          className={
            "display px-6 text-[clamp(3rem,9vw,8rem)] leading-none " +
            (outline ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-navy-deep)]" : "text-navy-deep")
          }
        >
          {w}
        </span>
        <span aria-hidden="true" className="size-4 shrink-0 rotate-45 bg-sky sm:size-5" />
      </span>
    ));

  return (
    <section aria-label={words.join(", ")} className="overflow-hidden bg-white py-10 sm:py-14">
      <div aria-hidden="true" className="space-y-2">
        <div ref={(el) => { rows.current[0] = el; }} className="flex w-max will-change-transform">
          {line(false)}
        </div>
        <div ref={(el) => { rows.current[1] = el; }} className="flex w-max will-change-transform">
          {line(true)}
        </div>
      </div>
    </section>
  );
}
