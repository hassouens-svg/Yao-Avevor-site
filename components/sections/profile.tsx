import Image from "next/image";
import { Mail } from "lucide-react";
import type { HomeContent } from "@/lib/content/types";
import { SectionHeader } from "@/components/public/section-header";
import { Reveal } from "@/components/public/reveal";
import { Tilt } from "@/components/public/tilt";
import portrait from "@/public/images/portrait-2-cutout.png";

/** Profil : le récapitulatif de Yao (texte de son profil LinkedIn). */
export function Profile({ content, full = false }: { content: HomeContent["profile"]; full?: boolean }) {
  const paragraphs = full ? content.paragraphs : content.paragraphs.slice(0, 4);
  return (
    <section id="profil" className="bg-white py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeader label={content.label} title={content.title} />
          <Tilt className="relative mt-10 aspect-[4/5] max-w-md overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#1d4f91,#0b1f3a)]">
            <Image src="/images/banner/usine.jpg" alt="" fill sizes="40vw" className="object-cover opacity-40 mix-blend-luminosity blur-[2px]" />
            <Image src={portrait} alt="Yao AVEVOR" fill sizes="(min-width:1024px) 35vw, 90vw" className="object-contain object-bottom" />
          </Tilt>
        </div>
        <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-ink/85 lg:col-span-6 lg:col-start-7 lg:pt-20">
          {paragraphs.map((p, i) => (
            <Reveal as="p" key={i} delay={i * 0.05} className={i === 0 ? "text-[1.25rem] leading-relaxed font-semibold text-navy-deep" : undefined}>
              {p}
            </Reveal>
          ))}
          <a
            href={`mailto:${content.email}`}
            className="mt-4 inline-flex items-center gap-3 rounded-full bg-navy-deep px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue"
          >
            <Mail strokeWidth={1.5} className="size-4" aria-hidden="true" />
            {content.email}
          </a>
        </div>
      </div>
    </section>
  );
}
