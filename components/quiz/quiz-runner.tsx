"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, X, Download } from "lucide-react";
import { gradeTest, type TestResult } from "@/lib/actions/tests";
import type { PublicTest } from "@/lib/content";
import { cn } from "@/lib/cn";

const L = (i: number) => String.fromCharCode(65 + i);

export function QuizRunner({ test }: { test: PublicTest }) {
  const [step, setStep] = useState<"id" | "quiz" | "done">("id");
  const [who, setWho] = useState({ firstName: "", lastName: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(() => test.questions.map(() => []));
  const [result, setResult] = useState<TestResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const q = test.questions[i];
  const answered = answers.filter((a) => a.length).length;

  function toggle(o: number) {
    setAnswers((prev) => prev.map((a, k) => (k !== i ? a : q.multiple ? (a.includes(o) ? a.filter((x) => x !== o) : [...a, o]) : [o])));
  }

  async function submit() {
    if (answered < test.count && !confirm(`${test.count - answered} question(s) sans réponse. Terminer quand même ?`)) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await gradeTest(test.slug, who, answers);
      if (!r.ok) setErr(r.message ?? "Erreur.");
      else {
        setResult(r);
        setStep("done");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setErr("Un problème technique est survenu. Merci de réessayer.");
    } finally {
      setBusy(false);
    }
  }

  const input = "h-12 w-full rounded-md border border-line bg-white px-4 text-[0.9375rem] outline-none focus:border-navy";

  if (step === "id")
    return (
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!who.firstName.trim() || !who.lastName.trim() || !/^\S+@\S+\.\S+$/.test(who.email) || !consent) {
            setErr("Merci de renseigner votre prénom, votre nom, un email valide et d’accepter les conditions.");
            return;
          }
          setErr(null);
          setStep("quiz");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-navy">Prénom<input className={cn(input, "mt-2")} autoComplete="given-name" value={who.firstName} onChange={(e) => setWho({ ...who, firstName: e.target.value })} /></label>
          <label className="block text-sm font-medium text-navy">Nom<input className={cn(input, "mt-2")} autoComplete="family-name" value={who.lastName} onChange={(e) => setWho({ ...who, lastName: e.target.value })} /></label>
        </div>
        <label className="block text-sm font-medium text-navy">Email (pour recevoir votre résultat)<input type="email" className={cn(input, "mt-2")} autoComplete="email" value={who.email} onChange={(e) => setWho({ ...who, email: e.target.value })} /></label>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 accent-navy" />
          J’accepte que mes réponses et mon résultat soient enregistrés et me soient envoyés par email.
        </label>
        {err && <p className="text-sm text-[#9b1c1c]">{err}</p>}
        <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-full bg-navy-deep px-7 text-sm font-medium text-white hover:bg-blue">
          Commencer le test ({test.count} questions) <ArrowRight className="size-4" />
        </button>
      </form>
    );

  if (step === "done" && result)
    return (
      <div className="space-y-8">
        <div className={cn("rounded-md border p-8", result.passed ? "border-teal/30 bg-[#e8f5f6]" : "border-[#c2410c]/30 bg-[#fff7ed]")}>
          <p className="label-caps text-muted">{result.passed ? "Test réussi" : "Test non réussi"}</p>
          <p className={cn("display mt-3 text-[clamp(3rem,8vw,5rem)]", result.passed ? "text-teal" : "text-[#c2410c]")}>
            {result.score}/{result.total} · {result.pct} %
          </p>
          <p className="mt-2 text-ink/80">
            {result.passed ? `Bravo ${who.firstName}, vous dépassez le seuil de ${result.passPct} %.` : `Le seuil de réussite est de ${result.passPct} %. Revoyez les points ci-dessous et retentez votre chance.`}
          </p>
          {result.certificateUrl && (
            <a
              href={result.certificateUrl}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-navy-deep px-6 text-sm font-semibold text-white transition-colors hover:bg-copper"
            >
              <Download className="size-4" /> Télécharger mon {result.certificateLabel} (PDF)
            </a>
          )}
          <p className="mt-4 text-sm text-muted">Votre résultat{result.certificateUrl ? " et le lien de votre attestation vous ont été envoyés" : " vous a été envoyé"} à {who.email}.</p>
        </div>
        {result.corrections && (
          <ol className="space-y-4">
            {result.corrections.map((c, k) => (
              <li key={k} className={cn("rounded-md border bg-white p-5", c.correct ? "border-line" : "border-[#c2410c]/40")}>
                <p className="flex gap-3 font-semibold text-navy-deep">
                  {c.correct ? <Check className="mt-0.5 size-5 shrink-0 text-teal" /> : <X className="mt-0.5 size-5 shrink-0 text-[#c2410c]" />}
                  <span>{k + 1}. {c.q}</span>
                </p>
                <ul className="mt-3 space-y-1.5 pl-8 text-sm">
                  {c.options.map((o, oi) => (
                    <li key={oi} className={cn(c.answer.includes(oi) ? "font-semibold text-teal" : c.given.includes(oi) ? "text-[#c2410c] line-through" : "text-muted")}>
                      {L(oi)}) {o}
                    </li>
                  ))}
                </ul>
                {c.explanation && <p className="mt-3 pl-8 text-sm text-ink/75">{c.explanation}</p>}
              </li>
            ))}
          </ol>
        )}
        {result.certificateUrl && (
          <div className="flex flex-col items-start gap-3 rounded-md border border-line bg-cloud p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-navy-deep">Votre <strong>{result.certificateLabel}</strong> est disponible.</p>
            <a href={result.certificateUrl} className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-copper">
              <Download className="size-4" /> Télécharger (PDF)
            </a>
          </div>
        )}
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-muted">
        <span className="font-mono">Question {i + 1} / {test.count}</span>
        <span>{answered} répondue(s)</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-blue transition-[width] duration-300" style={{ width: `${((i + 1) / test.count) * 100}%` }} />
      </div>
      <h2 className="mt-8 text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug font-semibold text-navy-deep normal-case" style={{ fontFamily: "var(--font-sans)" }}>
        {q.q}
      </h2>
      {q.multiple && <p className="mt-2 text-sm text-blue">Plusieurs réponses possibles.</p>}
      <ul className="mt-6 space-y-3">
        {q.options.map((o, oi) => {
          const on = answers[i].includes(oi);
          return (
            <li key={oi}>
              <button
                type="button"
                onClick={() => toggle(oi)}
                aria-pressed={on}
                className={cn("flex w-full items-start gap-4 rounded-md border p-4 text-left transition-colors", on ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white hover:border-navy/40")}
              >
                <span className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-sm", on ? "border-white" : "border-line")}>{L(oi)}</span>
                <span className="pt-0.5">{o}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {err && <p className="mt-4 text-sm text-[#9b1c1c]">{err}</p>}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm disabled:opacity-40">
          <ArrowLeft className="size-4" /> Précédente
        </button>
        {i < test.count - 1 ? (
          <button type="button" onClick={() => setI(i + 1)} className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-deep px-6 text-sm text-white hover:bg-blue">
            Suivante <ArrowRight className="size-4" />
          </button>
        ) : (
          <button type="button" disabled={busy} onClick={submit} className="inline-flex h-11 items-center gap-2 rounded-full bg-teal px-6 text-sm text-white disabled:opacity-60">
            {busy ? "Correction…" : "Terminer et voir mon résultat"}
          </button>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-1.5" aria-label="Aller à une question">
        {test.questions.map((_, k) => (
          <button key={k} type="button" onClick={() => setI(k)} className={cn("size-8 rounded font-mono text-xs", k === i ? "bg-navy-deep text-white" : answers[k].length ? "bg-sky-soft text-navy-deep" : "bg-cloud text-muted")}>
            {k + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
