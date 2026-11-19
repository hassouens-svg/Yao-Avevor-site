import type { Metadata } from "next";
import { getHomeContent, getTestimonials } from "@/lib/content";
import { PageHero } from "@/components/public/page-hero";
import { Pmp } from "@/components/sections/pmp";
import { Coaching } from "@/components/sections/coaching";
import { Speaking } from "@/components/sections/speaking";
import { Testimonials } from "@/components/sections/testimonials";
import { Expertises } from "@/components/sections/expertises";

export const metadata: Metadata = {
  title: "Formations — préparation PMP®, coaching, interventions",
  description: "Bootcamps de préparation à la certification PMP® avec Woloyem (PMI ATP), coaching individuel, ateliers en entreprise et conférences.",
};

export default async function FormationsPage() {
  const [content, testimonials] = await Promise.all([getHomeContent(), getTestimonials()]);
  return (
    <>
      <PageHero label="Formations & coaching" title="Apprendre avec méthode." intro="Préparer le PMP®, prendre un poste de chef de projet, structurer une équipe R&D : des formats exigeants, concrets, conçus pour durer après la formation." />
      <Pmp content={content.pmp} />
      <Testimonials content={content.testimonials} items={testimonials} />
      <Coaching content={content.coaching} />
      <Speaking content={content.speaking} />
      <Expertises content={content.expertises} />
    </>
  );
}
