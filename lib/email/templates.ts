import "server-only";
import { marked } from "marked";
import { box, btn, esc, layout, p, siteUrl, unsubUrl } from "./index";

/** Tous les modèles d'emails du site. */

const segmentLabels: Record<string, string> = {
  "gestion-projet": "la gestion de projet",
  "finances-perso": "les finances personnelles",
  livre: "la sortie des livres",
};

/** 1. Confirmation d'inscription à la newsletter (ou à la liste d'attente des livres). */
export function welcomeEmail(email: string, firstName: string, segments: string[]) {
  const name = firstName ? ` ${esc(firstName)}` : "";
  const interests = segments.map((s) => segmentLabels[s]).filter(Boolean);
  const bookOnly = segments.length === 1 && segments[0] === "livre";
  const unsubscribe = unsubUrl(email);
  return {
    subject: bookOnly ? "C’est noté : vous serez prévenu(e) de la sortie" : "Bienvenue ! Votre inscription est confirmée",
    html: layout(
      bookOnly ? `Merci${name}, c’est noté !` : `Bienvenue${name} !`,
      p(bookOnly ? "Votre inscription est confirmée : vous serez parmi les premiers prévenus de la sortie de mes livres, avec des extraits en avant-première." : "Votre inscription à la newsletter est confirmée. Merci de votre confiance !") +
        (interests.length ? box(`<strong>Vos centres d’intérêt :</strong> ${interests.join(", ")}.`) : "") +
        p("Au programme : des méthodes claires de gestion de projet, des retours du terrain industriel, la préparation au PMP®, et des outils concrets pour vos finances.") +
        p("En attendant, voici trois ressources pour commencer :") +
        `<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.8">
<li><a href="${siteUrl}/articles/comment-lire-sa-fiche-de-paie" style="color:#1d4f91">Lire sa fiche de paie, ligne par ligne</a></li>
<li><a href="${siteUrl}/tests" style="color:#1d4f91">Tester vos connaissances en gestion de projet</a></li>
<li><a href="${siteUrl}/outils" style="color:#1d4f91">Les simulateurs gratuits</a></li></ul>` +
        btn("Découvrir le site", siteUrl),
      { preheader: "Votre inscription est confirmée.", unsubscribe },
    ),
    headers: { "List-Unsubscribe": `<${unsubscribe}>` },
  };
}

/** 2. Accusé de réception d'un message de contact. */
export function contactAckEmail(name: string, reason: string, message: string) {
  return {
    subject: `Bien reçu : votre demande (${reason})`,
    html: layout(
      `Merci ${esc(name)}, votre message est bien arrivé`,
      p(`J’ai bien reçu votre demande concernant <strong>${esc(reason)}</strong>. Je vous réponds personnellement, en général sous 48 heures.`) +
        box(`<strong>Votre message :</strong><br>${esc(message).replace(/\n/g, "<br>")}`, "#f7f9fc", "#8cc8f0") +
        p("Pour les inscriptions aux bootcamps PMP®, vous pouvez aussi consulter directement le site de Woloyem.") +
        btn("Voir les formations", "https://www.woloyem.com/"),
      { preheader: "Votre message est bien arrivé." },
    ),
  };
}

/** 3. Remerciement après un avis. */
export function reviewThanksEmail(firstName: string) {
  return {
    subject: "Merci pour votre avis !",
    html: layout(
      `Merci ${esc(firstName)} !`,
      p("Votre avis a bien été reçu. Il sera publié sur le site après une rapide validation.") +
        p("Ces retours comptent énormément : ils aident d’autres professionnels à se lancer dans leur projet ou leur certification.") +
        btn("Voir les témoignages", `${siteUrl}/temoignages`),
      { preheader: "Votre avis a bien été reçu." },
    ),
  };
}

/** 4. Newsletter / campagne rédigée dans l'admin (Markdown). */
export function campaignEmail(email: string, subject: string, markdown: string, preheader?: string) {
  const unsubscribe = unsubUrl(email);
  const html = (marked.parse(markdown, { async: false }) as string)
    .replace(/<p>/g, '<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#1b2230">')
    .replace(/<h2>/g, '<h2 style="margin:24px 0 10px;font-size:19px;color:#071528">')
    .replace(/<h3>/g, '<h3 style="margin:20px 0 8px;font-size:16px;color:#071528">')
    .replace(/<a /g, '<a style="color:#1d4f91" ')
    .replace(/<ul>/g, '<ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.8">')
    .replace(/<img /g, '<img style="max-width:100%;height:auto;display:block;margin:12px 0" ')
    .replace(/<blockquote>/g, '<blockquote style="margin:16px 0;padding:12px 16px;background:#eaf5fd;border-left:4px solid #1d4f91">');
  return {
    subject,
    html: layout(esc(subject), html, { preheader, unsubscribe }),
    headers: { "List-Unsubscribe": `<${unsubscribe}>` },
  };
}

/** 5. Confirmation de désinscription. */
export function unsubscribedEmail() {
  return {
    subject: "Désinscription confirmée",
    html: layout("C’est fait, vous êtes désinscrit(e)", p("Vous ne recevrez plus la newsletter. Merci d’avoir suivi mes publications.") + p("Vous pouvez vous réinscrire à tout moment depuis le site.") + btn("Revenir sur le site", siteUrl)),
  };
}
