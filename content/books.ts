import type { Book } from "@/lib/content/types";

/** Livres (plusieurs possibles). Phase Appwrite : collection `books`, éditable dans l'admin. */
export const books: Book[] = [
  {
    slug: "guide-gestion-de-projet",
    title: "[TITRE DU LIVRE]",
    subtitle: "Un guide pratique de gestion de projet",
    status: "writing",
    statusLabel: "En cours d’écriture",
    color: "#0B1F3A",
    pitch:
      "De la théorie PMBOK® à la réalité du terrain industriel : des méthodes éprouvées, des cas concrets, et tout ce que l’on n’apprend pas dans les manuels.",
    excerpts: [
      { title: "[EXTRAIT PROVISOIRE]", body: "Un planning n’est pas une promesse faite au sponsor : c’est une hypothèse de travail. Sa valeur tient à la vitesse à laquelle il vous signale qu’elle a cessé d’être vraie." },
      { title: "[EXTRAIT PROVISOIRE]", body: "Dans une usine, un retard ne se discute pas en réunion : il se voit sur la ligne. La gestion de projet n’est pas une affaire de documents, mais de décisions prises à temps." },
      { title: "[EXTRAIT PROVISOIRE]", body: "Le risque le plus dangereux d’un projet est rarement technique. C’est celui que tout le monde voit, mais que personne n’ose inscrire dans le registre." },
    ],
    buyLinks: [],
  },
];
