"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ArticleMeta, Category, HomeContent } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { ArticleCard } from "@/components/public/article-card";
import { SectionHeader } from "@/components/public/section-header";
import { Button } from "@/components/public/button";

/** Derniers articles + filtres par catégorie. */
export function RecentArticles({
  content,
  articles,
  categories,
}: {
  content: HomeContent["articles"];
  articles: ArticleMeta[];
  categories: Category[];
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const used = categories.filter((c) => articles.some((a) => a.category === c.slug));
  const shown = articles.filter((a) => !filter || a.category === filter).slice(0, 3);

  return (
    <section id="articles" className="bg-white py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader label={content.label} title={content.title} />
          <Button href={filter ? `/articles?categorie=${filter}` : "/articles"} variant="secondary">
            Tous les articles
          </Button>
        </div>

        <div role="group" aria-label="Filtrer par catégorie" className="mt-8 flex flex-wrap gap-2">
          {[{ slug: null as string | null, name: "Tous" }, ...used].map((c) => {
            const on = filter === c.slug;
            return (
              <button
                key={c.slug ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c.slug)}
                className={cn(
                  "h-9 rounded-full border px-4 font-mono text-[0.8125rem] transition-colors duration-300",
                  on ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white text-navy-deep hover:border-navy/40",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((a, i) => (
              <motion.div
                key={a.slug}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.06 }}
              >
                <ArticleCard article={a} priority={i === 0} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
