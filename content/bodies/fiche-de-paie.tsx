import { Payslip } from "@/components/article/payslip";
import { BigFigure, Callout, FinanceDisclaimer } from "@/components/article/blocks";
import Link from "next/link";

export default function FicheDePaie() {
  return (
    <>
      <FinanceDisclaimer />
      <p>
        Chaque mois, elle arrive dans votre boîte mail ou votre coffre-fort numérique. Vous regardez la dernière ligne, le net
        payé, puis vous la refermez. C’est dommage : votre fiche de paie raconte précisément <strong>combien vous coûtez à votre
        employeur, ce qui finance votre protection sociale, et sur quelle base vous payez l’impôt</strong>. La lire, c’est
        comme lire le tableau de bord d’un projet : on y voit où part l’argent, et on repère les anomalies.
      </p>
      <p>
        Pour l’expliquer, prenons un bulletin réaliste mais <strong>entièrement fictif</strong> : Camille, technicien qualité
        non-cadre, 2 800 € brut par mois. Survolez ou touchez chaque zone : l’explication s’affiche en dessous. (Sur mobile, faites glisser le bulletin horizontalement.)
      </p>

      <Payslip />

      <h2>1. Le haut de la fiche : vérifiez d’abord qui vous êtes</h2>
      <p>
        L’en-tête n’est pas décoratif. On y trouve l’employeur (raison sociale, SIRET, code APE), la{" "}
        <strong>convention collective</strong> applicable, votre emploi, votre <strong>classification</strong> (coefficient,
        niveau, échelon) et votre date d’entrée. Ces informations déterminent le salaire minimum auquel vous avez droit, vos
        primes conventionnelles et votre ancienneté.
      </p>
      <Callout>
        <p>Une classification erronée peut vous priver de plusieurs centaines d’euros par an. Comparez-la avec votre contrat et la grille de votre convention collective.</p>
      </Callout>

      <h2>2. Le salaire brut : le point de départ de tout</h2>
      <p>
        Le salaire de base correspond à votre durée de travail multipliée par un taux horaire : ici 151,67 heures (35 heures
        par semaine, mensualisées) × 18,4611 € = 2 800 €. S’y ajoutent, le cas échéant, les heures supplémentaires majorées,
        les primes, les avantages en nature et les absences déduites. Le total donne le <strong>salaire brut</strong>.
      </p>

      <h2>3. Les cotisations : ce qui finance votre protection</h2>
      <p>
        Le cœur du bulletin est un tableau à deux colonnes de cotisations : la <strong>part salariale</strong>, retenue sur
        votre brut, et la <strong>part patronale</strong>, payée en plus par l’employeur. Depuis le bulletin « clarifié », elles
        sont regroupées par risque :
      </p>
      <ul>
        <li><strong>Santé</strong> : assurance maladie (payée par l’employeur) et complémentaire santé obligatoire, partagée.</li>
        <li><strong>Accidents du travail</strong> : à la charge exclusive de l’employeur.</li>
        <li><strong>Retraite</strong> : retraite de base (plafonnée et déplafonnée) et complémentaire AGIRC-ARRCO. C’est votre plus grosse cotisation salariale, et elle vous ouvre des droits.</li>
        <li><strong>Famille</strong> et <strong>assurance chômage</strong> : à la charge de l’employeur pour les salariés du privé.</li>
      </ul>
      <p>
        Dans notre exemple, Camille cotise 616,44 € par mois. Son employeur, lui, verse environ 1 000 € de plus que le brut,
        avant les allègements de cotisations prévus pour les salaires modérés.
      </p>
      <BigFigure value="≈ 22 %" label="La part du brut qui part en cotisations et contributions salariales pour un salarié non-cadre du privé (ordre de grandeur)." />

      <h2>4. CSG et CRDS : deux contributions, deux traitements fiscaux</h2>
      <p>
        La CSG et la CRDS sont calculées sur <strong>98,25 % du brut</strong> (plus certains éléments, comme la part patronale
        de la mutuelle). Elles apparaissent sur deux lignes, et c’est important :
      </p>
      <ul>
        <li><strong>CSG déductible (6,8 %)</strong> : elle diminue votre revenu imposable.</li>
        <li><strong>CSG non déductible et CRDS (2,9 % au total)</strong> : vous les payez, mais elles restent soumises à l’impôt.</li>
      </ul>
      <p>C’est précisément cette différence qui explique pourquoi votre net imposable est plus élevé que votre net.</p>

      <h2>5. Net avant impôt, net imposable, net payé : trois montants, trois usages</h2>
      <table>
        <thead>
          <tr>
            <th>Montant</th>
            <th>Calcul</th>
            <th>Exemple</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Net à payer avant impôt</td>
            <td>Brut − cotisations salariales</td>
            <td>2 183,56 €</td>
          </tr>
          <tr>
            <td>Net imposable</td>
            <td>Net avant impôt + CSG/CRDS non déductible + part patronale santé</td>
            <td>2 294,21 €</td>
          </tr>
          <tr>
            <td>Prélèvement à la source</td>
            <td>Net imposable × taux (4,5 %)</td>
            <td>103,24 €</td>
          </tr>
          <tr>
            <td>Net payé</td>
            <td>Net avant impôt − prélèvement</td>
            <td>2 080,32 €</td>
          </tr>
        </tbody>
      </table>
      <Callout kind="exemple" title="À quoi sert chaque montant">
        <p><strong>Le net payé</strong> : ce que vous budgétez chaque mois.</p>
        <p><strong>Le net imposable</strong> : la base de votre impôt ; son cumul annuel est pré-rempli dans votre déclaration.</p>
        <p><strong>Le montant net social</strong> : le revenu à déclarer à la CAF ou à la MSA pour la prime d’activité et le RSA.</p>
      </Callout>

      <h2>6. Le prélèvement à la source</h2>
      <p>
        Depuis 2019, l’impôt sur le revenu est retenu directement par l’employeur. Le taux est calculé et transmis par
        l’administration fiscale à partir de votre dernière déclaration ; vous pouvez opter pour un taux individualisé (en
        couple) ou un taux neutre (non transmis à l’employeur). Le taux, la base et le montant figurent sur la fiche. Pour
        comprendre comment ce taux est construit, lisez{" "}
        <Link href="/articles/comment-fonctionne-l-impot-sur-le-revenu">comment fonctionne l’impôt sur le revenu</Link>.
      </p>

      <h2>7. Les congés payés et les mentions du bas</h2>
      <p>
        Vous acquérez 2,5 jours ouvrables de congés par mois de travail effectif, soit 30 jours ouvrables (5 semaines) par an.
        Le bulletin indique les jours acquis, pris et restants. En bas, on trouve aussi le coût total pour l’employeur et la
        mention qui vous invite à conserver votre bulletin <strong>sans limitation de durée</strong> : il prouve vos droits à
        la retraite.
      </p>

      <h2>La méthode en 5 contrôles mensuels</h2>
      <ol>
        <li>Mon emploi et ma classification sont-ils corrects ?</li>
        <li>Mes heures supplémentaires et primes du mois apparaissent-elles ?</li>
        <li>Les absences déduites correspondent-elles à la réalité ?</li>
        <li>Le taux de prélèvement à la source est-il celui de mon espace impots.gouv.fr ?</li>
        <li>Mon solde de congés est-il juste ?</li>
      </ol>
      <Callout>
        <p>Lire sa fiche de paie prend cinq minutes par mois. C’est le plus petit « contrôle qualité » de vos finances personnelles, et l’un des plus rentables.</p>
      </Callout>
      <p>
        Pour estimer rapidement un net à partir d’un brut, utilisez le <Link href="/outils#brut-net">simulateur brut → net</Link>.
      </p>
    </>
  );
}
