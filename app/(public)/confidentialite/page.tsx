import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <LegalPage title="Confidentialité">
      <h2>Données collectées</h2>
      <ul>
        <li><strong>Newsletter et liste d’attente des livres</strong> : email, prénom (facultatif), centres d’intérêt, date de consentement.</li>
        <li><strong>Formulaire de contact</strong> : nom, email, motif et message.</li>
      </ul>
      <h2>Finalités et base légale</h2>
      <p>Ces données servent uniquement à vous répondre et à vous envoyer les informations demandées, sur la base de votre consentement. Elles ne sont ni vendues ni cédées.</p>
      <h2>Durée de conservation</h2>
      <p>Jusqu’à votre désinscription pour la newsletter ; 3 ans après le dernier échange pour les messages de contact.</p>
      <h2>Cookies et mesure d’audience</h2>
      <p>Ce site n’utilise pas de cookies publicitaires. La mesure d’audience, si elle est activée, est réalisée sans cookie.</p>
      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition. Chaque email contient un lien de désinscription.
        Pour toute demande : <a href={`mailto:${site.email}`}>{site.email}</a>. Vous pouvez également saisir la CNIL (cnil.fr).
      </p>
    </LegalPage>
  );
}
