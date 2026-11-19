import { BigFigure, Callout, FinanceDisclaimer } from "@/components/article/blocks";
import { CompoundSimulator } from "@/components/tools/compound-simulator";

export default function InteretsComposes() {
  return (
    <>
      <FinanceDisclaimer />
      <p>
        En gestion de projet, on apprend vite qu’un petit retard au début du planning coûte bien plus cher qu’un gros retard à
        la fin : il se propage. L’épargne fonctionne de la même façon, mais dans le bon sens. C’est le principe des{" "}
        <strong>intérêts composés</strong> : les intérêts gagnés produisent à leur tour des intérêts.
      </p>

      <h2>Le mécanisme, en une ligne</h2>
      <p>
        Avec des intérêts simples, 1 000 € placés à 5 % rapportent 50 € par an, toujours. Avec des intérêts composés, la
        deuxième année rapporte 5 % de 1 050 €, soit 52,50 €, puis 5 % de 1 102,50 €… Au bout de 10 ans, avec des intérêts
        capitalisés chaque année, 1 000 € deviennent environ <strong>1 629 €</strong>, contre 1 500 € en intérêts simples.
      </p>

      <h2>La règle de 72</h2>
      <p>
        Pour estimer en combien d’années un capital double, divisez 72 par le taux annuel. À 5 % : 72 ÷ 5 ≈ 14,4 ans (le calcul
        exact donne 14,2 ans). À 8 % : environ 9 ans. C’est un ordre de grandeur, très utile pour comparer des options.
      </p>

      <h2>Le temps compte plus que le montant</h2>
      <p>Comparons deux personnes qui épargnent 200 € par mois à 5 % par an, jusqu’à 65 ans :</p>
      <table>
        <thead>
          <tr>
            <th>Profil</th>
            <th>Versé</th>
            <th>Capital final</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Commence à 25 ans (40 ans)</td>
            <td>96 000 €</td>
            <td>≈ 305 000 €</td>
          </tr>
          <tr>
            <td>Commence à 35 ans (30 ans)</td>
            <td>72 000 €</td>
            <td>≈ 166 000 €</td>
          </tr>
        </tbody>
      </table>
      <BigFigure value="× 1,8" label="Dix ans de plus multiplient le capital final par 1,8, alors que les versements n’augmentent que d’un tiers." />

      <h2>Essayez vous-même</h2>
      <div className="not-prose my-8 rounded-[20px] border border-line bg-cloud/60 p-5 sm:p-8">
        <CompoundSimulator />
      </div>

      <h2>Les trois limites à garder en tête</h2>
      <ul>
        <li><strong>Le rendement n’est jamais garanti</strong> pour les placements risqués ; les simulations supposent un taux constant.</li>
        <li><strong>Les frais et la fiscalité</strong> réduisent l’effet : 1 % de frais annuels pèse lourd sur 30 ans.</li>
        <li><strong>L’inflation</strong> diminue le pouvoir d’achat du capital final.</li>
      </ul>
      <Callout>
        <p>Commencer tôt, verser régulièrement, limiter les frais : trois décisions simples, dont l’effet se compose avec le temps — exactement comme les bonnes décisions en début de projet.</p>
      </Callout>
    </>
  );
}
