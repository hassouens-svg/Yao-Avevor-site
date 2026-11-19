import Link from "next/link";
import type { ArticleMeta } from "@/lib/content/types";
import { categoryName } from "@/content/articles";
import Image from "next/image";
import { ArticleCover } from "./article-cover";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Carte d'article : zoom image subtil + soulignement animé du titre au survol. */
export function ArticleCard({ article, priority = false }: { article: ArticleMeta & { coverImage?: string }; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-md)]">
        <div className="relative h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
          {article.coverImage ? (
            <Image src={article.coverImage} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" unoptimized />
          ) : (
            <ArticleCover motif={article.cover} />
          )}
        </div>
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-navy backdrop-blur">
          {categoryName(article.category)}
        </span>
      </div>
      <div className="mt-6 flex items-center gap-3 text-sm text-muted">
        <time dateTime={article.publishedAt}>{dateFmt.format(new Date(article.publishedAt))}</time>
        <span aria-hidden="true">·</span>
        <span>{article.readingMinutes} min de lecture</span>
      </div>
      <h3 className="mt-3 text-[1.25rem] leading-snug text-navy-deep">
        <Link href={`/articles/${article.slug}`} prefetch={priority} className="after:absolute after:inset-0">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-700 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
            {article.title}
          </span>
        </Link>
      </h3>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{article.excerpt}</p>
    </article>
  );
}
