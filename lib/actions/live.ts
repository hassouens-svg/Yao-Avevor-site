"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { createRow, listRows, type Row } from "@/lib/appwrite/rest";
import { adminUpdateRow, requireAdmin } from "@/lib/admin/server-auth";
import { refreshSite } from "@/lib/actions/refresh";
import type { QuizQuestion } from "@/lib/quiz/parse";

/**
 * Sessions en direct : le formateur ouvre la salle d'attente, lance l'examen pour tout le monde,
 * et tout le monde termine à la même heure (heure du serveur, impossible à trafiquer).
 */
export type LiveStatus = { mode: "self" | "live"; state: "closed" | "waiting" | "running" | "ended"; session?: string; startAt?: string; endAt?: string; now: number };

async function testRow(slug: string): Promise<Row | null> {
  const rows = await listRows("tests", [{ method: "equal", attribute: "slug", values: [slug] }]).catch(() => []);
  return rows[0] ?? null;
}

function statusOf(row: Row): LiveStatus {
  const now = Date.now();
  let state = (String(row.liveState || "closed") as LiveStatus["state"]);
  const endAt = row.liveEndAt ? String(row.liveEndAt) : undefined;
  if (state === "running" && endAt && Date.parse(endAt) <= now) state = "ended";
  return { mode: row.mode === "live" ? "live" : "self", state, session: row.liveSession ? String(row.liveSession) : undefined, startAt: row.liveStartAt ? String(row.liveStartAt) : undefined, endAt, now };
}

export async function liveStatus(slug: string): Promise<LiveStatus | null> {
  const row = await testRow(slug);
  return row ? statusOf(row) : null;
}

const who = z.object({ firstName: z.string().trim().min(1).max(80), lastName: z.string().trim().min(1).max(80), email: z.string().trim().toLowerCase().email() });

/** Entrée dans la salle d'attente (ou en cours de session). */
export async function joinLive(slug: string, person: { firstName: string; lastName: string; email: string }) {
  const p = who.safeParse(person);
  if (!p.success) return { ok: false as const, message: "Nom, prénom ou email invalide." };
  const row = await testRow(slug);
  if (!row) return { ok: false as const, message: "Examen introuvable." };
  const st = statusOf(row);
  if (st.state !== "waiting" && st.state !== "running") return { ok: false as const, message: st.state === "ended" ? "La session est terminée." : "La session n’est pas encore ouverte. Attendez le signal du formateur." };
  await createRow("test_participants", { testSlug: slug, sessionId: st.session ?? "", ...p.data }).catch(() => {});
  return { ok: true as const, status: st };
}

/** Questions (sans les réponses) : en direct, seulement une fois l'examen lancé. */
export async function loadQuestions(slug: string) {
  const row = await testRow(slug);
  if (!row) return null;
  const st = statusOf(row);
  if (st.mode === "live" && st.state !== "running") return null;
  let qs: QuizQuestion[] = [];
  try {
    qs = JSON.parse(String(row.questions || "[]"));
  } catch {}
  return qs.map(({ q, options, answer }) => ({ q, options, multiple: (answer ?? []).length > 1 }));
}

/** Pilotage par l'administrateur (heure du serveur). */
export async function liveControl(jwt: string, slug: string, action: "open" | "start" | "end" | "close") {
  try {
    await requireAdmin(jwt);
    const row = await testRow(slug);
    if (!row) return { ok: false, message: "Examen introuvable." };
    const now = new Date();
    const minutes = Number(row.timeLimit) || 0;
    const data: Record<string, unknown> =
      action === "open"
        ? { mode: "live", liveState: "waiting", liveSession: randomUUID().slice(0, 8), liveStartAt: "", liveEndAt: "" }
        : action === "start"
          ? { liveState: "running", liveStartAt: now.toISOString(), liveEndAt: minutes ? new Date(now.getTime() + minutes * 60_000).toISOString() : "" }
          : action === "end"
            ? { liveState: "ended", liveEndAt: now.toISOString() }
            : { liveState: "closed", mode: "self" }; // session fermée : retour au passage libre
    await adminUpdateRow(jwt, "tests", row.$id, data);
    if (action === "open" || action === "close") await refreshSite();
    return { ok: true, status: statusOf({ ...row, ...data } as Row) };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}
