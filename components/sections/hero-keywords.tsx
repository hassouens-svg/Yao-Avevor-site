"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

/** Mots-clés du hero : tous visibles, l'un après l'autre s'allume en cuivre avec un trait qui se dessine. */
export function HeroKeywords({ words }: { words: string[] }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setActive((a) => (a + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4" aria-label="Domaines">
      {words.map((k, i) => (
        <li key={k} className="flex items-center gap-3 sm:gap-4">
          {i > 0 && <span aria-hidden="true" className="size-1.5 rotate-45 bg-navy-deep/25" />}
          <span
            className={cn(
              "display relative text-[clamp(1.2rem,2.2vw,1.875rem)] transition-colors duration-500",
              i === active ? "text-copper" : "text-blue",
            )}
          >
            {k}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-1 h-[3px] origin-left bg-copper transition-transform duration-700 ease-[var(--ease-out-expo)]",
                i === active ? "scale-x-100" : "scale-x-0 origin-right",
              )}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
