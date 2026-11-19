/**
 * Configuration du site. Provisoire : à la phase 4 ces valeurs viennent de la table `settings` (Supabase).
 */
export const site = {
  name: "Yao AVEVOR",
  fullName: "Yao AVEVOR, Ph.D, PMP®",
  tagline: "Piloter vos projets. Maîtriser votre argent.",
  description:
    "Docteur-ingénieur, responsable R&D industriel et formateur PMP® agréé PMI ATP. Gestion de projet, finances personnelles et finances de projet, expliquées avec rigueur et simplicité.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "aveveyao@yahoo.com",
  linkedin: "https://www.linkedin.com/in/yao-avevor/",
  location: "Chalon-sur-Saône, France",
} as const;

export const mainNav = [
  { href: "/a-propos", label: "À propos" },
  { href: "/articles", label: "Articles" },
  { href: "/livre", label: "Le livre" },
  { href: "/formations", label: "Formations" },
  { href: "/ressources", label: "Ressources" },
] as const;

export const footerNav = {
  explorer: [
    { href: "/a-propos", label: "À propos" },
    { href: "/articles", label: "Articles" },
    { href: "/livre", label: "Le livre" },
    { href: "/formations", label: "Formations & coaching" },
    { href: "/ressources", label: "Ressources" },
    { href: "/temoignages", label: "Témoignages" },
  ],
  legal: [
    { href: "/contact", label: "Contact" },
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/confidentialite", label: "Confidentialité" },
  ],
} as const;
