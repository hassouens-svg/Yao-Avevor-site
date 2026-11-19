"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Section épinglée dont la piste défile horizontalement pendant le scroll vertical (desktop).
 * Mobile / mouvement réduit : simple carrousel à défilement horizontal natif.
 */
export function HorizontalScroll({
  id,
  header,
  children,
  className,
}: {
  id?: string;
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(min-width: 1024px)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    import("@/lib/motion/gsap").then(async ({ loadGsap }) => {
      const { gsap } = await loadGsap();
      if (cancelled || !section.current || !track.current) return;
      ctx = gsap.context(() => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      }, section);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={section} id={id} className={className}>
      <div className="flex min-h-[100svh] flex-col justify-center gap-12 py-[clamp(4rem,8vw,6rem)] lg:gap-14">
        {header}
        <div className="overflow-x-auto [scrollbar-width:none] lg:overflow-visible" data-lenis-prevent-touch>
          <div ref={track} className="flex w-max gap-5 px-[var(--gutter)] will-change-transform lg:gap-6 lg:pl-[max(var(--gutter),calc((100vw-var(--container-site))/2))]">
            {children}
          </div>
        </div>
        <div className="container-site hidden lg:block">
          <div className="h-px w-full bg-line">
            <span ref={bar} className="block h-px origin-left scale-x-0 bg-navy-deep" />
          </div>
        </div>
      </div>
    </section>
  );
}
