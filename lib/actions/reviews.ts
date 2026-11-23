"use server";

import { z } from "zod";
import { createRow, uploadPublicFile } from "@/lib/appwrite/rest";
import { ADMIN_EMAIL, btn, esc, layout, p, sendEmail } from "@/lib/email";
import { site } from "@/lib/site";
import { flattenErrors, type FormState } from "@/lib/validations/forms";

const schema = z.object({
  firstName: z.string().trim().min(1, "Merci d’indiquer votre prénom").max(80),
  lastName: z.string().trim().min(1, "Merci d’indiquer votre nom").max(80),
  email: z.union([z.literal(""), z.string().trim().toLowerCase().email("Adresse email invalide")]).default(""),
  role: z.string().trim().max(200).default(""),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  message: z.string().trim().min(20, "Votre avis est un peu court (20 caractères minimum)").max(3000),
  consent: z.literal("on", { message: "Merci d’accepter la publication de votre avis" }),
});

/** Avis envoyé depuis la page publique /avis : enregistré « en attente », publié seulement après validation dans l'admin. */
export async function submitReview(_prev: FormState, fd: FormData): Promise<FormState> {
  if (String(fd.get("website") ?? "")) return { status: "success", message: "Merci !" };
  const parsed = schema.safeParse({
    firstName: fd.get("firstName"),
    lastName: fd.get("lastName"),
    email: fd.get("email") ?? "",
    role: fd.get("role") ?? "",
    rating: fd.get("rating") ?? 5,
    message: fd.get("message"),
    consent: fd.get("consent"),
  });
  if (!parsed.success) return { status: "error", message: "Merci de vérifier le formulaire.", fieldErrors: flattenErrors(parsed.error) };
  const d = parsed.data;

  let photo = "";
  const file = fd.get("photo");
  if (file instanceof File && file.size > 0) {
    if (file.size > 5_000_000) return { status: "error", message: "La photo dépasse 5 Mo.", fieldErrors: { photo: "Photo trop lourde (5 Mo maximum)" } };
    if (!file.type.startsWith("image/")) return { status: "error", message: "Format de photo non reconnu.", fieldErrors: { photo: "Image JPG, PNG ou WebP uniquement" } };
    try {
      photo = await uploadPublicFile("media", file);
    } catch {
      photo = "";
    }
  }

  try {
    await createRow("reviews", { ...d, photo, status: "pending", consent: true });
  } catch {
    return { status: "error", message: "Un problème technique est survenu. Merci de réessayer dans un instant." };
  }

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nouvel avis de ${d.firstName} ${d.lastName} — à valider`,
    replyTo: d.email || undefined,
    html: layout(
      "Nouvel avis à valider",
      p(`<strong>${esc(d.firstName)} ${esc(d.lastName)}</strong>${d.role ? ` — ${esc(d.role)}` : ""} · ${"★".repeat(d.rating)}${"☆".repeat(5 - d.rating)}`) +
        p(`« ${esc(d.message)} »`) +
        btn("Valider dans l’admin", `${site.url}/admin/avis`),
    ),
  });

  return { status: "success", message: "Merci pour votre avis ! Il sera publié après validation." };
}
