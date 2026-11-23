import type { Metadata } from "next";
import { SectionLabel } from "@/components/public/section-label";
import { ReviewForm } from "@/components/reviews/review-form";

export const metadata: Metadata = {
  title: "Laisser un avis",
  description: "Vous avez été accompagné(e) par Yao AVEVOR ? Partagez votre expérience.",
  robots: { index: false, follow: true },
};

export default function AvisPage() {
  return (
    <section className="bg-[radial-gradient(90%_80%_at_80%_0%,#e6f1fb,#ffffff_65%)] pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel>Votre avis compte</SectionLabel>
          <h1 className="mt-5 text-h1 text-navy-deep">Partagez votre expérience.</h1>
          <p className="mt-5 max-w-md text-lead text-muted">
            Formation PMP®, coaching, conférence : quelques lignes suffisent. Votre avis est publié après une rapide validation.
          </p>
        </div>
        <div className="rounded-md border border-line bg-white p-6 sm:p-10 lg:col-span-7">
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
