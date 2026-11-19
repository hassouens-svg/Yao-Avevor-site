"use client";

/**
 * Chargement paresseux de GSAP + plugins : jamais dans le bundle initial.
 */
let cache: Promise<{
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").SplitText;
}> | null = null;

export function loadGsap() {
  if (!cache) {
    cache = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
    ]).then(([g, st, sp]) => {
      g.gsap.registerPlugin(st.ScrollTrigger, sp.SplitText);
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger, SplitText: sp.SplitText };
    });
  }
  return cache;
}

export const EASE = "expo.out";
