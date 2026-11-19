/**
 * Couche d'accès au contenu. Aujourd'hui : fichiers locaux (`content/`).
 * Phase 4 : mêmes signatures, lecture depuis Supabase avec `"use cache"` + `cacheTag`.
 */
import { home } from "@/content/home";
import { lexicon } from "@/content/lexicon";
import { articles, categories } from "@/content/articles";
import { gallery, testimonials } from "@/content/testimonials";
import { books } from "@/content/books";

export async function getHomeContent() {
  return home;
}

export async function getLexicon() {
  return lexicon;
}

export async function getCategories() {
  return categories;
}

export async function getRecentArticles(limit = 3) {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, limit);
}

export async function getAllArticles() {
  return [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Témoignages publiés uniquement (les emplacements vides restent invisibles). */
export async function getTestimonials() {
  return testimonials.filter((t) => t.published);
}

export async function getGallery() {
  return gallery;
}

export async function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getRelatedArticles(slug: string, limit = 3) {
  const current = articles.find((a) => a.slug === slug);
  return [...articles]
    .filter((a) => a.slug !== slug)
    .sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}


export async function getBooks() {
  return books;
}

export async function getBook(slug: string) {
  return books.find((b) => b.slug === slug) ?? null;
}
