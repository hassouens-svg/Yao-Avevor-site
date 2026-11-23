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
    const cleanups: (() => void)[] = [];

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

        // Photo « vivante » : léger relief 3D qui suit la souris (ou l'inclinaison du téléphone)
        const photo = hero.querySelector<HTMLElement>("[data-hero-photo]");
        if (photo) {
          gsap.set(photo, { transformPerspective: 900 });
          const rY = gsap.quickTo(photo, "rotationY", { duration: 1.2, ease: "power3.out" });
          const rX = gsap.quickTo(photo, "rotationX", { duration: 1.2, ease: "power3.out" });
          const tX = gsap.quickTo(photo, "x", { duration: 1.2, ease: "power3.out" });
          const tilt = (nx: number, ny: number) => { rY(nx * 6); rX(-ny * 3); tX(nx * 10); };
          const onPhotoMove = (e: PointerEvent) => tilt(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
          const onOrient = (e: DeviceOrientationEvent) => { if (e.gamma != null && e.beta != null) tilt(Math.max(-0.5, Math.min(0.5, e.gamma / 50)), Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 50))); };
          window.addEventListener("pointermove", onPhotoMove, { passive: true });
          window.addEventListener("deviceorientation", onOrient, { passive: true });
          // Respiration très lente (comme une photo prise sur le vif)
          gsap.to(photo, { scale: 1.015, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
          cleanups.push(() => { window.removeEventListener("pointermove", onPhotoMove); window.removeEventListener("deviceorientation", onOrient); });
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
          cleanups.push(() => hero.removeEventListener("pointermove", onMove));
        }
      }, hero);
    });

    return () => {
      cancelled = true;
      cleanups.forEach((f) => f());
      ctx?.revert();
    };
  }, []);

  return null;
}
