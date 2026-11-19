import type { GalleryItem, Testimonial } from "@/lib/content/types";

/**
 * Témoignages. Règle : rien d'inventé.
 * Les deux recommandations ci-dessous sont réelles (LinkedIn, voir _sources/linkedin.md) ; leurs auteurs ont
 * donné leur accord (confirmé par le client). Les témoignages vidéo seront ajoutés dès réception des fichiers.
 */
export const testimonials: Testimonial[] = [
  {
    quote: "Certifiée PMP® le 13 novembre 2026, accompagnée par Yao lors du bootcamp « Un coup KO ».",
    name: "Anouchka N’GORAN",
    role: "PMP® Certified — 13 novembre 2026",
    videoUrl: "/videos/anouchka-ngoran-pmp.mp4",
    poster: "/videos/anouchka-ngoran-pmp.jpg",
    featured: true,
    published: true,
  },
  {
    quote: "Certifié PMP® le 10 novembre 2026, accompagné par Yao lors du bootcamp « Un coup KO ».",
    name: "Merveil Daniel AGNANDJI",
    role: "PMP® Certified — 10 novembre 2026",
    videoUrl: "/videos/merveil-daniel-agnandji-pmp.mp4",
    poster: "/videos/merveil-daniel-agnandji-pmp.jpg",
    featured: true,
    published: true,
  },
  {
    quote:
      "Son expertise approfondie du management de projet, associée à une pédagogie exceptionnelle, crée un environnement d’apprentissage exigeant et motivant. Il ne se contente pas de transmettre des connaissances, il développe également la confiance, la discipline et l’état d’esprit nécessaires à la réussite.",
    name: "Alpha Amadou Diallo",
    role: "PMP® · CAPM® — Telecom & Core Network Transformation Leader",
    linkedin: "https://www.linkedin.com/in/alphaamadoudiallo/",
    featured: true,
    published: true, // accord confirmé par le client (19/11/2026)
  },
  {
    quote:
      "Yao ne se contente pas de transmettre des connaissances. Il pousse à comprendre la logique du management de projet, à raisonner, à questionner ses certitudes et surtout à adopter le bon état d’esprit face aux situations complexes. […] Après plusieurs semaines de préparation intense, j’ai obtenu ma certification PMP®, du premier coup et Yao a incontestablement contribué à cette réussite.",
    name: "Lyliane Sossou",
    role: "PMP® — Directrice commerciale, banque · finance · assurance",
    linkedin: "https://www.linkedin.com/in/lylianesossou/",
    featured: true,
    published: true, // accord confirmé par le client (19/11/2026)
  },
  {
    quote: "[À REMPLIR DEPUIS LINKEDIN]",
    name: "[À REMPLIR DEPUIS LINKEDIN]",
    role: "[Poste — entreprise]",
    published: false,
    note: "Emplacement vide",
  },
];

/** Galerie : photos de formations, conférences, bootcamps — à fournir (masquée tant qu'elle est vide). */
export const gallery: GalleryItem[] = [];
