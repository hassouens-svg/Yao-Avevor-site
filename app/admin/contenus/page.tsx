"use client";

import { useCallback, useEffect, useState } from "react";
import { DB_ID, errorMessage, tables } from "@/lib/appwrite/browser";
import { refreshSite } from "@/lib/actions/refresh";
import { JsonEditor, type Json } from "@/components/admin/json-editor";
import { Btn, Card, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import { home } from "@/content/home";
import { lexicon } from "@/content/lexicon";
import { categories } from "@/content/articles";
import { certifications, timeline } from "@/content/timeline";

const blocks: { id: string; title: string; text: string; fallback: unknown }[] = [
  { id: "home", title: "Accueil & sections", text: "Hero, profil, chiffres, parcours, expertises, formation, interventions, newsletter, contact…", fallback: home },
  { id: "timeline", title: "Parcours (À propos)", text: "Les étapes de la frise.", fallback: timeline },
  { id: "certifications", title: "Certifications", text: "PMP®, ITIL®…", fallback: certifications },
  { id: "lexicon", title: "Lexique fiche de paie", text: "Les termes de la page Ressources.", fallback: lexicon },
  { id: "categories", title: "Catégories d’articles", text: "Noms et identifiants des catégories.", fallback: categories },
];

export default function ContenusPage() {
  const [active, setActive] = useState(blocks[0].id);
  const [data, setData] = useState<Json | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const block = blocks.find((b) => b.id === active)!;

  const load = useCallback(async (id: string) => {
    const b = blocks.find((x) => x.id === id)!;
    try {
      const row = await tables.getRow({ databaseId: DB_ID, tableId: "content", rowId: id });
      setData(JSON.parse(String((row as unknown as { data: string }).data)));
    } catch {
      setData(b.fallback as Json);
    }
    setDirty(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(active), 0);
    return () => clearTimeout(t);
  }, [active, load]);

  async function save() {
    if (data === null) return;
    setSaving(true);
    try {
      await tables.upsertRow({ databaseId: DB_ID, tableId: "content", rowId: active, data: { data: JSON.stringify(data) } });
      await refreshSite();
      setDirty(false);
      toast("Enregistré — le site est à jour.");
    } catch (e) {
      toast(errorMessage(e), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-navy-deep">Textes des pages</h1>
          <p className="mt-1 text-sm text-muted">Modifiez n’importe quel texte, bouton, image ou liste du site, puis enregistrez.</p>
        </div>
        <Btn onClick={save} disabled={!dirty || saving}>{saving ? "Enregistrement…" : dirty ? "Enregistrer" : "Enregistré"}</Btn>
      </header>
      <div className="flex flex-wrap gap-2">
        {blocks.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              if (dirty && !confirm("Des modifications ne sont pas enregistrées. Continuer ?")) return;
              setData(null);
              setActive(b.id);
            }}
            className={cn("rounded-full border px-4 py-2 text-sm", b.id === active ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white text-navy-deep")}
          >
            {b.title}
          </button>
        ))}
      </div>
      <Card>
        <p className="mb-5 text-sm text-muted">{block.text}</p>
        {data === null ? (
          <p className="text-sm text-muted">Chargement…</p>
        ) : (
          <JsonEditor
            value={data}
            onChange={(v) => {
              setData(v);
              setDirty(true);
            }}
          />
        )}
      </Card>
      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <Btn onClick={save} disabled={saving} className="shadow-lift">{saving ? "Enregistrement…" : "Enregistrer les modifications"}</Btn>
        </div>
      )}
    </div>
  );
}
