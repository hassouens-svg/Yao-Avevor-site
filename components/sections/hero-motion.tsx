"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Animations du hero (client uniquement) :
 * - halo bleu ciel qui suit doucement la souris (desktop)
 * - portrait en léger parallaxe au scroll
 * (les mots-clés italiques « s'écrivent » en CSS : .type-accent dans globals.css)
 */
export function HeroMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    const halo = hero.querySelector<HTMLElement>("[data-hero-halo]");
    const portrait = hero.querySelector<HTMLElement>("[data-hero-portrait]");
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    import("@/lib/motion/gsap").then(async ({ loadGsap }) => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      ctx = gsap.context(() => {
        // Parallaxe du portrait
        if (portrait) {
          gsap.to(portrait, {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        // Halo qui suit la souris
        if (halo && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          const xTo = gsap.quickTo(halo, "x", { duration: 1.6, ease: "power3.out" });
          const yTo = gsap.quickTo(halo, "y", { duration: 1.6, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const r = hero.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width * 0.7) * 0.25);
            yTo((e.clientY - r.top - r.height * 0.45) * 0.25);
          };
          hero.addEventListener("pointermove", onMove);
          return () => hero.removeEventListener("pointermove", onMove);
        }
      }, hero);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
