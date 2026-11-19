# Yao AVEVOR — site

Site de Yao AVEVOR, Ph.D, PMP®. Next.js 16 · Tailwind CSS v4 · GSAP · Three.js · **Appwrite** (base de données, médias, connexion admin) · hébergé sur **Vercel**.

- En ligne : https://yao-avevor-site.vercel.app
- Administration : https://yao-avevor-site.vercel.app/admin

## Administration (pour Yao)

Connexion sur `/admin` avec l’email et le mot de passe fournis. Lien « Mot de passe oublié » disponible sur l’écran de connexion.

| Menu | Ce qu’on y fait |
|---|---|
| Textes des pages | Modifier tous les textes, boutons, liens, images et listes du site (accueil, parcours, certifications, lexique, catégories) |
| Articles | Écrire / modifier / masquer des articles (Markdown), image de couverture |
| Livres | Ajouter des livres : couverture, présentation, extraits, liens vers les boutiques |
| Témoignages & vidéos | Témoignages écrits et vidéo (envoi MP4 ou lien YouTube/Vimeo) |
| Médias | Importer images, vidéos, PDF ; copier leur lien |
| Abonnés | Inscrits newsletter / livres, export CSV |
| Messages | Demandes reçues (coaching, formation, conférence…), statut, réponse par email |

Chaque enregistrement met le site à jour immédiatement.

## Appwrite

- Projet `6afefa5b0006e80c84a3`, endpoint `https://fra.cloud.appwrite.io/v1`, base `site`, bucket `media`, équipe `admins`.
- Le site public n’utilise **aucune clé secrète** : lecture publique (`read any`), création publique des messages et abonnés (`create any`), modifications réservées à l’équipe `admins`.
- Scripts (clé API Appwrite nécessaire, à créer dans la console puis à supprimer après usage) :

```bash
APPWRITE_API_KEY=... node --experimental-strip-types scripts/appwrite-setup.mts --seed
```

```bash
APPWRITE_API_KEY=... node --experimental-strip-types scripts/appwrite-admin.mts create-admin email@exemple.com Prénom Nom
```

## Développement

```bash
npm install
npm run dev
```

- `npm run build` / `npm run lint`
- `node scripts/screenshots.mjs <url> <dossier> / /a-propos` : captures 1440 px + 390 px

Le contenu des fichiers `content/` sert de valeurs par défaut et de secours si Appwrite ne répond pas.
