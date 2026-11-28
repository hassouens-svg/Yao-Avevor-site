"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, Download, Plus, Trash2 } from "lucide-react";
import { DB_ID, ID, Query, errorMessage, tables } from "@/lib/appwrite/browser";
import { refreshSite } from "@/lib/actions/refresh";
import { parseQuiz, type QuizQuestion } from "@/lib/quiz/parse";
import { Btn, Card, Field, Select, TextArea, TextInput, Toggle, useToast } from "@/components/admin/ui";
import { ShareLink } from "@/components/admin/share-link";
import { cn } from "@/lib/cn";

type TestRow = { $id: string; slug: string; title: string; subject?: string; description?: string; passPct?: number; questions?: string; source?: string; showCorrection?: boolean; published?: boolean; certificate?: string; trainingName?: string; certificateText?: string; timeLimit?: number; antiCheat?: boolean; maxExits?: number; shuffle?: boolean };
type Result = { $id: string; $createdAt: string; testSlug: string; firstName: string; lastName: string; email: string; score: number; total: number; pct: number; passed: boolean; exits?: number; durationSec?: number; status?: string };
const dur = (s?: number) => (s ? `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")}` : "—");

const EXAMPLE = `1. Qui est responsable de prioriser le Product Backlog ?
A) Le Scrum Master
B) Le Product Owner
C) Le sponsor
D) L'équipe de développement
Réponse : B
Explication : Le Product Owner maximise la valeur du produit et ordonne le backlog.

2. Un projet a un CPI de 0,8. Que peut-on en conclure ?
A) Il est en avance
B) Il dépense plus que prévu pour le travail réalisé
C) Il est en retard
D) Il est dans le budget
Réponse : B`;

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

function toSource(qs: QuizQuestion[]) {
  return qs
    .map((q, i) => [`${i + 1}. ${q.q}`, ...q.options.map((o, k) => `${String.fromCharCode(65 + k)}) ${o}`), `Réponse : ${q.answer.map((a) => String.fromCharCode(65 + a)).join(", ")}`, ...(q.explanation ? [`Explication : ${q.explanation}`] : [])].join("\n"))
    .join("\n\n");
}

