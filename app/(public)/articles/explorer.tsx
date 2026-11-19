"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ArticleMeta, Category } from "@/lib/content/types";
import { ArticleCard } from "@/components/public/article-card";
import { cn } from "@/lib/cn";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Recherche + filtres par catégorie (synchronisés avec l'URL : ?categorie=…). */
export function ArticlesExplorer({ articles, categories }: { articles: ArticleMeta[]; categories: Category[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("categorie");
  const [q, setQ] = useState("");
  const used = categories.filter((c) => articles.some((a) => a.category === c.slug));

  const shown = useMemo(
    () =>
      articles.filter(
        (a) => (!cat || a.category === cat) && (!q || norm(a.title + " " + a.excerpt).includes(norm(q))),
      ),
    [articles, cat, q],
  );

  const setCat = (slug: string | null) => router.replace(slug ? `/articles?categorie=${slug}` : "/articles", { scroll: false });

  return (
    <section className="bg-white pb-24">
      <div className="container-site">
        <div className="flex flex-col gap-5 border-y border-line py-6 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
            {[{ slug: null as string | null, name: "Tous" }, ...used].map((c) => (
              <button
                key={c.slug ?? "all"}
                type="button"
                aria-pressed={cat === c.slug}
                onClick={() => setCat(c.slug)}
                className={cn(
                  "h-9 rounded-full border px-4 font-mono text-[0.8125rem] transition-colors",
                  cat === c.slug ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-cloud text-navy-deep hover:border-navy/40",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <label className="relative block lg:w-80">
            <span className="sr-only">Rechercher un article</span>
            <Search strokeWidth={1.5} className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher (ex. « impôt », « PMP »)"
              className="h-11 w-full rounded-full border border-line bg-cloud pr-4 pl-11 text-sm outline-none focus:border-navy"
            />
          </label>
        </div>
        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {shown.length} article{shown.length > 1 ? "s" : ""}
        </p>
        <div className="mt-6 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <ArticleCard key={a.slug} article={a} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
