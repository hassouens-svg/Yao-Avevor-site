import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTests } from "@/lib/content";
import { PageHero } from "@/components/public/page-hero";

export const metadata: Metadata = {
  title: "Tests & quiz — gestion de projet, PMP®, finances",
  description: "Testez vos connaissances : gestion de projet, préparation PMP®, finances. Résultat immédiat et envoyé par email.",
};

export default async function TestsPage() {
  const tests = await getTests();
  return (
    <>
      <PageHero label="Tests & quiz" title="Testez vos connaissances." intro="Gestion de projet, certification PMP®, finances : faites le point en quelques minutes. Résultat immédiat, corrections et envoi par email." />
      <section className="bg-white pb-24">
        <div className="container-site">
          {tests.length === 0 ? (
            <p className="border-t border-line pt-8 text-muted">Aucun test publié pour l’instant. Revenez bientôt !</p>
          ) : (
            <ul className="border-t border-line">
              {tests.map((t) => (
                <li key={t.slug} className="border-b border-line">
                  <Link href={`/tests/${t.slug}`} className="group grid gap-2 py-6 sm:grid-cols-[10rem_1fr_auto] sm:items-center sm:gap-6">
                    <span className="font-mono text-xs tracking-wider text-blue uppercase">{t.subject || "Test"}</span>
                    <span>
                      <span className="block text-[1.25rem] font-semibold text-navy-deep group-hover:text-blue">{t.title}</span>
                      {t.description && <span className="mt-1 block text-sm text-muted">{t.description}</span>}
                    </span>
                    <span className="flex items-center gap-3 text-sm text-muted">
                      {t.count} questions · réussite à {t.passPct} %
                      <ArrowUpRight className="size-4 text-navy-deep" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
