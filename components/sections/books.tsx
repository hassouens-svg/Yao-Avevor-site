import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Book, HomeContent } from "@/lib/content/types";
import { SectionHeader } from "@/components/public/section-header";
import { Book3D } from "./book-3d";
import { WaitlistForm } from "./waitlist-form";

/** Livres : une couverture 3D par livre (pivote sous la souris) + inscription aux sorties. */
export function BooksSection({ content, books, headingLevel = "h2" }: { content: HomeContent["books"]; books: Book[]; headingLevel?: "h1" | "h2" }) {
  return (
    <section id="livres" className={headingLevel === "h2" ? "relative overflow-hidden bg-white py-[clamp(4rem,8vw,7rem)]" : "relative overflow-hidden bg-white pb-24"}>
      <div className="container-site">
        {headingLevel === "h2" ? (
          <SectionHeader label={content.label} title={content.title} intro={content.intro} />
        ) : null}
        <ul className={headingLevel === "h2" ? "mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3" : "grid gap-8 md:grid-cols-2 lg:grid-cols-3"}>
          {books.map((b) => (
            <li key={b.slug} className="group relative flex flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#eaf5fd,#dcebf8)]">
              <span className="label-caps absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-navy-deep shadow-soft">
                <span className="size-2 animate-pulse rounded-full bg-blue-bright motion-reduce:animate-none" />
                {b.statusLabel}
              </span>
              <div className="flex justify-center pt-16 pb-6">
                <Book3D title={b.title} subtitle={b.subtitle} cover={b.cover} />
              </div>
              <div className="mt-auto bg-white/70 p-6 backdrop-blur">
                <h3 className="text-[1.375rem] text-navy-deep">{b.title}</h3>
                <p className="mt-1 text-sm font-semibold text-blue">{b.subtitle}</p>
                <p className="mt-3 text-[0.9375rem] text-muted">{b.pitch}</p>
                <Link href={`/livres/${b.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy-deep after:absolute after:inset-0">
                  <span className="link-underline pb-0.5">Découvrir le livre</span>
                  <ArrowUpRight strokeWidth={1.75} className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
          <li className="flex flex-col justify-center rounded-[28px] bg-navy-deep p-8 text-white">
            <p className="label-caps text-sky">— Sorties</p>
            <h3 className="mt-4 text-[1.5rem]">{content.waitlistTitle}</h3>
            <p className="mt-2 text-sm text-mist">{content.waitlistText}</p>
            <div className="mt-2 rounded-[16px] bg-white p-5 text-ink">
              <WaitlistForm />
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
