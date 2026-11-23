import "server-only";
import { createHmac } from "node:crypto";
import { site } from "@/lib/site";

/**
 * Envoi d'emails via Resend (offre gratuite : 3 000 emails / mois, 100 / jour).
 * Variables Vercel : RESEND_API_KEY (obligatoire), EMAIL_FROM, ADMIN_EMAIL (facultatives).
 * Sans clé, les envois sont ignorés sans bloquer le site.
 */
const FROM = process.env.EMAIL_FROM ?? "Yao AVEVOR <contact@yaoavevor.com>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? site.email;
const SITE = site.url.replace(/\/$/, "");

export type Mail = { to: string | string[]; subject: string; html: string; replyTo?: string; headers?: Record<string, string> };

export async function sendEmail({ to, subject, html, replyTo, headers }: Mail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY absente : email non envoyé →", subject);
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: Array.isArray(to) ? to : [to], subject, html, reply_to: replyTo ?? ADMIN_EMAIL, headers }),
      cache: "no-store",
    });
    if (!res.ok) console.error("[email] échec", res.status, await res.text());
    return { ok: res.ok };
  } catch (e) {
    console.error("[email] erreur", e);
    return { ok: false };
  }
}

/** Envoi groupé (jusqu'à 100 emails par appel Resend). */
export async function sendBatch(mails: Mail[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, sent: 0, skipped: true };
  let sent = 0;
  for (let i = 0; i < mails.length; i += 100) {
    const chunk = mails.slice(i, i + 100).map((m) => ({ from: FROM, to: Array.isArray(m.to) ? m.to : [m.to], subject: m.subject, html: m.html, reply_to: m.replyTo ?? ADMIN_EMAIL, headers: m.headers }));
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(chunk),
      cache: "no-store",
    });
    if (res.ok) sent += chunk.length;
    else console.error("[email] lot en échec", res.status, await res.text());
  }
  return { ok: sent === mails.length, sent };
}

/* ───────── Désinscription sécurisée (jeton signé, sans base de données) ───────── */
const secret = () => process.env.UNSUBSCRIBE_SECRET ?? process.env.RESEND_API_KEY ?? "dev";
export const unsubToken = (email: string) => createHmac("sha256", secret()).update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
export const unsubUrl = (email: string) => `${SITE}/newsletter/desinscription?e=${encodeURIComponent(email)}&t=${unsubToken(email)}`;

/* ───────── Gabarit ───────── */
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const p = (t: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#1b2230">${t}</p>`;
export const btn = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0"><tr><td style="background:#071528;border-radius:999px"><a href="${href}" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold">${label} →</a></td></tr></table>`;
export const box = (inner: string, bg = "#eaf5fd", border = "#1d4f91") =>
  `<div style="margin:18px 0;padding:16px 18px;background:${bg};border-left:4px solid ${border};font-size:14px;line-height:1.6;color:#1b2230">${inner}</div>`;

/** Signature de Yao avec sa photo, présente en bas de chaque email. */
function signature() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid #e3e7ed;padding-top:22px;width:100%"><tr>
<td width="76" valign="top" style="padding-top:22px"><img src="${SITE}/images/email-yao.jpg" width="64" height="64" alt="Yao AVEVOR" style="display:block;width:64px;height:64px;border-radius:50%;border:2px solid #8cc8f0"></td>
<td valign="top" style="padding-top:22px;font-family:Arial,Helvetica,sans-serif">
<p style="margin:0;font-size:15px;font-weight:bold;color:#071528">Yao AVEVOR, Ph.D, PMP®</p>
<p style="margin:3px 0 0;font-size:13px;color:#5b6474">Gestion de projets industriels · Formateur PMP® (PMI ATP)</p>
<p style="margin:8px 0 0;font-size:13px"><a href="${SITE}" style="color:#1d4f91;text-decoration:none">yaoavevor.com</a> &nbsp;·&nbsp; <a href="${site.linkedin}" style="color:#1d4f91;text-decoration:none">LinkedIn</a></p>
</td></tr></table>`;
}

export function layout(title: string, body: string, opts: { preheader?: string; unsubscribe?: string } = {}) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#0a0e17">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(opts.preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fa"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e3e7ed">
<tr><td style="background:#071528;padding:20px 28px"><span style="color:#ffffff;font-size:19px;font-weight:bold;letter-spacing:1px">YAO AVEVOR</span><span style="color:#8cc8f0;font-size:19px;font-weight:bold">.</span>
<span style="float:right;color:#8cc8f0;font-size:11px;letter-spacing:2px;padding-top:5px">CONCEPTION · MANAGEMENT · PILOTAGE · INNOVATION</span></td></tr>
<tr><td style="height:4px;background:#1d4f91;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:30px 28px 26px">
<h1 style="margin:0 0 18px;font-size:23px;line-height:1.3;color:#071528">${title}</h1>
${body}
${signature()}
</td></tr>
<tr><td style="padding:16px 28px;background:#f7f9fc;border-top:1px solid #e3e7ed;font-size:11px;line-height:1.6;color:#5b6474">
Vous recevez cet email suite à une action sur <a href="${SITE}" style="color:#1d4f91">yaoavevor.com</a>.${opts.unsubscribe ? ` <a href="${opts.unsubscribe}" style="color:#1d4f91">Se désinscrire</a> en un clic.` : ""}<br>
PMP® est une marque déposée du Project Management Institute, Inc.
</td></tr></table></td></tr></table></body></html>`;
}

export const siteUrl = SITE;
