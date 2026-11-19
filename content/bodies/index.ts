import type { ComponentType } from "react";
import FicheDePaie from "./fiche-de-paie";
import ImpotSurLeRevenu from "./impot-sur-le-revenu";
import InteretsComposes from "./interets-composes";

/** Corps des articles rédigés. Phase 4/6 : remplacés par le contenu TipTap stocké dans Supabase. */
export const bodies: Record<string, ComponentType> = {
  "comment-lire-sa-fiche-de-paie": FicheDePaie,
  "comment-fonctionne-l-impot-sur-le-revenu": ImpotSurLeRevenu,
  "les-interets-composes": InteretsComposes,
};
