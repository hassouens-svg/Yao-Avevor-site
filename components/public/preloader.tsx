"use client";

import { useEffect, useRef } from "react";
import { PRELOAD_KEY } from "@/lib/motion/preload";
import { Monogram } from "./monogram";

/**
 * Préloader < 1,2 s, uniquement à la première visite de la session :
 * le monogramme « YA » se dessine, puis le rideau bleu marine se lève.
 *
 * Le voile est rendu côté serveur mais n'est visible que si le script inline du <head>
 * a posé `html[data-preload]` (première visite, mouvement non réduit) : aucun flash, aucun impact sur les visites suivantes.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(PRELOAD_KEY, "1");
    } catch {}
    const html = document.documentElement;
    if (!html.dataset.preload || !root.current) return;
    const el = root.current;
    let cancelled = false;
    const done = () => delete html.dataset.preload;

    import("@/lib/motion/gsap").then(async ({ loadGsap }) => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const paths = el.querySelectorAll<SVGPathElement>("[data-stroke]");
      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });
      gsap
        .timeline({ onComplete: done })
        .to(paths, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut", stagger: 0.07 })
        .to(el.querySelector("svg"), { opacity: 0, y: -12, duration: 0.25, ease: "power2.in" }, "+=0.05")
        .to(el, { yPercent: -100, duration: 0.55, ease: "expo.inOut" }, "-=0.1");
    }, done);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[150] hidden items-center justify-center bg-navy-deep text-sky"
    >
      <Monogram className="h-12 w-auto" strokeWidth={1.6} />
    </div>
  );
}
