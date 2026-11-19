import { Callout, FinanceDisclaimer } from "@/components/article/blocks";
import { BudgetSimulator } from "@/components/tools/other-simulators";

export default function BudgetProjet() {
  return (
    <>
      <FinanceDisclaimer />
      <p>
        Un budget personnel qui échoue ressemble beaucoup à un projet qui échoue : un objectif flou, pas de planning, aucun suivi,
        et des imprévus que personne n’avait envisagés. Bonne nouvelle : les outils du chef de projet s’appliquent très bien à
        votre argent.
      </p>

      <h2>1. La charte : pourquoi ce budget ?</h2>
      <p>
        Écrivez en une phrase l’objectif de l’année : constituer une épargne de précaution, rembourser un crédit, financer un
        projet. Un budget sans objectif devient une simple liste de restrictions — et on l’abandonne vite.
      </p>

      <h2>2. Le périmètre : tout ce qui entre et tout ce qui sort</h2>
      <p>
        Listez vos revenus nets réels, puis vos dépenses sur trois mois, relevés bancaires à l’appui. Séparez les charges fixes
        (loyer, assurances, abonnements), les dépenses variables (courses, transport) et les dépenses occasionnelles (vacances,
        cadeaux, réparations), à lisser sur douze mois.
      </p>

      <h2>3. Le planning : une répartition de départ</h2>
      <p>
        La règle 50/30/20 donne un premier repère : 50 % pour les besoins, 30 % pour les envies, 20 % pour l’épargne et les
        dettes. C’est un point de départ, à ajuster à votre réalité.
      </p>
      <div className="not-prose my-8 rounded-[20px] border border-line bg-cloud/60 p-5 sm:p-8">
        <BudgetSimulator />
      </div>

      <h2>4. Les risques : prévoir l’imprévu</h2>
      <p>
        Panne de voiture, facture imprévue, baisse de revenus : comme dans un registre des risques, identifiez-les et prévoyez
        une réponse. La principale réponse s’appelle le <strong>fonds d’urgence</strong>.
      </p>

      <h2>5. La revue mensuelle : piloter, pas subir</h2>
      <p>
        Une fois par mois, 20 minutes : comparez le prévu et le réel, comprenez les écarts, ajustez le mois suivant. C’est la
        revue de projet de votre budget. Ce n’est pas l’écart qui pose problème, c’est l’écart qu’on ne regarde pas.
      </p>

      <Callout>
        <p>Automatisez ce qui peut l’être : un virement d’épargne programmé le jour de la paie est la décision budgétaire la plus efficace qui soit.</p>
      </Callout>
    </>
  );
}
