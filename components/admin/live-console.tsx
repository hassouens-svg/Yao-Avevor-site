"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Maximize2, Play, Square, Users, X } from "lucide-react";
import { account, DB_ID, Query, errorMessage, tables } from "@/lib/appwrite/browser";
import { liveControl } from "@/lib/actions/live";
import { Btn, Card, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

type Participant = { $id: string; $createdAt: string; firstName: string; lastName: string; email: string };
type Done = { $id: string; email: string; pct: number; passed: boolean; status?: string };
type TestLite = { $id: string; slug: string; title: string; mode?: string; timeLimit?: number; liveState?: string; liveSession?: string; liveStartAt?: string; liveEndAt?: string; published?: boolean };

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** QR code + salle d'attente en temps réel + lancement de l'examen pour tout le monde. */
export function LiveConsole({ test: initial }: { test: TestLite }) {
  const [test, setTest] = useState(initial);
  const [qr, setQr] = useState<string>("");
  const [people, setPeople] = useState<Participant[]>([]);
  const [done, setDone] = useState<Done[]>([]);
  const [busy, setBusy] = useState(false);
  const [project, setProject] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const toast = useToast();
  const url = typeof window !== "undefined" ? `${window.location.origin}/tests/${test.slug}` : `/tests/${test.slug}`;
  const live = test.mode === "live";
  const state = test.liveState || "closed";

  useEffect(() => {
    QRCode.toDataURL(url, { width: 720, margin: 1, color: { dark: "#071528", light: "#ffffff" } }).then(setQr).catch(() => {});
  }, [url]);

  const refresh = useCallback(async () => {
    try {
      const t = (await tables.getRow({ databaseId: DB_ID, tableId: "tests", rowId: test.$id })) as unknown as TestLite;
      setTest(t);
      if (t.liveSession) {
        const [p, r] = await Promise.all([
          tables.listRows({ databaseId: DB_ID, tableId: "test_participants", queries: [Query.equal("sessionId", t.liveSession), Query.limit(500), Query.orderAsc("$createdAt")] }),
          tables.listRows({ databaseId: DB_ID, tableId: "test_results", queries: [Query.equal("sessionId", t.liveSession), Query.limit(500)] }),
        ]);
        setPeople(p.rows as unknown as Participant[]);
        setDone(r.rows as unknown as Done[]);
      }
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }, [test.$id, toast]);

  useEffect(() => {
    const first = setTimeout(refresh, 0);
    const id = setInterval(refresh, 3000);
    const clock = setInterval(() => setNow(Date.now()), 500);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      clearInterval(clock);
    };
  }, [refresh]);

  async function control(action: "open" | "start" | "end" | "close") {
    if (action === "start" && !confirm(`Lancer l’examen maintenant pour ${unique.length} participant(s) ?`)) return;
    if (action === "end" && !confirm("Terminer l’examen maintenant pour tout le monde ? Les copies seront envoyées automatiquement.")) return;
    setBusy(true);
    try {
      const { jwt } = await account.createJWT();
      const r = await liveControl(jwt, test.slug, action);
      if (!r.ok) toast(r.message ?? "Erreur.", "error");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  // Un participant = un email (s'il rejoint deux fois, on ne le compte qu'une fois)
  const unique = [...new Map(people.map((p) => [p.email.toLowerCase(), p])).values()];
  const doneBy = new Map(done.map((d) => [d.email.toLowerCase(), d]));
  const endMs = test.liveEndAt ? Date.parse(test.liveEndAt) : 0;
  const left = state === "running" && endMs ? Math.max(0, Math.round((endMs - now) / 1000)) : null;
  const stateLabel = { closed: "Fermée", waiting: "Salle d’attente ouverte", running: "Examen en cours", ended: "Terminé" }[state] ?? state;

  const controls = (dark = false) => (
    <div className="flex flex-wrap gap-2">
      {(state === "closed" || state === "ended") && <Btn disabled={busy} onClick={() => control("open")}><Users className="size-4" /> Ouvrir la salle d’attente</Btn>}
      {state === "waiting" && <Btn disabled={busy || !unique.length} onClick={() => control("start")} className="bg-teal hover:bg-teal/90"><Play className="size-4" /> Lancer l’examen pour tous ({unique.length})</Btn>}
      {state === "running" && <Btn variant="danger" disabled={busy} onClick={() => control("end")}><Square className="size-4" /> Terminer maintenant</Btn>}
      {state !== "closed" && <Btn variant="secondary" disabled={busy} onClick={() => control("close")} className={dark ? "bg-white/10 text-white" : ""}>Fermer la session</Btn>}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center gap-3">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt={`QR code vers ${url}`} className="w-full max-w-[220px] rounded-md border border-line" />
          ) : (
            <div className="skeleton aspect-square w-full max-w-[220px] rounded-md" />
          )}
          <div className="flex gap-2">
            <a href={qr} download={`qr-${test.slug}.png`} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line px-3 text-xs"><Download className="size-3.5" /> PNG</a>
            <button type="button" onClick={() => setProject(true)} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-navy-deep px-3 text-xs text-white"><Maximize2 className="size-3.5" /> Projeter</button>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <p className="label-caps text-muted">Partager l’examen</p>
          <p className="font-mono text-navy-deep break-all">{url}</p>
          <p className="text-muted">Les participants scannent le QR code (ou ouvrent le lien), saisissent leur nom et leur email, puis{live ? " attendent votre lancement." : " passent l’examen à leur rythme."}</p>
          {!test.published && <p className="rounded-md bg-[#fff7ed] p-3 text-[#9b1c1c]">Ce test n’est pas affiché sur le site : activez « Afficher sur la page publique » dans l’onglet Questions et enregistrez.</p>}
          <p className="rounded-md bg-cloud p-3 text-muted">
            {live ? (
              <>Session en direct : les participants arrivent dans la salle d’attente. Cliquez sur <strong>« Lancer l’examen pour tous »</strong> : le chrono démarre pour tout le monde et l’examen se termine pour tout le monde à la même heure. « Fermer la session » remet le test en accès libre.</>
            ) : (
              <>Accès libre : chacun commence quand il veut, avec son propre chrono. Pour un examen en groupe, cliquez sur <strong>« Ouvrir la salle d’attente »</strong> ci-dessous, partagez le QR code, puis lancez.</>
            )}
          </p>
        </div>
      </Card>

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label-caps text-muted">Session en direct</p>
            <p className="mt-1 text-lg font-semibold text-navy-deep">
              <span className={cn("mr-2 inline-block size-2.5 rounded-full", state === "running" ? "bg-teal" : state === "waiting" ? "animate-pulse bg-copper" : "bg-line")} />
              {stateLabel}
              {left !== null && <span className="ml-3 font-mono text-copper">{mmss(left)}</span>}
            </p>
            <p className="text-xs text-muted">Durée : {test.timeLimit ? `${test.timeLimit} min, fin identique pour tout le monde` : "sans limite (vous terminez la session vous-même)"}</p>
          </div>
          {controls()}
        </div>
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-cloud text-xs text-muted uppercase"><tr><th className="px-4 py-2.5">Participant</th><th className="px-4 py-2.5">Email</th><th className="px-4 py-2.5">Arrivée</th><th className="px-4 py-2.5">Statut</th></tr></thead>
            <tbody className="divide-y divide-line">
              {unique.map((p) => {
                const d = doneBy.get(p.email.toLowerCase());
                return (
                  <tr key={p.$id}>
                    <td className="px-4 py-2.5 font-medium text-navy-deep">{p.firstName} {p.lastName}</td>
                    <td className="px-4 py-2.5 text-muted">{p.email}</td>
                    <td className="px-4 py-2.5 text-muted">{new Date(p.$createdAt).toLocaleTimeString("fr-FR")}</td>
                    <td className="px-4 py-2.5">{d ? <span className={d.passed ? "text-teal" : "text-[#c2410c]"}>Terminé · {d.pct} %{d.status && d.status !== "ok" ? ` (${d.status})` : ""}</span> : state === "running" ? "En cours…" : "En attente"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!unique.length && <p className="p-5 text-sm text-muted">{state === "waiting" ? "Personne pour l’instant : partagez le QR code." : "Ouvrez la salle d’attente pour accueillir les participants."}</p>}
        </div>
        <p className="text-xs text-muted">Mise à jour automatique toutes les 3 secondes · {unique.length} connecté(s) · {done.length} copie(s) rendue(s)</p>
      </Card>

      {project && (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 overflow-y-auto bg-navy-deep p-8 text-white">
          <button type="button" onClick={() => setProject(false)} className="absolute top-5 right-5 rounded-full bg-white/10 p-2" aria-label="Fermer"><X className="size-5" /></button>
          <p className="label-caps text-sky">Scannez pour participer</p>
          <h2 className="display max-w-4xl text-center text-[clamp(2rem,5vw,4.5rem)] leading-none">{test.title}</h2>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="" className="w-[min(60vh,420px)] rounded-xl bg-white p-3" />
          )}
          <p className="font-mono text-lg text-mist">{url.replace(/^https?:\/\//, "")}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div><p className="display text-6xl">{unique.length}</p><p className="text-sm text-mist">participant(s)</p></div>
            {left !== null && <div><p className="display font-mono text-6xl text-copper-light">{mmss(left)}</p><p className="text-sm text-mist">temps restant</p></div>}
            {state === "running" && <div><p className="display text-6xl">{done.length}</p><p className="text-sm text-mist">copie(s) rendue(s)</p></div>}
          </div>
          {controls(true)}
        </div>
      )}
    </div>
  );
}
