import "server-only";
import { site } from "@/lib/site";

/**
 * Envoi d'emails via Resend (offre gratuite : 3 000 emails / mois, 100 / jour).
 * Variables (Vercel → Settings → Environment Variables) :
 *   RESEND_API_KEY  (obligatoire pour envoyer)
 *   EMAIL_FROM      (défaut : "Yao AVEVOR <contact@yaoavevor.com>" — domaine à vérifier dans Resend)
 *   ADMIN_EMAIL     (défaut : l'email de contact du site)
 * Sans clé, les envois sont ignorés sans bloquer le site.
 */
const FROM = process.env.EMAIL_FROM ?? "Yao AVEVOR <contact@yaoavevor.com>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? site.email;

export async function sendEmail({ to, subject, html, replyTo }: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY absente : email non envoyé →", subject);
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: Array.isArray(to) ? to : [to], subject, html, reply_to: replyTo }),
      cache: "no-store",
    });
    if (!res.ok) console.error("[email] échec", res.status, await res.text());
    return { ok: res.ok };
  } catch (e) {
    console.error("[email] erreur", e);
    return { ok: false };
  }
}

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Gabarit HTML sobre, compatible avec les clients mail. */
export function layout(title: string, body: string) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#0a0e17">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e3e7ed">
<tr><td style="background:#071528;padding:22px 28px;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:.5px">YAO AVEVOR<span style="color:#8cc8f0">.</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;color:#071528">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e3e7ed;font-size:12px;color:#5b6474">Yao AVEVOR, Ph.D, PMP® — <a href="${site.url}" style="color:#1d4f91">${site.url.replace(/^https?:\/\//, "")}</a></td></tr>
</table></td></tr></table></body></html>`;
}

export const p = (t: string) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6">${t}</p>`;
export const btn = (label: string, href: string) =>
  `<p style="margin:20px 0"><a href="${href}" style="display:inline-block;background:#071528;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px">${label}</a></p>`;
