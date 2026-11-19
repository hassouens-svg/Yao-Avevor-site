"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

/** Curseur discret : point bleu ciel qui grossit sur les éléments cliquables. Desktop uniquement. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    const el = dot.current!;
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, cx = -100, cy = -100, raf = 0, visible = false;
    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.translate = `${cx}px ${cy}px`;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x; cy = y;
        el.style.opacity = "1";
      }
      const t = e.target as Element | null;
      const interactive = t?.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor]');
      el.dataset.state = interactive ? "hover" : "";
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };
    const onDown = () => (el.dataset.pressed = "1");
    const onUp = () => (el.dataset.pressed = "");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[200] hidden opacity-0 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div className="size-2.5 rounded-full bg-sky mix-blend-difference transition-transform duration-500 ease-[var(--ease-out-expo)] in-data-[state=hover]:scale-[4.2] in-data-[pressed=1]:scale-75 in-data-[state=hover]:opacity-60" />
      </div>
    </div>
  );
}
