"use server";

import { contactSchema, flattenErrors, subscribeSchema, type FormState } from "@/lib/validations/forms";
import { createRow } from "@/lib/appwrite/rest";
import { ADMIN_EMAIL, btn, esc, layout, p, sendEmail } from "@/lib/email";
import { contactAckEmail, welcomeEmail } from "@/lib/email/templates";
import { site } from "@/lib/site";

/**
 * Actions des formulaires publics.
 * Validation (Zod + honeypot), puis enregistrement dans Appwrite (tables `subscribers` et `messages`),
 * consultables dans l'admin. Emails automatiques (double opt-in, notification) : étape suivante.
 */

function isBot(formData: FormData) {
  // Champ piège invisible pour les humains
  return String(formData.get("website") ?? "").length > 0;
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Merci !" };

  const parsed = subscribeSchema.safeParse({
    firstName: formData.get("firstName") ?? undefined,
    email: formData.get("email"),
    segments: formData.getAll("segments"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Merci de vérifier le formulaire.", fieldErrors: flattenErrors(parsed.error) };
  }

  try {
    const d = parsed.data;
    await createRow("subscribers", {
      email: d.email,
      firstName: d.firstName ?? "",
      segments: d.segments.join(","),
      status: "confirmed",
      consentAt: new Date().toISOString(),
    });
    await sendEmail({ to: d.email, ...welcomeEmail(d.email, d.firstName ?? "", d.segments) });
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Nouvel abonné : ${d.email}`,
      html: layout("Nouvel abonné", p(`${esc(d.firstName || "—")} · ${esc(d.email)}`) + p(`Intérêts : ${esc(d.segments.join(", ") || "—")}`) + btn("Voir les abonnés", `${site.url}/admin/abonnes`)),
    });
  } catch {
    return { status: "error", message: "Un problème technique est survenu. Merci de réessayer dans un instant." };
  }
  return {
    status: "success",
    message: "Merci ! Votre inscription est confirmée : un email de bienvenue vient de vous être envoyé.",
  };
}

export async function sendContact(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: "success", message: "Merci !" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    reason: formData.get("reason"),
    message: formData.get("message"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Merci de vérifier le formulaire.", fieldErrors: flattenErrors(parsed.error) };
  }

  try {
    const d = parsed.data;
    await createRow("messages", { name: d.name, email: d.email, reason: d.reason, message: d.message, status: "new" });
    await sendEmail({
      to: ADMIN_EMAIL,
      replyTo: d.email,
      subject: `${d.reason} — nouveau message de ${d.name}`,
      html: layout(`Nouveau message : ${esc(d.reason)}`, p(`<strong>${esc(d.name)}</strong> (${esc(d.email)})`) + p(esc(d.message).replace(/\n/g, "<br>")) + btn("Ouvrir les messages", `${site.url}/admin/messages`)),
    });
    await sendEmail({ to: d.email, ...contactAckEmail(d.name, d.reason, d.message) });
  } catch {
    return { status: "error", message: "Un problème technique est survenu. Merci de réessayer, ou écrivez directement à aveveyao@yahoo.com." };
  }
  return { status: "success", message: "Merci, votre message est bien parti. Je vous réponds personnellement." };
}
