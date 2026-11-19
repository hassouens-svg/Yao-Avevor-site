/**
 * Contenu de départ de l'accueil (seed) — migrera vers Supabase en phase 4 et deviendra éditable dans l'admin.
 * Règle : rien d'inventé. Les faits viennent de _sources/linkedin.md et de woloyem.com.
 */
import type { HomeContent } from "@/lib/content/types";

export const home: HomeContent = {
  hero: {
    label: "Docteur-ingénieur · PMP® · Formateur PMI ATP",
    line1: "Gestion de projets",
    line2: "industriels.",
    keywords: ["Conception", "Management", "Pilotage", "Innovation"],
    subtitle:
      "Responsable R&D avec 9 ans d’expérience en environnement industriel, je pilote des activités de développement à l’interface entre simulation numérique, innovation produit et performance des procédés.",
    primaryCta: { label: "Me contacter", href: "/contact" },
    secondaryCta: { label: "Préparer le PMP®", href: "/formations" },
    portraitAlt: "Yao AVEVOR, bras croisés, en costume bleu marine",
  },

  trust: {
    label: "Parcours",
    logos: [
      { name: "Verallia", src: "/logos/verallia.png", width: 594, height: 185, href: "https://www.verallia.com" },
      { name: "Woloyem Consulting", src: "/logos/woloyem.png", width: 1076, height: 231, href: "https://www.woloyem.com" },
      { name: "Capgemini Engineering", src: "/logos/capgemini.svg", width: 162, height: 38, href: "https://www.capgemini.com" },
      { name: "Université de Lorraine", src: "/logos/universite-de-lorraine.svg", width: 322, height: 112, href: "https://www.univ-lorraine.fr" },
      { name: "CNRS", src: "/logos/cnrs.svg", width: 55, height: 55, href: "https://www.cnrs.fr" },
      { name: "PMP® — Project Management Professional", src: "/logos/pmp-woloyem.png", width: 340, height: 340 },
    ],
  },

  profile: {
    label: "Profil",
    title: "Technique et business, R&D et terrain.",
    email: "aveveyao@yahoo.com",
    paragraphs: [
      "Responsable R&D avec 9 ans d’expérience en environnement industriel, je pilote des activités de développement à l’interface entre simulation numérique, innovation produit et performance des procédés.",
      "Docteur-Ingénieur en mécanique et matériaux et certifié PMP, je combine expertise technique, pilotage de projets complexes et management d’équipe dans des contextes industriels exigeants.",
      "J’encadre des ingénieurs et structure les activités R&D avec un objectif clair : transformer des problématiques techniques en solutions robustes, industrialisables et créatrices de valeur (qualité, coûts, performance).",
      "Mon positionnement est à l’interface entre technique et business, avec une forte capacité à connecter les enjeux R&D aux besoins opérationnels et industriels.",
      "En parallèle de mes activités industrielles, j’interviens comme formateur ATP du PMI chez Woloyem Consulting. J’accompagne des professionnels dans le développement de leurs compétences en gestion de projet, l’appropriation des standards internationaux du PMI et la préparation à la certification PMP®, à travers des formations alliant théorie, études de cas et mises en situation.",
      "Restons connectés pour échanger sur des projets industriels innovants et enrichissants !",
    ],
  },

  stats: [
    { value: 9, suffix: " ans", label: "En environnement industriel", source: "LinkedIn — Infos" },
    { value: 6, suffix: "", label: "Pays équipés de ses outils de simulation", source: "LinkedIn — Verallia" },
    { value: 12, suffix: "", label: "Ingénieurs pilotés sur un projet Airbus A320", source: "LinkedIn — Capgemini" },
    { value: 15, suffix: "", label: "Certifications & licences", source: "LinkedIn — Certifications" },
  ],

  bento: {
    label: "Parcours",
    title: "Du laboratoire à l’usine.",
    text: "Une thèse sur l’usinage, l’aéronautique, puis l’industrie verrière. Partout, la même mission : rendre le complexe pilotable.",
    items: [
      { kind: "photo", src: "/images/portrait-2-cutout.png", alt: "Yao AVEVOR en veste grise, bras croisés", caption: "Formateur PMP® — Woloyem", span: "tall" },
      {
        kind: "role",
        years: "Depuis 2025",
        org: "Verallia",
        title: "Responsable R&D Process – Produit",
        text: "Pilotage d’une activité R&D, management d’ingénieurs, optimisation et allègement des emballages en verre.",
        logo: "/logos/verallia.png",
        span: "wide",
        tone: "blue",
      },
      { kind: "figure", value: "6", label: "pays : France, Espagne, Italie, Allemagne, Brésil, Argentine", tone: "navy" },
      {
        kind: "role",
        years: "2020 – 2024",
        org: "Verallia",
        title: "Chef de projet R&D",
        text: "Simulation de la résistance mécanique, machine learning, déploiement des outils dans les bureaux d’étude du groupe.",
        tone: "sky",
      },
      {
        kind: "role",
        years: "Depuis 2024",
        org: "Woloyem",
        title: "Formateur PMP® · PMI ATP",
        text: "Bootcamps de préparation à la certification PMP®, en français.",
        logo: "/logos/woloyem.png",
        tone: "teal",
      },
      {
        kind: "role",
        years: "2017 – 2018",
        org: "Capgemini Engineering",
        title: "Chef de projet innovation",
        text: "Optimisation de la structure des cabines de l’Airbus A320 — équipe de 12 ingénieurs.",
        logo: "/logos/capgemini.svg",
        span: "wide",
        tone: "blue",
      },
      { kind: "figure", value: "Ph.D", label: "Génie mécanique & matériaux — Université de Lorraine, LEM3 (CNRS)", tone: "sky" },
      {
        kind: "role",
        years: "2016 – 2017",
        org: "École des Mines de Nancy",
        title: "Enseignant-chercheur",
        text: "Mécanique des milieux continus, calcul de structures, éléments finis ; 6 projets de fin d’études encadrés.",
        tone: "navy",
      },
    ],
  },

  ticker: ["Gestion de projet", "PMP®", "R&D industrielle", "Innovation", "Simulation numérique", "Leadership", "Valeur acquise", "Formation", "Finances de projet"],

  expertises: {
    label: "Expertises",
    title: "Quatre terrains, une même méthode.",
    intro: "Clarifier l’objectif, planifier, mesurer, ajuster. Que l’enjeu soit un programme R&D, un examen ou un budget.",
    items: [
      {
        number: "01",
        tag: "Méthode",
        title: "Gestion de projet",
        lead: "Du cadrage à la clôture : piloter en prédictif, en agile ou en hybride, et parler le langage du sponsor.",
        points: ["Cadrage, planning, chemin critique", "Gestion des risques", "Agile, prédictif, hybride", "Gouvernance & rôle du sponsor"],
        href: "/articles?categorie=gestion-de-projet",
        cta: "Articles gestion de projet",
        image: "/images/banner/conception.jpg",
        tone: "navy",
      },
      {
        number: "02",
        tag: "Terrain",
        title: "R&D & innovation industrielle",
        lead: "Transformer des problèmes techniques en solutions robustes, industrialisables et créatrices de valeur.",
        points: ["Simulation numérique & éléments finis", "Optimisation produit / procédé", "Machine learning appliqué", "Équipes R&D & transfert"],
        href: "/a-propos",
        cta: "Découvrir le parcours",
        image: "/images/banner/innovation.jpg",
        tone: "teal",
      },
      {
        number: "03",
        tag: "Transmission",
        title: "Formation & certification PMP®",
        lead: "Préparer la certification PMP® avec un formateur agréé PMI : théorie, études de cas, mises en situation.",
        points: ["Bootcamps PMP® en français", "Coaching individuel", "Ateliers en entreprise", "Méthode d’examen"],
        href: "/formations",
        cta: "Voir les formations",
        image: "/images/banner/management.jpg",
        tone: "blue",
      },
      {
        number: "04",
        tag: "Pédagogie",
        title: "Finances personnelles & de projet",
        lead: "Lire sa fiche de paie, comprendre l’impôt, piloter un budget de projet : des outils simples et des simulateurs.",
        points: ["Fiche de paie décryptée", "L’impôt sur le revenu expliqué", "Valeur acquise & ROI", "Simulateurs en ligne"],
        href: "/outils",
        cta: "Essayer les simulateurs",
        image: "/images/banner/pilotage.jpg",
        tone: "sky",
      },
    ],
  },

  translator: {
    label: "Le traducteur",
    title: "Un terme. Une phrase claire.",
    moreHref: "/ressources",
    terms: [
      { term: "Chemin critique", plain: "La suite de tâches qui fixe la date de fin du projet : si l’une d’elles glisse, tout le projet glisse.", example: "Commander un moule avant d’avoir validé le design : le chemin critique se lit à l’envers." },
      { term: "Valeur acquise", plain: "Ce que vaut, en budget, le travail réellement terminé. Elle permet de savoir si l’on est en avance, en retard, au-dessus ou en dessous du budget.", example: "50 % du travail fait sur un budget de 100 000 € = 50 000 € de valeur acquise." },
      { term: "SPI", plain: "L’indice de performance des délais : valeur acquise ÷ valeur planifiée. En dessous de 1, on est en retard.", example: "SPI = 0,9 : on avance à 90 % du rythme prévu." },
      { term: "CPI", plain: "L’indice de performance des coûts : valeur acquise ÷ coût réel. En dessous de 1, on dépense plus que prévu.", example: "CPI = 1,1 : chaque euro dépensé produit 1,10 € de travail." },
      { term: "Sponsor", plain: "La personne qui porte le projet au niveau de la direction : elle donne la direction, arbitre et débloque.", example: "Sans sponsor engagé, même un bon projet peut échouer." },
      { term: "Registre des risques", plain: "La liste vivante de ce qui pourrait mal tourner, avec probabilité, impact, responsable et réponse prévue.", example: "Le risque le plus dangereux est celui que personne n’ose y inscrire." },
      { term: "Intérêts composés", plain: "Les intérêts produisent à leur tour des intérêts. Avec le temps, la croissance s’accélère.", example: "1 000 € à 5 % par an deviennent environ 1 629 € en 10 ans." },
      { term: "Net imposable", plain: "Le montant de salaire retenu pour calculer votre impôt. Il est un peu supérieur à votre net, car il inclut une partie de la CSG.", example: "C’est lui, et non le net versé, qui sert au prélèvement à la source." },
    ],
  },

  tools: {
    label: "Simulateurs",
    title: "Calculez. Comprenez. Décidez.",
    text: "Des simulateurs gratuits, sans inscription, pour vos projets et vos finances.",
    chips: [
      { label: "Intérêts composés", href: "/outils#interets-composes" },
      { label: "Impôt sur le revenu", href: "/outils#impot" },
      { label: "Brut → net", href: "/outils#brut-net" },
      { label: "Valeur acquise (EVM)", href: "/outils#evm" },
      { label: "Fonds d’urgence", href: "/outils#fonds-urgence" },
      { label: "Budget 50/30/20", href: "/outils#budget" },
      { label: "Mensualité de crédit", href: "/outils#credit" },
    ],
  },

  articles: { label: "Le journal", title: "Derniers articles" },

  books: {
    label: "Livres",
    title: "Livres",
    intro: "Des guides pratiques, de la théorie à la réalité du terrain industriel.",
    waitlistTitle: "Soyez prévenu(e) des sorties",
    waitlistText: "Un email à chaque nouveau livre, et des extraits en avant-première.",
  },

  pmp: {
    badge: "Bootcamp PMP® · avec Woloyem, PMI ATP",
    title: "Décrochez le PMP® avec méthode.",
    text: "Des bootcamps de préparation à la certification PMP® animés en français, au sein de Woloyem, partenaire de formation agréé du PMI. Théorie, études de cas, mises en situation : on apprend la logique du management de projet, pas seulement l’examen.",
    chips: [
      { value: "4 sem.", label: "Format soirée (FR)" },
      { value: "PMI ATP", label: "Partenaire agréé" },
      { value: "Live", label: "Sessions en direct, à distance" },
      { value: "FR", label: "Langue" },
    ],
    cta: { label: "Rejoindre la prochaine cohorte", href: "/contact?motif=formation" },
    note: "Inscriptions et tarifs : via Woloyem Academy.",
  },

  coaching: {
    label: "Accompagnement",
    title: "Un projet difficile ? Avançons ensemble.",
    text: "Pour les professionnels qui préparent un examen, prennent un poste de chef de projet ou pilotent un programme R&D sous tension.",
    options: [
      { title: "Coaching individuel", text: "Préparation PMP®, prise de poste, montée en compétences." },
      { title: "Équipes & entreprises", text: "Ateliers cadrage, risques, planning, valeur acquise." },
    ],
    cta: { label: "Prendre contact", href: "/contact?motif=coaching" },
  },

  speaking: {
    label: "Interventions",
    title: "Faites venir Yao.",
    text: "Un ingénieur qui rend la gestion de projet concrète, pour les entreprises, les écoles et les communautés professionnelles.",
    tabs: [
      { key: "conferences", title: "Conférences", text: "Des interventions claires et vivantes, adaptées à votre public.", points: ["Gestion de projet industrielle", "Innovation et R&D : du labo à l’usine", "Réussir sa certification PMP®"] },
      { key: "ateliers", title: "Ateliers", text: "Des ateliers pratiques pour équipes projet et R&D.", points: ["Cadrage et charte projet", "Risques et planning", "Pilotage par la valeur acquise"] },
      { key: "ecoles", title: "Écoles", text: "Pour écoles d’ingénieurs, universités et associations étudiantes.", points: ["Cours et masterclass", "Jurys et projets de fin d’études", "Orientation et métiers de la R&D"] },
      { key: "webinaires", title: "Webinaires", text: "Des formats courts, en ligne, pour vos communautés.", points: ["Choisir sa certification", "Préparer l’examen PMP®", "Questions-réponses en direct"] },
    ],
    cta: { label: "Vérifier les disponibilités", href: "/contact?motif=conference" },
  },

  testimonials: { label: "Témoignages", title: "Ils ont réussi. Ils en parlent." },

  newsletter: {
    label: "Restons en contact",
    title: "Une méthode claire, chaque mois.",
    text: "Articles, outils et coulisses de la gestion de projet. Et les sorties de livres en avant-première.",
    interests: [
      { value: "gestion-projet", label: "Gestion de projet" },
      { value: "finances-perso", label: "Finances perso" },
      { value: "livre", label: "Livres" },
    ],
  },

  contact: {
    label: "Contact",
    title: "Parlons de votre projet.",
    text: "Formation PMP®, coaching, conférence ou simple question : écrivez-moi, je réponds personnellement.",
    reasons: ["Formation PMP®", "Coaching", "Conférence", "Presse", "Autre"],
  },
};
