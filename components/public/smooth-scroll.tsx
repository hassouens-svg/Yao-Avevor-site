"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

declare global {
  interface Window {
    __lenis?: import("lenis").default;
  }
}

/**
 * Lenis (smooth scroll) synchronisé avec GSAP ScrollTrigger.
 * Désactivé si prefers-reduced-motion. Ajoute `js-motion` sur <html> pour activer les états initiaux des révélations.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    document.documentElement.classList.add("js-motion");

    let destroyed = false;
    let cleanup = () => {};

    Promise.all([import("lenis"), import("@/lib/motion/gsap").then((m) => m.loadGsap())]).then(
      ([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
        if (destroyed) return;
        const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -80 } });
        window.__lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        cleanup = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          delete window.__lenis;
        };
      },
    );

    return () => {
      destroyed = true;
      cleanup();
      document.documentElement.classList.remove("js-motion");
    };
  }, []);

  return null;
}
