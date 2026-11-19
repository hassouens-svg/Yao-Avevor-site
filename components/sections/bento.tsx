import Image from "next/image";
import type { BentoItem, HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/public/section-header";
import { Tilt } from "@/components/public/tilt";

const tones = {
  white: "bg-white text-navy-deep border border-line",
  navy: "bg-navy-deep text-white",
  sky: "bg-sky-soft text-navy-deep",
} as const;

function Tile({ item }: { item: BentoItem }) {
  const span = item.span === "tall" ? "row-span-2" : item.span === "wide" ? "sm:col-span-2" : "";
  if (item.kind === "photo") {
    return (
      <Tilt className={cn("group relative min-h-[22rem] overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(160deg,#dcebf8,#f3f6fa)]", span)}>
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-contain object-bottom transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <p className="label-caps absolute top-5 left-5 rounded-full bg-white/90 px-3 py-1.5 text-navy-deep backdrop-blur">{item.caption}</p>
      </Tilt>
    );
  }
  const tone = tones[item.tone ?? "white"];
  if (item.kind === "figure") {
    return (
      <Tilt className={cn("flex flex-col justify-between gap-8 rounded-[var(--radius-lg)] p-7", tone, span)}>
        <p className="display text-[clamp(3.5rem,6vw,5.5rem)]">{item.value}</p>
        <p className={cn("text-sm leading-snug", item.tone === "navy" ? "text-mist" : "text-muted")}>{item.label}</p>
      </Tilt>
    );
  }
  return (
    <Tilt className={cn("flex flex-col justify-between gap-8 rounded-[var(--radius-lg)] p-7", tone, span)}>
      <div className="flex items-start justify-between gap-4">
        <p className={cn("label-caps", item.tone === "navy" ? "text-sky" : "text-blue")}>{item.years}</p>
        {item.logo && (
          <Image src={item.logo} alt="" width={120} height={40} className="h-6 w-auto object-contain opacity-80" />
        )}
      </div>
      <div>
        <p className={cn("text-sm font-medium", item.tone === "navy" ? "text-mist" : "text-muted")}>{item.org}</p>
        <h3 className="mt-1 text-[1.375rem] leading-tight">{item.title}</h3>
        <p className={cn("mt-3 text-[0.9375rem] leading-relaxed", item.tone === "navy" ? "text-white/75" : "text-muted")}>
          {item.text}
        </p>
      </div>
    </Tilt>
  );
}

/** Parcours en grille « bento » : cartes qui s'inclinent sous la souris. */
export function Bento({ content }: { content: HomeContent["bento"] }) {
  return (
    <section id="parcours" className="bg-cloud py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeader label={content.label} title={content.title} className="lg:col-span-7" />
          <p className="max-w-md text-lead text-muted lg:col-span-5">{content.text}</p>
        </div>
        <div className="mt-12 grid auto-rows-[minmax(13rem,auto)] grid-cols-1 gap-4 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, i) => (
            <Tile key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
