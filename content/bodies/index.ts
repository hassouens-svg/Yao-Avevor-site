import type { ComponentType } from "react";
import FicheDePaie from "./fiche-de-paie";
import ImpotSurLeRevenu from "./impot-sur-le-revenu";
import InteretsComposes from "./interets-composes";
import Evm from "./evm";
import PmpErreurs from "./pmp-erreurs";
import BudgetProjet from "./budget-projet";
import FondsUrgence from "./fonds-urgence";
import BrutNet from "./brut-net";

/** Corps des articles rédigés. Phase Appwrite : remplacés par le contenu stocké en base, éditable dans l'admin. */
export const bodies: Record<string, ComponentType> = {
  "comment-lire-sa-fiche-de-paie": FicheDePaie,
  "comment-fonctionne-l-impot-sur-le-revenu": ImpotSurLeRevenu,
  "les-interets-composes": InteretsComposes,
  "la-valeur-acquise-evm-expliquee-simplement": Evm,
  "reussir-le-pmp-les-7-erreurs": PmpErreurs,
  "gerer-son-budget-comme-un-projet": BudgetProjet,
  "le-fonds-d-urgence": FondsUrgence,
  "brut-net-net-imposable": BrutNet,
};
