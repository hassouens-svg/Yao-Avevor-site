# Yao AVEVOR — site portfolio

Site premium de Yao AVEVOR, Ph.D, PMP®. Next.js 16 · Tailwind CSS v4 · GSAP · Lenis · Motion.

- Brief : `docs/BRIEF.md` · Plan : `PLAN.md` · À valider : `A_VERIFIER.md` · Crédits : `CREDITS.md`

## Démarrer en local

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000 (le design system est sur `/styleguide`).

## Scripts utiles

- `npm run build` : build de production
- `npm run lint` : vérification ESLint
- `node scripts/screenshots.mjs <url> <dossier> / /styleguide` : captures desktop 1440 px + mobile 390 px (Playwright)
- `python scripts/cutout.py <entrée> <sortie>` : détourage d'un portrait (nécessite `pip install "rembg[cpu]"`)

Le guide de déploiement (Vercel + Supabase + Resend) sera complété au fil des phases.
