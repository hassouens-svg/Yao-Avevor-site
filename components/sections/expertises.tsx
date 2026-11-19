"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { useState } from "react";
import type { HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/public/section-header";

const accent: Record<string, string> = {
  navy: "bg-navy-deep",
  teal: "bg-teal",
  blue: "bg-blue",
  sky: "bg-sky",
  white: "bg-blue-bright",
};

/**
 * Expertises : grille éditoriale à filets fins (desktop), accordéon compact (mobile).
 * Un trait de couleur par pilier, pas de cartes arrondies.
 */
export function Expertises({ content }: { content: HomeContent["expertises"] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="expertises" className="bg-white py-[clamp(3.5rem,7vw,6rem)]">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeader label={content.label} title={content.title} className="lg:col-span-7" />
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted lg:col-span-5">{content.intro}</p>
        </div>

        <div className="mt-10 grid border-t border-line md:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {content.items.map((item, i) => {
            const isOpen = open === i;
            const external = item.href.startsWith("http");
            return (
              <article
                key={item.number}
                className={cn(
                  "group border-b border-line md:px-6 md:pb-8",
                  i % 2 === 0 ? "md:border-r md:pl-0" : "",
                  i % 4 === 0 ? "lg:pl-0" : "lg:pl-6",
                  i % 4 !== 3 ? "lg:border-r" : "lg:border-r-0",
                )}
              >
                <span aria-hidden="true" className={cn("-mt-px block h-[3px] w-12 transition-[width] duration-500 group-hover:w-24 md:mb-7", accent[item.tone] ?? "bg-blue")} />

                {/* Mobile : en-tête cliquable */}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left md:hidden"
                >
                  <span>
                    <span className="font-mono text-[0.7rem] tracking-wider text-blue uppercase">
                      {item.number} — {item.tag}
                    </span>
                    <span className="mt-1 block text-[1.1875rem] font-semibold text-navy-deep">{item.title}</span>
                  </span>
                  <span className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-transform", isOpen && "rotate-45 bg-navy-deep text-white")}>
                    <Plus className="size-4" strokeWidth={1.75} />
                  </span>
                </button>

                {/* Desktop : en-tête */}
                <div className="hidden md:block">
                  <p className="font-mono text-[0.7rem] tracking-wider text-blue uppercase">
                    {item.number} — {item.tag}
                  </p>
                  <h3 className="mt-4 min-h-[3.2em] text-[1.375rem] leading-tight text-navy-deep">{item.title}</h3>
                </div>

                <div className={cn("grid transition-[grid-template-rows] duration-500 md:grid-rows-[1fr]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="text-[0.9375rem] leading-relaxed text-muted md:mt-3">{item.lead}</p>
                    <ul className="mt-4 space-y-2">
                      {item.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-sm text-ink/80">
                          <span aria-hidden="true" className="mt-[0.55em] h-px w-3 shrink-0 bg-navy-deep/40" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={item.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-5 mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-deep md:mb-0"
                    >
                      <span className="link-underline pb-0.5">{item.cta}</span>
                      <ArrowUpRight strokeWidth={1.75} className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
