import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/lib/site";

/**
 * Attestations : le contenu est signé (HMAC) et porté par le lien lui-même.
 * Personne ne peut fabriquer ou modifier une attestation sans la clé, et aucune donnée n'est exposée.
 */
export type CertType = "none" | "quiz" | "training";
/** k type · n nom · t test · f formation · b fanion (domaine) · x texte · s score · d date · id référence */
export type CertData = { k: Exclude<CertType, "none">; n: string; t: string; f?: string; b?: string; x: string; s: string; d: string; id: string };

const secret = () => process.env.CERTIFICATE_SECRET ?? process.env.UNSUBSCRIBE_SECRET ?? process.env.RESEND_API_KEY ?? "dev";
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url").slice(0, 32);

/** Texte qui suit le nom de la formation (ou du test) sur le certificat. */
export const DEFAULT_TEXTS: Record<Exclude<CertType, "none">, string> = {
  training:
    "et a réussi le test de fin de formation avec un score de {score}, démontrant les connaissances nécessaires pour planifier, piloter et réussir un projet, de la conception à la clôture, en appliquant les bonnes pratiques et méthodes éprouvées.",
  quiz: "avec un score de {score}, démontrant une bonne maîtrise des notions évaluées.",
};

export function fillText(template: string, v: { nom: string; formation: string; test: string; score: string; date: string }) {
  return template.replace(/\{(nom|formation|test|score|date)\}/g, (_, k: keyof typeof v) => v[k]);
}

export function certificateUrl(data: CertData) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${site.url.replace(/\/$/, "")}/attestation/pdf?d=${payload}&s=${sign(payload)}`;
}

export function readCertificate(payload: string | null, sig: string | null): CertData | null {
  if (!payload || !sig) return null;
  const a = Buffer.from(sign(payload));
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as CertData;
  } catch {
    return null;
  }
}
