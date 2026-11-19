"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { DB_ID, Query, errorMessage, tables } from "@/lib/appwrite/browser";
import { Btn, Card, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

type Msg = { $id: string; $createdAt: string; name: string; email: string; reason?: string; message: string; status?: string };
const statuses = [{ v: "new", l: "Nouveau" }, { v: "read", l: "Lu" }, { v: "done", l: "Traité" }];

export default function MessagesPage() {
  const [rows, setRows] = useState<Msg[] | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const toast = useToast();
  const load = useCallback(async () => {
    try {
      const r = await tables.listRows({ databaseId: DB_ID, tableId: "messages", queries: [Query.limit(500), Query.orderDesc("$createdAt")] });
      setRows(r.rows as unknown as Msg[]);
    } catch (e) {
      toast(errorMessage(e), "error");
      setRows([]);
    }
  }, [toast]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function setStatus(id: string, status: string) {
    await tables.updateRow({ databaseId: DB_ID, tableId: "messages", rowId: id, data: { status } });
    load();
  }
  const shown = (rows ?? []).filter((r) => filter === "all" || (r.status ?? "new") === filter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-navy-deep">Messages</h1>
        <p className="mt-1 text-sm text-muted">Demandes reçues via le formulaire de contact : coaching, formation, conférence, presse…</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {[{ v: "all", l: "Tous" }, ...statuses].map((s) => (
          <button key={s.v} type="button" onClick={() => setFilter(s.v)} className={cn("rounded-full border px-4 py-1.5 text-sm", filter === s.v ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white")}>
            {s.l}
          </button>
        ))}
      </div>
      {rows === null ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : shown.length === 0 ? (
        <Card><p className="text-sm text-muted">Aucun message.</p></Card>
      ) : (
        <ul className="space-y-4">
          {shown.map((m) => (
            <li key={m.$id}>
              <Card className={cn((m.status ?? "new") === "new" && "border-blue")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy-deep">{m.name} <span className="font-normal text-muted">— {m.email}</span></p>
                    <p className="mt-0.5 text-xs text-muted">{new Date(m.$createdAt).toLocaleString("fr-FR")} · {m.reason}</p>
                  </div>
                  <select value={m.status ?? "new"} onChange={(e) => setStatus(m.$id, e.target.value)} className="h-9 rounded-lg border border-line px-2 text-sm">
                    {statuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                  </select>
                </div>
                <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-ink/85">{m.message}</p>
                <div className="mt-4 flex gap-2">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re : votre demande (${m.reason ?? "contact"})`)}`} onClick={() => setStatus(m.$id, "read")} className="inline-flex h-9 items-center gap-2 rounded-full bg-navy-deep px-4 text-sm text-white"><Mail className="size-4" /> Répondre</a>
                  <Btn variant="danger" className="h-9" onClick={async () => { if (!confirm("Supprimer ce message ?")) return; await tables.deleteRow({ databaseId: DB_ID, tableId: "messages", rowId: m.$id }); load(); }}><Trash2 className="size-4" /></Btn>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
