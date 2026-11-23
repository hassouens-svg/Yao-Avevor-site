"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { DB_ID, Query, errorMessage, tables } from "@/lib/appwrite/browser";
import { Btn, Card, useToast } from "@/components/admin/ui";
import { effectiveSubscribers } from "@/lib/admin/subscribers";

type Sub = { $id: string; $createdAt: string; email: string; firstName?: string; segments?: string; status?: string };

export default function AbonnesPage() {
  const [rows, setRows] = useState<Sub[] | null>(null);
  const toast = useToast();
  const load = useCallback(async () => {
    try {
      const r = await tables.listRows({ databaseId: DB_ID, tableId: "subscribers", queries: [Query.limit(1000), Query.orderDesc("$createdAt")] });
      setRows(effectiveSubscribers(r.rows as unknown as (Sub & { $id: string })[]) as Sub[]);
    } catch (e) {
      toast(errorMessage(e), "error");
      setRows([]);
    }
  }, [toast]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  function exportCsv() {
    const lines = [["email", "prenom", "centres_interet", "statut", "date"], ...(rows ?? []).filter((r) => r.status !== "unsubscribed").map((r) => [r.email, r.firstName ?? "", r.segments ?? "", r.status ?? "", r.$createdAt.slice(0, 10)])];
    const csv = lines.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `abonnes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-navy-deep">Abonnés</h1>
          <p className="mt-1 text-sm text-muted">Inscrits à la newsletter et aux sorties de livres ({rows?.length ?? "…"}).</p>
        </div>
        <Btn variant="secondary" onClick={exportCsv} disabled={!rows?.length}><Download className="size-4" /> Exporter (CSV / Excel)</Btn>
      </header>
      <Card className="overflow-x-auto p-0 sm:p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-cloud text-xs text-muted uppercase">
            <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Prénom</th><th className="px-4 py-3">Intérêts</th><th className="px-4 py-3">Statut</th><th className="px-4 py-3">Date</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(rows ?? []).map((r) => (
              <tr key={r.$id}>
                <td className="px-4 py-3 font-medium text-navy-deep">{r.email}</td>
                <td className="px-4 py-3">{r.firstName}</td>
                <td className="px-4 py-3 text-muted">{r.segments}</td>
                <td className="px-4 py-3">{r.status === "unsubscribed" ? <span className="text-xs text-[#c2410c]">Désinscrit</span> : <span className="text-xs text-teal">Abonné</span>}</td>
                <td className="px-4 py-3 text-muted">{new Date(r.$createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" aria-label="Supprimer" className="text-[#9b1c1c]" onClick={async () => { if (!confirm(`Supprimer ${r.email} ?`)) return; for (const id of (r as Sub & { ids?: string[] }).ids ?? [r.$id]) await tables.deleteRow({ databaseId: DB_ID, tableId: "subscribers", rowId: id }); load(); }}><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows?.length === 0 && <p className="p-6 text-sm text-muted">Aucun abonné pour l’instant.</p>}
      </Card>
    </div>
  );
}
