import { Callout, FinanceDisclaimer } from "@/components/article/blocks";
import { EmergencySimulator } from "@/components/tools/other-simulators";

export default function FondsUrgence() {
  return (
    <>
      <FinanceDisclaimer />
      <p>
        En gestion de projet, on ne supprime pas les risques : on prévoit une <strong>réserve</strong> pour y faire face. Le fonds
        d’urgence joue exactement ce rôle dans vos finances personnelles. C’est la première ligne de défense avant tout autre
        objectif d’épargne.
      </p>

      <h2>À quoi sert-il ?</h2>
      <p>
        À absorber un imprévu sans s’endetter ni toucher à une épargne de long terme : perte d’emploi, réparation importante,
        dépense de santé, période sans revenus. Il ne sert pas à financer des vacances ou un achat prévu.
      </p>

      <h2>Combien mettre de côté ?</h2>
      <p>
        Le repère courant est de <strong>3 à 6 mois de dépenses incompressibles</strong> (logement, alimentation, transport,
        assurances, remboursements). Plutôt 3 mois avec un emploi stable et un double revenu ; plutôt 6 mois ou plus pour un
        indépendant ou un foyer à revenu unique.
      </p>
      <div className="not-prose my-8 rounded-[20px] border border-line bg-cloud/60 p-5 sm:p-8">
        <EmergencySimulator />
      </div>

      <h2>Où le placer ?</h2>
      <p>
        Sur un support <strong>disponible immédiatement et sans risque de perte</strong> : un livret d’épargne réglementé est la
        solution la plus courante. Le rendement passe au second plan : on achète de la sécurité, pas de la performance.
      </p>

      <h2>Comment le constituer sans se priver ?</h2>
      <ul>
        <li>Programmez un virement automatique le jour de la paie, même modeste.</li>
        <li>Affectez-y une partie des rentrées exceptionnelles (prime, remboursement).</li>
        <li>Fixez des jalons : 1 mois, puis 3, puis 6 — et célébrez-les.</li>
      </ul>
      <Callout>
        <p>Après avoir utilisé le fonds, la priorité est de le reconstituer. Comme une réserve de projet : on la consomme, puis on la recharge.</p>
      </Callout>
    </>
  );
}
