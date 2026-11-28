"use server";

import { z } from "zod";
import { createRow, listRows } from "@/lib/appwrite/rest";
import { ADMIN_EMAIL, btn, esc, layout, p, sendEmail } from "@/lib/email";
import type { QuizQuestion } from "@/lib/quiz/parse";
import { site } from "@/lib/site";
import { DEFAULT_TEXTS, certificateUrl, fillText, type CertType } from "@/lib/certificate";
import { readToken, signToken } from "@/lib/sign";

const identity = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email(),
});

export type TestResult = {
  ok: boolean;
  message?: string;
  score?: number;
  total?: number;
  pct?: number;
  passed?: boolean;
  passPct?: number;
  /** "ok" | "temps écoulé" | "interrompu (sortie de l'écran)" | "hors délai" */
  status?: string;
  certificateUrl?: string;
  certificateLabel?: string;
  corrections?: { q: string; options: string[]; answer: number[]; given: number[]; correct: boolean; explanation?: string }[];
};

/** Démarrage du test : jeton signé qui fixe l'heure de départ (le chrono ne peut pas être trafiqué). */
export async function startTest(slug: string) {
  return signToken({ slug, t: Date.now() });
}


export type TestMeta = { token?: string; exits?: number; ended?: "normal" | "time" | "exits" };

