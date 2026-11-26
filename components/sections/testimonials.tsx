import type { HomeContent, Testimonial } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/public/section-header";
import { Tilt } from "@/components/public/tilt";
import Link from "next/link";
import { Star } from "lucide-react";
import { VideoTestimonial } from "./video-testimonial";
import { ExpandableQuote } from "./expandable-quote";

/** Témoignages : grille de cartes alternées (marine / bleu ciel) + témoignages vidéo. */
export function Testimonials({ content, items, hideHeader = false }: { content: HomeContent["testimonials"]; items: Testimonial[]; hideHeader?: boolean }) {
  const quotes = items.filter((t) => !t.videoUrl);
  const videos = items.filter((t) => t.videoUrl);
  if (!items.length) return null;

  return (
    <section id="temoignages" className="bg-cloud py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {!hideHeader && <SectionHeader label={content.label} title={content.title} />}
          <Link href="/avis" className="inline-flex h-10 items-center rounded-full border border-navy-deep px-5 text-sm font-medium text-navy-deep transition-colors hover:bg-navy-deep hover:text-white">
            Laisser un avis
          </Link>
        </div>

        {videos.length > 0 && (
          <div className={cn("mt-10 grid gap-5 md:grid-cols-2", videos.length !== 2 && videos.length !== 4 && "lg:grid-cols-3")}>
            {videos.map((v) => (
              <VideoTestimonial key={v.name} item={v} />
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {quotes.map((t, i) => {
            const dark = i % 4 === 0 || i % 4 === 3;
            return (
              <Tilt key={t.name} max={4} className={cn("flex flex-col justify-between self-start rounded-md p-8 sm:p-10", dark ? "bg-navy-deep text-white" : "bg-sky-soft text-navy-deep")}>
                <figure>
                  <span aria-hidden="true" className={cn("display block text-5xl leading-none", dark ? "text-sky" : "text-blue")}>
                    “
                  </span>
                  <ExpandableQuote text={t.quote} dark={dark} />
                  {t.rating ? (
                    <p className="mt-5 flex gap-0.5" aria-label={`Note : ${t.rating} sur 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} aria-hidden="true" className={cn("size-4", n <= t.rating! ? "fill-[#e0a400] text-[#e0a400]" : dark ? "text-white/20" : "text-navy/15")} />
                      ))}
                    </p>
                  ) : null}
                  <figcaption className="mt-6 flex items-center gap-3">
                    {t.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.photo} alt="" className="size-11 shrink-0 rounded-full object-cover" />
                    )}
                    <span>
                    {t.linkedin ? (
                      <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="font-bold underline-offset-4 hover:underline">
                        {t.name}
                      </a>
                    ) : (
                      <span className="font-bold">{t.name}</span>
                    )}
                    <span className={cn("mt-1 block text-sm", dark ? "text-mist" : "text-muted")}>{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Tilt>
            );
          })}
        </div>
      </div>
    </section>
  );
}
