# PLAN — Site de Yao AVEVOR, Ph.D, PMP®

> Phase 1 du brief (`docs/BRIEF.md`). **Rien n'est codé tant que ce plan n'est pas validé.**
> Les points à trancher sont regroupés en fin de document (§ 9).

---

## 1. Intention

**Promesse lisible en 5 secondes :**
> L'ingénieur-docteur qui applique la rigueur de la gestion de projet industrielle… à vos projets **et** à votre argent.

Ton visuel : *cabinet de conseil haut de gamme × maison d'édition* (McKinsey Insights, Stripe Press, Monocle).
Sobre, éditorial, beaucoup de blanc, numérotation de sections, filets fins. Le bleu ciel est un accent rare.

Trois piliers : **Gestion de projet** · **Finances personnelles** · **Finances de projet**.
Quatre mots-clés repris de la bannière : **Conception · Management · Pilotage · Innovation**.

---

## 2. Stack

| Couche | Choix | Remarque |
|---|---|---|
| Framework | **Next.js 16** (App Router, RSC, Server Actions, Cache Components), TypeScript strict | validé |
| Styles | **Tailwind CSS v4** (tokens en `@theme`), shadcn/ui pour l'admin uniquement | |
| Animations | **GSAP + ScrollTrigger + SplitText** (chargés dynamiquement côté client), **Motion** pour les transitions de composants, **Lenis** | |
| Données | **Supabase** : Postgres + Auth + Storage, RLS partout | |
| Éditeur | **TipTap** (articles, campagnes) | |
| Emails | **Resend** + React Email | |
| Formulaires | Zod + React Hook Form | |
| Analytics | **Umami** (sans cookies) | par défaut |
| Déploiement | Vercel | |
| Qualité | ESLint, Prettier, Playwright (captures 1440 / 390 + tests e2e critiques) | |

---

## 3. Design system

### 3.1 Couleurs (tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--ink` | `#0A0E17` | Texte principal sur fond clair |
| `--navy` | `#0B1F3A` | Marque, boutons primaires, titres |
| `--navy-deep` | `#071528` | Sections sombres, hero, newsletter, footer |
| `--sky` | `#8CC8F0` | Accent rare : soulignés, puces, chiffres, curseur, focus |
| `--sky-soft` | `#EAF5FD` | Fonds doux (encadrés « À retenir ») |
| `--white` | `#FFFFFF` | Fond par défaut |
| `--paper` | `#F6F7F9` | Sections alternées |
| `--muted` | `#5B6474` | Texte secondaire |
| `--line` | `#E3E7ED` | Filets, bordures |

Contrastes vérifiés (AA) : `--ink`/blanc 19:1 · `--muted`/blanc 6,1:1 · blanc/`--navy-deep` 18:1 · `--sky`/`--navy-deep` 9,6:1.
⚠️ `--sky` sur blanc ≈ 1,8:1 → **jamais pour du texte sur fond clair** (uniquement décor : soulignés, puces). Sur fond clair, les liens sont en `--navy` avec soulignement `--sky`.

### 3.2 Typographie

- **Fraunces** (variable, axes `opsz`, `SOFT`, `wght`, italique) — titres. Italique pour les mots-clés : « Piloter vos *projets*. Maîtriser votre *argent*. »
- **Inter** (variable) — texte & UI ; `tabular-nums` pour les chiffres.
- Chargement via `next/font` (auto-hébergé, `display: swap`, sous-ensemble latin).

Échelle fluide :

| Rôle | Taille | Interligne |
|---|---|---|
| Display (hero) | `clamp(3rem, 7.5vw, 7.5rem)` → 48–120px | 0.95 |
| H1 page | `clamp(2.5rem, 5vw, 4.5rem)` | 1.0 |
| H2 section | `clamp(2rem, 3.6vw, 3.25rem)` | 1.05 |
| H3 | `clamp(1.375rem, 2vw, 1.75rem)` | 1.2 |
| Lead | `clamp(1.125rem, 1.4vw, 1.375rem)` | 1.5 |
| Corps | 1.0625rem (17px) | 1.65 |
| Article (prose) | 1.1875rem (19px), mesure 68ch | 1.7 |
| Label | 0.75rem, capitales, `letter-spacing: 0.14em` | — |

