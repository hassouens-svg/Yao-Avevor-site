import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";
import { FloatingCards } from "@/components/sections/floating-cards";

/** En-tête des pages intérieures : label, grand titre, intro, illustrations flottantes floues. */
export function PageHero({ label, title, intro, children }: { label: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(90%_80%_at_80%_0%,#e6f1fb,#ffffff_65%)] pt-[calc(var(--header-h)+4rem)] pb-14 sm:pb-20">
      <FloatingCards className="absolute inset-0 -z-10 opacity-60" />
      <div className="container-site">
        <SectionLabel>{label}</SectionLabel>
        <Reveal as="h1" mode="lines" immediate className="mt-5 max-w-5xl text-display text-navy-deep">
          {title}
        </Reveal>
        {intro && <p className="mt-6 max-w-2xl text-lead text-muted">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
