import type { Metadata } from "next";
import { getHomeContent, getTestimonials } from "@/lib/content";
import { PageHero } from "@/components/public/page-hero";
import { Testimonials } from "@/components/sections/testimonials";
import { Pmp } from "@/components/sections/pmp";

export const metadata: Metadata = {
  title: "Témoignages",
  description: "Ils ont préparé et obtenu leur certification PMP® avec Yao AVEVOR : témoignages vidéo et recommandations.",
};

export default async function TemoignagesPage() {
  const [content, items] = await Promise.all([getHomeContent(), getTestimonials()]);
  return (
    <>
      <PageHero label="Témoignages" title="Ils ont réussi. Ils en parlent." intro="Vidéos de réussite et recommandations d’apprenants accompagnés vers la certification PMP®." />
      <Testimonials content={content.testimonials} items={items} hideHeader />
      <Pmp content={content.pmp} />
    </>
  );
}
