import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/public/section-header";
import { HorizontalScroll } from "./horizontal-scroll";

const tones = {
  white: { card: "bg-white text-navy-deep border border-line", sub: "text-muted", tag: "text-blue", dot: "bg-blue" },
  teal: { card: "bg-teal text-white", sub: "text-white/80", tag: "text-sky", dot: "bg-sky" },
  navy: { card: "bg-navy-deep text-white", sub: "text-mist", tag: "text-sky", dot: "bg-sky" },
  blue: { card: "bg-blue text-white", sub: "text-white/75", tag: "text-sky", dot: "bg-sky" },
  sky: { card: "bg-sky text-navy-deep", sub: "text-navy/75", tag: "text-navy", dot: "bg-navy" },
} as const;

/** Expertises : sur desktop, la section s'épingle et les cartes défilent horizontalement au scroll. */
export function Expertises({ content }: { content: HomeContent["expertises"] }) {
  return (
    <HorizontalScroll
      id="expertises"
      className="bg-white"
      header={
        <div className="container-site grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeader label={content.label} title={content.title} className="lg:col-span-7" />
          <p className="max-w-md text-lead text-muted lg:col-span-5">{content.intro}</p>
        </div>
      }
    >
      {content.items.map((item) => {
        const t = tones[item.tone];
        return (
          <article
            key={item.number}
            className={cn(
              "group relative flex w-[86vw] shrink-0 flex-col justify-between overflow-hidden rounded-[24px] p-8 sm:w-[60vw] sm:p-10 lg:h-[min(68vh,620px)] lg:w-[min(46vw,640px)] lg:p-12",
              t.card,
            )}
          >
            <span aria-hidden="true" className="display pointer-events-none absolute -right-4 -bottom-10 text-[16rem] leading-none opacity-[0.07]">
              {item.number}
            </span>
            {item.image && (
              <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-[16px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.45)] lg:absolute lg:top-10 lg:right-10 lg:mb-0 lg:aspect-square lg:w-36 xl:w-44">
                <Image src={item.image} alt="" fill sizes="(min-width:1024px) 180px, 80vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            )}
            <div className="relative">
              <p className={cn("label-caps", t.tag)}>
                {item.number} — {item.tag}
              </p>
              <h3 className="display mt-6 max-w-[14ch] text-[clamp(2.25rem,4vw,3.75rem)] font-normal tracking-normal">{item.title}</h3>
              <p className={cn("mt-5 max-w-md text-lead", t.sub)}>{item.lead}</p>
            </div>
            <div className="relative mt-10">
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {item.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[0.9375rem]">
                    <span aria-hidden="true" className={cn("size-1.5 shrink-0 rotate-45", t.dot)} />
                    {p}
                  </li>
                ))}
              </ul>
              <Link href={item.href} className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-semibold">
                <span className="link-underline pb-0.5">{item.cta}</span>
                <ArrowUpRight strokeWidth={1.75} aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        );
      })}
    </HorizontalScroll>
  );
}
