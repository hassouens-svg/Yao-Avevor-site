import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeader } from "@/components/public/section-header";
import { MarketsBoard, TickerTape } from "@/components/markets/markets-board";
import { DcaSimulator, RentalSimulator } from "@/components/tools/invest-simulators";
import { LoanSimulator } from "@/components/tools/other-simulators";

export const metadata: Metadata = {
  title: "Bourse & immobilier — marchés en direct et simulateurs d’investissement",
  description: "Suivez les marchés en direct (CAC 40, S&P 500, foncières cotées, or…) et simulez un investissement programmé en bourse ou un investissement locatif.",
};

const basics = [
  { t: "Horizon", d: "La bourse se pense sur 8 à 10 ans minimum. Sur une courte durée, les baisses peuvent être fortes ; l’argent dont on a besoin à court terme reste sur un livret." },
  { t: "Diversification", d: "Un ETF (fonds indiciel coté) achète d’un coup des centaines d’entreprises. C’est la façon la plus simple de ne pas dépendre d’une seule société ou d’un seul pays." },
  { t: "Frais", d: "1 % de frais par an paraît peu ; sur 20 ans, cela peut coûter plusieurs milliers d’euros. Comparez les frais de gestion, de courtage et d’enveloppe." },
  { t: "Enveloppes", d: "PEA, assurance-vie, compte-titres, PER : chaque enveloppe a sa fiscalité et ses règles de retrait. À vérifier selon votre situation." },
  { t: "Immobilier", d: "Rendement brut, charges, vacance, crédit, fiscalité : un bien rentable sur le papier peut coûter chaque mois. Le cash-flow est l’indicateur clé." },
  { t: "Pierre-papier", d: "Foncières cotées et SCPI permettent d’investir dans l’immobilier sans gérer de bien, avec leurs propres risques et frais." },
];

export default function MarchesPage() {
  return (
    <>
      <PageHero label="Bourse & immobilier" title="Investir, en ingénieur." intro="Suivre les marchés en direct, comprendre les mécanismes, puis simuler avant de décider. Contenu pédagogique : aucune recommandation d’achat ou de vente." />
      <TickerTape />

      <section className="bg-white py-[clamp(3rem,6vw,5rem)]">
        <div className="container-site">
          <SectionHeader label="Marchés en direct" title="Graphiques et cotations." />
          <div className="mt-8">
            <MarketsBoard />
          </div>
          <p className="mt-4 text-xs text-muted">Données TradingView, en temps réel ou différées selon les places.</p>
        </div>
      </section>

      <section className="border-y border-line bg-cloud py-[clamp(3rem,6vw,5rem)]">
        <div className="container-site">
          <SectionHeader label="Les bases" title="Six principes avant d’investir." />
          <dl className="mt-10 grid border-t border-line md:grid-cols-2 lg:grid-cols-3">
            {basics.map((b, i) => (
              <div key={b.t} className="border-b border-line py-6 md:pr-8">
                <dt className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.1875rem] font-semibold text-navy-deep">{b.t}</span>
                </dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{b.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="dca" className="scroll-mt-28 bg-white py-[clamp(3rem,6vw,5rem)]">
        <div className="container-site">
          <SectionHeader label="Simulateur — bourse" title="Investissement programmé." intro="Investir chaque mois la même somme, quel que soit le niveau du marché : l’effet du temps, des frais et de l’inflation." />
          <div className="mt-10 border-t border-line pt-8"><DcaSimulator /></div>
        </div>
      </section>

      <section id="locatif" className="scroll-mt-28 border-t border-line bg-white py-[clamp(3rem,6vw,5rem)]">
        <div className="container-site">
          <SectionHeader label="Simulateur — immobilier" title="Investissement locatif." intro="Rendement brut, rendement net, mensualité et cash-flow : la rentabilité réelle d’un bien, avant impôts." />
          <div className="mt-10 border-t border-line pt-8"><RentalSimulator /></div>
        </div>
      </section>

      <section id="credit" className="scroll-mt-28 border-t border-line bg-white py-[clamp(3rem,6vw,5rem)]">
        <div className="container-site">
          <SectionHeader label="Simulateur — crédit" title="Mensualité de crédit." />
          <div className="mt-10 border-t border-line pt-8"><LoanSimulator /></div>
          <p className="mt-10 text-sm text-muted">
            Pour aller plus loin : <Link href="/articles?categorie=bourse" className="underline">articles bourse</Link> ·{" "}
            <Link href="/articles?categorie=immobilier" className="underline">articles immobilier</Link> · <Link href="/outils" className="underline">tous les simulateurs</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
