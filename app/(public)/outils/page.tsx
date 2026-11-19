import type { Metadata } from "next";
import { SectionLabel } from "@/components/public/section-label";
import { Reveal } from "@/components/public/reveal";
import { CompoundSimulator } from "@/components/tools/compound-simulator";
import { TaxSimulator } from "@/components/tools/tax-simulator";
import {
  BudgetSimulator,
  EmergencySimulator,
  EvmSimulator,
  GrossNetSimulator,
  LoanSimulator,
} from "@/components/tools/other-simulators";

export const metadata: Metadata = {
  title: "Simulateurs gratuits — impôt, salaire, intérêts composés, valeur acquise",
  description:
    "Simulateurs pédagogiques gratuits : impôt sur le revenu, brut → net, intérêts composés, valeur acquise (EVM), fonds d’urgence, budget 50/30/20, mensualité de crédit.",
};

const tools = [
  { id: "interets-composes", tag: "Épargne", title: "Intérêts composés", text: "Voyez comment le temps fait travailler votre épargne.", el: <CompoundSimulator /> },
  { id: "impot", tag: "Impôts", title: "Impôt sur le revenu", text: "Barème progressif, quotient familial, décote : ce que vous payez, tranche par tranche.", el: <TaxSimulator /> },
  { id: "brut-net", tag: "Salaire", title: "Du brut au net", text: "De votre salaire brut à ce qui arrive sur votre compte.", el: <GrossNetSimulator /> },
  { id: "evm", tag: "Gestion de projet", title: "Valeur acquise (EVM)", text: "Votre projet est-il en retard ? Au-dessus du budget ? Le diagnostic en 4 chiffres.", el: <EvmSimulator /> },
  { id: "fonds-urgence", tag: "Épargne", title: "Fonds d’urgence", text: "Combien mettre de côté, et en combien de temps.", el: <EmergencySimulator /> },
  { id: "budget", tag: "Budget", title: "Budget 50/30/20", text: "Une répartition simple pour démarrer un budget.", el: <BudgetSimulator /> },
  { id: "credit", tag: "Crédit", title: "Mensualité de crédit", text: "Mensualité, coût total et part des intérêts d’un prêt.", el: <LoanSimulator /> },
];

export default function OutilsPage() {
  return (
    <>
      <section className="bg-[radial-gradient(100%_80%_at_80%_0%,#eaf5fd,#ffffff_60%)] pt-[calc(var(--header-h)+4rem)] pb-14">
        <div className="container-site">
          <SectionLabel>Simulateurs</SectionLabel>
          <Reveal as="h1" mode="lines" immediate className="mt-5 max-w-5xl text-display text-navy-deep">
            Calculez. Comprenez. Décidez.
          </Reveal>
          <p className="mt-6 max-w-2xl text-lead text-muted">
            Des outils gratuits, sans inscription, pour vos projets et vos finances. Chaque résultat est expliqué, pour que vous compreniez le calcul — pas seulement le chiffre.
          </p>
          <nav aria-label="Aller à un simulateur" className="mt-10 flex flex-wrap gap-2">
            {tools.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 font-mono text-[0.8125rem] text-navy-deep transition-colors hover:border-navy-deep hover:bg-navy-deep hover:text-white">
                {t.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="bg-white pb-24">
        <div className="container-site space-y-6">
          {tools.map((t, i) => (
            <section key={t.id} id={t.id} aria-labelledby={`${t.id}-titre`} className="scroll-mt-28 rounded-[24px] border border-line bg-cloud/60 p-6 sm:p-10 lg:p-12">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="label-caps text-blue">
                    {String(i + 1).padStart(2, "0")} — {t.tag}
                  </p>
                  <h2 id={`${t.id}-titre`} className="mt-3 text-h2 text-navy-deep">
                    {t.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-muted">{t.text}</p>
                </div>
              </div>
              {t.el}
            </section>
          ))}
          <p className="pt-4 text-center text-sm text-muted">
            Outils pédagogiques : résultats indicatifs, qui ne constituent pas un conseil financier, fiscal ou juridique personnalisé.
          </p>
        </div>
      </div>
    </>
  );
}
