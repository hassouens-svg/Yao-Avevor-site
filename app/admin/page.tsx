"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DB_ID, Query, tables } from "@/lib/appwrite/browser";
import { Card } from "@/components/admin/ui";
import { useAuth } from "@/components/admin/auth";

const tiles = [
  { table: "messages", label: "Messages reçus", href: "/admin/messages", color: "bg-navy-deep text-white" },
  { table: "subscribers", label: "Abonnés", href: "/admin/abonnes", color: "bg-blue text-white" },
  { table: "articles", label: "Articles", href: "/admin/articles", color: "bg-teal text-white" },
  { table: "testimonials", label: "Témoignages", href: "/admin/temoignages", color: "bg-sky text-navy-deep" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [newMsgs, setNewMsgs] = useState(0);

  useEffect(() => {
    tiles.forEach(async (t) => {
      try {
        const r = await tables.listRows({ databaseId: DB_ID, tableId: t.table, queries: [Query.limit(1)] });
        setCounts((c) => ({ ...c, [t.table]: r.total }));
      } catch {}
    });
    tables.listRows({ databaseId: DB_ID, tableId: "messages", queries: [Query.equal("status", "new"), Query.limit(1)] }).then((r) => setNewMsgs(r.total)).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="display text-4xl text-navy-deep">Bonjour{user?.name ? ` ${user.name.split(" ")[0]}` : ""}.</h1>
        <p className="mt-1 text-sm text-muted">{newMsgs > 0 ? `${newMsgs} nouveau(x) message(s) à traiter.` : "Aucun nouveau message."}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.table} href={t.href} className={`rounded-2xl p-6 transition-transform hover:-translate-y-0.5 ${t.color}`}>
            <p className="display text-5xl">{counts[t.table] ?? "…"}</p>
            <p className="mt-2 text-sm opacity-80">{t.label}</p>
          </Link>
        ))}
      </div>
      <Card>
        <h2 className="text-lg font-semibold text-navy-deep">Que voulez-vous faire ?</h2>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <li><Link className="text-blue underline" href="/admin/contenus">Modifier un texte, un bouton ou une image du site</Link></li>
          <li><Link className="text-blue underline" href="/admin/articles">Écrire un nouvel article</Link></li>
          <li><Link className="text-blue underline" href="/admin/livres">Ajouter un livre et ses liens d’achat</Link></li>
          <li><Link className="text-blue underline" href="/admin/temoignages">Ajouter un témoignage vidéo</Link></li>
          <li><Link className="text-blue underline" href="/admin/medias">Importer des images ou des vidéos</Link></li>
          <li><Link className="text-blue underline" href="/admin/messages">Lire les demandes de coaching et de contact</Link></li>
        </ul>
      </Card>
    </div>
  );
}
