"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

type Card = {
  src: string;
  alt: string;
  w: number;
  h: number;
  /** position en % du conteneur */
  x: number;
  y: number;
  /** largeur en vw (desktop) / vw (mobile) */
  size: [number, number];
  /** profondeur : 0 (loin, très flou) → 1 (proche, net) */
  depth: number;
  rotate: number;
  hideMobile?: boolean;
};

const cards: Card[] = [
  { src: "/images/banner/usine.jpg", alt: "", w: 612, h: 300, x: 4, y: 14, size: [17, 34], depth: 0.35, rotate: -8 },
  { src: "/images/banner/conception.jpg", alt: "", w: 346, h: 300, x: 76, y: 8, size: [11, 26], depth: 0.6, rotate: 7 },
  { src: "/images/banner/management.jpg", alt: "", w: 446, h: 300, x: 70, y: 52, size: [13, 30], depth: 0.25, rotate: -5, hideMobile: true },
  { src: "/images/banner/pilotage.jpg", alt: "", w: 480, h: 390, x: 40, y: 7, size: [12, 26], depth: 0.5, rotate: 6, hideMobile: true },
  { src: "/images/banner/innovation.jpg", alt: "", w: 360, h: 336, x: 86, y: 30, size: [9, 22], depth: 0.8, rotate: -10 },
];

/**
 * Illustrations de la bannière (Conception, Management, Pilotage, Innovation, usine) flottant en 3D derrière le portrait :
 * floues selon leur profondeur, elles flottent doucement et suivent la souris (ou l'inclinaison au scroll sur mobile).
 */
export function FloatingCards({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);
      el.style.setProperty("--mx", cx.toFixed(4));
      el.style.setProperty("--my", (cy + scroll * 0.6).toFixed(4));
      el.style.setProperty("--sc", scroll.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className={cn("pointer-events-none [perspective:1200px]", className)}>
      {cards.map((c, i) => {
        const blur = (1 - c.depth) * 5 + 0.5;
        const travel = 18 + c.depth * 46;
        return (
          <div
            key={c.src}
            className={cn("absolute w-[var(--w-m)] md:w-[var(--w-d)]", c.hideMobile && "hidden md:block")}
            style={
              {
                left: `${c.x}%`,
                top: `${c.y}%`,
                "--w-d": `${c.size[0]}vw`,
                "--w-m": `${c.size[1]}vw`,
                transform: `translate3d(calc(var(--mx,0) * ${travel}px), calc(var(--my,0) * ${travel}px - var(--sc,0) * ${c.depth * 120}px), ${c.depth * 120}px) rotateY(calc(var(--mx,0) * 14deg)) rotateX(calc(var(--my,0) * -12deg)) rotate(${c.rotate}deg)`,
                zIndex: Math.round(c.depth * 10),
              } as React.CSSProperties
            }
          >
            <div
              className="overflow-hidden rounded-[18px] shadow-[0_20px_50px_-12px_rgba(11,31,58,0.45)] motion-safe:animate-[bookfloat_7s_ease-in-out_infinite] md:rounded-[22px]"
              style={{ animationDelay: `${i * -1.3}s`, filter: `blur(${blur}px) saturate(1.15)`, opacity: 0.55 + c.depth * 0.4 }}
            >
              <Image src={c.src} alt={c.alt} width={c.w} height={c.h} sizes="30vw" className="block h-auto w-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
