"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock, Download, ShieldCheck, X } from "lucide-react";
import { gradeTest, startTest, type TestMeta, type TestResult } from "@/lib/actions/tests";
import { joinLive, liveStatus, loadQuestions } from "@/lib/actions/live";
import type { PublicTest } from "@/lib/content";
import { cn } from "@/lib/cn";

const L = (i: number) => String.fromCharCode(65 + i);

function shuffled(n: number) {
  const a = Array.from({ length: n }, (_, k) => k);
  for (let k = n - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

type WakeLock = { release: () => Promise<void> };

export function QuizRunner({ test }: { test: PublicTest }) {
  const [step, setStep] = useState<"id" | "rules" | "lobby" | "quiz" | "done">("id");
  const live = test.mode === "live";
  const guarded = test.antiCheat || test.timeLimit > 0 || live;
  const [qs, setQs] = useState(test.questions);
  const count = qs.length || test.count;
  // Ordre d'affichage (mélangé si activé) ; les réponses restent stockées dans l'ordre d'origine
  const [order, setOrder] = useState(() => qs.map((_, k) => k));
  const [optOrder, setOptOrder] = useState(() => qs.map((q) => q.options.map((_, k) => k)));
  const [token, setToken] = useState<string>();
  const [deadline, setDeadline] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [exits, setExits] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [fsLost, setFsLost] = useState(false);
  const away = useRef(false);
  const finished = useRef(false);
  const wake = useRef<WakeLock | null>(null);
  const [who, setWho] = useState({ firstName: "", lastName: "", email: "" });
  const [consent, setConsent] = useState(false);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(() => qs.map(() => []));
  const [result, setResult] = useState<TestResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const qi = order[i]; // index d'origine de la question affichée
  const q = qs[qi];
  const answered = answers.filter((a) => a.length).length;
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);
  const exitsRef = useRef(0);

  function toggle(o: number) {
    setAnswers((prev) => prev.map((a, k) => (k !== qi ? a : q.multiple ? (a.includes(o) ? a.filter((x) => x !== o) : [...a, o]) : [o])));
  }

  const submit = useCallback(
    async (ended: TestMeta["ended"] = "normal") => {
      if (finished.current) return;
      const current = answersRef.current;
      const missing = count - current.filter((a) => a.length).length;
      if (ended === "normal" && missing > 0 && !confirm(`${missing} question(s) sans réponse. Terminer quand même ?`)) return;
      finished.current = true;
      setBusy(true);
      setErr(null);
      try {
        const r = await gradeTest(test.slug, who, current, { token, exits: exitsRef.current, ended });
        if (!r.ok) {
          finished.current = false;
          setErr(r.message ?? "Erreur.");
        } else {
          setResult(r);
          setStep("done");
          wake.current?.release().catch(() => {});
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        finished.current = false;
        setErr("Un problème technique est survenu. Merci de réessayer.");
      } finally {
        setBusy(false);
      }
    },
    [count, test.slug, who, token],
  );

  async function armGuards() {
    if (!test.antiCheat) return;
    // Écran toujours allumé (téléphone) + plein écran sur ordinateur (doit suivre un clic)
    try {
      const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLock> } };
      wake.current = (await nav.wakeLock?.request("screen")) ?? null;
    } catch {}
    if (window.matchMedia("(pointer: fine)").matches) document.documentElement.requestFullscreen?.().catch(() => {});
  }

  function prepare(list: typeof qs) {
    setQs(list);
    setAnswers(list.map(() => []));
    // Tirage au démarrage (jamais au rendu) : un ordre différent pour chaque participant
    setOrder(test.shuffle ? shuffled(list.length) : list.map((_, k) => k));
    setOptOrder(list.map((x) => (test.shuffle ? shuffled(x.options.length) : x.options.map((_, k) => k))));
    setI(0);
  }

  async function begin() {
    setBusy(true);
    setErr(null);
    try {
      if (live) {
        const r = await joinLive(test.slug, who);
        if (!r.ok) return setErr(r.message);
        await armGuards();
        setStep("lobby");
        return;
      }
      prepare(qs);
      setToken(await startTest(test.slug));
      if (test.timeLimit > 0) setDeadline(Date.now() + test.timeLimit * 60_000);
      await armGuards();
      setStep("quiz");
    } finally {
      setBusy(false);
    }
  }

  // Session en direct : salle d'attente puis synchronisation de la fin (heure du serveur)
  const offset = useRef(0);
  const launching = useRef(false);
  useEffect(() => {
    if (!live || (step !== "lobby" && step !== "quiz")) return;
    let stop = false;
    const poll = async () => {
      const st = await liveStatus(test.slug).catch(() => null);
      if (!st || stop) return;
      offset.current = st.now - Date.now();
      const end = st.endAt ? Date.parse(st.endAt) - offset.current : null;
      if (step === "lobby" && st.state === "running" && !launching.current) {
        launching.current = true;
        const list = await loadQuestions(test.slug);
        if (list && list.length) {
          prepare(list);
          setToken(await startTest(test.slug));
          setDeadline(end);
          setStep("quiz");
        }
        launching.current = false;
      } else if (step === "lobby" && st.state === "ended") {
        setErr("La session est terminée.");
      } else if (step === "quiz") {
        if (end !== deadline) setDeadline(end);
        if (st.state === "ended" || st.state === "closed") submit("time");
      }
    };
    poll();
    const id = setInterval(poll, step === "lobby" ? 2000 : 5000);
    return () => {
      stop = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, step, test.slug, deadline, submit]);

  // Compte à rebours
  useEffect(() => {
    if (step !== "quiz" || !deadline) return;
    const tick = () => {
      const s = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setLeft(s);
      if (s <= 0) submit("time");
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [step, deadline, submit]);

  // Surveillance : sortie de l'onglet / de la fenêtre / écran éteint
  useEffect(() => {
    if (step !== "quiz" || !test.antiCheat) return;
    const leave = () => {
      if (away.current || finished.current) return;
      away.current = true;
      exitsRef.current += 1;
      setExits(exitsRef.current);
    };
    const back = async () => {
      if (!away.current || finished.current) return;
      away.current = false;
      const n = exitsRef.current;
      if (n > test.maxExits) {
        setWarning(null);
        submit("exits");
        return;
      }
      const rest = test.maxExits - n;
      setWarning(`Vous avez quitté l’écran du test (${n} sortie${n > 1 ? "s" : ""}). ${rest === 0 ? "À la prochaine sortie, le test sera terminé automatiquement." : `Encore ${rest} sortie${rest > 1 ? "s" : ""} tolérée${rest > 1 ? "s" : ""}, ensuite le test sera terminé.`}`);
      // Le verrou d'écran est libéré quand la page est cachée : on le redemande
      try {
        const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLock> } };
        wake.current = (await nav.wakeLock?.request("screen")) ?? null;
      } catch {}
    };
    const onVis = () => (document.hidden ? leave() : back());
    const onFs = () => setFsLost(!document.fullscreenElement && window.matchMedia("(pointer: fine)").matches);
    const block = (e: Event) => e.preventDefault();
    const beforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", leave);
    window.addEventListener("focus", back);
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", block);
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", leave);
      window.removeEventListener("focus", back);
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", block);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [step, test.antiCheat, test.maxExits, submit]);

  // Sans surveillance : simple avertissement si on quitte la page en plein test
  useEffect(() => {
    if (step !== "quiz" || test.antiCheat) return;
    const beforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [step, test.antiCheat]);

  const rules = useMemo(() => {
    const r: string[] = [];
    if (live) r.push("Session en direct : l’examen démarre pour tout le monde quand le formateur le lance, et se termine pour tout le monde à la même heure.");
    if (test.timeLimit > 0) r.push(`${live ? "Durée de l’examen" : "Vous avez"} ${test.timeLimit} minutes. À la fin du temps, le test est envoyé automatiquement avec vos réponses.`);
    if (test.antiCheat) {
      r.push(
        test.maxExits === 0
          ? "Ne quittez pas cet écran : changer d’onglet, d’application ou de fenêtre, ou verrouiller votre téléphone, termine immédiatement le test."
          : `Ne quittez pas cet écran : changer d’onglet, d’application ou de fenêtre, ou verrouiller votre téléphone, compte comme une sortie. Au-delà de ${test.maxExits} sortie${test.maxExits > 1 ? "s" : ""}, le test est terminé.`,
      );
      r.push("Un test interrompu ne donne pas droit au certificat. Le copier-coller est désactivé, l’écran reste allumé pendant le test et, sur ordinateur, le test s’ouvre en plein écran.");
      r.push("Avant de commencer : branchez votre appareil, coupez les notifications et prévoyez un moment au calme.");
    }
    return r;
  }, [test.timeLimit, test.antiCheat, test.maxExits, live]);

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
          if (guarded) setStep("rules");
          else begin();
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
          {guarded ? "Continuer" : `Commencer le test (${count} questions)`} <ArrowRight className="size-4" />
        </button>
      </form>
    );

  if (step === "rules")
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-6 text-copper" />
          <h2 className="text-xl font-semibold text-navy-deep normal-case" style={{ fontFamily: "var(--font-sans)" }}>Conditions de l’examen</h2>
        </div>
        <ul className="space-y-3">
          {rules.map((r) => (
            <li key={r} className="flex gap-3 text-[0.9375rem] text-ink/85">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-copper" />
              {r}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">{count} questions · seuil de réussite {test.passPct} %.</p>
        {err && <p className="text-sm text-[#9b1c1c]">{err}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={begin} className="inline-flex h-12 items-center gap-2 rounded-full bg-navy-deep px-7 text-sm font-medium text-white hover:bg-blue disabled:opacity-60">
            {busy ? "…" : live ? "Rejoindre la session" : "Je suis prêt(e), démarrer"} <ArrowRight className="size-4" />
          </button>
          <button type="button" onClick={() => setStep("id")} className="inline-flex h-12 items-center rounded-full border border-line px-6 text-sm">Retour</button>
        </div>
      </div>
    );

  if (step === "lobby")
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="relative flex size-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-copper/25 motion-reduce:hidden" />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-navy-deep text-white"><Clock className="size-7" /></span>
        </span>
        <h2 className="mt-6 text-2xl font-semibold text-navy-deep normal-case" style={{ fontFamily: "var(--font-sans)" }}>Vous êtes dans la salle d’attente</h2>
        <p className="mt-2 max-w-md text-muted">Bonjour {who.firstName}. L’examen va commencer dès que le formateur le lancera. Restez sur cette page.</p>
        {err && <p className="mt-4 text-sm text-[#9b1c1c]">{err}</p>}
      </div>
    );

  if (step === "done" && result)
    return (
      <div className="space-y-8">
        <div className={cn("rounded-md border p-8", result.passed ? "border-teal/30 bg-[#e8f5f6]" : "border-[#c2410c]/30 bg-[#fff7ed]")}>
          <p className="label-caps text-muted">{result.passed ? "Test réussi" : "Test non réussi"}</p>
          {result.status && result.status !== "ok" && (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#9b1c1c]">
              <AlertTriangle className="size-3.5" /> Test {result.status}
            </p>
          )}
          <p className={cn("display mt-3 text-[clamp(3rem,8vw,5rem)]", result.passed ? "text-teal" : "text-[#c2410c]")}>
            {result.score}/{result.total} · {result.pct} %
          </p>
          <p className="mt-2 text-ink/80">
            {result.passed
              ? `Bravo ${who.firstName}, vous dépassez le seuil de ${result.passPct} %.`
              : result.status === "interrompu (sortie de l’écran)"
                ? "Le test a été arrêté car vous avez quitté l’écran trop de fois."
                : `Le seuil de réussite est de ${result.passPct} %. Revoyez les points ci-dessous et retentez votre chance.`}
          </p>
          {result.certificateUrl && (
            <a
              href={result.certificateUrl}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-navy-deep px-6 text-sm font-semibold text-white transition-colors hover:bg-copper"
            >
              <Download className="size-4" /> Télécharger mon {result.certificateLabel} (PDF)
            </a>
          )}
          {result.certificateUrl && <p className="mt-3 text-sm text-navy-deep">Le lien de téléchargement vous est aussi envoyé par email.</p>}
          <p className="mt-3 text-sm text-muted">Votre résultat vous a été envoyé à {who.email}.</p>
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
    <div className={cn("relative", test.antiCheat && "select-none")}>
      {(left !== null || test.antiCheat) && (
        <div className="sticky top-[calc(var(--header-h)+0.5rem)] z-20 mb-5 flex items-center justify-between gap-3 rounded-md border border-line bg-white/95 px-4 py-2.5 shadow-soft backdrop-blur">
          {left !== null ? (
            <span className={cn("inline-flex items-center gap-2 font-mono text-lg font-bold tabular-nums", left <= 60 ? "animate-pulse text-[#c2410c]" : left <= 300 ? "text-copper" : "text-navy-deep")} aria-live={left <= 60 ? "assertive" : "off"}>
              <Clock className="size-4" /> {mmss(left)}
            </span>
          ) : (
            <span />
          )}
          {test.antiCheat && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <ShieldCheck className="size-4 text-copper" /> Examen surveillé · sorties : {exits}/{test.maxExits}
            </span>
          )}
        </div>
      )}
      {warning && (
        <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-[150] flex items-center justify-center bg-navy-deep/70 p-6 backdrop-blur-sm">
          <div className="max-w-md rounded-md bg-white p-7 shadow-lift">
            <AlertTriangle className="size-8 text-[#c2410c]" />
            <p className="mt-4 text-[1.0625rem] font-semibold text-navy-deep">Sortie de l’écran détectée</p>
            <p className="mt-2 text-sm text-ink/80">{warning}</p>
            <button type="button" onClick={() => setWarning(null)} className="mt-6 inline-flex h-11 items-center rounded-full bg-navy-deep px-6 text-sm text-white">Reprendre le test</button>
          </div>
        </div>
      )}
      {fsLost && !warning && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-navy-deep/70 p-6 backdrop-blur-sm">
          <div className="max-w-md rounded-md bg-white p-7 text-center shadow-lift">
            <p className="font-semibold text-navy-deep">Le test se passe en plein écran.</p>
            <button type="button" onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})} className="mt-5 inline-flex h-11 items-center rounded-full bg-navy-deep px-6 text-sm text-white">Revenir en plein écran</button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-sm text-muted">
        <span className="font-mono">Question {i + 1} / {count}</span>
        <span>{answered} répondue(s)</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-blue transition-[width] duration-300" style={{ width: `${((i + 1) / count) * 100}%` }} />
      </div>
      <h2 className="mt-8 text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug font-semibold text-navy-deep normal-case" style={{ fontFamily: "var(--font-sans)" }}>
        {q.q}
      </h2>
      {q.multiple && <p className="mt-2 text-sm text-blue">Plusieurs réponses possibles.</p>}
      <ul className="mt-6 space-y-3">
        {optOrder[qi].map((oi, pos) => {
          const o = q.options[oi];
          const on = answers[qi].includes(oi);
          return (
            <li key={oi}>
              <button
                type="button"
                onClick={() => toggle(oi)}
                aria-pressed={on}
                className={cn("flex w-full items-start gap-4 rounded-md border p-4 text-left transition-colors", on ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white hover:border-navy/40")}
              >
                <span className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-sm", on ? "border-white" : "border-line")}>{L(pos)}</span>
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
        {i < count - 1 ? (
          <button type="button" onClick={() => setI(i + 1)} className="inline-flex h-11 items-center gap-2 rounded-full bg-navy-deep px-6 text-sm text-white hover:bg-blue">
            Suivante <ArrowRight className="size-4" />
          </button>
        ) : (
          <button type="button" disabled={busy} onClick={() => submit("normal")} className="inline-flex h-11 items-center gap-2 rounded-full bg-teal px-6 text-sm text-white disabled:opacity-60">
            {busy ? "Correction…" : "Terminer et voir mon résultat"}
          </button>
        )}
      </div>
      <div className="mt-8 flex flex-wrap gap-1.5" aria-label="Aller à une question">
        {order.map((orig, k) => (
          <button key={k} type="button" onClick={() => setI(k)} className={cn("size-8 rounded font-mono text-xs", k === i ? "bg-navy-deep text-white" : answers[orig].length ? "bg-sky-soft text-navy-deep" : "bg-cloud text-muted")}>
            {k + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
