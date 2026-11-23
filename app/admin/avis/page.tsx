"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Star, Trash2, X } from "lucide-react";
import { DB_ID, ID, Query, errorMessage, tables } from "@/lib/appwrite/browser";
import { refreshSite } from "@/lib/actions/refresh";
import { Btn, Card, useToast } from "@/components/admin/ui";
import { ShareLink } from "@/components/admin/share-link";
import { cn } from "@/lib/cn";

type Review = { $id: string; $createdAt: string; firstName: string; lastName: string; email?: string; role?: string; rating?: number; message: string; photo?: string; status?: string };

export default function AvisPage() {
  const [rows, setRows] = useState<Review[] | null>(null);
  const [filter, setFilter] = useState("pending");
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const r = await tables.listRows({ databaseId: DB_ID, tableId: "reviews", queries: [Query.limit(500), Query.orderDesc("$createdAt")] });
      setRows(r.rows as unknown as Review[]);
    } catch (e) {
      toast(errorMessage(e), "error");
      setRows([]);
    }
  }, [toast]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function approve(r: Review) {
    try {
      await tables.createRow({
        databaseId: DB_ID,
        tableId: "testimonials",
        rowId: ID.unique(),
        data: { quote: r.message, name: `${r.firstName} ${r.lastName}`, role: r.role ?? "", photo: r.photo ?? "", rating: r.rating ?? 5, linkedin: "", videoUrl: "", poster: "", featured: false, published: true, position: 0 },
      });
      await tables.updateRow({ databaseId: DB_ID, tableId: "reviews", rowId: r.$id, data: { status: "approved" } });
      await refreshSite();
      toast("Avis publié sur le site.");
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }
  async function setStatus(r: Review, status: string) {
    await tables.updateRow({ databaseId: DB_ID, tableId: "reviews", rowId: r.$id, data: { status } });
    load();
  }

  const shown = (rows ?? []).filter((r) => filter === "all" || (r.status ?? "pending") === filter);
  const counts = (s: string) => (rows ?? []).filter((r) => (r.status ?? "pending") === s).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display text-4xl text-navy-deep">Avis</h1>
        <p className="mt-1 text-sm text-muted">Envoyez ce lien à vos apprenants et clients. Chaque avis arrive ici : validez-le pour le publier sur le site.</p>
      </header>
      <ShareLink path="/avis" label="Lien à envoyer pour recevoir des avis" message="Bonjour ! Pourriez-vous laisser un avis sur notre accompagnement ? Merci beaucoup :" />
      <div className="flex flex-wrap gap-2">
        {[{ v: "pending", l: `À valider (${counts("pending")})` }, { v: "approved", l: `Publiés (${counts("approved")})` }, { v: "rejected", l: `Refusés (${counts("rejected")})` }, { v: "all", l: "Tous" }].map((s) => (
          <button key={s.v} type="button" onClick={() => setFilter(s.v)} className={cn("rounded-full border px-4 py-1.5 text-sm", filter === s.v ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white")}>{s.l}</button>
        ))}
      </div>
      {rows === null ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : shown.length === 0 ? (
        <Card><p className="text-sm text-muted">Aucun avis dans cette catégorie.</p></Card>
      ) : (
        <ul className="space-y-4">
          {shown.map((r) => (
            <li key={r.$id}>
              <Card className={cn((r.status ?? "pending") === "pending" && "border-blue")}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="size-14 shrink-0 overflow-hidden rounded-full bg-cloud">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {r.photo ? <img src={r.photo} alt="" className="size-full object-cover" /> : <span className="flex size-full items-center justify-center font-semibold text-muted">{r.firstName[0]}{r.lastName[0]}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy-deep">{r.firstName} {r.lastName} {r.role && <span className="font-normal text-muted">— {r.role}</span>}</p>
                    <p className="mt-0.5 flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => <Star key={n} className={cn("size-4", n <= (r.rating ?? 5) ? "fill-[#e0a400] text-[#e0a400]" : "text-line")} />)}
                      <span className="ml-2 text-xs text-muted">{new Date(r.$createdAt).toLocaleDateString("fr-FR")}{r.email ? ` · ${r.email}` : ""}</span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-ink/85">{r.message}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(r.status ?? "pending") !== "approved" && <Btn onClick={() => approve(r)}><Check className="size-4" /> Valider et publier</Btn>}
                  {(r.status ?? "pending") === "pending" && <Btn variant="secondary" onClick={() => setStatus(r, "rejected")}><X className="size-4" /> Refuser</Btn>}
                  <Btn variant="danger" onClick={async () => { if (!confirm("Supprimer cet avis ?")) return; await tables.deleteRow({ databaseId: DB_ID, tableId: "reviews", rowId: r.$id }); load(); }}><Trash2 className="size-4" /></Btn>
                </div>
                {r.status === "approved" && <p className="mt-3 text-xs text-muted">Publié — modifiable ou masquable dans « Témoignages & vidéos ».</p>}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
