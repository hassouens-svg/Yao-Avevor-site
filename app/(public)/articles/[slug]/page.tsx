import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllArticles, getArticle, getRelatedArticles } from "@/lib/content";
import { categoryName } from "@/content/articles";
import { bodies } from "@/content/bodies";
import { ArticleCover } from "@/components/public/article-cover";
import { ArticleCard } from "@/components/public/article-card";
import { ReadingProgress, ShareBar, Toc } from "@/components/article/parts";
import { Button } from "@/components/public/button";
import { site } from "@/lib/site";
import portrait from "@/public/images/portrait-cutout.png";
import { marked } from "marked";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export async function generateStaticParams() {
  const all = await getAllArticles();
  return all.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: { type: "article", title: a.title, description: a.excerpt, images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: a.title, description: a.excerpt, images: ["/opengraph-image.jpg"] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const Body = bodies[slug];
  const related = await getRelatedArticles(slug);
  const path = `/articles/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: site.fullName, url: site.url },
    inLanguage: "fr-FR",
  };

  return (
    <article>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="bg-[radial-gradient(100%_80%_at_80%_0%,#eaf5fd,#ffffff_60%)] pt-[calc(var(--header-h)+3rem)]">
        <div className="container-site">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy-deep">
            <ArrowLeft strokeWidth={1.5} className="size-4" /> Tous les articles
          </Link>
          <div className="mt-8 max-w-4xl">
            <p className="label-caps text-blue">{categoryName(article.category)}</p>
            <h1 className="mt-4 text-h1 text-navy-deep">{article.title}</h1>
            <p className="mt-6 max-w-2xl text-lead text-muted">{article.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-6 text-sm text-muted">
              <span className="flex items-center gap-3">
                <span className="relative size-10 overflow-hidden rounded-full bg-sky-soft">
                  <Image src={portrait} alt="" fill sizes="40px" className="object-cover object-top" />
                </span>
                <span className="font-semibold text-navy-deep">Yao AVEVOR, Ph.D</span>
              </span>
              <time dateTime={article.publishedAt}>{dateFmt.format(new Date(article.publishedAt))}</time>
              <span>{article.readingMinutes} min de lecture</span>
            </div>
          </div>
          <div className="relative mt-12 aspect-[21/9] overflow-hidden rounded-md">
            {article.coverImage ? (
              <Image src={article.coverImage} alt="" fill priority sizes="100vw" className="object-cover" unoptimized />
            ) : (
              <ArticleCover motif={article.cover} />
            )}
          </div>
        </div>
      </header>

      <div className="container-site grid gap-12 py-16 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28 space-y-10">
            <Toc />
            <ShareBar title={article.title} path={path} />
          </div>
        </aside>
        <div id="article-body" className="prose-ya min-w-0 lg:col-span-8 lg:col-start-5">
          {article.body ? (
            <div dangerouslySetInnerHTML={{ __html: marked.parse(article.body, { async: false }) as string }} />
          ) : Body ? (
            <Body />
          ) : (
            <div className="not-prose rounded-md border border-line bg-cloud p-10">
              <p className="label-caps text-blue">En préparation</p>
              <p className="mt-4 text-[1.5rem] font-bold text-navy-deep">Cet article est en cours de rédaction.</p>
              <p className="mt-3 text-muted">Inscrivez-vous à la newsletter pour être prévenu(e) de sa publication.</p>
              <Button href="/#newsletter" className="mt-6 bg-navy-deep hover:bg-blue">
                M’inscrire
              </Button>
            </div>
          )}

          <div className="not-prose mt-16 flex flex-col gap-6 rounded-md bg-navy-deep p-8 text-white sm:flex-row sm:items-center">
            <span className="relative size-20 shrink-0 overflow-hidden rounded-full bg-sky-soft">
              <Image src={portrait} alt="Yao AVEVOR" fill sizes="80px" className="object-cover object-top" />
            </span>
            <div>
              <p className="font-bold">Yao AVEVOR, Ph.D, PMP®</p>
              <p className="mt-1 text-sm text-mist">
                Docteur-ingénieur, responsable R&amp;D chez Verallia et formateur PMP® agréé PMI. Il rend la gestion de projet — et les chiffres du quotidien — simples et concrets.
              </p>
            </div>
          </div>
          <div className="not-prose mt-8 lg:hidden">
            <ShareBar title={article.title} path={path} />
          </div>
        </div>
      </div>

      <section className="bg-cloud py-20">
        <div className="container-site">
          <h2 className="text-h2 text-navy-deep">À lire ensuite</h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
