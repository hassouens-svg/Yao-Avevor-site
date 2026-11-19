import type { Metadata } from "next";
import { getBooks, getHomeContent } from "@/lib/content";
import { PageHero } from "@/components/public/page-hero";
import { BooksSection } from "@/components/sections/books";

export const metadata: Metadata = {
  title: "Livres",
  description: "Les livres de Yao AVEVOR : des guides pratiques de gestion de projet, de la théorie à la réalité du terrain industriel.",
};

export default async function LivresPage() {
  const [content, books] = await Promise.all([getHomeContent(), getBooks()]);
  return (
    <>
      <PageHero label="Livres" title="Livres." intro={content.books.intro} />
      <BooksSection content={content.books} books={books} headingLevel="h1" />
    </>
  );
}
