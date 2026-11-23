"use server";

import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, ADMIN_TEAM } from "@/lib/appwrite/config";
import { sendBatch, sendEmail } from "@/lib/email";
import { campaignEmail } from "@/lib/email/templates";

/** Vérifie, à partir d'un jeton de session Appwrite (JWT), que l'appelant est administrateur. */
async function requireAdmin(jwt: string) {
  const headers = { "X-Appwrite-Project": APPWRITE_PROJECT, "X-Appwrite-JWT": jwt };
  const me = await fetch(`${APPWRITE_ENDPOINT}/account`, { headers, cache: "no-store" });
  if (!me.ok) throw new Error("Session expirée : reconnectez-vous.");
  const user = (await me.json()) as { email: string };
  const t = await fetch(`${APPWRITE_ENDPOINT}/teams`, { headers, cache: "no-store" });
  const teams = t.ok ? ((await t.json()) as { teams: { $id: string }[] }).teams : [];
  if (!teams.some((x) => x.$id === ADMIN_TEAM)) throw new Error("Accès réservé aux administrateurs.");
  return user;
}

export async function sendCampaign(jwt: string, input: { subject: string; markdown: string; preheader?: string; recipients: string[]; test?: boolean }) {
  try {
    const admin = await requireAdmin(jwt);
    if (!input.subject.trim() || !input.markdown.trim()) return { ok: false, message: "Objet et contenu obligatoires." };
    if (input.test) {
      const r = await sendEmail({ to: admin.email, ...campaignEmail(admin.email, `[TEST] ${input.subject}`, input.markdown, input.preheader) });
      return r.ok ? { ok: true, message: `Test envoyé à ${admin.email}.` } : { ok: false, message: "Échec de l’envoi du test (vérifiez la configuration Resend)." };
    }
    const list = [...new Set(input.recipients.map((e) => e.trim().toLowerCase()).filter((e) => /^\S+@\S+\.\S+$/.test(e)))];
    if (!list.length) return { ok: false, message: "Aucun destinataire." };
    const r = await sendBatch(list.map((e) => ({ to: e, ...campaignEmail(e, input.subject, input.markdown, input.preheader) })));
    return { ok: r.ok, message: r.ok ? `Newsletter envoyée à ${r.sent} abonné(s).` : `Envoyée à ${r.sent} sur ${list.length}. Limite gratuite : 100 emails par jour.` };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}
