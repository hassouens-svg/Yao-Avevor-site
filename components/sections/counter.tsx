"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Compteur « mécanique » : chaque chiffre défile comme un odomètre quand il apparaît.
 * La valeur finale est rendue côté serveur (SEO, sans JS, mouvement réduit).
 */
export function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digits = String(value).split("");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85) return; // déjà visible : on n'anime pas
    el.dataset.odo = "armed";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        requestAnimationFrame(() => (el.dataset.odo = "run"));
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className="odo inline-flex">
      <span className="sr-only">{value}</span>
      {digits.map((d, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block h-[1.1em] overflow-hidden leading-[1.1]">
          <span
            className="odo-col block"
            style={{ "--d": Number(d), "--i": i, "--n": digits.length } as React.CSSProperties}
          >
            {Array.from({ length: 10 }, (_, k) => (
              <span key={k} className="block h-[1.1em]">{k}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
