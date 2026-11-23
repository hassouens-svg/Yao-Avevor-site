import Image from "next/image";
import type { HomeContent } from "@/lib/content/types";
import { Button } from "@/components/public/button";
import Link from "next/link";
import portrait from "@/public/images/portrait-2-cutout.png";

/** Carte scindée : photo claire à gauche, panneau bleu marine à droite. */
export function Coaching({ content, speaking }: { content: HomeContent["coaching"]; speaking?: HomeContent["speaking"] }) {
  return (
    <section id="accompagnement" className="bg-white py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-md lg:grid-cols-2">
          <div className="relative min-h-[22rem] bg-[linear-gradient(160deg,#eef4fb,#dcebf8)]">
            <Image src={portrait} alt="Yao AVEVOR" fill quality={90} sizes="(min-width:1024px) 50vw, 100vw" className="object-contain object-bottom" />
          </div>
          <div className="blueprint blueprint-dark relative bg-navy-deep p-8 text-white sm:p-12 lg:p-14">
            <p className="label-caps text-sky">— {content.label}</p>
            <h2 className="mt-5 text-[clamp(2.25rem,3.6vw,3.5rem)] leading-[1.1]">{content.title}</h2>
            <p className="mt-5 max-w-lg text-mist">{content.text}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {content.options.map((o) => (
                <div key={o.title} className="rounded-md border border-white/12 bg-white/[0.04] p-5">
                  <h3 className="text-base text-white">{o.title}</h3>
                  <p className="mt-2 text-sm text-mist">{o.text}</p>
                </div>
              ))}
            </div>
            {speaking && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="label-caps text-copper-light">— {speaking.title}</p>
                <p className="mt-2 text-sm text-mist">{speaking.text}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {speaking.tabs.map((t) => (
                    <li key={t.key}>
                      <Link href={speaking.cta.href} title={t.text} className="inline-flex h-9 items-center rounded-full border border-white/15 px-4 text-sm text-white/90 transition-colors hover:border-copper-light hover:bg-copper-light hover:text-navy-deep">
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button href={content.cta.href} variant="light" magnetic className="mt-9">
              {content.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
