/**
 * Couche d'accès au contenu.
 * Source : Appwrite (base « site »), éditable dans l'admin. Repli automatique sur les fichiers `content/`
 * si Appwrite ne répond pas, pour que le site ne tombe jamais.
 *
 * Cache : `"use cache"` + tag « site ». L'admin appelle `refreshSite()` après chaque enregistrement → mise à jour immédiate.
 */
import { cacheLife, cacheTag } from "next/cache";
import { home as localHome } from "@/content/home";
import { lexicon as localLexicon } from "@/content/lexicon";
import { articles as localArticles, categories as localCategories } from "@/content/articles";
import { gallery, testimonials as localTestimonials } from "@/content/testimonials";
import { books as localBooks } from "@/content/books";
import { certifications as localCertifications, timeline as localTimeline } from "@/content/timeline";
import { getRow, listRows, type Row } from "@/lib/appwrite/rest";
import type { ArticleMeta, Book, Category, HomeContent, LexiconTerm, Testimonial } from "./types";

export const SITE_TAG = "site";

/** Fusion profonde : les nouveaux champs du code restent présents même si la base ne les a pas encore. */
function merge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(over) ? over : base) as T;
  if (base && typeof base === "object" && over && typeof over === "object" && !Array.isArray(over)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = k in out ? merge(out[k], v) : v;
    return out as T;
  }
  return (over ?? base) as T;
}

async function block<T>(id: string, fallback: T): Promise<T> {
  "use cache";
  cacheTag(SITE_TAG);
  cacheLife("hours");
  try {
    const row = await getRow("content", id);
    if (!row?.data) return fallback;
    return merge(fallback, JSON.parse(String(row.data)));
  } catch {
    return fallback;
  }
}

async function rows(table: string): Promise<Row[] | null> {
  "use cache";
  cacheTag(SITE_TAG);
  cacheLife("hours");
  try {
    return await listRows(table);
  } catch {
    return null;
  }
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const json = <T,>(v: unknown, fb: T): T => {
  try {
    return typeof v === "string" && v ? (JSON.parse(v) as T) : fb;
  } catch {
    return fb;
  }
};

export type FullArticle = ArticleMeta & { id?: string; body?: string; coverImage?: string };

export async function getHomeContent(): Promise<HomeContent> {
  return block("home", localHome);
}
export async function getLexicon(): Promise<LexiconTerm[]> {
  return block("lexicon", localLexicon);
}
export async function getCategories(): Promise<Category[]> {
  return block("categories", localCategories);
}
export async function getTimeline() {
  return block("timeline", localTimeline);
}
export async function getCertifications() {
  return block("certifications", localCertifications);
}

export async function getAllArticles(): Promise<FullArticle[]> {
  const r = await rows("articles");
  const list: FullArticle[] = r
    ? r
        .filter((x) => x.published !== false)
        .map((x) => ({
          id: x.$id,
          slug: str(x.slug),
          title: str(x.title),
          excerpt: str(x.excerpt),
          category: str(x.category),
          readingMinutes: Number(x.readingMinutes) || 5,
          publishedAt: str(x.publishedAt) || x.$createdAt.slice(0, 10),
          cover: (str(x.cover) || "curve") as ArticleMeta["cover"],
          coverImage: str(x.coverImage),
          body: str(x.body),
        }))
    : localArticles;
  return list.filter((a) => a.slug).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getRecentArticles(limit = 3) {
  return (await getAllArticles()).slice(0, limit);
}

export async function getArticle(slug: string) {
  return (await getAllArticles()).find((a) => a.slug === slug) ?? null;
}

export async function getRelatedArticles(slug: string, limit = 3) {
  const all = await getAllArticles();
  const current = all.find((a) => a.slug === slug);
  return all
    .filter((a) => a.slug !== slug)
    .sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Témoignages publiés, dans l'ordre choisi dans l'admin. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const r = await rows("testimonials");
  if (!r) return localTestimonials.filter((t) => t.published);
  return r
    .filter((x) => x.published !== false)
    .sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0))
    .map((x) => ({
      quote: str(x.quote),
      name: str(x.name),
      role: str(x.role),
      linkedin: str(x.linkedin) || undefined,
      photo: str(x.photo) || undefined,
      videoUrl: str(x.videoUrl) || undefined,
      poster: str(x.poster) || undefined,
      rating: Number(x.rating) || undefined,
      featured: !!x.featured,
      published: true,
    }));
}

export async function getBooks(): Promise<Book[]> {
  const r = await rows("books");
  if (!r) return localBooks;
  return r
    .filter((x) => x.published !== false)
    .sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0))
    .map((x) => ({
      slug: str(x.slug),
      title: str(x.title),
      subtitle: str(x.subtitle),
      status: (str(x.status) || "writing") as Book["status"],
      statusLabel: str(x.statusLabel),
      pitch: str(x.pitch),
      cover: str(x.cover) || undefined,
      excerpts: json(x.excerpts, [] as Book["excerpts"]),
      buyLinks: json(x.buyLinks, [] as Book["buyLinks"]),
    }));
}

export async function getBook(slug: string) {
  return (await getBooks()).find((b) => b.slug === slug) ?? null;
}

export async function getGallery() {
  return gallery;
}

export type PublicTest = { slug: string; title: string; subject: string; description: string; passPct: number; timeLimit: number; antiCheat: boolean; maxExits: number; shuffle: boolean; count: number; questions: { q: string; options: string[]; multiple: boolean }[] };

/** Tests publiés, sans les bonnes réponses (la correction se fait côté serveur). */
export async function getTests(): Promise<PublicTest[]> {
  const r = await rows("tests");
  if (!r) return [];
  return r
    .filter((x) => x.published !== false)
    .map((x) => {
      const qs = json(x.questions, [] as { q: string; options: string[]; answer: number[] }[]);
      return {
        slug: str(x.slug),
        title: str(x.title),
        subject: str(x.subject),
        description: str(x.description),
        passPct: Number(x.passPct) || 70,
        timeLimit: Number(x.timeLimit) || 0,
        antiCheat: x.antiCheat === true,
        maxExits: Math.max(0, Number(x.maxExits) || 0),
        shuffle: x.shuffle === true,
        count: qs.length,
        questions: qs.map(({ q, options, answer }) => ({ q, options, multiple: (answer ?? []).length > 1 })),
      };
    })
    .filter((t) => t.slug && t.count);
}

export async function getTest(slug: string) {
  return (await getTests()).find((t) => t.slug === slug) ?? null;
}
