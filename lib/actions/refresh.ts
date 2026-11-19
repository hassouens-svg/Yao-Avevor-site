"use server";

import { updateTag } from "next/cache";
import { SITE_TAG } from "@/lib/content";

/** Appelée par l'admin après chaque enregistrement : le site public reflète immédiatement les changements. */
export async function refreshSite() {
  updateTag(SITE_TAG);
  return { ok: true };
}
