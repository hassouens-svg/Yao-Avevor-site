import type { Metadata } from "next";
import { getCertifications, getHomeContent, getTimeline } from "@/lib/content";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeader } from "@/components/public/section-header";
import { Profile } from "@/components/sections/profile";
import { Stats } from "@/components/sections/stats";
import { Timeline } from "@/components/sections/timeline";
import { Trust } from "@/components/sections/trust";
import { Button } from "@/components/public/button";

export const metadata: Metadata = {
  title: "À propos — parcours, doctorat, certifications",
  description: "Docteur-ingénieur en mécanique et matériaux, responsable R&D chez Verallia, certifié PMP® et formateur PMI ATP : le parcours de Yao AVEVOR.",
};

export default async function AProposPage() {
  const [content, timeline, certifications] = await Promise.all([getHomeContent(), getTimeline(), getCertifications()]);
  return (
    <>
      <PageHero label="À propos" title="Du laboratoire à l’usine." intro="Une thèse sur l’usinage, l’aéronautique, puis l’industrie verrière. Partout, la même mission : rendre le complexe pilotable — et transmettre la méthode." />
      <Trust content={content.trust} />
      <Profile content={content.profile} full />
      <Stats stats={content.stats} />
      <section className="bg-cloud py-[clamp(4rem,8vw,7rem)]">
        <div className="container-site">
          <SectionHeader label="Parcours" title="Les étapes." />
          <div className="mt-14">
            <Timeline items={timeline} />
          </div>
        </div>
      </section>
      <section className="bg-white py-[clamp(4rem,8vw,7rem)]">
        <div className="container-site">
          <SectionHeader label="Certifications" title="Certifié, et formateur agréé." />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {certifications.map((c, i) => (
              <li key={c.name} className={["rounded-md p-7 text-white", "bg-navy-deep", "bg-blue", "bg-copper"][i % 3]}>
                <p className="label-caps text-sky">{c.year || "Certification"}</p>
                <p className="mt-4 text-[1.375rem] font-bold">{c.name}</p>
                <p className="mt-2 text-sm text-white/75">{c.org}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button href="/contact" className="bg-navy-deep hover:bg-blue">Me contacter</Button>
            <Button href="https://www.woloyem.com/" variant="secondary">Voir les formations</Button>
          </div>
        </div>
      </section>
    </>
  );
}
