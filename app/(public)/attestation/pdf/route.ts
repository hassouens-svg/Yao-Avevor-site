import { readCertificate } from "@/lib/certificate";
import { renderCertificate } from "@/lib/certificate/pdf";

/** Téléchargement de l'attestation PDF (lien signé, envoyé par email et affiché après le test). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const cert = readCertificate(url.searchParams.get("d"), url.searchParams.get("s"));
  if (!cert) return new Response("Lien d’attestation invalide.", { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const pdf = await renderCertificate(cert);
  const file = `attestation-${cert.n.normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase()}.pdf`;
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${url.searchParams.has("view") ? "inline" : "attachment"}; filename="${file}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
