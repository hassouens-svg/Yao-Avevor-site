"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BentoItem, HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/public/section-header";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

type Role = Extract<BentoItem, { kind: "role" }>;
type Figure = Extract<BentoItem, { kind: "figure" }>;
type Photo = Extract<BentoItem, { kind: "photo" }>;

const NOW = 2026;

/** « 2020 – 2024 » → [2020, 2025[ ; « Depuis 2025 » → [2025, maintenant] (en cours). */
function span(years: string) {
  const ys = (years.match(/\d{4}/g) ?? []).map(Number);
  const start = ys[0] ?? NOW;
  const ongoing = ys.length < 2;
  const end = ongoing ? NOW + 0.9 : ys[1] + (ys[1] === start ? 1 : 0.95);
  return { start, end, ongoing };
}

/**
 * Parcours en diagramme de Gantt : au défilement, les barres se tracent année après année,
 * les jalons s'allument et le trait « aujourd'hui » apparaît en cuivre. Chaque ligne se déplie.
 */
export function Bento({ content }: { content: HomeContent["bento"] }) {
  const roles = content.items
    .filter((i): i is Role => i.kind === "role")
    .map((r) => ({ ...r, ...span(r.years) }))
    .sort((a, b) => a.start - b.start);
  const figures = content.items.filter((i): i is Figure => i.kind === "figure");
  const photo = content.items.find((i): i is Photo => i.kind === "photo");
  const [open, setOpen] = useState<number | null>(null);
  const chart = useRef<HTMLDivElement>(null);

  const min = Math.min(...roles.map((r) => r.start));
  const max = NOW + 1;
  const pct = (y: number) => ((y - min) / (max - min)) * 100;
  const years = Array.from({ length: max - min }, (_, i) => min + i);

  useEffect(() => {
    const el = chart.current;
    if (!el || prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    el.dataset.armed = "true";
    import("@/lib/motion/gsap").then(async ({ loadGsap }) => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.8 } });
        tl.fromTo("[data-gantt-axis]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
        el.querySelectorAll<HTMLElement>("[data-gantt-bar]").forEach((bar, i) => {
          const at = Number(bar.dataset.at) * 1;
          tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "power2.out", duration: 0.35 }, at);
          const dot = el.querySelector(`[data-gantt-dot="${i}"]`);
          if (dot) tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.08 }, at);
        });
        tl.fromTo("[data-gantt-today]", { scaleY: 0 }, { scaleY: 1, duration: 0.15 }, 0.85);
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
      delete el.dataset.armed;
    };
  }, []);

  return (
    <section id="parcours" className="blueprint relative bg-cloud py-[clamp(3.5rem,7vw,6rem)]">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <SectionHeader label={content.label} title={content.title} />
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{content.text}</p>
            {figures.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-4">
                {figures.map((f, i) => (
                  <div key={i} className="border-t-2 border-navy-deep pt-3">
                    <dt className="sr-only">{f.label}</dt>
                    <dd>
                      <span className="display block text-[clamp(1.75rem,3vw,2.5rem)] text-blue">{f.value}</span>
                      <span className="mt-1 block text-xs leading-snug text-muted">{f.label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {photo && (
              <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-md border border-line bg-[linear-gradient(160deg,#dcebf8,#f3f6fa)] lg:block">
                <Image src={photo.src} alt={photo.alt} fill sizes="30vw" quality={90} className="object-contain object-bottom" />
              </div>
            )}
          </div>
        </div>

        <div ref={chart} className="group/gantt lg:col-span-8">
          <p className="label-caps flex items-center justify-between text-muted">
            <span><span className="hidden sm:inline">Diagramme de Gantt · </span>{min} → aujourd’hui</span>
            <span className="flex items-center gap-2 text-copper"><span className="h-3 w-px bg-copper" /> {NOW}</span>
          </p>

          {/* Axe des années */}
          <div className="relative mt-4 ml-0 sm:ml-[13rem]">
            <div data-gantt-axis className="h-px origin-left bg-navy-deep" />
            <div className="relative h-6">
              {years.map((y) => (
                <span key={y} className={cn("absolute top-1.5 -translate-x-1/2 font-mono text-[0.625rem] text-muted", y % 2 && "hidden sm:inline")} style={{ left: `${pct(y)}%` }}>
                  {String(y).slice(2)}
                </span>
              ))}
            </div>
          </div>

          <ul className="relative">
            {/* Grille verticale + trait « aujourd'hui » */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 left-0 sm:left-[13rem]">
              {years.map((y) => (
                <span key={y} className="absolute inset-y-0 w-px bg-navy-deep/[0.06]" style={{ left: `${pct(y)}%` }} />
              ))}
              <span data-gantt-today className="absolute inset-y-0 w-0.5 origin-top bg-copper" style={{ left: `${pct(NOW + 0.9)}%` }} />
            </div>

            {roles.map((r, i) => {
              const isOpen = open === i;
              const at = ((r.start - min) / (max - min)) * 0.8;
              return (
                <li key={i} className="relative border-b border-line/80">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-4 text-left sm:grid-cols-[12rem_1fr_auto] sm:gap-x-4"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.6875rem] tracking-wider text-blue uppercase">{r.years}</span>
                      <span className="mt-0.5 block text-[0.9375rem] leading-snug font-semibold text-navy-deep group-hover:text-blue">{r.title}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        {r.logo && <Image src={r.logo} alt="" width={64} height={20} className="h-3 w-auto object-contain opacity-80" />}
                        {r.org}
                      </span>
                    </span>
                    {/* Barre */}
                    <span className="relative col-span-2 col-start-1 row-start-2 h-7 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                      <span
                        data-gantt-bar
                        data-at={at}
                        className={cn(
                          "absolute inset-y-1 origin-left rounded-[3px] shadow-[0_6px_14px_-6px_rgba(11,31,58,0.45)] transition-[filter] group-hover:brightness-110",
                          r.ongoing ? "bg-[linear-gradient(90deg,var(--color-blue),var(--color-blue-bright)_70%,var(--color-copper-light))]" : i % 2 ? "bg-navy-deep" : "bg-blue",
                        )}
                        style={{ left: `${pct(r.start)}%`, width: `${pct(r.end) - pct(r.start)}%` }}
                      />
                      <span
                        data-gantt-dot={i}
                        aria-hidden="true"
                        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-white bg-copper shadow"
                        style={{ left: `${pct(r.start)}%` }}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "inline-flex size-8 items-center justify-center rounded-full border border-line bg-white text-navy-deep transition-transform duration-300",
                        isOpen && "rotate-45 border-navy-deep bg-navy-deep text-white",
                      )}
                    >
                      <Plus className="size-4" strokeWidth={1.75} />
                    </span>
                  </button>
                  <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-5 text-[0.9375rem] leading-relaxed text-ink/75 sm:pl-[13rem]">{r.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-muted">Cliquez sur une ligne pour lire le détail de la mission.</p>
        </div>
      </div>
    </section>
  );
}
