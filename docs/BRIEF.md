# PROMPT CLAUDE CODE — Site portfolio premium de Yao AVEVOR, Ph.D, PMP®

> À coller tel quel dans Claude Code, à la racine d'un dossier vide.
> Avant de lancer : place dans le dossier `/_sources/` :
> - `yao-portrait.jpg` (sa photo en costume bleu marine)
> - `banniere.png` (sa bannière « Gestion de Projets industriels »)
> - `linkedin.pdf` (sur LinkedIn : son profil → « Plus » → « Enregistrer au format PDF ») — **indispensable** pour récupérer son parcours exact
> - `/logos/` : les logos officiels des entreprises (voir section 7)

---

## 0. TON RÔLE

Tu es un **développeur front-end senior avec 20 ans d'expérience**, directeur artistique et expert UX/UI, spécialisé dans les sites de personnalités premium (auteurs, conférenciers, experts finance). Tu livres un niveau Awwwards : typographie soignée, rythme vertical parfait, micro-interactions subtiles, performance irréprochable. Tu ne fais **jamais** de rendu "template générique". Chaque section doit avoir une intention.

Avant d'écrire une seule ligne de code :
1. Charge et applique le skill **frontend-design** (s'il n'est pas installé : `/plugin install frontend-design@claude-plugins-official`). Si le skill communautaire **ui-ux-pro-max** est disponible, utilise-le aussi pour la palette, la typo et les patterns UX.
2. Lis tout le dossier `/_sources/` (photo, bannière, PDF LinkedIn, logos).
3. Rédige un **PLAN.md** (architecture, design system, liste des pages, schéma BDD, phases) et montre-le-moi avant de coder.
4. Travaille ensuite **phase par phase** (section 12), en vérifiant visuellement chaque phase avec Playwright (captures desktop 1440px + mobile 390px) et en corrigeant ce qui n'est pas au niveau.

---

## 1. LA PERSONNE — Yao AVEVOR, Ph.D, PMP®

