"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

type Obj = {
  src: string;
  w: number;
  h: number;
  /** position en % du conteneur */
  x: number;
  y: number;
  /** largeur en vw : [ordinateur, mobile] */
  size: [number, number];
  /** profondeur : 0 (loin) → 1 (proche) — règle le déplacement, l'échelle et une légère profondeur de champ */
  depth: number;
  rotate: number;
  hideMobile?: boolean;
};

/** Objets 3D aux couleurs du site : engrenages (conception), Gantt (pilotage), graphique (management),
 *  bouteille en verre (industrie verrière), ampoule (innovation), médaille (certification). */
const objects: Obj[] = [
  { src: "/images/3d/gear.webp", w: 640, h: 544, x: 3, y: 13, size: [13, 30], depth: 0.55, rotate: -6 },
  { src: "/images/3d/gantt.webp", w: 640, h: 486, x: 36, y: 6, size: [11, 26], depth: 0.3, rotate: 4, hideMobile: true },
  { src: "/images/3d/bulb.webp", w: 533, h: 638, x: 84, y: 9, size: [8, 20], depth: 0.75, rotate: 10 },
  { src: "/images/3d/bars.webp", w: 640, h: 536, x: 83, y: 44, size: [11, 24], depth: 0.45, rotate: -4 },
  { src: "/images/3d/bottle.webp", w: 399, h: 640, x: 55, y: 60, size: [5.5, 14], depth: 0.2, rotate: 8, hideMobile: true },
  { src: "/images/3d/ring.webp", w: 564, h: 600, x: 47, y: 30, size: [5, 12], depth: 0.15, rotate: 0, hideMobile: true },
];

/**
 * Objets 3D flottant autour du portrait : nets, éclairés, ils flottent doucement,
 * suivent la souris (ou l'inclinaison du téléphone) et s'éloignent au défilement.
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
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);
      el.style.setProperty("--mx", cx.toFixed(4));
      el.style.setProperty("--my", cy.toFixed(4));
      el.style.setProperty("--sc", scroll.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className={cn("pointer-events-none [perspective:1200px]", className)}>
      {objects.map((o, i) => {
        const travel = 14 + o.depth * 50;
        const blur = o.depth < 0.25 ? 1.2 : 0;
        return (
          <div
            key={o.src}
            className={cn("absolute w-[var(--w-m)] md:w-[var(--w-d)]", o.hideMobile && "hidden md:block")}
            style={
              {
                left: `${o.x}%`,
                top: `${o.y}%`,
                "--w-d": `${o.size[0]}vw`,
                "--w-m": `${o.size[1]}vw`,
                transform: `translate3d(calc(var(--mx,0) * ${travel}px), calc(var(--my,0) * ${travel}px - var(--sc,0) * ${60 + o.depth * 220}px), 0) rotateY(calc(var(--mx,0) * ${10 + o.depth * 14}deg)) rotateX(calc(var(--my,0) * -${8 + o.depth * 10}deg)) rotate(calc(${o.rotate}deg + var(--sc,0) * ${o.depth * 40}deg))`,
                zIndex: Math.round(o.depth * 10),
              } as React.CSSProperties
            }
          >
            <div
              className="motion-safe:animate-[objin_1.4s_var(--ease-out-expo)_both,bookfloat_7s_ease-in-out_infinite]"
              style={{ animationDelay: `${0.5 + i * 0.12}s, ${i * -1.3}s`, filter: `drop-shadow(0 24px 30px rgba(11,31,58,${0.12 + o.depth * 0.18}))${blur ? ` blur(${blur}px)` : ""}` }}
            >
              <Image src={o.src} alt="" width={o.w} height={o.h} sizes="(min-width: 768px) 14vw, 30vw" quality={90} className="block h-auto w-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
