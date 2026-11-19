"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

type Item = { years: string; org: string; title: string; place: string; text: string; logo?: string };

/** Frise verticale : la ligne se dessine au scroll, chaque étape apparaît avec son logo. */
export function Timeline({ items }: { items: Item[] }) {
  const root = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
      if (line.current) line.current.style.transform = `scaleY(${p})`;
      el.querySelectorAll<HTMLElement>("[data-step]").forEach((s) => {
        if (s.getBoundingClientRect().top < window.innerHeight * 0.85) s.dataset.visible = "1";
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <ol ref={root} className="relative ml-3 sm:ml-0">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-0 w-0.5 bg-line sm:left-[11.5rem]" />
      <span ref={line} aria-hidden="true" className="absolute top-2 bottom-2 left-0 w-0.5 origin-top bg-blue [.js-motion_&]:scale-y-0 sm:left-[11.5rem]" />
      {items.map((it) => (
        <li
          key={it.years + it.title}
          data-step
          className="relative grid gap-2 pb-12 pl-8 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] [.js-motion_&:not([data-visible])]:translate-y-4 [.js-motion_&:not([data-visible])]:opacity-0 sm:grid-cols-[11.5rem_1fr] sm:gap-10 sm:pl-0"
        >
          <span aria-hidden="true" className="absolute top-1.5 -left-[7px] size-4 rounded-full border-[3px] border-white bg-blue shadow sm:left-[calc(11.5rem-7px)]" />
          <p className="label-caps pt-1 text-blue sm:pr-8 sm:text-right">{it.years}</p>
          <div className="sm:pl-10">
            <div className="flex flex-wrap items-center gap-3">
              {it.logo && (
                <span className="inline-flex h-9 items-center rounded-md border border-line bg-white px-2">
                  <Image src={it.logo} alt="" width={90} height={30} className="h-5 w-auto object-contain" />
                </span>
              )}
              <p className="text-sm font-semibold text-muted">
                {it.org}
                {it.place ? ` · ${it.place}` : ""}
              </p>
            </div>
            <h3 className="mt-3 text-[1.375rem] text-navy-deep">{it.title}</h3>
            {it.text && <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{it.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
