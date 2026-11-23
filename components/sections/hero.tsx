import Image from "next/image";
import { Button } from "@/components/public/button";
import { Reveal } from "@/components/public/reveal";
import { SectionLabel } from "@/components/public/section-label";
import type { HomeContent } from "@/lib/content/types";
import portrait from "@/public/images/portrait-cutout.png";
import { HeroMotion } from "./hero-motion";
import { FloatingCards } from "./floating-cards";
import { HeroKeywords } from "./hero-keywords";


/**
 * Hero : grande photo détourée en fond clair, illustrations de la bannière qui flottent en 3D (floues),
 * texte superposé en bas avec un fondu blanc. Même composition sur mobile et sur ordinateur.
 */
export function Hero({ content }: { content: HomeContent["hero"] }) {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[radial-gradient(90%_70%_at_60%_35%,#e6f1fb_0%,#f7fafd_45%,#ffffff_75%)]"
    >
      <HeroMotion />

      {/* Couche 3D : illustrations floues qui flottent */}
      <FloatingCards className="absolute inset-0 z-0" />

      {/* Portrait */}
      <div
        data-hero-portrait
        className="relative z-10 mx-auto mt-[calc(var(--header-h)-0.5rem)] flex h-[56svh] w-full items-end justify-center will-change-transform md:absolute md:inset-x-0 md:top-0 md:bottom-0 md:mt-0 md:h-auto md:justify-end md:pr-[max(var(--gutter),calc((100vw-var(--container-site))/2+2vw))]"
      >
        <div aria-hidden="true" className="absolute bottom-[8%] left-1/2 h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(140,200,240,0.55),rgba(140,200,240,0))] md:left-auto md:right-[max(var(--gutter),calc((100vw-var(--container-site))/2+2vw))] md:w-[42%] md:translate-x-[8%]" />
        <Image
          data-hero-photo
          quality={90}
          src={portrait}
          alt={content.portraitAlt}
          priority
          fetchPriority="high"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="relative h-full w-auto max-w-none object-contain object-bottom [transform-origin:50%_100%] md:h-[94%]"
        />
      </div>

      {/* Fondu blanc qui fait monter le texte sur la photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+40svh)] bottom-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_14svh,#fff_20svh)] md:top-auto md:h-[22%] md:bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fff_100%)]"
      />

      {/* Texte */}
      <div className="container-site relative z-20 -mt-[9svh] pb-12 md:mt-auto md:pt-[calc(var(--header-h)+2rem)] md:pb-16">
        <div className="md:max-w-[52%]">
        <SectionLabel className="max-sm:text-[0.625rem]! max-sm:tracking-[0.06em]!">{content.label}</SectionLabel>
        <h1 className="mt-5 display text-[clamp(2.5rem,11vw,3.75rem)] leading-[1.04] text-navy-deep md:text-[clamp(3.5rem,6.2vw,6.5rem)]">
          <Reveal as="span" mode="lines" immediate delay={0.05} className="block">
            {content.line1}
          </Reveal>
          <Reveal as="span" mode="lines" immediate delay={0.18} className="block text-blue">
            {content.line2}
          </Reveal>
        </h1>
        <Reveal immediate delay={0.4} className="mt-5">
          <HeroKeywords words={content.keywords} />
        </Reveal>
        <Reveal as="p" immediate delay={0.55} className="mt-6 max-w-[36rem] text-[1.0625rem] leading-relaxed text-ink/75 sm:text-lead">
          {content.subtitle}
        </Reveal>
        <Reveal immediate delay={0.7} className="mt-8 flex flex-wrap gap-3">
          <Button href={content.primaryCta.href} magnetic className="bg-navy-deep hover:bg-blue">
            {content.primaryCta.label}
          </Button>
          <Button href={content.secondaryCta.href} variant="secondary" arrow={false} className="bg-white/70 backdrop-blur">
            {content.secondaryCta.label}
          </Button>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
