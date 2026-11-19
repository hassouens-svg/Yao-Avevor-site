import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllArticles, getCategories } from "@/lib/content";
import { SectionLabel } from "@/components/public/section-label";
import { Reveal } from "@/components/public/reveal";
import { ArticlesExplorer } from "./explorer";

export const metadata: Metadata = {
  title: "Articles — gestion de projet, PMP®, fiche de paie, impôts",
  description: "Des articles clairs et concrets : gestion de projet, certification PMP®, finances de projet, fiche de paie, impôts, épargne.",
};

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([getAllArticles(), getCategories()]);
  return (
    <>
      <section className="bg-[radial-gradient(100%_80%_at_80%_0%,#eaf5fd,#ffffff_60%)] pt-[calc(var(--header-h)+4rem)] pb-10">
        <div className="container-site">
          <SectionLabel>Le journal</SectionLabel>
          <Reveal as="h1" mode="lines" immediate className="mt-5 max-w-5xl text-display text-navy-deep">
            Comprendre, puis décider.
          </Reveal>
          <p className="mt-6 max-w-2xl text-lead text-muted">
            Gestion de projet, certification PMP®, finances de projet et finances personnelles : des explications concrètes, des exemples chiffrés, des outils.
          </p>
        </div>
      </section>
      <Suspense fallback={<div className="container-site min-h-[50vh]" />}>
        <ArticlesExplorer articles={articles} categories={categories} />
      </Suspense>
    </>
  );
}
