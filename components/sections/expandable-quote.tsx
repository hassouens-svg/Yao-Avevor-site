"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Citation repliée après quelques lignes, avec « Voir plus » seulement si le texte dépasse. */
export function ExpandableQuote({ text, dark, lines = 5 }: { text: string; dark?: boolean; lines?: number }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => !open && setOverflow(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <>
      <blockquote
        ref={ref}
        className="mt-4 text-[1.1875rem] leading-[1.5] font-medium"
        style={open ? undefined : { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: lines, overflow: "hidden" }}
      >
        {text}
      </blockquote>
      {(overflow || open) && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={cn("mt-3 text-sm font-semibold underline underline-offset-4", dark ? "text-sky hover:text-white" : "text-blue hover:text-navy-deep")}
        >
          {open ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </>
  );
}
