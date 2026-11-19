import Link from "next/link";
import { BigFigure, Callout, FinanceDisclaimer } from "@/components/article/blocks";
import { TaxSimulator } from "@/components/tools/tax-simulator";
import { IR_PARAMS } from "@/lib/finance";

const fmt = (n: number) => n.toLocaleString("fr-FR");

export default function ImpotSurLeRevenu() {
  const b = IR_PARAMS.brackets;
  return (
    <>
      <FinanceDisclaimer />
      <p>
        « Je suis passé dans la tranche à 30 %, je vais gagner moins. » C’est l’idée reçue la plus répandue sur l’impôt, et
        elle est fausse. L’impôt sur le revenu français est un mécanisme <strong>progressif</strong>, construit en quatre
        étapes. Une fois qu’on les a vues, on comprend son avis d’impôt, son taux de prélèvement… et on arrête d’avoir peur
        des tranches.
      </p>

      <h2>Étape 1 : du salaire au revenu net imposable</h2>
      <p>
        On part des revenus du <strong>foyer fiscal</strong> (vous, votre conjoint marié ou pacsé, vos enfants à charge). Pour
        les salaires, on prend le cumul annuel du <strong>net imposable</strong> figurant sur vos fiches de paie, puis on
        applique un <strong>abattement forfaitaire de 10 %</strong> pour frais professionnels (dans la limite d’un minimum et
        d’un maximum). Vous pouvez y renoncer pour déclarer vos frais réels, s’ils sont plus élevés.
      </p>
      <Callout kind="exemple">
        <p>Salaires déclarés : 36 000 € → abattement de 10 % : 3 600 € → <strong>revenu net imposable : 32 400 €</strong>.</p>
      </Callout>

      <h2>Étape 2 : le quotient familial</h2>
      <p>
        On divise le revenu net imposable par le nombre de <strong>parts</strong> du foyer : 1 part par adulte seul, 2 pour
        un couple marié ou pacsé, puis une demi-part pour chacun des deux premiers enfants et une part entière à partir du
        troisième. L’idée : un même revenu ne fait pas vivre de la même façon une personne seule et une famille.
      </p>
      <p>
        Cet avantage est toutefois <strong>plafonné</strong> : chaque demi-part liée aux enfants ne peut pas réduire l’impôt
        de plus de {fmt(IR_PARAMS.qfCapPerHalfShare)} € ({IR_PARAMS.label.toLowerCase()}).
      </p>

      <h2>Étape 3 : le barème progressif, tranche par tranche</h2>
      <p>On applique ensuite le barème au revenu d’<strong>une part</strong> :</p>
      <table>
        <thead>
          <tr>
            <th>Revenu par part</th>
            <th>Taux</th>
          </tr>
        </thead>
        <tbody>
          {b.map((t, i) => (
            <tr key={i}>
              <td>{Number.isFinite(t.upTo) ? `${i === 0 ? "Jusqu’à" : `De ${fmt(b[i - 1].upTo + 1)} à`} ${fmt(t.upTo)} €` : `Au-delà de ${fmt(b[i - 1].upTo)} €`}</td>
              <td>{Math.round(t.rate * 100)} %</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Le point clé : <strong>chaque taux ne s’applique qu’à la portion de revenu comprise dans sa tranche</strong>. Avec
        32 400 € pour une part :
      </p>
      <ul>
        <li>les {fmt(b[0].upTo)} premiers euros ne sont pas imposés (0 %) ;</li>
        <li>de {fmt(b[0].upTo)} € à {fmt(b[1].upTo)} €, soit 17 979 €, sont imposés à 11 % : 1 977,69 € ;</li>
        <li>de {fmt(b[1].upTo)} € à 32 400 €, soit 2 821 €, sont imposés à 30 % : 846,30 €.</li>
      </ul>
      <p>On multiplie ensuite le résultat par le nombre de parts. Ici : <strong>2 824 € d’impôt</strong>.</p>
      <BigFigure value="8,7 %" label="Le taux moyen réel de notre exemple : 2 824 € d’impôt pour 32 400 € de revenu net imposable, alors que le taux marginal est de 30 %." />
      <Callout>
        <p>Le <strong>taux marginal</strong> (30 % ici) ne concerne que les derniers euros gagnés. Le <strong>taux moyen</strong> (8,7 %) est ce que vous payez réellement. Une augmentation ne peut donc jamais faire baisser votre revenu après impôt.</p>
      </Callout>

      <h2>Étape 4 : la décote et les réductions</h2>
      <p>
        Pour les impôts modestes, une <strong>décote</strong> vient alléger le montant. Prenons un couple avec deux enfants et
        70 000 € de salaires : après l’abattement, 63 000 € pour 3 parts, soit 21 000 € par part. Impôt brut : 3 102 €. Comme
        il est inférieur au seuil de la décote pour un couple, celle-ci retire 79 € : <strong>impôt final 3 023 €</strong>,
        soit un taux moyen de 4,8 %. Le même couple sans enfants paierait 5 108 €.
      </p>
      <p>
        Viennent enfin les <strong>réductions et crédits d’impôt</strong> (emploi à domicile, garde d’enfants, dons…), qui
        diminuent l’impôt calculé, voire donnent lieu à un remboursement pour les crédits.
      </p>

      <h2>Simulez votre propre situation</h2>
      <div className="not-prose my-8 rounded-[20px] border border-line bg-cloud/60 p-5 sm:p-8">
        <TaxSimulator />
      </div>

      <h2>Et le prélèvement à la source ?</h2>
      <p>
        Le prélèvement à la source ne change pas le calcul : il change le <strong>moment</strong> où l’on paie. Chaque mois,
        votre employeur applique à votre net imposable un taux calculé par l’administration à partir de votre dernière
        déclaration. Au printemps, vous déclarez vos revenus de l’année précédente ; l’été, l’avis d’impôt fait le bilan :
        si l’on a trop prélevé, vous êtes remboursé ; sinon, le complément est étalé.
      </p>
      <Callout kind="attention">
        <p>Un changement important (naissance, mariage, baisse de revenus) ? Mettez à jour votre taux dans votre espace sur impots.gouv.fr, sans attendre la déclaration suivante.</p>
      </Callout>
      <p>
        Pour comprendre d’où vient le net imposable, lisez{" "}
        <Link href="/articles/comment-lire-sa-fiche-de-paie">comment lire sa fiche de paie, ligne par ligne</Link>.
      </p>
    </>
  );
}
