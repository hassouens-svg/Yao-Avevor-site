"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

/** Carte qui s'incline en 3D sous la souris, avec un reflet lumineux qui suit le pointeur. */
export function Tilt({ children, className, max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLSpanElement>(null);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transition = "transform 0.15s ease-out";
    el.style.transform = `rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`;
    if (glare.current) {
      glare.current.style.opacity = "1";
      glare.current.style.background = `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgb(255 255 255 / 0.28), transparent 45%)`;
    }
  }
  function onLeave() {
    const el = ref.current!;
    el.style.transition = "transform 0.9s cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "";
    if (glare.current) glare.current.style.opacity = "0";
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("relative [transform-style:preserve-3d]", className)}>
      {children}
      <span ref={glare} aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500" />
    </div>
  );
}
