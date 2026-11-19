import Link from "next/link";
import { BigFigure, Callout, FinanceDisclaimer } from "@/components/article/blocks";
import { DcaSimulator } from "@/components/tools/invest-simulators";

export default function Bourse() {
  return (
    <>
      <FinanceDisclaimer />
      <p>
        La bourse fait peur parce qu’on la regarde au jour le jour. Un ingénieur la regarde comme un système : des variables
        (horizon, diversification, frais), des risques identifiés, et une stratégie qui fonctionne sans avoir à prédire
        l’avenir. Voici les bases pour comprendre — pas pour spéculer.
      </p>

      <h2>Une action, un indice, un ETF</h2>
      <ul>
        <li><strong>Une action</strong> est une part d’une entreprise. Sa valeur dépend des résultats de cette seule entreprise.</li>
        <li><strong>Un indice</strong> (CAC 40, S&amp;P 500, MSCI World) mesure l’évolution d’un panier d’entreprises.</li>
        <li><strong>Un ETF</strong> est un fonds coté qui réplique un indice : en achetant une part, on détient un petit morceau de toutes les entreprises de l’indice, avec des frais généralement faibles.</li>
      </ul>

      <h2>Le risque principal : l’horizon trop court</h2>
      <p>
        Les marchés actions peuvent perdre 30 % ou plus en quelques mois, et mettre plusieurs années à se reprendre. Investir
        de l’argent dont on aura besoin dans deux ans, c’est risquer de devoir vendre au pire moment. Règle simple : d’abord
        le <Link href="/articles/le-fonds-d-urgence">fonds d’urgence</Link>, ensuite l’investissement long terme.
      </p>

      <h2>L’investissement programmé</h2>
      <p>
        Plutôt que de chercher le « bon moment », on investit la même somme chaque mois. On achète plus de parts quand les
        prix baissent, moins quand ils montent, et on supprime la tentation de jouer au devin.
      </p>
      <div className="not-prose my-8 rounded-md border border-line bg-cloud/60 p-5 sm:p-8">
        <DcaSimulator />
      </div>
      <BigFigure value="Frais" label="Sur 20 ans, quelques dixièmes de pourcentage de frais annuels représentent souvent plusieurs milliers d’euros : le simulateur ci-dessus le montre." />

      <h2>Les enveloppes</h2>
      <p>
        En France, on investit via une enveloppe : PEA (actions européennes, fiscalité avantageuse après 5 ans), assurance-vie,
        compte-titres ou PER. Chacune a ses règles de fiscalité et de retrait : à choisir selon l’objectif et l’horizon, et à
        vérifier sur des sources officielles.
      </p>
      <Callout>
        <p>Horizon long, diversification large, frais bas, versements réguliers : quatre règles simples, qui comptent plus que n’importe quelle prévision.</p>
      </Callout>
      <p>Suivez les principaux indices en direct sur la page <Link href="/marches">Bourse &amp; immobilier</Link>.</p>
    </>
  );
}
