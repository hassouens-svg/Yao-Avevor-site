import type { Metadata } from "next";
import { getHomeContent } from "@/lib/content";
import { site } from "@/lib/site";
import { PageHero } from "@/components/public/page-hero";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Formation PMP®, coaching, conférence, presse : contactez Yao AVEVOR.",
};

export default async function ContactPage() {
  const content = await getHomeContent();
  return (
    <>
      <PageHero label="Contact" title="Parlons de votre projet." intro={content.contact.text} />
      <Contact content={content.contact} email={site.email} linkedin={site.linkedin} />
    </>
  );
}
