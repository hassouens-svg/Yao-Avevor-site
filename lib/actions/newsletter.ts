"use server";

import { createRow } from "@/lib/appwrite/rest";
import { ADMIN_EMAIL, esc, layout, p, sendEmail, unsubToken } from "@/lib/email";
import { unsubscribedEmail } from "@/lib/email/templates";

/** Désinscription en un clic (lien signé reçu par email). */
export async function unsubscribe(email: string, token: string) {
  const e = email.trim().toLowerCase();
  if (!e || token !== unsubToken(e)) return { ok: false, message: "Lien de désinscription invalide." };
  try {
    await createRow("subscribers", { email: e, firstName: "", segments: "", status: "unsubscribed", consentAt: new Date().toISOString() });
  } catch {
    return { ok: false, message: "Un problème technique est survenu. Merci de réessayer." };
  }
  await sendEmail({ to: e, ...unsubscribedEmail() });
  await sendEmail({ to: ADMIN_EMAIL, subject: `Désinscription : ${e}`, html: layout("Désinscription", p(esc(e))) });
  return { ok: true, message: "Vous êtes désinscrit(e). Vous ne recevrez plus la newsletter." };
}
