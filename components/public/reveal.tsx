"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** lines : titre révélé ligne par ligne (SplitText + masque). fade : fondu montant. */
  mode?: "lines" | "words" | "fade";
  delay?: number;
  /** true : se joue au montage (hero), false : au scroll */
  immediate?: boolean;
  id?: string;
};

/**
 * Révélation éditoriale. Le contenu est rendu côté serveur et lisible sans JS ;
 * il n'est masqué (via html.js-motion [data-reveal]) que lorsque l'animation peut se jouer.
 */
export function Reveal({ as: Tag = "div", children, className, mode = "fade", delay = 0, immediate = false, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-revealed", "");
      return;
    }
    let ctx: { revert: () => void } | undefined;
    let split: { revert: () => void } | undefined;
    let cancelled = false;

    import("@/lib/motion/gsap").then(async ({ loadGsap }) => {
      const { gsap, SplitText } = await loadGsap();
      if (cancelled) return;
      await document.fonts?.ready;
      if (cancelled) return;

      ctx = gsap.context(() => {
        const trigger = immediate
          ? {}
          : { scrollTrigger: { trigger: el, start: "top 85%", once: true } };

        if (mode === "fade") {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", delay, ...trigger, onStart: () => el.setAttribute("data-revealed", "") },
          );
          return;
        }

        const s = SplitText.create(el, {
          type: mode === "lines" ? "lines" : "words,lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            el.setAttribute("data-revealed", "");
            gsap.set(el, { autoAlpha: 1 });
            const targets = mode === "lines" ? self.lines : self.words;
            return gsap.from(targets, {
              yPercent: 110,
              duration: 0.9,
              ease: "expo.out",
              stagger: mode === "lines" ? 0.09 : 0.035,
              delay,
              ...trigger,
            });
          },
        });
        split = s;
      }, el);
    });

    return () => {
      cancelled = true;
      split?.revert();
      ctx?.revert();
    };
  }, [mode, delay, immediate]);

  return (
    <Tag ref={ref} data-reveal className={className} id={id}>
      {children}
    </Tag>
  );
}
