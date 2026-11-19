"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import type { HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { Button } from "@/components/public/button";
import { SectionHeader } from "@/components/public/section-header";

/** Interventions : onglets (conférences, ateliers, écoles, webinaires). */
export function Speaking({ content }: { content: HomeContent["speaking"] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const uid = useId();
  const tab = content.tabs[active];

  return (
    <section id="interventions" className="bg-white pb-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <SectionHeader label={content.label} title={content.title} intro={content.text} />
        <div role="tablist" aria-label="Types d’interventions" className="mt-10 flex flex-wrap gap-2">
          {content.tabs.map((t, i) => (
            <button
              key={t.key}
              role="tab"
              id={`${uid}-${i}`}
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              onClick={() => setActive(i)}
              className={cn(
                "h-10 rounded-full border px-5 text-sm font-semibold transition-colors",
                i === active ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-cloud text-navy-deep hover:border-navy/40",
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${active}`} className="mt-6 rounded-[20px] border border-line bg-cloud p-7 sm:p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab.key}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 md:grid-cols-2"
            >
              <div>
                <h3 className="text-[1.75rem] text-navy-deep">{tab.title}</h3>
                <p className="mt-3 max-w-md text-muted">{tab.text}</p>
                <Button href={content.cta.href} className="mt-7 bg-navy-deep hover:bg-blue">
                  {content.cta.label}
                </Button>
              </div>
              <ul className="space-y-4 self-center">
                {tab.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[0.9375rem] text-navy-deep">
                    <span aria-hidden="true" className="size-2 rounded-full bg-navy-deep" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
