import type { Metadata } from "next";
import { Gauge, Lightbulb, PenTool, Users } from "lucide-react";
import { Button } from "@/components/public/button";
import { Reveal } from "@/components/public/reveal";
import { SectionLabel } from "@/components/public/section-label";
import { Monogram, Wordmark } from "@/components/public/monogram";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "ink", hex: "#0A0E17", cls: "bg-ink", fg: "text-white", role: "Encre / texte" },
  { name: "navy", hex: "#0B1F3A", cls: "bg-navy", fg: "text-white", role: "Marque, boutons" },
  { name: "navy-deep", hex: "#071528", cls: "bg-navy-deep", fg: "text-white", role: "Fonds sombres" },
  { name: "sky", hex: "#8CC8F0", cls: "bg-sky", fg: "text-navy-deep", role: "Accent rare" },
  { name: "sky-soft", hex: "#EAF5FD", cls: "bg-sky-soft", fg: "text-navy", role: "Fonds doux" },
  { name: "white", hex: "#FFFFFF", cls: "bg-white border border-line", fg: "text-navy", role: "Fond" },
  { name: "paper", hex: "#F6F7F9", cls: "bg-paper", fg: "text-navy", role: "Sections alternées" },
  { name: "muted", hex: "#5B6474", cls: "bg-muted", fg: "text-white", role: "Texte secondaire" },
  { name: "line", hex: "#E3E7ED", cls: "bg-line", fg: "text-navy", role: "Filets" },
  { name: "mist", hex: "#A9B4C6", cls: "bg-mist", fg: "text-navy-deep", role: "Texte secondaire (sombre)" },
];

const pillars = [
  { icon: PenTool, label: "Conception" },
  { icon: Users, label: "Management" },
  { icon: Gauge, label: "Pilotage" },
  { icon: Lightbulb, label: "Innovation" },
];

function Block({ index, title, children, dark = false }: { index: string; title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section
      {...(dark ? { "data-header-dark": "" } : {})}
      className={dark ? "bg-navy-deep py-24 text-white" : "border-t border-line py-24"}
    >
      <div className="container-site">
        <SectionLabel index={index} tone={dark ? "dark" : "light"}>
          {title}
        </SectionLabel>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export default function Styleguide() {
  return (
    <>
      <section data-header-dark className="bg-navy-deep pt-[calc(var(--header-h)+6rem)] pb-24 text-white">
        <div className="container-site">
          <SectionLabel tone="dark">Design system</SectionLabel>
          <Reveal as="h1" mode="lines" immediate className="mt-8 max-w-4xl font-serif text-h1">
            Rigueur d’ingénieur, <em className="italic-accent text-sky">élégance</em> éditoriale.
          </Reveal>
          <p className="mt-6 max-w-2xl text-lead text-mist">
            Tous les fondamentaux du site : couleurs, typographie, espacements, composants et mouvement.
          </p>
        </div>
      </section>

      <Block index="01" title="Couleurs">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colors.map((c) => (
            <li key={c.name} className="overflow-hidden rounded-[var(--radius-md)] border border-line">
              <div className={`${c.cls} ${c.fg} flex h-28 items-end p-4 text-sm font-medium`}>{c.name}</div>
              <div className="space-y-1 p-4 text-sm">
                <p className="tabular font-medium text-navy">{c.hex}</p>
                <p className="text-muted">{c.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-muted">
          Le bleu ciel n’est jamais utilisé pour du texte sur fond clair (contraste 1,8:1). Sur fond clair, il sert
          uniquement au décor : soulignés, puces, filets.
        </p>
      </Block>

      <Block index="02" title="Typographie">
        <div className="space-y-12">
          <div>
            <p className="label-caps text-muted">Display — Fraunces 48→120px</p>
            <p className="mt-4 font-serif text-display text-navy">
              Piloter vos <em className="italic-accent">projets</em>.
            </p>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="label-caps text-muted">H1 — 40→72px</p>
              <p className="mt-3 font-serif text-h1 text-navy">La valeur acquise</p>
            </div>
            <div>
              <p className="label-caps text-muted">H2 — 32→52px</p>
              <p className="mt-3 font-serif text-h2 text-navy">Lire sa fiche de paie</p>
            </div>
            <div>
              <p className="label-caps text-muted">H3 — 22→28px</p>
              <p className="mt-3 font-serif text-h3 text-navy">Le fonds d’urgence, votre plan de risques</p>
            </div>
            <div>
              <p className="label-caps text-muted">Lead — Inter 18→22px</p>
              <p className="mt-3 text-lead text-muted">
                Une méthode claire, des exemples chiffrés, aucune promesse magique.
              </p>
            </div>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="label-caps text-muted">Corps — Inter 17px / 1.65</p>
              <p className="mt-3 max-w-[62ch]">
                Un projet réussi n’est pas un projet sans imprévus : c’est un projet dont les imprévus avaient été
                envisagés. Il en va de même pour votre budget. La rigueur n’est pas une contrainte, c’est une
                liberté.
              </p>
            </div>
            <div>
              <p className="label-caps text-muted">Chiffres — tabular-nums</p>
              <p className="tabular mt-3 font-serif text-h1 text-navy">
                1,08 <span className="text-muted">CPI</span>
              </p>
            </div>
          </div>
        </div>
      </Block>

      <Block index="03" title="Labels de section">
        <div className="space-y-6">
          <SectionLabel index="01">Approche</SectionLabel>
          <SectionLabel index="02">Expertises</SectionLabel>
          <SectionLabel>Sans numéro</SectionLabel>
        </div>
      </Block>

      <Block index="04" title="Boutons">
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/styleguide" magnetic>
            Primaire magnétique
          </Button>
          <Button href="/styleguide" variant="secondary">
            Secondaire
          </Button>
          <Button href="/styleguide" variant="ghost">
            Lien fléché
          </Button>
        </div>
      </Block>

      <Block index="05" title="Sur fond sombre" dark>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/styleguide" variant="light" magnetic>
            Bouton clair
          </Button>
          <a href="#" className="link-underline pb-1 text-sky">
            Lien bleu ciel
          </a>
        </div>
        <ul className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {pillars.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col gap-4 border-t border-white/15 pt-6">
              <Icon strokeWidth={1.5} className="size-7 text-sky" aria-hidden="true" />
              <span className="font-serif text-h3">{label}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block index="06" title="Identité">
        <div className="flex flex-wrap items-center gap-12 text-navy">
          <Wordmark />
          <Monogram className="h-16 w-auto" strokeWidth={1.6} />
        </div>
      </Block>

      <Block index="07" title="Surfaces & rayons">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-[var(--radius-sm)] border border-line p-6 text-sm text-muted">8px — inputs, badges</div>
          <div className="rounded-[var(--radius-md)] bg-white p-6 text-sm text-muted shadow-soft">12px — cartes, ombre douce</div>
          <div className="rounded-[var(--radius-lg)] bg-sky-soft p-6 text-sm text-navy">
            <p className="label-caps text-navy">À retenir</p>
            <p className="mt-3">16px — encadrés et médias.</p>
          </div>
        </div>
      </Block>

      <Block index="08" title="Révélation au scroll">
        <Reveal as="p" mode="lines" className="max-w-4xl font-serif text-h2 text-navy">
          Chaque animation sert la lecture : elle guide l’œil, elle ne le distrait jamais. Et tout se désactive
          proprement si vous préférez réduire les animations.
        </Reveal>
      </Block>
    </>
  );
}
