"use server";

import { requireAdmin } from "@/lib/admin/server-auth";
import { sendBatch, sendEmail } from "@/lib/email";
import { campaignEmail } from "@/lib/email/templates";

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
