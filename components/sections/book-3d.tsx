"use client";

import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Monogram } from "@/components/public/monogram";

/**
 * Maquette 3D de la couverture (CSS 3D : face, tranche, pages, ombre, reflet).
 * Pivote selon la souris (tilt) ; un reflet lumineux balaie la couverture.
 * Remplaçable par la vraie couverture depuis l'admin (phase 6).
 */
export function Book3D({ title, subtitle, cover }: { title: string; subtitle: string; cover?: string }) {
  const book = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (book.current) {
      book.current.style.transition = "transform 0.2s cubic-bezier(0.22,1,0.36,1)";
      book.current.style.transform = `rotateY(${-24 + px * 22}deg) rotateX(${4 - py * 12}deg)`;
    }
    if (glare.current) glare.current.style.backgroundPosition = `${50 - px * 80}% 0`;
  }
  function onLeave() {
    if (!book.current) return;
    book.current.style.transition = "transform 1.2s cubic-bezier(0.22,1,0.36,1)";
    book.current.style.transform = "";
  }

  // Dimensions du livre (format ~ 15,5 × 23,5 cm)
  const W = "min(68vw, 300px)";
  const D = "34px"; // épaisseur

  return (
    <div
      className="relative py-6 [perspective:1600px]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label={`Couverture provisoire du livre ${title}`}
    >
      {/* Ombre portée */}
      <div
        aria-hidden="true"
        className="absolute inset-x-[8%] bottom-0 h-10 rounded-[50%] bg-navy-deep/30 blur-2xl"
      />
      <div className="[transform-style:preserve-3d] motion-safe:animate-[bookfloat_7s_ease-in-out_infinite]">
      <div
        ref={book}
        className="relative [transform:rotateY(-24deg)_rotateX(4deg)] [transform-style:preserve-3d]"
        style={{ width: W, aspectRatio: "155 / 235" }}
      >
        {/* Face avant */}
        <div className="absolute inset-0 overflow-hidden rounded-r-[6px] rounded-l-[2px] bg-navy [backface-visibility:hidden] [transform:translateZ(calc(34px/2))]">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="absolute inset-0 z-[1] size-full object-cover" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_10%,rgb(140_200_240/0.28),transparent_60%)]" />
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-white/10 to-transparent" />
          <div className="relative flex h-full flex-col justify-between p-[9%] text-white">
            <div className="flex items-center justify-between">
              <Monogram className="h-4 w-auto text-sky" strokeWidth={2.4} />
              <span className="label-caps text-[0.55rem] text-mist">Gestion de projet</span>
            </div>
            <div>
              <span aria-hidden="true" className="mb-5 block h-px w-12 bg-sky" />
              <p className="font-serif text-[clamp(1.4rem,5.6vw,1.95rem)] leading-[1.05] tracking-[-0.01em]">{title}</p>
              <p className="mt-3 text-[0.8rem] leading-snug text-mist">{subtitle}</p>
            </div>
            <p className="label-caps text-[0.6rem] tracking-[0.2em] text-white/80">Yao AVEVOR, Ph.D</p>
          </div>
          {/* Reflet qui balaie */}
          <div
            ref={glare}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgb(255_255_255/0.16)_48%,transparent_60%)] bg-[length:250%_100%] bg-[position:120%_0] mix-blend-screen motion-safe:animate-[sheen_6s_cubic-bezier(0.22,1,0.36,1)_infinite]"
          />
        </div>
        {/* Tranche (dos) */}
        <div
          className="absolute top-0 left-0 h-full bg-[linear-gradient(90deg,#06111f,#0b1f3a_40%,#081a31)] [transform-origin:left] [transform:rotateY(-90deg)_translateX(calc(-34px/2))_translateZ(0)]"
          style={{ width: D }}
        >
          <p className="absolute inset-0 flex items-center justify-center [writing-mode:vertical-rl] font-serif text-[0.7rem] tracking-[0.08em] text-white/80">
            Yao AVEVOR
          </p>
        </div>
        {/* Pages (côté) */}
        <div
          className="absolute top-[3px] right-0 h-[calc(100%-6px)] bg-[repeating-linear-gradient(90deg,#f4f1ea,#f4f1ea_1px,#e6e1d6_2px)] [transform-origin:right] [transform:rotateY(90deg)_translateX(calc(34px/2))]"
          style={{ width: D }}
        />
        {/* Dos (face arrière) */}
        <div className="absolute inset-0 rounded-l-[6px] bg-navy-deep [transform:translateZ(calc(-34px/2))_rotateY(180deg)]" />
      </div>
      </div>
    </div>
  );
}