**Ce qui est confirmé publiquement** (à compléter/corriger avec `linkedin.pdf`) :
- Titre LinkedIn : *Chef de projet R&D Industrie · Ingénieur mécanique · Formateur PMI ATP*
- Docteur (Ph.D), certifié **PMP®** (Project Management Professional, PMI)
- Basé à **Chalon-sur-Saône** (Bourgogne-Franche-Comté)
- Industrie : **Verallia** (leader européen de l'emballage en verre) — a été Ingénieur R&D Modélisation chez Verallia Packaging, aujourd'hui Chef de projet R&D industrie
- **Formateur et coach PMP®** chez **Woloyem Consulting / Woloyem Academy** (www.woloyem.com) — organisme **PMI Premier Authorized Training Partner** (bootcamps PMP®, PRINCE2®, ITIL® ; implantations Prague, Abidjan, Paris). Il anime notamment des bootcamps PMP® (cohortes Afrique, Europe, Canada) et ses apprenants le remercient publiquement après leur réussite.
- Email de contact (bannière) : **aveveyao@yahoo.com**
- LinkedIn : https://www.linkedin.com/in/yao-avevor/

**Son positionnement sur le site** (à rendre évident en 5 secondes) :
> L'ingénieur-docteur qui applique la rigueur de la gestion de projet industrielle… à vos projets **et** à votre argent.

Trois piliers :
1. **Gestion de projet** — PMP®, méthodes prédictives/agiles/hybrides, pilotage R&D industriel, PMO
2. **Finances personnelles** — lire sa fiche de paie, budget, épargne, fonds d'urgence, comprendre ses impôts, investir intelligemment (pédagogie, jamais de conseil en investissement personnalisé)
3. **Finances de projet** — budget projet, coûts, valeur acquise (EVM), ROI, business case

Il **écrit un livre sur la gestion de projet** (titre provisoire à définir — mets `[TITRE DU LIVRE]` modifiable dans l'admin) et publie des **articles**.

⚠️ **Règle absolue sur les données** : tout ce qui n'est pas vérifiable dans `/_sources/` (dates, diplômes, université du doctorat, chiffres type « +500 personnes formées », taux de réussite) doit être marqué `[À CONFIRMER]` dans le seed et listé dans un fichier `A_VERIFIER.md`. **N'invente aucun chiffre, aucun témoignage, aucune citation.** Tout est modifiable depuis l'admin.

---

## 2. STACK TECHNIQUE

- **Next.js 15** (App Router, Server Components, Server Actions) + **TypeScript strict**
- **Tailwind CSS v4** + **shadcn/ui** (composants admin) — design public 100 % sur-mesure
- **Motion** (ex-Framer Motion) pour les transitions de composants
- **GSAP + ScrollTrigger + SplitText** pour les animations au scroll (GSAP est gratuit, plugins inclus)
- **Lenis** pour le smooth scroll
- **Supabase** : Postgres, Auth (admin), Storage (images, PDF, vidéos), RLS activée partout
- **TipTap** : éditeur riche des articles (titres, images, citations, encadrés, tableaux, embed YouTube)
- **Resend** + React Email : emails de contact, double opt-in newsletter, campagnes (« le livre est disponible ! »)
- **Zod** + React Hook Form pour toutes les validations
- **next/image**, **next/font**, sitemap, robots, Open Graph dynamique (`@vercel/og`)
- Analytics sans cookies : **Plausible** ou **Umami**
- Déploiement : **Vercel**
- Fichier `.env.example` complet + `README.md` d'installation pas-à-pas (pour un non-développeur)

---

## 3. DIRECTION ARTISTIQUE

**Références** : https://nicolelapin.com (structure d'un site d'expert finance/auteur : hero fort, bandeau « vu dans », chiffres, bibliothèque de livres, lexique interactif, témoignages, newsletter « Stay close ») — mais en plus sobre, plus éditorial, plus « cabinet de conseil haut de gamme ». Inspirations complémentaires : sites de McKinsey Insights, Stripe Press, Linear (rigueur), Monocle (éditorial).

**Palette** (sobre, premium, contrastes AA minimum) :
| Rôle | Couleur |
|---|---|
| Encre / noir | `#0A0E17` |
| Bleu marine principal | `#0B1F3A` |
| Bleu marine profond (fonds sombres) | `#071528` |
| Bleu ciel (accent, liens, détails) | `#8CC8F0` |
| Bleu ciel clair (fonds doux) | `#EAF5FD` |
| Blanc | `#FFFFFF` |
| Blanc cassé (sections alternées) | `#F6F7F9` |
| Gris texte secondaire | `#5B6474` |
| Filets / bordures | `#E3E7ED` |

Pas d'orange, pas de jaune, pas de dégradés flashy. Le bleu ciel est **un accent rare** (soulignés, puces, chiffres clés, curseur), jamais un fond massif.

**Typographie** :
- Titres : **Fraunces** (serif variable élégante, optical size, italique pour les mots-clés : « Piloter vos *projets*. Maîtriser votre *argent*. »)
- Texte & UI : **Inter** (ou Geist)
- Chiffres/données : Inter avec `font-variant-numeric: tabular-nums`
- Échelle typographique fluide (`clamp()`), titres hero 72–120px desktop, interlignage serré sur les titres, généreux sur le texte (1.65)
- Petits labels en capitales espacées (`letter-spacing: 0.14em`) au-dessus des titres de section : « 01 — EXPERTISE »

**Mise en page** : grille 12 colonnes, beaucoup d'espace blanc, alternance sections claires / sections bleu marine profond, numérotation éditoriale des sections (01, 02, 03…), filets fins, coins légèrement arrondis (8–16px), ombres très douces.

**Visuels** :
- **Photo** : à partir de `yao-portrait.jpg`, génère (avec `rembg` ou équivalent en script Python) une **version détourée** pour le hero, posée sur un fond bleu marine avec un halo bleu ciel très diffus. Garde aussi la version originale pour la section « À propos ». Optimise en AVIF/WebP.
- **Bannière** : ne pas l'utiliser telle quelle (style Canva trop chargé). En extraire l'email et l'idée des 4 mots-clés **Conception · Management · Pilotage · Innovation**, qu'on retranscrit en version premium (icônes ligne fines Lucide, animées).
- **Images d'illustration** : photos libres de droits haut de gamme (Unsplash/Pexels : industrie, usine verrière, salles de formation, bureaux, carnets, calculs) avec un **traitement colorimétrique unifié** (léger duotone bleu marine). Les télécharger dans `/public/images/` et les créditer dans `CREDITS.md`.
- **Icônes** : Lucide, trait 1.5px, jamais d'emoji.
- **Couverture du livre** : crée une maquette 3D de couverture provisoire (CSS 3D : tranche, ombre, reflet) en bleu marine, titre en Fraunces — remplaçable par la vraie couverture depuis l'admin.

---

## 4. ANIMATIONS (niveau « dev senior », jamais gadget)

Principe : **chaque animation sert la lecture**. Durées 400–900ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`. Respect total de `prefers-reduced-motion` (tout se désactive proprement).

- **Préloader** court (< 1,2s, uniquement à la première visite) : monogramme « YA » qui se dessine en trait, puis rideau bleu marine qui se lève
- **Smooth scroll** Lenis
- **Titres** : révélation ligne par ligne / mot par mot (SplitText + masque), une seule fois
- **Hero** : portrait détouré en léger parallaxe, halo bleu ciel qui suit doucement la souris, mots-clés italiques qui s'écrivent
- **Bandeau logos** (entreprises / certifications) en **marquee infini** lent, logos en niveaux de gris → couleur au survol
- **Compteurs** de chiffres clés animés au scroll (uniquement avec des chiffres confirmés)
- **Parcours** : timeline verticale dont la ligne se **dessine au scroll**, les étapes apparaissent avec leur logo
- **Expertises** : cartes en **stacking sticky** (elles s'empilent au scroll)
- **Livre** : couverture 3D qui pivote selon la souris (tilt), reflet lumineux qui balaie
- **Articles** : cartes avec zoom image subtil + soulignement animé du titre au survol
- **Boutons** : effet **magnétique** léger sur les CTA principaux, flèche qui glisse
- **Curseur personnalisé** discret (desktop uniquement) : point bleu ciel qui grossit sur les éléments cliquables
- **Transitions de pages** : fondu + léger slide (View Transitions API si dispo, sinon Motion)
- **Barre de progression de lecture** fine bleu ciel en haut des articles
- **Navigation** : header transparent sur le hero, puis fond blanc flouté (`backdrop-blur`) qui se rétracte au scroll vers le bas et réapparaît vers le haut

Performance : Lighthouse ≥ 95 sur les 4 critères, LCP < 2,5s, CLS < 0,05. Les animations GSAP sont chargées en dynamique côté client uniquement.

---

## 5. ARBORESCENCE DU SITE PUBLIC

### `/` — Accueil (one-page éditorial)
1. **Hero** — label « Ph.D · PMP® · Formateur PMI ATP » ; titre « Piloter vos *projets*. Maîtriser votre *argent*. » ; sous-titre en 2 lignes sur son approche ; CTA « Découvrir mes articles » + « Me contacter » ; portrait détouré ; indicateur de scroll
2. **Bandeau confiance** « Ils m'ont fait confiance / Parcours » — marquee des logos (Verallia, Woloyem, PMI — Authorized Training Partner, établissement du doctorat, etc.)
3. **Chiffres clés** — 4 compteurs (ex. années d'expérience, personnes formées au PMP®, cohortes, articles) → **tous `[À CONFIRMER]`**, masqués s'ils sont vides
4. **01 — Approche** : courte bio + les 4 mots-clés Conception · Management · Pilotage · Innovation
5. **02 — Expertises** : 3 piliers (Gestion de projet / Finances personnelles / Finances de projet) en cartes sticky, chacune avec « Ce que j'enseigne » + lien vers les articles filtrés
6. **03 — Le livre** : couverture 3D, pitch, statut « Bientôt disponible », **extraits du livre** (carrousel de citations/extraits), formulaire « Soyez prévenu(e) à la sortie » (email + prénom → segment newsletter `livre`)
7. **04 — Lexique interactif** (inspiré du « translator » de Nicole Lapin) : « La fiche de paie en clair » — carrousel numéroté « 01 / 12 » : on clique un terme (Brut, Net à payer, Net imposable, Net social, CSG/CRDS, Prélèvement à la source, Cotisations patronales…) et la définition simple s'affiche ; lien vers l'article complet
8. **05 — Articles récents** : 3 derniers articles en vedette + filtres par catégorie
9. **06 — Formations & coaching** : préparation PMP® (avec Woloyem Academy), coaching individuel, interventions en entreprise, conférences → CTA « Demander un programme »
10. **07 — Témoignages** : carrousel de recommandations LinkedIn (texte, nom, poste, photo, lien vers le profil) + témoignages **vidéo** (lecteur custom, vignette, play animé)
11. **08 — Galerie** : photos de formations, conférences, bootcamps (grille masonry + lightbox)
12. **Newsletter** « Restons en contact » : bloc bleu marine profond, double opt-in, choix des centres d'intérêt (Gestion de projet / Finances perso / Le livre)
13. **Contact** : formulaire + email + LinkedIn
14. **Footer** : navigation, réseaux, newsletter mini, mentions légales, politique de confidentialité, « © Yao AVEVOR »

### Autres pages
- `/a-propos` — biographie longue, parcours en timeline (formation, doctorat, Verallia, Woloyem), certifications, valeurs, photo originale
- `/articles` — liste avec recherche, filtres par catégorie et tags, pagination
- `/articles/[slug]` — article premium : temps de lecture, sommaire sticky auto-généré, encadrés « À retenir », barre de progression, partage LinkedIn/WhatsApp/copie de lien, auteur en bas, articles liés, CTA newsletter
- `/livre` — page dédiée : pitch, sommaire, extraits, à qui il s'adresse, liste d'attente, puis liens d'achat quand disponible
- `/formations` — offres de formation et coaching
- `/ressources` — lexique complet fiche de paie + futurs outils/PDF téléchargeables (lead magnets contre email)
- `/temoignages` — tous les témoignages
- `/contact` — formulaire avec motif (Formation PMP®, Coaching, Conférence, Presse, Autre)
- `/mentions-legales`, `/confidentialite`
- `404` soignée (« Ce livrable n'est pas dans le périmètre du projet » + retour accueil)

---

## 6. BACK-OFFICE `/admin` — il gère TOUT lui-même

Accès : Supabase Auth (lien magique par email + mot de passe), rôle `admin` unique, toutes les routes `/admin` protégées par middleware + RLS. Interface shadcn/ui sobre, en français, utilisable par un non-technicien, prévisualisation avant publication.

Modules :
1. **Tableau de bord** — nb d'abonnés (total / segment livre), derniers messages, articles publiés/brouillons, raccourcis
2. **Contenus des sections** — chaque section de l'accueil et des pages est éditable (titres, textes, boutons, images, ordre, afficher/masquer). Stocker en tables typées ou en JSON validé par Zod par section.
3. **Articles** — éditeur TipTap complet, image de couverture, catégorie, tags, extrait, SEO (title, description, image OG), statut brouillon/publié/programmé, date, slug auto
4. **Catégories** — Gestion de projet, PMP®, Finances personnelles, Fiche de paie & salaire, Budget & épargne, Finances de projet, Leadership
5. **Livre** — titre, sous-titre, couverture, pitch, sommaire, **extraits** (ajout/suppression/ordre), statut (`en écriture` / `précommande` / `disponible`), liens d'achat, bouton **« Prévenir les inscrits »** qui envoie la campagne au segment `livre`
6. **Lexique** — termes + définitions (alimente le carrousel et `/ressources`)
7. **Témoignages** — texte, nom, poste, entreprise, photo, URL LinkedIn, vidéo (upload ou YouTube/Vimeo), mise en avant, ordre
8. **Médias** — bibliothèque (upload drag & drop, compression auto, texte alternatif obligatoire), galerie publique
9. **Parcours & logos** — expériences, formations, certifications, logos (SVG/PNG), ordre de la timeline et du marquee
10. **Formations** — offres, descriptions, CTA
11. **Newsletter** — liste des abonnés (segments, date, statut confirmé), export CSV, désinscription, **rédaction et envoi de campagnes** (éditeur + aperçu + envoi test + envoi au segment) via Resend
12. **Messages** — boîte de réception des formulaires de contact, statut lu/traité, réponse par email
13. **Paramètres** — SEO global, réseaux sociaux, email de contact, image OG par défaut, mentions légales

---

## 7. LOGOS DES ENTREPRISES

- Utilise **les logos officiels** fournis dans `/_sources/logos/`. S'ils manquent, récupère-les depuis les pages presse/media kit officielles des entreprises (Verallia, Woloyem) et en SVG si possible ; sinon liste-les dans `A_VERIFIER.md` et affiche un placeholder typographique propre.
- Affichage uniforme : hauteur fixe, niveaux de gris par défaut, couleur au survol.
- Les marques PMI/PMP® : utiliser le badge **PMI Authorized Training Partner** et le symbole ® uniquement selon les règles d'usage de PMI (le signaler dans `A_VERIFIER.md`).

---

## 8. CONTENU DE DÉPART À INJECTER (seed)

Rédige en **français**, ton : expert, clair, chaleureux, pédagogique, phrases courtes, exemples concrets. Contenu réel et utile, pas de lorem ipsum.

**6 articles complets** (1 200–1 800 mots chacun, avec intertitres, encadrés « À retenir », exemple chiffré) :
1. *Comment lire sa fiche de paie, ligne par ligne* — brut, cotisations salariales et patronales, CSG/CRDS, net à payer avant impôt, prélèvement à la source, net imposable, **montant net social**, congés payés. Ajoute un **schéma interactif d'une fiche de paie fictive** où l'on survole chaque bloc pour l'expliquer. (Préciser que les taux sont indicatifs et à vérifier sur service-public.fr / URSSAF.)
2. *Brut, net, net imposable : enfin clair*
3. *Gérer son budget personnel comme un projet* — charte, périmètre, planning, risques, revue mensuelle
4. *Le fonds d'urgence : votre plan de gestion des risques personnel*
5. *Réussir le PMP® : les 7 erreurs qui font échouer à l'examen*
6. *La valeur acquise (EVM) expliquée simplement* — VP, VA, CR, SPI, CPI avec un exemple chiffré et un mini-calculateur interactif

**Lexique fiche de paie** : 12 termes avec définitions simples.

**Livre** : titre `[TITRE DU LIVRE]`, pitch provisoire (« un guide pratique de gestion de projet, de la théorie PMBOK® à la réalité du terrain industriel »), 3 extraits provisoires clairement marqués `[EXTRAIT PROVISOIRE]`.

**Témoignages** : **n'invente rien.** Crée 3 emplacements vides `[À REMPLIR DEPUIS LINKEDIN]` avec la structure complète. Les recommandations reçues sur LinkedIn (section « Recommandations » de `linkedin.pdf`) peuvent être importées **après accord de leurs auteurs**.

**Bio** : à partir de `linkedin.pdf` ; sinon, version courte basée sur la section 1 avec `[À CONFIRMER]`.

Ajoute sur chaque article finance le bandeau : « Contenu pédagogique — ne constitue pas un conseil financier ou fiscal personnalisé. »

---

## 9. SEO, ACCESSIBILITÉ, CONFORMITÉ

- Métadonnées par page, Open Graph dynamique (titre + portrait sur fond marine), JSON-LD (`Person`, `Article`, `Book`, `Course`), sitemap, robots, URLs propres en français
- HTML sémantique, contrastes AA, navigation clavier complète, focus visibles, `alt` obligatoires, ARIA sur carrousels et lightbox
- **RGPD** : double opt-in newsletter, lien de désinscription dans chaque email, case de consentement sur les formulaires, politique de confidentialité, pas de cookies non essentiels (analytics sans cookies → pas de bannière lourde)
- Anti-spam : honeypot + rate limiting sur les formulaires (et Cloudflare Turnstile en option)

---

## 10. QUALITÉ DU CODE

- Architecture claire : `app/(public)`, `app/admin`, `components/ui`, `components/sections`, `lib/supabase`, `lib/validations`, `emails/`
- Migrations SQL Supabase versionnées dans `supabase/migrations/` + script de seed
- Composants réutilisables, aucune donnée en dur dans les composants publics : tout vient de la BDD
- ESLint + Prettier, zéro erreur TypeScript, build Vercel qui passe
- Responsive parfait : 360px → 1920px ; menu mobile plein écran animé

---

## 11. CRITÈRES D'ACCEPTATION (à vérifier toi-même avant de dire « terminé »)

- [ ] Le hero donne une impression « premium » immédiate sur desktop ET mobile (captures Playwright à l'appui)
- [ ] Toutes les animations listées fonctionnent et se désactivent avec `prefers-reduced-motion`
- [ ] Lighthouse ≥ 95 (performance, accessibilité, bonnes pratiques, SEO) sur l'accueil et un article
- [ ] Depuis `/admin`, je peux : modifier un texte du hero, publier un article avec image, ajouter un extrait du livre, ajouter un témoignage vidéo, envoyer une campagne test → et voir le résultat en ligne
- [ ] Inscription newsletter → email de confirmation → abonné confirmé visible dans l'admin
- [ ] Formulaire de contact → email reçu + message visible dans l'admin
- [ ] Aucun chiffre ni témoignage inventé ; `A_VERIFIER.md` liste tout ce qui doit être validé par Yao
- [ ] README permettant de déployer sur Vercel + Supabase + Resend en suivant les étapes

---

## 12. PHASES DE TRAVAIL

1. **Plan** : PLAN.md + design system (tokens couleurs, typo, espacements, composants) → attends ma validation
2. **Fondations** : projet Next.js, Tailwind, polices, Lenis, layout, header/footer, page de style (`/styleguide`) montrant tous les composants
3. **Accueil statique** : toutes les sections avec contenu seed, animations incluses → captures et auto-critique
4. **Supabase** : schéma, RLS, migrations, seed, branchement des sections sur la BDD
5. **Pages secondaires** : articles, article, livre, à propos, formations, ressources, témoignages, contact, légales, 404
6. **Admin** complet (section 6)
7. **Emails & newsletter** (Resend, double opt-in, campagnes, notification livre)
8. **SEO, accessibilité, performance** → audit Lighthouse et corrections
9. **Revue finale** : passe de polish « œil de directeur artistique » (alignements, rythme, cohérence des animations), checklist section 11, README, A_VERIFIER.md

À la fin de chaque phase : résume ce qui est fait, montre les captures, liste ce qui reste.
