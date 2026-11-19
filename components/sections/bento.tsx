"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { BentoItem, HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/public/section-header";

type Role = Extract<BentoItem, { kind: "role" }>;
type Figure = Extract<BentoItem, { kind: "figure" }>;
type Photo = Extract<BentoItem, { kind: "photo" }>;

/**
 * Parcours compact : chiffres forts en tête, puis une ligne par poste (années · logo · titre),
 * dépliable pour lire le détail. Peu de place sur mobile, lecture rapide sur ordinateur.
 */
export function Bento({ content }: { content: HomeContent["bento"] }) {
  const roles = content.items.filter((i): i is Role => i.kind === "role");
  const figures = content.items.filter((i): i is Figure => i.kind === "figure");
  const photo = content.items.find((i): i is Photo => i.kind === "photo");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="parcours" className="bg-cloud py-[clamp(3.5rem,7vw,6rem)]">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <SectionHeader label={content.label} title={content.title} />
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{content.text}</p>
            {photo && (
              <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-md border border-line bg-[linear-gradient(160deg,#dcebf8,#f3f6fa)] lg:block">
                <Image src={photo.src} alt={photo.alt} fill sizes="30vw" className="object-contain object-bottom" />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          {figures.length > 0 && (
            <dl className="grid grid-cols-2 border-t-2 border-navy-deep sm:grid-cols-3">
              {figures.map((f, i) => (
                <div key={i} className={cn("py-4 pr-4", i > 0 && "sm:border-l sm:border-line sm:pl-5")}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd>
                    <span className="display block text-[clamp(1.75rem,3vw,2.5rem)] text-blue">{f.value}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted">{f.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-2 border-t border-line">
            {roles.map((r, i) => {
              const isOpen = open === i;
              return (
                <li key={i} className="border-b border-line">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 text-left sm:grid-cols-[7.5rem_1fr_auto] sm:py-5"
                  >
                    <span className="font-mono text-[0.75rem] tracking-wider text-blue uppercase sm:pt-0.5">{r.years}</span>
                    <span className="col-start-1 row-start-2 min-w-0 sm:col-start-2 sm:row-start-1">
                      <span className="block truncate text-[1.0625rem] font-semibold text-navy-deep group-hover:text-blue sm:text-[1.1875rem]">{r.title}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-sm text-muted">
                        {r.logo && <Image src={r.logo} alt="" width={64} height={20} className="h-3.5 w-auto object-contain opacity-80" />}
                        {r.org}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "row-span-2 inline-flex size-8 items-center justify-center rounded-full border border-line text-navy-deep transition-transform duration-300 sm:row-span-1",
                        isOpen && "rotate-45 border-navy-deep bg-navy-deep text-white",
                      )}
                    >
                      <Plus className="size-4" strokeWidth={1.75} />
                    </span>
                  </button>
                  <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-5 text-[0.9375rem] leading-relaxed text-ink/75 sm:pl-[8.5rem]">{r.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