export default function TestsAdmin() {
  const [rows, setRows] = useState<TestRow[] | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [edit, setEdit] = useState<(Omit<TestRow, "$id"> & { $id?: string }) | null>(null);
  const [view, setView] = useState<"edit" | "results">("edit");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const [t, r] = await Promise.all([
        tables.listRows({ databaseId: DB_ID, tableId: "tests", queries: [Query.limit(200), Query.orderDesc("$createdAt")] }),
        tables.listRows({ databaseId: DB_ID, tableId: "test_results", queries: [Query.limit(1000), Query.orderDesc("$createdAt")] }),
      ]);
      setRows(t.rows as unknown as TestRow[]);
      setResults(r.rows as unknown as Result[]);
    } catch (e) {
      toast(errorMessage(e), "error");
      setRows([]);
    }
  }, [toast]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const parsed = useMemo(() => (edit ? parseQuiz(edit.source ?? "") : { questions: [], errors: [] }), [edit]);

  function open(r: TestRow | null) {
    setView("edit");
    if (!r) return setEdit({ slug: "", title: "", subject: "Gestion de projet", description: "", passPct: 70, source: "", showCorrection: true, published: true });
    let source = r.source ?? "";
    if (!source && r.questions) {
      try {
        source = toSource(JSON.parse(r.questions));
      } catch {}
    }
    setEdit({ ...r, source });
  }

  async function save() {
    if (!edit) return;
    if (!edit.title.trim()) return toast("Donnez un titre au test.", "error");
    if (!parsed.questions.length) return toast("Aucune question valide détectée.", "error");
    const data = {
      slug: edit.slug?.trim() || slugify(edit.title),
      title: edit.title.trim(),
      subject: edit.subject ?? "",
      description: edit.description ?? "",
      passPct: Number(edit.passPct) || 70,
      questions: JSON.stringify(parsed.questions),
      showCorrection: edit.showCorrection !== false,
      published: edit.published !== false,
      certificate: edit.certificate || "none",
      trainingName: edit.trainingName ?? "",
      certificateText: edit.certificateText ?? "",
      timeLimit: Math.max(0, Math.round(Number(edit.timeLimit) || 0)),
      antiCheat: edit.antiCheat === true,
      maxExits: Math.max(0, Math.round(Number(edit.maxExits) || 0)),
      shuffle: edit.shuffle === true,
    };
    setSaving(true);
    try {
      if (edit.$id) await tables.updateRow({ databaseId: DB_ID, tableId: "tests", rowId: edit.$id, data });
      else {
        const created = await tables.createRow({ databaseId: DB_ID, tableId: "tests", rowId: ID.unique(), data });
        setEdit({ ...edit, ...data, $id: created.$id });
      }
      await refreshSite();
      toast(`Test enregistré (${parsed.questions.length} questions).`);
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    } finally {
      setSaving(false);
    }
  }

  function exportCsv(list: Result[], name: string) {
    const lines = [["prenom", "nom", "email", "score", "total", "pourcentage", "reussi", "statut", "duree", "sorties", "date"], ...list.map((r) => [r.firstName, r.lastName, r.email, r.score, r.total, r.pct, r.passed ? "oui" : "non", r.status ?? "ok", dur(r.durationSec), r.exits ?? 0, r.$createdAt.slice(0, 16).replace("T", " ")])];
    const csv = lines.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `resultats-${name}.csv`;
    a.click();
  }

  if (edit) {
    const set = (k: string, v: unknown) => setEdit({ ...edit, [k]: v });
    const slug = edit.slug || slugify(edit.title);
    const testResults = results.filter((r) => r.testSlug === slug);
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => setEdit(null)} className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy-deep"><ChevronLeft className="size-4" /> Tous les tests</button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="display text-3xl text-navy-deep">{edit.$id ? edit.title : "Nouveau test"}</h1>
          <div className="flex gap-2">
            {edit.$id && <Btn variant="danger" onClick={async () => { if (!confirm("Supprimer ce test ?")) return; await tables.deleteRow({ databaseId: DB_ID, tableId: "tests", rowId: edit.$id! }); await refreshSite(); setEdit(null); load(); }}><Trash2 className="size-4" /></Btn>}
            <Btn onClick={save} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
          </div>
        </div>
        {edit.$id && (
          <>
            <ShareLink path={`/tests/${slug}`} label="Lien du test à envoyer" message={`Testez vos connaissances : « ${edit.title} »`} />
            <div className="flex gap-2">
              {(["edit", "results"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)} className={cn("rounded-full border px-4 py-1.5 text-sm", view === v ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white")}>
                  {v === "edit" ? "Questions" : `Résultats (${testResults.length})`}
                </button>
              ))}
            </div>
          </>
        )}

        {view === "results" ? (
          <Card className="overflow-x-auto p-0 sm:p-0">
            <div className="flex justify-end p-3"><Btn variant="secondary" onClick={() => exportCsv(testResults, slug)} disabled={!testResults.length}><Download className="size-4" /> Exporter (Excel)</Btn></div>
            <table className="w-full text-left text-sm">
              <thead className="bg-cloud text-xs text-muted uppercase"><tr><th className="px-4 py-3">Participant</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Résultat</th><th className="px-4 py-3">Durée</th><th className="px-4 py-3">Sorties</th><th className="px-4 py-3">Date</th></tr></thead>
              <tbody className="divide-y divide-line">
                {testResults.map((r) => (
                  <tr key={r.$id}>
                    <td className="px-4 py-3 font-medium text-navy-deep">{r.firstName} {r.lastName}</td>
                    <td className="px-4 py-3 text-muted">{r.email}</td>
                    <td className="px-4 py-3 font-mono">{r.score}/{r.total} · {r.pct} %</td>
                    <td className="px-4 py-3">{r.passed ? <span className="rounded-full bg-[#e8f5f6] px-2.5 py-1 text-xs text-teal">Réussi</span> : <span className="rounded-full bg-[#fff7ed] px-2.5 py-1 text-xs text-[#c2410c]">Non réussi</span>}{r.status && r.status !== "ok" && <span className="mt-1 block text-xs text-[#9b1c1c]">{r.status}</span>}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{dur(r.durationSec)}</td>
                    <td className={cn("px-4 py-3 font-mono text-xs", r.exits ? "font-bold text-[#c2410c]" : "text-muted")}>{r.exits ?? 0}</td>
                    <td className="px-4 py-3 text-muted">{new Date(r.$createdAt).toLocaleString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!testResults.length && <p className="p-6 text-sm text-muted">Aucun participant pour l’instant.</p>}
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="space-y-5">
              <Field label="Titre du test"><TextInput value={edit.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex. PMP® — Agilité et Scrum" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Sujet"><TextInput value={edit.subject ?? ""} onChange={(e) => set("subject", e.target.value)} placeholder="Gestion de projet, Finances…" /></Field>
                <Field label="Seuil de réussite (%)"><TextInput type="number" min={0} max={100} value={edit.passPct ?? 70} onChange={(e) => set("passPct", Number(e.target.value))} /></Field>
              </div>
              <Field label="Description (facultatif)"><TextArea value={edit.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2} /></Field>
              <Field label="Adresse (URL)" hint="Laissez vide : créée à partir du titre."><TextInput value={edit.slug} onChange={(e) => set("slug", slugify(e.target.value))} /></Field>
              <div className="flex flex-wrap gap-6">
                <Toggle checked={edit.showCorrection !== false} onChange={(v) => set("showCorrection", v)} label="Montrer la correction à la fin" />
                <Toggle checked={edit.published !== false} onChange={(v) => set("published", v)} label="Test en ligne" />
              </div>
              <div className="space-y-4 rounded-md border border-line bg-cloud p-4">
                <p className="text-sm font-semibold text-navy-deep">Conditions d’examen</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Durée (minutes)" hint="0 = pas de chrono. À la fin, le test est envoyé automatiquement.">
                    <TextInput type="number" min={0} max={600} value={edit.timeLimit ?? 0} onChange={(e) => set("timeLimit", Number(e.target.value))} />
                  </Field>
                  {edit.antiCheat && (
                    <Field label="Sorties d’écran tolérées" hint="0 = la première sortie termine le test.">
                      <TextInput type="number" min={0} max={10} value={edit.maxExits ?? 0} onChange={(e) => set("maxExits", Number(e.target.value))} />
                    </Field>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <Toggle checked={edit.antiCheat === true} onChange={(v) => set("antiCheat", v)} label="Examen surveillé : sortie de l’écran détectée, copier-coller bloqué, écran maintenu allumé, plein écran sur ordinateur" />
                  <Toggle checked={edit.shuffle === true} onChange={(v) => set("shuffle", v)} label="Mélanger l’ordre des questions et des réponses pour chaque participant" />
                </div>
              </div>
              <div className="space-y-4 rounded-md border border-line bg-cloud p-4">
                <Field label="Document téléchargeable (si le seuil est atteint)">
                  <Select
                    value={edit.certificate || "none"}
                    onChange={(e) => set("certificate", e.target.value)}
                    options={[
                      { value: "none", label: "Pas d’attestation" },
                      { value: "quiz", label: "Attestation de réussite du test (quiz seul)" },
                      { value: "training", label: "Certificat de réussite à une formation" },
                    ]}
                  />
                </Field>
                {edit.certificate === "training" && (
                  <Field label="Nom de la formation suivie"><TextInput value={edit.trainingName ?? ""} onChange={(e) => set("trainingName", e.target.value)} placeholder="Ex. Gestion de projet — les fondamentaux" /></Field>
                )}
                {edit.certificate && edit.certificate !== "none" && (
                  <Field
                    label="Texte de l’attestation (facultatif)"
                    hint="Laissez vide pour le texte par défaut. Mots remplacés automatiquement : {nom}, {formation}, {test}, {score}, {date}."
                  >
                    <TextArea
                      rows={4}
                      value={edit.certificateText ?? ""}
                      onChange={(e) => set("certificateText", e.target.value)}
                      placeholder={
                        edit.certificate === "training"
                          ? "{nom} a suivi l’ensemble des modules de la formation « {formation} » et a réussi le test de fin de formation avec un score de {score}. Cette réussite atteste de l’assimilation des connaissances théoriques nécessaires pour cadrer, planifier, piloter et clôturer un projet."
                          : "{nom} a réussi le test « {test} » avec un score de {score}, attestant de sa bonne maîtrise des notions évaluées."
                      }
                    />
                  </Field>
                )}
              </div>
              <Field label="Questions et réponses (copier-coller)" hint="Une question, ses propositions A) B) C)…, puis « Réponse : B » (ou « Réponses : A, C »). « Explication : … » est facultatif. Laissez une ligne vide entre les questions.">
                <TextArea className="min-h-[28rem] font-mono text-[13px]" value={edit.source ?? ""} onChange={(e) => set("source", e.target.value)} placeholder={EXAMPLE} />
              </Field>
            </Card>
            <Card>
              <p className="text-sm font-semibold text-navy-deep">
                Aperçu : <span className={parsed.questions.length ? "text-teal" : "text-muted"}>{parsed.questions.length} question(s) reconnue(s)</span>
              </p>
              {parsed.errors.length > 0 && (
                <ul className="mt-3 space-y-1 rounded-md bg-[#fff7ed] p-3 text-sm text-[#9a3412]">
                  {parsed.errors.map((e) => <li key={e}>⚠ {e}</li>)}
                </ul>
              )}
              <ol className="mt-4 max-h-[40rem] space-y-4 overflow-auto pr-2">
                {parsed.questions.map((q, i) => (
                  <li key={i} className="border-b border-line pb-3 text-sm">
                    <p className="font-semibold text-navy-deep">{i + 1}. {q.q}</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {q.options.map((o, k) => <li key={k} className={q.answer.includes(k) ? "font-semibold text-teal" : "text-muted"}>{String.fromCharCode(65 + k)}) {o} {q.answer.includes(k) && "✓"}</li>)}
                    </ul>
                    {q.explanation && <p className="mt-1 text-xs text-muted italic">{q.explanation}</p>}
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-navy-deep">Tests</h1>
          <p className="mt-1 text-sm text-muted">Créez des tests par copier-coller, envoyez le lien, consultez les résultats. Les participants reçoivent leur résultat par email.</p>
        </div>
        <Btn onClick={() => open(null)}><Plus className="size-4" /> Nouveau test</Btn>
      </header>
      <ShareLink path="/tests" label="Page publique de tous les tests" message="Testez vos connaissances en gestion de projet :" />
      <Card className="p-0 sm:p-0">
        {rows === null ? (
          <p className="p-6 text-sm text-muted">Chargement…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted">Aucun test. Cliquez sur « Nouveau test ».</p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((r) => {
              let n = 0;
              try { n = JSON.parse(r.questions || "[]").length; } catch {}
              const res = results.filter((x) => x.testSlug === r.slug);
              const avg = res.length ? Math.round(res.reduce((a, b) => a + b.pct, 0) / res.length) : null;
              return (
                <li key={r.$id}>
                  <button type="button" onClick={() => open(r)} className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-cloud">
                    <span>
                      <span className="block font-semibold text-navy-deep">{r.title}</span>
                      <span className="text-sm text-muted">{r.subject} · {n} questions · {res.length} participant(s){avg !== null ? ` · moyenne ${avg} %` : ""}</span>
                    </span>
                    <span className={cn("rounded-full px-3 py-1 text-xs", r.published === false ? "bg-cloud text-muted" : "bg-sky-soft text-navy-deep")}>{r.published === false ? "Hors ligne" : "En ligne"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
