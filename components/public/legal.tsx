import { PageHero } from "./page-hero";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero label="Informations" title={title} />
      <section className="bg-white pb-24">
        <div className="container-site">
          <div className="prose-ya max-w-3xl">{children}</div>
        </div>
      </section>
    </>
  );
}
