import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getHomeContent, getLexicon } from "@/lib/content";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeader } from "@/components/public/section-header";
import { Translator } from "@/components/sections/translator";

export const metadata: Metadata = {
  title: "Ressources — lexique de la fiche de paie, termes de gestion de projet, outils",
  description: "Lexique complet de la fiche de paie, traducteur des termes de gestion de projet et simulateurs gratuits.",
};

const colors = ["bg-navy-deep text-white", "bg-blue text-white", "bg-teal text-white", "bg-sky text-navy-deep"];

export default async function RessourcesPage() {
  const [content, lexicon] = await Promise.all([getHomeContent(), getLexicon()]);
  return (
    <>
      <PageHero label="Ressources" title="Les mots, puis les outils." intro="Un lexique clair de la fiche de paie, les termes clés de la gestion de projet, et des simulateurs pour passer à la pratique." />

      <section id="fiche-de-paie" className="bg-white py-[clamp(4rem,8vw,7rem)]">
        <div className="container-site">
          <SectionHeader label="Lexique" title="La fiche de paie en clair." intro="Douze termes que tout salarié devrait comprendre. Définitions simplifiées, à visée pédagogique." />
          <dl className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lexicon.map((t, i) => (
              <div key={t.term} className="rounded-md border border-line bg-cloud p-6">
                <dt className="flex items-baseline gap-3">
                  <span className="label-caps tabular text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.25rem] font-bold text-navy-deep">{t.term}</span>
                </dt>
                <dd className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{t.short}</dd>
              </div>
            ))}
          </dl>
          <Link href="/articles/comment-lire-sa-fiche-de-paie" className="mt-10 inline-flex items-center gap-2 font-semibold text-navy-deep">
            <span className="link-underline pb-0.5">Lire l’article : la fiche de paie décryptée</span>
            <ArrowUpRight strokeWidth={1.75} className="size-4" />
          </Link>
        </div>
      </section>

      <Translator content={content.translator} />

      <section className="bg-cloud py-[clamp(4rem,8vw,7rem)]">
        <div className="container-site">
          <SectionHeader label="Outils" title={content.tools.title} intro={content.tools.text} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.tools.chips.map((c, i) => (
              <li key={c.href}>
                <Link href={c.href} className={`group flex h-full min-h-40 flex-col justify-between rounded-md p-6 transition-transform duration-500 hover:-translate-y-1 ${colors[i % colors.length]}`}>
                  <span className="label-caps opacity-75">Simulateur {String(i + 1).padStart(2, "0")}</span>
                  <span className="flex items-end justify-between gap-3 text-[1.375rem] font-bold">
                    {c.label}
                    <ArrowUpRight strokeWidth={1.75} className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
