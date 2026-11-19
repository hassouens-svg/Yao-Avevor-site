import Link from "next/link";
import { Callout, FinanceDisclaimer } from "@/components/article/blocks";
import { GrossNetSimulator } from "@/components/tools/other-simulators";

export default function BrutNet() {
  return (
    <>
      <FinanceDisclaimer />
      <p>
        Trois montants reviennent sans cesse : le brut, le net et le net imposable. Ils ne servent pas à la même chose, et les
        confondre conduit à des erreurs de budget ou de déclaration.
      </p>

      <h2>Le brut : la référence du contrat</h2>
      <p>
        C’est la rémunération prévue par votre contrat, avant toute retenue. Les offres d’emploi, les grilles et les négociations
        salariales parlent en brut annuel.
      </p>

      <h2>Le net : ce qui arrive sur votre compte</h2>
      <p>
        On retire du brut les cotisations et contributions salariales (environ 22 % pour un non-cadre du privé, 25 % pour un
        cadre, en ordre de grandeur) : on obtient le <strong>net à payer avant impôt</strong>. On retire ensuite le prélèvement à
        la source : c’est le <strong>net versé</strong>.
      </p>
      <div className="not-prose my-8 rounded-[20px] border border-line bg-cloud/60 p-5 sm:p-8">
        <GrossNetSimulator />
      </div>

      <h2>Le net imposable : la base de l’impôt</h2>
      <p>
        Il est un peu plus élevé que le net avant impôt, car on y réintègre la CSG non déductible, la CRDS et la part patronale de
        la complémentaire santé. C’est lui qui sert au calcul du prélèvement à la source, et dont le cumul annuel est pré-rempli
        dans votre déclaration de revenus.
      </p>
      <Callout kind="exemple" title="En résumé">
        <p><strong>Brut</strong> : pour négocier et comparer des offres.</p>
        <p><strong>Net versé</strong> : pour construire votre budget.</p>
        <p><strong>Net imposable</strong> : pour comprendre votre impôt.</p>
      </Callout>
      <p>
        Pour voir où se trouve chaque montant sur un vrai bulletin, lisez{" "}
        <Link href="/articles/comment-lire-sa-fiche-de-paie">comment lire sa fiche de paie, ligne par ligne</Link>.
      </p>
    </>
  );
}
