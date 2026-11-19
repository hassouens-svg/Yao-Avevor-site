import type { HomeContent, Testimonial } from "@/lib/content/types";
import { cn } from "@/lib/cn";
import { SectionHeader } from "@/components/public/section-header";
import { Tilt } from "@/components/public/tilt";
import { VideoTestimonial } from "./video-testimonial";

/** Témoignages : grille de cartes alternées (marine / bleu ciel) + témoignages vidéo. */
export function Testimonials({ content, items }: { content: HomeContent["testimonials"]; items: Testimonial[] }) {
  const quotes = items.filter((t) => !t.videoUrl);
  const videos = items.filter((t) => t.videoUrl);
  if (!items.length) return null;

  return (
    <section id="temoignages" className="bg-cloud py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <SectionHeader label={content.label} title={content.title} />

        {videos.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoTestimonial key={v.name} item={v} />
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {quotes.map((t, i) => {
            const dark = i % 4 === 0 || i % 4 === 3;
            return (
              <Tilt key={t.name} max={4} className={cn("flex flex-col justify-between rounded-[20px] p-8 sm:p-10", dark ? "bg-navy-deep text-white" : "bg-sky-soft text-navy-deep")}>
                <figure>
                  <span aria-hidden="true" className={cn("display block text-5xl leading-none", dark ? "text-sky" : "text-blue")}>
                    “
                  </span>
                  <blockquote className="mt-4 text-[1.1875rem] leading-[1.5] font-medium">{t.quote}</blockquote>
                  <figcaption className="mt-8">
                    {t.linkedin ? (
                      <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="font-bold underline-offset-4 hover:underline">
                        {t.name}
                      </a>
                    ) : (
                      <span className="font-bold">{t.name}</span>
                    )}
                    <span className={cn("mt-1 block text-sm", dark ? "text-mist" : "text-muted")}>{t.role}</span>
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
