import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Yao AVEVOR — [STATUT JURIDIQUE ET ADRESSE À COMPLÉTER]
        <br />
        Contact : <a href={`mailto:${site.email}`}>{site.email}</a>
        <br />
        Directeur de la publication : Yao AVEVOR
      </p>
      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, visuels et outils de ce site sont la propriété de Yao AVEVOR, sauf mention contraire. Les logos et marques citées
        appartiennent à leurs propriétaires respectifs. PMP®, PMBOK® et PMI® sont des marques déposées du Project Management Institute, Inc.
        ITIL® est une marque déposée de PeopleCert.
      </p>
      <h2>Contenus pédagogiques</h2>
      <p>
        Les articles et simulateurs ont une visée pédagogique. Ils ne constituent pas un conseil financier, fiscal ou juridique personnalisé.
        Les règles et taux évoluent : vérifiez-les sur service-public.fr, impots.gouv.fr et urssaf.fr.
      </p>
    </LegalPage>
  );
}
