import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBook, getBooks, getHomeContent } from "@/lib/content";
import { Book3D } from "@/components/sections/book-3d";
import { ExcerptCarousel } from "@/components/sections/excerpt-carousel";
import { WaitlistForm } from "@/components/sections/waitlist-form";
import { Button } from "@/components/public/button";

export async function generateStaticParams() {
  return (await getBooks()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = await getBook((await params).slug);
  return b ? { title: `${b.title} — ${b.subtitle}`, description: b.pitch } : {};
}

export default async function LivrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [book, content] = await Promise.all([getBook(slug), getHomeContent()]);
  if (!book) notFound();
  return (
    <section className="bg-[radial-gradient(90%_80%_at_80%_0%,#e6f1fb,#ffffff_65%)] pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="container-site">
        <Link href="/livres" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy-deep">
          <ArrowLeft strokeWidth={1.5} className="size-4" /> Tous les livres
        </Link>
        <div className="mt-10 grid items-center gap-14 lg:grid-cols-12">
          <div className="flex justify-center rounded-[28px] bg-[linear-gradient(160deg,#eaf5fd,#dcebf8)] py-16 lg:col-span-5">
            <Book3D title={book.title} subtitle={book.subtitle} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="label-caps text-blue">{book.statusLabel}</p>
            <h1 className="mt-4 text-h1 text-navy-deep">{book.title}</h1>
            <p className="mt-3 text-[1.25rem] font-semibold text-blue">{book.subtitle}</p>
            <p className="mt-5 text-lead text-muted">{book.pitch}</p>
            {book.buyLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {book.buyLinks.map((l) => (
                  <Button key={l.href} href={l.href} className="bg-navy-deep hover:bg-blue">{l.label}</Button>
                ))}
              </div>
            )}
            <ExcerptCarousel excerpts={book.excerpts} />
            <div className="mt-10 rounded-[20px] border border-line bg-white p-6 sm:p-8">
              <h2 className="text-[1.5rem] text-navy-deep">{content.books.waitlistTitle}</h2>
              <p className="mt-1.5 text-[0.9375rem] text-muted">{content.books.waitlistText}</p>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
