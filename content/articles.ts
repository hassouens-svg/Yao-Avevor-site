import type { ArticleMeta, Category } from "@/lib/content/types";

export const categories: Category[] = [
  { slug: "gestion-de-projet", name: "Gestion de projet", isFinance: false },
  { slug: "pmp", name: "PMP®", isFinance: false },
  { slug: "finances-personnelles", name: "Finances personnelles", isFinance: true },
  { slug: "fiche-de-paie", name: "Fiche de paie & salaire", isFinance: true },
  { slug: "budget-epargne", name: "Budget & épargne", isFinance: true },
  { slug: "impots", name: "Impôts", isFinance: true },
  { slug: "bourse", name: "Bourse", isFinance: true },
  { slug: "immobilier", name: "Immobilier", isFinance: true },
  { slug: "finances-de-projet", name: "Finances de projet", isFinance: false },
  { slug: "leadership", name: "Leadership", isFinance: false },
];

/** Métadonnées des 6 articles de départ (le texte intégral arrive en phase 5). */
export const articles: ArticleMeta[] = [
  {
    slug: "investir-en-bourse-les-bases",
    title: "Investir en bourse : les bases, sans jargon",
    excerpt: "Action, indice, ETF, horizon, frais, enveloppes : comprendre la bourse comme un système, et simuler un investissement programmé.",
    category: "bourse",
    readingMinutes: 7,
    publishedAt: "2026-11-19",
    cover: "growth",
  },
  {
    slug: "investissement-locatif-calculer-la-rentabilite",
    title: "Investissement locatif : calculer la vraie rentabilité",
    excerpt: "Rendement brut, rendement net, cash-flow, risques : la méthode pour juger un bien comme un projet, avec simulateur.",
    category: "immobilier",
    readingMinutes: 7,
    publishedAt: "2026-11-19",
    cover: "budget",
  },
  {
    slug: "comment-fonctionne-l-impot-sur-le-revenu",
    title: "Comment fonctionne l’impôt sur le revenu en France",
    excerpt:
      "Tranches, quotient familial, décote, taux marginal et taux moyen, prélèvement à la source : le mécanisme complet, démontré pas à pas, avec simulateur.",
    category: "impots",
    readingMinutes: 10,
    publishedAt: "2026-11-18",
    cover: "tax",
  },
  {
    slug: "les-interets-composes",
    title: "Les intérêts composés : le moteur lent qui change tout",
    excerpt: "Pourquoi le temps compte plus que le montant, la règle de 72, et un simulateur pour le voir de vos yeux.",
    category: "budget-epargne",
    readingMinutes: 6,
    publishedAt: "2026-11-08",
    cover: "growth",
  },
  {
    slug: "comment-lire-sa-fiche-de-paie",
    title: "Comment lire sa fiche de paie, ligne par ligne",
    excerpt:
      "Brut, cotisations, CSG, net imposable, montant net social : chaque bloc de votre bulletin expliqué simplement, avec un schéma interactif.",
    category: "fiche-de-paie",
    readingMinutes: 9,
    publishedAt: "2026-11-17",
    cover: "payslip",
  },
  {
    slug: "la-valeur-acquise-evm-expliquee-simplement",
    title: "La valeur acquise (EVM) expliquée simplement",
    excerpt:
      "VP, VA, CR, SPI, CPI : l’outil le plus redouté du PMP®, démontré sur un exemple chiffré et un mini-calculateur.",
    category: "finances-de-projet",
    readingMinutes: 8,
    publishedAt: "2026-11-12",
    cover: "curve",
  },
  {
    slug: "reussir-le-pmp-les-7-erreurs",
    title: "Réussir le PMP® : les 7 erreurs qui font échouer à l’examen",
    excerpt:
      "Ce que j’observe, cohorte après cohorte, chez les candidats qui échouent — et comment les éviter dès le premier jour de révision.",
    category: "pmp",
    readingMinutes: 7,
    publishedAt: "2026-11-05",
    cover: "exam",
  },
  {
    slug: "gerer-son-budget-comme-un-projet",
    title: "Gérer son budget personnel comme un projet",
    excerpt: "Charte, périmètre, planning, risques, revue mensuelle : la méthode projet appliquée à votre argent.",
    category: "budget-epargne",
    readingMinutes: 8,
    publishedAt: "2026-10-29",
    cover: "budget",
  },
  {
    slug: "le-fonds-d-urgence",
    title: "Le fonds d’urgence : votre plan de gestion des risques personnel",
    excerpt: "Combien mettre de côté, où le placer, comment le constituer sans vous priver : la réserve qui change tout.",
    category: "budget-epargne",
    readingMinutes: 7,
    publishedAt: "2026-10-22",
    cover: "shield",
  },
  {
    slug: "brut-net-net-imposable",
    title: "Brut, net, net imposable : enfin clair",
    excerpt: "Trois montants, trois usages. Pourquoi votre net imposable est supérieur à votre net, et lequel déclarer où.",
    category: "fiche-de-paie",
    readingMinutes: 6,
    publishedAt: "2026-10-15",
    cover: "net",
  },
];

export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
