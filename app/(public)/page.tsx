import Image from "next/image";
import { Button } from "@/components/public/button";
import { Reveal } from "@/components/public/reveal";
import { SectionLabel } from "@/components/public/section-label";
import portrait from "@/public/images/portrait-cutout.png";

/**
 * Accueil — phase 2 : hero provisoire servant à valider les fondations (header, typo, halo, portrait).
 * Les 14 sections arrivent en phase 3.
 */
export default function Home() {
  return (
    <section
      data-header-dark
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy-deep text-white"
    >
      {/* Halo bleu ciel diffus */}
      <div
        aria-hidden="true"
        className="absolute top-[18%] right-[-10%] -z-10 size-[min(90vw,900px)] rounded-full bg-[radial-gradient(closest-side,rgb(140_200_240/0.22),transparent)] blur-2xl lg:right-[2%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_60%,rgb(7_21_40/0.9))]" />

      <div className="container-site grid w-full items-end gap-10 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12">
        <div className="pb-16 lg:col-span-7 lg:pb-28">
          <SectionLabel tone="dark">Ph.D · PMP® · Formateur PMI ATP</SectionLabel>
          <Reveal as="h1" mode="lines" immediate delay={0.1} className="mt-8 font-serif text-display">
            Piloter vos <em className="italic-accent text-sky">projets</em>. Maîtriser votre{" "}
            <em className="italic-accent text-sky">argent</em>.
          </Reveal>
          <Reveal as="p" immediate delay={0.5} className="mt-8 max-w-xl text-lead text-mist">
            Docteur-ingénieur et responsable R&amp;D dans l’industrie, j’applique la rigueur de la gestion de projet
            industrielle à vos projets — et à votre argent.
          </Reveal>
          <Reveal immediate delay={0.65} className="mt-10 flex flex-wrap gap-4">
            <Button href="/articles" variant="light" magnetic>
              Découvrir mes articles
            </Button>
            <Button
              href="/contact"
              arrow={false}
              className="border border-white/25 bg-transparent text-white hover:border-white hover:bg-white hover:text-navy"
            >
              Me contacter
            </Button>
          </Reveal>
        </div>
        <div className="relative mx-auto w-full max-w-[520px] lg:col-span-5 lg:max-w-none">
          <Image
            src={portrait}
            alt="Portrait de Yao AVEVOR en costume bleu marine, bras croisés"
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="h-auto w-full [mask-image:linear-gradient(180deg,#000_75%,transparent)]"
          />
        </div>
      </div>
    </section>
  );
}
