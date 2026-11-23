import { getAllArticles, getBooks, getCategories, getHomeContent, getTestimonials } from "@/lib/content";
import { Hero } from "@/components/sections/hero";
import { Trust } from "@/components/sections/trust";
import { Stats } from "@/components/sections/stats";
import { Bento } from "@/components/sections/bento";
import { Expertises } from "@/components/sections/expertises";
import { ToolsTeaser } from "@/components/sections/tools-teaser";
import { MarketsStrip } from "@/components/sections/markets";
import { RecentArticles } from "@/components/sections/recent-articles";
import { Pmp } from "@/components/sections/pmp";
import { BooksSection } from "@/components/sections/books";
import { Coaching } from "@/components/sections/coaching";
import { Testimonials } from "@/components/sections/testimonials";
import { Newsletter } from "@/components/sections/newsletter";

export default async function Home() {
  const [content, articles, categories, testimonials, books] = await Promise.all([
    getHomeContent(),
    getAllArticles(),
    getCategories(),
    getTestimonials(),
    getBooks(),
  ]);

  return (
    <>
      <Hero content={content.hero} />
      <Trust content={content.trust} />
      <Stats stats={content.stats} />
      <Bento content={content.bento} />
      <Expertises content={content.expertises} />
      <MarketsStrip />
      <ToolsTeaser content={content.tools} />
      <Pmp content={content.pmp} />
      <Testimonials content={content.testimonials} items={testimonials} />
      <RecentArticles content={content.articles} articles={articles} categories={categories} />
      <BooksSection content={content.books} books={books} />
      <Coaching content={content.coaching} speaking={content.speaking} />
      <Newsletter content={content.newsletter} />
    </>
  );
}
