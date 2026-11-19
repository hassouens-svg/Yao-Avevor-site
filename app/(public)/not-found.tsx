import { Button } from "@/components/public/button";
import { SectionLabel } from "@/components/public/section-label";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-[radial-gradient(90%_80%_at_80%_0%,#e6f1fb,#ffffff_65%)] pt-[var(--header-h)]">
      <div className="container-site">
        <SectionLabel>Erreur 404</SectionLabel>
        <h1 className="mt-5 max-w-4xl text-display text-navy-deep">
          Hors du <span className="text-blue">périmètre.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lead text-muted">Ce livrable n’est pas dans le périmètre du projet. La page demandée n’existe pas ou a été déplacée.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/" className="bg-navy-deep hover:bg-blue">Retour à l’accueil</Button>
          <Button href="/articles" variant="secondary">Lire les articles</Button>
        </div>
      </div>
    </section>
  );
}
