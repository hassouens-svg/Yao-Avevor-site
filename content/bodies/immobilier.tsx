import { Callout, FinanceDisclaimer } from "@/components/article/blocks";
import { RentalSimulator } from "@/components/tools/invest-simulators";

export default function Immobilier() {
  return (
    <>
      <FinanceDisclaimer />
      <p>
        « 7 % de rendement ! » L’annonce est séduisante. Mais un investissement locatif se juge comme un projet : sur son coût
        complet, ses risques et son flux de trésorerie mensuel. Voici comment calculer la rentabilité réelle d’un bien.
      </p>

      <h2>1. Le rendement brut : un premier filtre</h2>
      <p>
        Rendement brut = loyers annuels ÷ coût total (prix + frais de notaire + travaux). Un bien acheté 180 000 €, avec
        14 400 € de frais de notaire et 10 000 € de travaux, loué 850 € par mois, offre environ 5 % brut. C’est un indicateur de
        tri, pas une décision.
      </p>

      <h2>2. Le rendement net : la réalité des charges</h2>
      <p>
        On retire les charges non récupérables, la taxe foncière, l’assurance, l’entretien et la vacance locative (les mois sans
        locataire). Il n’est pas rare de perdre 1 à 2 points de rendement entre le brut et le net.
      </p>

      <h2>3. Le cash-flow : l’indicateur décisif</h2>
      <p>
        Avec un crédit, la vraie question est : chaque mois, les loyers couvrent-ils la mensualité et les charges ? Un
        cash-flow négatif n’est pas forcément un mauvais investissement, mais c’est un effort d’épargne qu’il faut pouvoir tenir
        dans la durée.
      </p>
      <div className="not-prose my-8 rounded-md border border-line bg-cloud/60 p-5 sm:p-8">
        <RentalSimulator />
      </div>

      <h2>4. Les risques à inscrire au registre</h2>
      <ul>
        <li><strong>Vacance et impayés</strong> : prévoir une réserve, ou une assurance loyers impayés.</li>
        <li><strong>Travaux imprévus</strong> : toiture, chaudière, mise aux normes énergétiques.</li>
        <li><strong>Réglementation</strong> : diagnostic de performance énergétique, encadrement des loyers selon les villes.</li>
        <li><strong>Fiscalité</strong> : micro-foncier, régime réel, location meublée… elle change fortement le résultat final.</li>
      </ul>
      <Callout>
        <p>Achetez un emplacement et un cash-flow, pas une promesse de rendement. Et simulez toujours le scénario pessimiste : vacance plus longue, travaux, taux plus élevé.</p>
      </Callout>
    </>
  );
}
