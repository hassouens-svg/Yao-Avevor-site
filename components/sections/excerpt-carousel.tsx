"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/** Carrousel accessible des extraits du livre. */
export function ExcerptCarousel({ excerpts }: { excerpts: { title: string; body: string }[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  if (!excerpts.length) return null;
  const go = (d: number) => setI((v) => (v + d + excerpts.length) % excerpts.length);
  const e = excerpts[i];

  return (
    <section
      aria-roledescription="carrousel"
      aria-label="Extraits du livre"
      className="mt-8 border-l-4 border-navy-deep pl-6 sm:pl-8"
    >
      <div aria-live="polite" className="relative min-h-[11.5rem] sm:min-h-[9.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={i}
            role="group"
            aria-roledescription="extrait"
            aria-label={`${i + 1} sur ${excerpts.length}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <figcaption className="label-caps text-muted">{e.title}</figcaption>
            <blockquote className="mt-4 text-[1.25rem] leading-[1.5] font-medium text-navy-deep">« {e.body} »</blockquote>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Extrait précédent"
          className="inline-flex size-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
        >
          <ArrowLeft strokeWidth={1.5} className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Extrait suivant"
          className="inline-flex size-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
        >
          <ArrowRight strokeWidth={1.5} className="size-4" />
        </button>
        <p className="tabular label-caps text-muted">
          <span className="text-navy">{String(i + 1).padStart(2, "0")}</span> / {String(excerpts.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
