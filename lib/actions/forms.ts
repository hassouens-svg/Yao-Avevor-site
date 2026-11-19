"use server";

import { contactSchema, flattenErrors, subscribeSchema, type FormState } from "@/lib/validations/forms";

/**
 * Actions des formulaires publics.
 * Phase 3 : validation complète (Zod + honeypot), sans persistance.
 * Phase 4 : insertion Supabase (`subscribers`, `messages`) + rate limiting.
 * Phase 7 : emails Resend (double opt-in, notification de contact).
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

  // TODO(phase 4/7) : enregistrer l'abonné (statut pending) et envoyer l'email de confirmation.
  return {
    status: "success",
    message: "Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.",
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

  // TODO(phase 4/7) : enregistrer le message et notifier Yao par email.
  return { status: "success", message: "Merci, votre message est bien parti. Je vous réponds personnellement." };
}
