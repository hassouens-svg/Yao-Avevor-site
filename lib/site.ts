/**
 * Configuration du site. Provisoire : à la phase 4 ces valeurs viennent de la table `settings` (Supabase).
 */
export const site = {
  name: "Yao AVEVOR",
  fullName: "Yao AVEVOR, Ph.D, PMP®",
  tagline: "Piloter l’innovation. Transmettre la méthode.",
  description:
    "Docteur-ingénieur, responsable R&D chez Verallia et formateur PMP® agréé PMI ATP. Gestion de projet, innovation industrielle, formation et outils pratiques.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "aveveyao@yahoo.com",
  linkedin: "https://www.linkedin.com/in/yao-avevor/",
  location: "Chalon-sur-Saône, France",
} as const;

export const mainNav = [
  { href: "/a-propos", label: "À propos" },
  { href: "/formations", label: "Formations" },
  { href: "/articles", label: "Articles" },
  { href: "/outils", label: "Simulateurs" },
  { href: "/livre", label: "Le livre" },
] as const;

export const footerNav = {
  explorer: [
    { href: "/a-propos", label: "À propos" },
    { href: "/articles", label: "Articles" },
    { href: "/livre", label: "Le livre" },
    { href: "/formations", label: "Formations & coaching" },
    { href: "/outils", label: "Simulateurs" },
    { href: "/ressources", label: "Ressources" },
    { href: "/temoignages", label: "Témoignages" },
  ],
  legal: [
    { href: "/contact", label: "Contact" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
} as const;
