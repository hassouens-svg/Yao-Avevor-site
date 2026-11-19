import Image from "next/image";
import type { HomeContent } from "@/lib/content/types";
import { Button } from "@/components/public/button";
import { Reveal } from "@/components/public/reveal";
import { Tilt } from "@/components/public/tilt";
import portrait from "@/public/images/portrait-2-cutout.png";

/** Bloc « formation PMP® » : badge, titre, puces de chiffres, CTA, photo. */
export function Pmp({ content }: { content: HomeContent["pmp"] }) {
  return (
    <section id="pmp" className="bg-cloud py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-xs text-navy-deep">
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-blue" />
            {content.badge}
          </p>
          <Reveal as="h2" mode="lines" className="mt-6 text-h2 text-navy-deep">
            {content.title}
          </Reveal>
          <p className="mt-5 max-w-xl text-lead text-muted">{content.text}</p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {content.chips.map((c) => (
              <li key={c.label} className="rounded-[14px] border border-line bg-white p-4">
                <p className="display text-[1.75rem] text-navy-deep">{c.value}</p>
                <p className="mt-1.5 text-xs leading-snug text-muted">{c.label}</p>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button href={content.cta.href} magnetic className="bg-navy-deep hover:bg-blue">
              {content.cta.label}
            </Button>
            <p className="text-sm text-muted">{content.note}</p>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Tilt className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,#ffffff,#dcebf8)]">
            <Image src={portrait} alt="Yao AVEVOR, formateur PMP®" fill sizes="(min-width:1024px) 40vw, 90vw" className="object-contain object-bottom" />
            <Image
              src="/logos/pmp-woloyem.png"
              alt="Badge PMP®"
              width={340}
              height={340}
              className="absolute top-6 right-6 size-24 drop-shadow-xl motion-safe:animate-[bookfloat_6s_ease-in-out_infinite] sm:size-28"
            />
          </Tilt>
        </div>
      </div>
    </section>
  );
}
