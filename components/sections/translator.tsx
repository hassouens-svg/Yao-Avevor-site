"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import type { HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionLabel } from "@/components/public/section-label";

const pad = (n: number) => String(n).padStart(2, "0");

/** Le traducteur : on clique un terme, on obtient une phrase claire + un exemple. Onglets ARIA. */
export function Translator({ content }: { content: HomeContent["translator"] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const terms = content.terms;
  const t = terms[active];

  function select(i: number) {
    const n = (i + terms.length) % terms.length;
    setActive(n);
    tabs.current[n]?.focus();
  }

  return (
    <section id="traducteur" className="bg-white py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <div className="rounded-[24px] border border-line bg-white p-6 shadow-soft sm:p-10 lg:p-14">
          <div className="border-l-4 border-navy-deep pl-5 sm:pl-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel>{content.label}</SectionLabel>
                <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-none text-navy-deep">{content.title}</h2>
              </div>
              <p className="label-caps tabular text-muted">
                <span className="text-navy-deep">{pad(active + 1)}</span> / {pad(terms.length)}
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Termes"
              className="mt-8 flex flex-wrap gap-2"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") select(active + 1);
                if (e.key === "ArrowLeft") select(active - 1);
              }}
            >
              {terms.map((term, i) => (
                <button
                  key={term.term}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`${uid}-t${i}`}
                  aria-selected={i === active}
                  aria-controls={`${uid}-p`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-full border px-4 py-2 font-mono text-[0.8125rem] transition-colors duration-300",
                    i === active ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-cloud text-navy-deep hover:border-navy/40",
                  )}
                >
                  {term.term}
                </button>
              ))}
            </div>

            <div role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t${active}`} className="mt-8 rounded-[16px] border border-line bg-cloud p-6 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-navy-deep">{t.term}</h3>
                  <p className="label-caps mt-4 text-blue">◆ En clair</p>
                  <p className="mt-3 max-w-3xl text-lead text-ink/85">{t.plain}</p>
                  <p className="mt-6 max-w-3xl border-t border-line pt-5 text-[0.9375rem] text-muted">
                    <span className="font-semibold text-navy-deep">Exemple — </span>
                    {t.example}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <Link href={content.moreHref} className="mt-8 inline-flex border-b border-navy-deep pb-0.5 text-sm font-semibold text-navy-deep">
              Voir tout le lexique →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
