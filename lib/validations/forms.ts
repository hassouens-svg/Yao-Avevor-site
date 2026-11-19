import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Adresse email invalide").max(254);
const consent = z.literal("on", { message: "Merci de cocher la case de consentement" });

export const subscribeSchema = z.object({
  firstName: z.string().trim().max(80).optional().default(""),
  email,
  segments: z.array(z.enum(["gestion-projet", "finances-perso", "livre"])).default([]),
  consent,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Merci d’indiquer votre nom").max(120),
  email,
  reason: z.enum(["Formation PMP®", "Coaching", "Conférence", "Presse", "Autre"]),
  message: z.string().trim().min(10, "Votre message est un peu court").max(5000),
  consent,
});

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export function flattenErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
