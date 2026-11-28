import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTest, getTests } from "@/lib/content";
import { QuizRunner } from "@/components/quiz/quiz-runner";

export async function generateStaticParams() {
  const t = await getTests();
  return t.length ? t.map((x) => ({ slug: x.slug })) : [{ slug: "exemple" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await getTest((await params).slug);
  return t ? { title: `${t.title} — test`, description: t.description || `${t.count} questions · ${t.subject}` } : {};
}

export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const test = await getTest((await params).slug);
  if (!test) notFound();
  return (
    <section className="bg-[radial-gradient(90%_80%_at_80%_0%,#e6f1fb,#ffffff_65%)] pt-[calc(var(--header-h)+2.5rem)] pb-24">
      <div className="container-site max-w-3xl">
        <Link href="/tests" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy-deep">
          <ArrowLeft className="size-4" strokeWidth={1.5} /> Tous les tests
        </Link>
        <p className="label-caps mt-8 text-blue">{test.subject || "Test"} · {test.count} questions{test.timeLimit ? ` · ${test.timeLimit} min` : ""} · réussite à {test.passPct} %{test.antiCheat ? " · examen surveillé" : ""}</p>
        <h1 className="mt-3 text-h1 text-navy-deep">{test.title}</h1>
        {test.description && <p className="mt-4 text-lead text-muted">{test.description}</p>}
        <div className="mt-10 rounded-md border border-line bg-white p-6 sm:p-10">
          <QuizRunner test={test} />
        </div>
      </div>
    </section>
  );
}
