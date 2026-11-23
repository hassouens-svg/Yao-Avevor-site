/** Statut effectif d'un abonné : la ligne la plus récente pour un email l'emporte (inscription ou désinscription). */
export type SubRow = { $id: string; $createdAt: string; email: string; firstName?: string; segments?: string; status?: string };

export function effectiveSubscribers<T extends SubRow>(rows: T[]) {
  const byEmail = new Map<string, T & { ids: string[] }>();
  for (const r of [...rows].sort((a, b) => a.$createdAt.localeCompare(b.$createdAt))) {
    const k = r.email.toLowerCase();
    const prev = byEmail.get(k);
    byEmail.set(k, { ...r, firstName: r.firstName || prev?.firstName, segments: r.status === "unsubscribed" ? prev?.segments : r.segments, ids: [...(prev?.ids ?? []), r.$id] });
  }
  return [...byEmail.values()].sort((a, b) => b.$createdAt.localeCompare(a.$createdAt));
}
