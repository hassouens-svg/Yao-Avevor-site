import { BigFigure, Callout } from "@/components/article/blocks";
import { EvmSimulator } from "@/components/tools/other-simulators";

export default function Evm() {
  return (
    <>
      <p>
        « On est à 60 %. » C’est la phrase la plus dangereuse d’une revue de projet. 60 % de quoi ? Du temps écoulé ? Du budget
        dépensé ? Du travail réellement terminé ? La <strong>valeur acquise</strong> (Earned Value Management, EVM) répond à cette
        question avec trois chiffres et deux ratios. C’est l’un des sujets les plus redoutés de l’examen PMP®, et l’un des plus
        utiles sur le terrain.
      </p>

      <h2>Les trois chiffres de base</h2>
      <ul>
        <li><strong>VP — Valeur planifiée</strong> (PV) : ce que le travail prévu à date devait coûter selon le plan.</li>
        <li><strong>VA — Valeur acquise</strong> (EV) : ce que vaut, au budget, le travail réellement terminé.</li>
        <li><strong>CR — Coût réel</strong> (AC) : ce qui a réellement été dépensé pour ce travail.</li>
      </ul>
      <p>Tous sont exprimés en euros, ce qui permet de comparer délais et coûts dans la même unité.</p>

      <h2>Un exemple chiffré</h2>
      <p>
        Un projet R&amp;D a un budget total (BAC) de 120 000 €. À mi-parcours, le plan prévoyait 50 % du travail réalisé ; on en a
        terminé 40 %, et on a dépensé 55 000 €.
      </p>
      <table>
        <thead>
          <tr><th>Indicateur</th><th>Calcul</th><th>Résultat</th></tr>
        </thead>
        <tbody>
          <tr><td>VP</td><td>120 000 × 50 %</td><td>60 000 €</td></tr>
          <tr><td>VA</td><td>120 000 × 40 %</td><td>48 000 €</td></tr>
          <tr><td>CR</td><td>constaté</td><td>55 000 €</td></tr>
          <tr><td>Écart de délais (VA − VP)</td><td>48 000 − 60 000</td><td>−12 000 €</td></tr>
          <tr><td>Écart de coûts (VA − CR)</td><td>48 000 − 55 000</td><td>−7 000 €</td></tr>
        </tbody>
      </table>

      <h2>SPI et CPI : les deux ratios à retenir</h2>
      <p>
        <strong>SPI = VA ÷ VP = 0,80</strong> : le projet avance à 80 % du rythme prévu. <strong>CPI = VA ÷ CR = 0,87</strong> :
        chaque euro dépensé ne produit que 0,87 € de travail. En dessous de 1, c’est défavorable ; au-dessus, favorable.
      </p>
      <BigFigure value="137 500 €" label="Le coût final estimé (EAC = BAC ÷ CPI) si la performance actuelle se maintient, au lieu des 120 000 € prévus." />

      <h2>Essayez avec vos propres chiffres</h2>
      <div className="not-prose my-8 rounded-[20px] border border-line bg-cloud/60 p-5 sm:p-8">
        <EvmSimulator />
      </div>

      <h2>Ce que l’EVM change dans le pilotage</h2>
      <p>
        L’intérêt n’est pas le calcul, c’est la conversation qu’il permet. Avec un CPI de 0,87 à mi-parcours, on ne dit plus
        « on verra » : on présente au sponsor une prévision chiffrée et des options (réduire le périmètre, renforcer l’équipe,
        accepter le surcoût). C’est exactement le rôle du chef de projet : transformer un ressenti en décision.
      </p>
      <Callout>
        <p>SPI et CPI ne valent que si la <strong>valeur acquise</strong> est mesurée honnêtement. Fixez à l’avance la règle d’avancement (0/100, 50/50, jalons pondérés), sinon les « 90 % terminés » dureront des mois.</p>
      </Callout>
    </>
  );
}
