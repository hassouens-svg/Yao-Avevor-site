import type { HomeContent } from "@/lib/content/types";
import { SectionHeader } from "@/components/public/section-header";
import { Book3D } from "./book-3d";
import { ExcerptCarousel } from "./excerpt-carousel";
import { WaitlistForm } from "./waitlist-form";

/** Le livre : couverture 3D qui pivote sous la souris, extraits, liste d'attente. */
export function BookSection({ content }: { content: HomeContent["book"] }) {
  return (
    <section id="livre" className="relative overflow-hidden bg-white py-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <SectionHeader label={content.label} title={`${content.title} — bientôt.`} />
        <div className="mt-12 grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="relative flex justify-center rounded-[28px] bg-[radial-gradient(80%_80%_at_50%_40%,#eaf5fd,#f3f6fa)] py-14 lg:col-span-5">
            <Book3D title={content.title} subtitle={content.subtitle} />
            <span className="label-caps absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-navy-deep shadow-soft">
              <span className="size-2 animate-pulse rounded-full bg-blue-bright motion-reduce:animate-none" />
              {content.statusLabel}
            </span>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[clamp(1.25rem,1.8vw,1.5rem)] leading-snug font-semibold text-navy-deep">{content.subtitle}</p>
            <p className="mt-4 max-w-xl text-lead text-muted">{content.pitch}</p>
            <ExcerptCarousel excerpts={content.excerpts} />
            <div className="mt-10 rounded-[20px] border border-line bg-cloud p-6 sm:p-8">
              <h3 className="text-[1.25rem] text-navy-deep">{content.waitlistTitle}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-muted">{content.waitlistText}</p>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