/** Correction côté serveur : les bonnes réponses ne sont jamais envoyées avant la fin du test. */
export async function gradeTest(slug: string, who: { firstName: string; lastName: string; email: string }, answers: number[][], meta: TestMeta = {}): Promise<TestResult> {
  const id = identity.safeParse(who);
  if (!id.success) return { ok: false, message: "Nom, prénom ou email invalide." };

  const rows = await listRows("tests", [{ method: "equal", attribute: "slug", values: [slug] }]).catch(() => []);
  const row = rows[0];
  if (!row || row.published === false) return { ok: false, message: "Ce test n’est pas disponible." };
  let questions: QuizQuestion[] = [];
  try {
    questions = JSON.parse(String(row.questions || "[]"));
  } catch {}
  if (!questions.length) return { ok: false, message: "Ce test ne contient aucune question." };

  const corrections = questions.map((q, i) => {
    const given = [...new Set((answers[i] ?? []).filter((n) => Number.isInteger(n)))].sort();
    const correct = given.length === q.answer.length && given.every((g, k) => g === q.answer[k]);
    return { q: q.q, options: q.options, answer: q.answer, given, correct, explanation: q.explanation };
  });
  const score = corrections.filter((c) => c.correct).length;
  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const passPct = Number(row.passPct) || 70;

  // Chrono et surveillance
  const timeLimit = Number(row.timeLimit) || 0; // minutes, 0 = sans limite
  const started = readToken<{ slug: string; t: number }>(meta.token);
  const durationSec = started && started.slug === slug ? Math.round((Date.now() - started.t) / 1000) : 0;
  const exits = Math.max(0, Math.min(99, Number(meta.exits) || 0));
  const live = row.mode === "live";
  const liveEnd = live && row.liveEndAt ? Date.parse(String(row.liveEndAt)) : 0;
  let status = "ok";
  if (meta.ended === "exits") status = "interrompu (sortie de l’écran)";
  else if (live && liveEnd && Date.now() > liveEnd + 90_000) status = "hors délai";
  else if (!live && timeLimit && (!started || started.slug !== slug)) status = "chrono non vérifié";
  else if (!live && timeLimit && durationSec > timeLimit * 60 + 90) status = "hors délai";
  else if (meta.ended === "time") status = "temps écoulé";
  // Interrompu, hors délai ou chrono invalide : pas de réussite ni de certificat
  const passed = pct >= passPct && (status === "ok" || status === "temps écoulé");
  const title = String(row.title);
  const d = id.data;

  // Attestation (si le test en propose une et que le seuil est atteint)
  const certType = (String(row.certificate || "none") as CertType);
  let certUrl: string | undefined;
  let certLabel: string | undefined;
  if (passed && certType !== "none") {
    const nom = `${d.firstName} ${d.lastName}`;
    const formation = String(row.trainingName || title);
    const now = new Date().toISOString();
    const text = fillText(String(row.certificateText || "").trim() || DEFAULT_TEXTS[certType], {
      nom,
      formation,
      test: title,
      score: `${pct} %`,
      date: new Date(now).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    });
    const ref = `CERT-${now.slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    certUrl = certificateUrl({ k: certType, n: nom, t: title, f: formation, b: String(row.subject || "Formation"), x: text, s: `${score}/${total} (${pct} %)`, d: now, id: ref });
    certLabel = certType === "training" ? "certificat de fin de formation" : "certificat de réussite";
  }

  await createRow("test_results", {
    testSlug: slug,
    testTitle: title,
    ...d,
    score,
    total,
    pct,
    passed,
    answers: JSON.stringify(corrections.map((c) => c.given)),
    exits,
    durationSec,
    status,
    sessionId: live ? String(row.liveSession || "") : "",
  }).catch(() => {});

  const showCorrection = row.showCorrection !== false;
  const wrong = corrections.filter((c) => !c.correct);
  const letters = (ix: number[]) => ix.map((i) => String.fromCharCode(65 + i)).join(", ") || "—";
  const correctionHtml =
    showCorrection && wrong.length
      ? `<h2 style="font-size:16px;margin:24px 0 8px;color:#071528">À revoir (${wrong.length})</h2>` +
        wrong
          .map(
            (c) =>
              `<div style="border-top:1px solid #e3e7ed;padding:12px 0;font-size:14px;line-height:1.5"><strong>${esc(c.q)}</strong><br>Votre réponse : ${letters(c.given)} · Bonne réponse : <strong>${letters(c.answer)}</strong> — ${esc(c.answer.map((a) => c.options[a]).join(" / "))}${c.explanation ? `<br><span style="color:#5b6474">${esc(c.explanation)}</span>` : ""}</div>`,
          )
          .join("")
      : "";

  await sendEmail({
    to: d.email,
    subject: `${passed ? "Test réussi" : "Résultat de votre test"} — ${title} (${pct} %)`,
    html: layout(
      passed ? "Bravo, test réussi !" : "Votre résultat",
      p(`Bonjour ${esc(d.firstName)},`) +
        p(`Voici votre résultat au test <strong>${esc(title)}</strong> :`) +
        `<p style="font-size:36px;font-weight:bold;margin:8px 0;color:${passed ? "#0d7480" : "#c2410c"}">${score} / ${total} · ${pct} %</p>` +
        p(passed ? `Vous avez atteint le seuil de réussite (${passPct} %).` : `Le seuil de réussite est de ${passPct} %. Revoyez les points ci-dessous et retentez votre chance.`) +
        (status !== "ok" && status !== "temps écoulé" ? p(`<strong>Statut :</strong> test ${esc(status)}.`) : "") +
        (certUrl ? p(`Votre <strong>${certLabel}</strong> est disponible : téléchargez le PDF, imprimez-le ou partagez-le sur LinkedIn.`) + btn(`Télécharger mon ${certLabel}`, certUrl) : "") +
        correctionHtml +
        btn(passed ? "Voir les autres tests" : "Refaire le test", passed ? `${site.url}/tests` : `${site.url}/tests/${slug}`),
    ),
  });
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Test « ${title} » : ${d.firstName} ${d.lastName} — ${pct} % ${passed ? "(réussi)" : ""}`,
    replyTo: d.email,
    html: layout("Nouveau résultat de test", p(`${esc(d.firstName)} ${esc(d.lastName)} (${esc(d.email)}) : <strong>${score}/${total} — ${pct} %</strong> ${passed ? "✅ réussi" : "❌ non réussi"}`) + p(`Durée : ${durationSec ? `${Math.floor(durationSec / 60)} min ${durationSec % 60} s` : "—"} · Sorties de l’écran : ${exits} · Statut : ${esc(status)}`) + btn("Voir les résultats", `${site.url}/admin/tests`)),
  });

  return { ok: true, score, total, pct, passed, passPct, status, certificateUrl: certUrl, certificateLabel: certLabel, corrections: showCorrection ? corrections : undefined };
}
