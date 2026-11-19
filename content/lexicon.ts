import type { LexiconTerm } from "@/lib/content/types";

/**
 * Lexique de la fiche de paie (France). Définitions pédagogiques simplifiées ;
 * les taux exacts évoluent et doivent être vérifiés sur service-public.fr et urssaf.fr.
 */
export const lexicon: LexiconTerm[] = [
  {
    term: "Salaire brut",
    short:
      "La rémunération totale prévue par votre contrat (salaire de base, heures supplémentaires, primes), avant toute retenue. C’est le point de départ de tous les calculs de la fiche.",
  },
  {
    term: "Cotisations salariales",
    short:
      "La part des cotisations sociales retenue sur votre salaire brut : retraite, chômage, prévoyance… Elles financent votre protection sociale et expliquent l’essentiel de l’écart entre brut et net.",
  },
  {
    term: "Cotisations patronales",
    short:
      "Les cotisations payées par l’employeur en plus de votre brut. Elles n’apparaissent pas dans votre net, mais font partie du coût réel de votre poste pour l’entreprise.",
  },
  {
    term: "CSG / CRDS",
    short:
      "Deux contributions prélevées sur presque tous les revenus pour financer la Sécurité sociale et rembourser sa dette. Une partie de la CSG est déductible de l’impôt, l’autre non : d’où leur présence dans le calcul du net imposable.",
  },
  {
    term: "Net à payer avant impôt",
    short:
      "Le brut moins toutes les cotisations et contributions salariales. C’est ce que vous toucheriez si l’impôt sur le revenu n’était pas prélevé à la source.",
  },
  {
    term: "Prélèvement à la source",
    short:
      "L’impôt sur le revenu retenu directement par l’employeur chaque mois, selon le taux transmis par l’administration fiscale. Le taux appliqué figure sur la fiche.",
  },
  {
    term: "Net à payer",
    short:
      "La somme réellement versée sur votre compte bancaire : le net avant impôt, moins le prélèvement à la source.",
  },
  {
    term: "Net imposable",
    short:
      "Le montant retenu pour calculer votre impôt sur le revenu. Il est un peu supérieur au net avant impôt, car il réintègre la CSG non déductible et la CRDS.",
  },
  {
    term: "Montant net social",
    short:
      "Un montant affiché sur la fiche de paie depuis 2023 pour simplifier les demandes de prime d’activité et de RSA : c’est le revenu à déclarer à la CAF ou à la MSA.",
  },
  {
    term: "Congés payés",
    short:
      "Le suivi de vos jours acquis, pris et restants. Pendant vos congés, votre salaire est maintenu ou calculé selon la règle la plus favorable prévue par la loi.",
  },
  {
    term: "Heures supplémentaires",
    short:
      "Les heures effectuées au-delà de la durée légale ou conventionnelle. Elles sont majorées et bénéficient, dans certaines limites, d’une exonération d’impôt et d’une réduction de cotisations.",
  },
  {
    term: "Avantages en nature",
    short:
      "Les biens ou services fournis par l’employeur (véhicule, logement, repas…). Ils ne sont pas versés en argent, mais sont ajoutés au brut pour le calcul des cotisations et de l’impôt.",
  },
];