Label de section : `01 — EXPERTISE` (numéro en `--sky` sur fond sombre, `--navy` sur fond clair, tiret cadratin, filet de 40px).

### 3.3 Espacements & grille

- Base 4px. Échelle : 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160.
- Rythme vertical des sections : `clamp(5rem, 10vw, 10rem)` en haut/bas.
- Grille 12 colonnes, gouttière 24px (16px mobile), conteneur max 1320px, marges latérales `clamp(1rem, 4vw, 3rem)`.
- Rayons : 8px (inputs, badges), 12px (cartes), 16px (blocs média). Ombres très douces (`0 1px 2px rgb(10 14 23 / .04), 0 8px 24px rgb(10 14 23 / .06)`).

### 3.4 Mouvement

- Easing unique `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` ; durées 400 / 600 / 900ms.
- `prefers-reduced-motion: reduce` → pas de préloader, pas de Lenis, pas de parallaxe/tilt/magnétisme/curseur, révélations remplacées par un simple affichage. Un seul hook `useReducedMotion` + garde CSS globale.
- GSAP importé via `import()` dans des composants client ; aucune animation ne bloque le LCP (le titre hero est rendu visible côté serveur, l'animation le masque/révèle seulement après hydratation, avec garde-fou anti-flash).

### 3.5 Composants publics (sur-mesure)

`Button` (primaire / secondaire / lien, variante magnétique, flèche glissante) · `SectionLabel` · `SectionHeading` (SplitText) · `Container` / `Grid` · `Marquee` · `Counter` · `Timeline` · `StickyCards` · `Book3D` · `Carousel` (accessible, ARIA) · `ArticleCard` · `CategoryFilter` · `Lexicon` · `TestimonialCard` / `VideoPlayer` · `MasonryGallery` + `Lightbox` · `NewsletterForm` · `ContactForm` · `Callout` (« À retenir », avertissement) · `Toc` (sommaire sticky) · `ReadingProgress` · `ShareBar` · `Cursor` · `Preloader` · `Header` / `MobileMenu` / `Footer`.

Tous visibles sur `/styleguide` (page non indexée).

---

## 4. Visuels

| Élément | Traitement |
|---|---|
| Portrait | `_sources/yao-portrait.png` (400×400). Détourage avec **rembg** (script Python `scripts/cutout.py`), posé sur `--navy-deep` + halo `--sky` très diffus. Exports AVIF/WebP. ⚠️ **Résolution trop faible pour un hero 120px** → demander l'original HD (§ 9). |
| Bannière | Non utilisée telle quelle. On garde l'email et les 4 mots-clés, retranscrits en icônes Lucide trait 1.5 (`PenTool` Conception, `Users` Management, `Gauge`/`LineChart` Pilotage, `Lightbulb` Innovation), animées en dessin de trait. |
| Illustrations | Unsplash/Pexels (industrie verrière, formation, carnets, calculs), duotone bleu marine appliqué par script (`sharp`) à l'import → `/public/images/`, crédits dans `CREDITS.md`. |
| Logos | `_sources/logos/` est **vide** → placeholders typographiques propres + liste dans `A_VERIFIER.md`. |
| Couverture du livre | Maquette CSS 3D (tranche, ombre, reflet), fond marine, titre Fraunces, remplaçable via l'admin. |
| OG images | `@vercel/og` : titre + portrait détouré sur fond marine. |

---

## 5. Arborescence

### 5.1 Public — `app/(public)`

| Route | Contenu |
|---|---|
| `/` | Hero · Bandeau confiance (marquee) · Chiffres clés (masqués si vides) · 01 Approche · 02 Expertises (cartes sticky) · 03 Le livre · 04 Lexique fiche de paie · 05 Articles récents · 06 Formations & coaching · 07 Témoignages · 08 Galerie · Newsletter · Contact · Footer |
| `/a-propos` | Bio longue, timeline parcours, certifications, valeurs, photo originale |
| `/articles` | Recherche (Postgres full-text FR), filtres catégorie/tags, pagination |
| `/articles/[slug]` | Temps de lecture, sommaire sticky, encadrés, progression, partage, auteur, articles liés, CTA newsletter, bandeau « contenu pédagogique » pour les catégories finance |
| `/livre` | Pitch, sommaire, extraits, public visé, liste d'attente → liens d'achat |
| `/formations` | Préparation PMP® (Woloyem Academy), coaching, entreprise, conférences |
| `/ressources` | Lexique complet + lead magnets (PDF contre email) |
| `/temoignages` | Tous les témoignages (texte + vidéo) |
| `/contact` | Formulaire avec motif |
| `/mentions-legales`, `/confidentialite` | Textes éditables |
| `/newsletter/confirmer`, `/newsletter/desinscription` | Double opt-in / désinscription (jeton signé) |
| `404` | « Ce livrable n'est pas dans le périmètre du projet. » |
| `/styleguide` | Design system (noindex) |

### 5.2 Admin — `app/admin` (shadcn/ui, en français)

Tableau de bord · Sections (contenus de l'accueil et des pages) · Articles · Catégories · Livre · Lexique · Témoignages · Médias · Parcours & logos · Formations · Newsletter (abonnés, segments, export CSV, campagnes) · Messages · Paramètres.
Prévisualisation des brouillons via Next.js **Draft Mode**.

### 5.3 Structure du code

```
app/
  (public)/…            pages publiques
  admin/…               back-office (layout protégé)
  api/og/…              images OG
  sitemap.ts, robots.ts
components/
  ui/                   shadcn (admin)
  public/               primitives publiques (Button, Marquee…)
  sections/             sections de l'accueil
  admin/
lib/
  supabase/             clients server / browser / admin, types générés
  validations/          schémas Zod (dont un schéma par section)
  queries/              lecture des données (cache + revalidateTag)
  actions/              Server Actions
  motion/               hooks GSAP/Lenis, reduced-motion
emails/                 templates React Email
supabase/
  migrations/           SQL versionné
  seed.sql (+ seed/articles/*.md)
scripts/                cutout.py, duotone.ts, import-images.ts
_sources/               fichiers fournis (non publiés)
```

---

## 6. Schéma de base de données

Toutes les tables : `id uuid`, `created_at`, `updated_at` (trigger). **RLS activée partout.**
Rôle admin : table `profiles(id → auth.users, role)` + fonction `is_admin()` (`security definer`) utilisée dans les policies. Inscription publique à l'auth désactivée.

| Table | Champs principaux | Lecture publique |
|---|---|---|
| `settings` (1 ligne) | site_name, contact_email, linkedin_url, socials jsonb, seo jsonb, og_image, legal_md, privacy_md | oui |
| `sections` | key (`home.hero`…), page, position, visible, content jsonb (validé par Zod côté app) | si `visible` |
| `categories` | name, slug, description, is_finance, position | oui |
| `tags` + `article_tags` | name, slug | oui |
| `articles` | title, slug, excerpt, cover_id, category_id, content jsonb (TipTap) + content_html, reading_minutes, status (`draft`/`published`/`scheduled`), published_at, seo_title, seo_description, og_image_id, search tsvector (FR) | si publié et `published_at <= now()` |
| `book` (1 ligne) | title, subtitle, cover_id, pitch, toc jsonb, audience, status (`writing`/`preorder`/`available`), buy_links jsonb | oui |
| `book_excerpts` | title, body, position, is_provisional | oui |
| `lexicon_terms` | term, slug, short_def, long_def, article_id, position | oui |
| `testimonials` | quote, author_name, author_role, company, photo_id, linkedin_url, video_url / video_media_id, featured, position, published | si `published` |
| `media` | storage_path, mime, width, height, alt (obligatoire), blur_data, in_gallery, gallery_position | oui |
| `experiences` | kind (`work`/`education`/`certification`), title, organization, location, start_date, end_date, description, logo_id, position, needs_check | oui |
| `logos` | name, media_id, url, position, visible | oui |
| `stats` | label, value, suffix, position, visible, needs_check | si `visible` et valeur non nulle |
| `offers` (formations) | title, slug, summary, body, format, cta_label, cta_url, position, visible | si `visible` |
| `subscribers` | email (unique), first_name, segments text[] (`gestion-projet`, `finances-perso`, `livre`), status (`pending`/`confirmed`/`unsubscribed`), token, consent_at, confirmed_at, ip_hash | **non** (insert via Server Action uniquement) |
| `campaigns` | subject, preheader, content jsonb/html, segment, status, sent_at, stats jsonb | non |
| `messages` | name, email, reason, body, status (`new`/`read`/`done`), consent_at, ip_hash | non |
| `rate_limits` | key, window_start, count | non |

Storage : buckets `public-media` (lecture publique) et `private` (lead magnets, servis par URL signée).
Écritures publiques (newsletter, contact) : **Server Actions** avec clé service + Zod + honeypot + rate limit — aucune policy `insert` anonyme.
Revalidation : chaque mutation admin appelle `revalidateTag` → le site public reste statique/ISR et rapide.

---

## 7. Contenu seed

- **6 articles complets** (1 200–1 800 mots) : fiche de paie ligne par ligne (avec schéma interactif d'une fiche fictive), brut/net/net imposable, budget comme un projet, fonds d'urgence, 7 erreurs au PMP®, valeur acquise (avec mini-calculateur). Taux indicatifs + renvoi service-public.fr / URSSAF.
- **Lexique** : 12 termes (Brut, Cotisations salariales, Cotisations patronales, CSG/CRDS, Net à payer avant impôt, Prélèvement à la source, Net à payer, Net imposable, Montant net social, Congés payés, Heures supplémentaires, Avantages en nature).
- **Livre** : `[TITRE DU LIVRE]`, pitch provisoire, 3 `[EXTRAIT PROVISOIRE]`.
- **Témoignages** : 3 emplacements `[À REMPLIR DEPUIS LINKEDIN]`, non publiés.
- **Chiffres clés** : vides → section masquée.
- **Bio / parcours** : section 1 du brief, tout le non-vérifiable marqué `[À CONFIRMER]` (dates, université du doctorat, diplôme d'ingénieur…).
- Tout ce qui est `[À CONFIRMER]` est recensé dans `A_VERIFIER.md`.

---

## 8. Phases

| # | Phase | Livrable | Vérification |
|---|---|---|---|
| 1 | **Plan** | ce document + `A_VERIFIER.md` | ta validation |
| 2 | Fondations | Next.js, Tailwind tokens, polices, Lenis, layout, header/footer, menu mobile, `/styleguide`, détourage portrait | captures 1440/390 |
| 3 | Accueil statique | toutes les sections + animations, contenu seed en fichiers locaux | captures + auto-critique DA |
| 4 | Supabase | migrations, RLS, seed, branchement des sections | tests RLS (anon ne lit pas `subscribers`/`messages`) |
| 5 | Pages secondaires | articles, article, livre, à propos, formations, ressources, témoignages, contact, légales, 404 | captures |
| 6 | Admin | 13 modules | parcours e2e Playwright du § 11 du brief |
| 7 | Emails | contact, double opt-in, campagnes, « le livre est disponible » | envoi test Resend |
| 8 | SEO / a11y / perf | métadonnées, JSON-LD, sitemap, OG, audit Lighthouse | ≥ 95 × 4 sur `/` et un article |
| 9 | Revue finale | polish DA, README pas-à-pas, `A_VERIFIER.md` final | checklist § 11 du brief |

Chaque phase = un ou plusieurs commits sur `main`, résumé + captures à la fin.

---

## 9. Points à trancher / éléments manquants

1. ~~`linkedin.pdf` manquant~~ → profil fourni, consigné dans `_sources/linkedin.md`.
2. **Portrait HD** — la photo fournie fait 400×400 px : suffisant pour « À propos », **insuffisant pour un hero premium** (flou en Retina). Idéalement ≥ 1600 px de haut, fond le plus uni possible.
3. **Logos** — récupérés : Verallia, Woloyem, Capgemini, CNRS, badge PMP®. Restent : Université de Lorraine, Mines Nancy, PMI ATP, ITIL®.
4. ~~Next.js 15 ou 16~~ → **16** retenu.
5. **Nom de domaine** : plus tard. **Comptes à créer** (à la phase 4/7, pas maintenant) : Supabase, Resend (+ domaine d'envoi vérifié), Vercel, Umami/Plausible. **Nom de domaine** prévu ?
6. **Email de contact** : `aveveyao@yahoo.com` (bannière). L'envoi Resend nécessite un domaine à soi (ex. `contact@yaoavevor.com`) ; le Yahoo reste l'adresse de réception.
7. **Analytics** : Umami (gratuit auto-hébergé / cloud) ou Plausible (payant, très simple) ?
