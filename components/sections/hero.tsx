import Image from "next/image";
import { Button } from "@/components/public/button";
import { Reveal } from "@/components/public/reveal";
import { SectionLabel } from "@/components/public/section-label";
import { Hero3D } from "@/components/three/hero-3d";
import type { HomeContent } from "@/lib/content/types";
import portrait from "@/public/images/portrait-cutout.png";
import { HeroMotion } from "./hero-motion";

/** Hero clair : grand titre condensé, portrait détouré, objets en verre 3D qui suivent la souris. */
export function Hero({ content }: { content: HomeContent["hero"] }) {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-[radial-gradient(120%_90%_at_75%_30%,#eef4fb_0%,#ffffff_60%)] pt-[var(--header-h)]"
    >
      <HeroMotion />
      <Hero3D className="absolute inset-0 z-0" />
      <div className="container-site relative grid min-h-[calc(100svh-var(--header-h))] items-center gap-6 lg:grid-cols-12">
        {/* Texte */}
        <div className="relative z-20 order-2 pb-14 lg:order-1 lg:col-span-7 lg:pb-0">
          <SectionLabel>{content.label}</SectionLabel>
          <h1 className="mt-6 display text-[clamp(3rem,5.6vw,6rem)] leading-[1.1] text-navy-deep">
            <Reveal as="span" mode="lines" immediate delay={0.05} className="block">
              {content.line1}
            </Reveal>
            <Reveal as="span" mode="lines" immediate delay={0.2} className="block text-blue">
              {content.line2}
            </Reveal>
          </h1>
          <Reveal as="p" immediate delay={0.5} className="mt-7 max-w-[34rem] text-lead text-muted">
            {content.subtitle}
          </Reveal>
          <Reveal immediate delay={0.65} className="mt-9 flex flex-wrap gap-3">
            <Button href={content.primaryCta.href} magnetic className="bg-navy-deep hover:bg-blue">
              {content.primaryCta.label}
            </Button>
            <Button href={content.secondaryCta.href} variant="secondary" arrow={false}>
              {content.secondaryCta.label}
            </Button>
          </Reveal>
        </div>

        {/* Portrait + 3D */}
        <div className="relative order-1 h-[52svh] lg:order-2 lg:col-span-5 lg:h-[calc(100svh-var(--header-h))]">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 z-0 aspect-square w-[78%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(140_200_240/0.45),rgb(140_200_240/0)_70%)]"
          />
          <div data-hero-portrait className="absolute inset-x-0 bottom-0 z-10 flex h-full items-end justify-center will-change-transform">
            <Image
              src={portrait}
              alt={content.portraitAlt}
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="h-[92%] w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_40px_rgba(11,31,58,0.18)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
