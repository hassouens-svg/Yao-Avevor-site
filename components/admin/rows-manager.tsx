"use client";

import { ChevronLeft, Plus, Trash2, Upload, Film } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { DB_ID, ID, Query, errorMessage, tables, uploadFile } from "@/lib/appwrite/browser";
import { refreshSite } from "@/lib/actions/refresh";
import { Btn, Card, Field, Select, TextArea, TextInput, Toggle, useToast } from "./ui";

/**
 * Gestion générique d'une table Appwrite (liste + formulaire) : articles, livres, témoignages.
 */
export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "date" | "url"; hint?: string; required?: boolean }
  | { key: string; label: string; type: "number"; hint?: string }
  | { key: string; label: string; type: "boolean"; hint?: string }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[]; hint?: string }
  | { key: string; label: string; type: "image" | "video"; hint?: string }
  | { key: string; label: string; type: "markdown"; hint?: string }
  | { key: string; label: string; type: "list"; fields: { key: string; label: string; long?: boolean }[]; hint?: string };

type Row = { $id: string } & Record<string, unknown>;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);

function MediaField({ value, onChange, kind }: { value: string; onChange: (v: string) => void; kind: "image" | "video" }) {
  const input = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState<number | null>(null);
  const toast = useToast();
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-cloud">
        {value ? (
          kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          ) : /youtu|vimeo/.test(value) ? (
            <span className="px-2 text-center text-xs text-muted">Vidéo en ligne</span>
          ) : (
            <video src={value} className="max-h-full max-w-full" muted />
          )
        ) : kind === "video" ? (
          <Film className="size-6 text-muted" />
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder={kind === "video" ? "Lien YouTube / Vimeo, ou envoyez un fichier" : "URL de l’image"} />
        <button type="button" onClick={() => input.current?.click()} className="inline-flex items-center gap-2 text-xs font-semibold text-blue">
          <Upload className="size-3.5" /> {pct !== null ? `Envoi… ${pct} %` : kind === "video" ? "Envoyer une vidéo (MP4, max 50 Mo)" : "Envoyer une image"}
        </button>
        <input
          ref={input}
          type="file"
          accept={kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/*"}
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              setPct(0);
              const r = await uploadFile(f, setPct);
              onChange(r.url);
            } catch (err) {
              toast(errorMessage(err), "error");
            } finally {
              setPct(null);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}

function ListField({ value, onChange, fields }: { value: Record<string, string>[]; onChange: (v: Record<string, string>[]) => void; fields: { key: string; label: string; long?: boolean }[] }) {
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-line bg-cloud/60 p-3">
          <div className="flex justify-end">
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-xs text-[#9b1c1c]">Supprimer</button>
          </div>
          {fields.map((f) =>
            f.long ? (
              <TextArea key={f.key} placeholder={f.label} value={item[f.key] ?? ""} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
            ) : (
              <TextInput key={f.key} placeholder={f.label} value={item[f.key] ?? ""} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, [f.key]: e.target.value } : x)))} />
            ),
          )}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, Object.fromEntries(fields.map((f) => [f.key, ""]))])} className="inline-flex items-center gap-2 rounded-full border border-dashed border-navy/30 px-4 py-2 text-sm text-navy-deep">
        <Plus className="size-4" /> Ajouter
      </button>
    </div>
  );
}

export function RowsManager({
  table,
  title,
  description,
  fields,
  titleKey,
  subtitleKey,
  orderKey,
  jsonKeys = [],
  defaults,
}: {
  table: string;
  title: string;
  description: string;
  fields: FieldDef[];
  titleKey: string;
  subtitleKey?: string;
  orderKey?: string;
  jsonKeys?: string[];
  defaults: Record<string, unknown>;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const r = await tables.listRows({ databaseId: DB_ID, tableId: table, queries: [Query.limit(500), orderKey ? Query.orderAsc(orderKey) : Query.orderDesc("$createdAt")] });
      setRows(r.rows as unknown as Row[]);
    } catch (e) {
      toast(errorMessage(e), "error");
      setRows([]);
    }
  }, [table, orderKey, toast]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  function open(row: Row | null) {
    if (!row) {
      setEditId(null);
      setEditing({ ...defaults });
      return;
    }
    const data: Record<string, unknown> = {};
    for (const f of fields) {
      const v = row[f.key];
      data[f.key] = jsonKeys.includes(f.key) ? (() => { try { return JSON.parse(String(v || "[]")); } catch { return []; } })() : v ?? defaults[f.key] ?? "";
    }
    setEditId(row.$id);
    setEditing(data);
  }

  async function save() {
    if (!editing) return;
    const data: Record<string, unknown> = {};
    for (const f of fields) {
      let v = editing[f.key];
      if (jsonKeys.includes(f.key)) v = JSON.stringify(v ?? []);
      if (f.type === "number") v = Number(v) || 0;
      if (f.type === "boolean") v = !!v;
      data[f.key] = v ?? "";
    }
    if ("slug" in data && !data.slug) data.slug = slugify(String(data[titleKey] ?? ""));
    setSaving(true);
    try {
      if (editId) await tables.updateRow({ databaseId: DB_ID, tableId: table, rowId: editId, data });
      else await tables.createRow({ databaseId: DB_ID, tableId: table, rowId: ID.unique(), data });
      await refreshSite();
      toast("Enregistré — le site est à jour.");
      setEditing(null);
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Supprimer définitivement cet élément ?")) return;
    try {
      await tables.deleteRow({ databaseId: DB_ID, tableId: table, rowId: id });
      await refreshSite();
      toast("Supprimé.");
      setEditing(null);
      load();
    } catch (e) {
      toast(errorMessage(e), "error");
    }
  }

  if (editing) {
    const set = (k: string, v: unknown) => setEditing({ ...editing, [k]: v });
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => setEditing(null)} className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy-deep">
          <ChevronLeft className="size-4" /> Retour à la liste
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="display text-3xl text-navy-deep">{editId ? "Modifier" : "Nouveau"}</h1>
          <div className="flex gap-2">
            {editId && <Btn variant="danger" onClick={() => remove(editId)}><Trash2 className="size-4" /> Supprimer</Btn>}
            <Btn onClick={save} disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
          </div>
        </div>
        <Card className="space-y-5">
          {fields.map((f) => {
            const v = editing[f.key];
            return (
              <Field key={f.key} label={f.label} hint={f.hint}>
                {f.type === "textarea" ? (
                  <TextArea value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                ) : f.type === "markdown" ? (
                  <div className="grid gap-3 lg:grid-cols-2">
                    <TextArea className="min-h-96 font-mono text-[13px]" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                    <div className="prose-ya max-h-[32rem] overflow-auto rounded-lg border border-line bg-white p-4 text-sm" dangerouslySetInnerHTML={{ __html: marked.parse(String(v ?? ""), { async: false }) as string }} />
                  </div>
                ) : f.type === "number" ? (
                  <TextInput type="number" value={Number(v ?? 0)} onChange={(e) => set(f.key, Number(e.target.value))} className="max-w-40" />
                ) : f.type === "boolean" ? (
                  <div><Toggle checked={!!v} onChange={(b) => set(f.key, b)} label={v ? "Oui" : "Non"} /></div>
                ) : f.type === "select" ? (
                  <Select value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} options={f.options} />
                ) : f.type === "image" || f.type === "video" ? (
                  <MediaField value={String(v ?? "")} onChange={(nv) => set(f.key, nv)} kind={f.type} />
                ) : f.type === "list" ? (
                  <ListField value={(v as Record<string, string>[]) ?? []} onChange={(nv) => set(f.key, nv)} fields={f.fields} />
                ) : (
                  <TextInput type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                )}
              </Field>
            );
          })}
        </Card>
        <div className="sticky bottom-4 flex justify-end">
          <Btn onClick={save} disabled={saving} className="shadow-lift">{saving ? "Enregistrement…" : "Enregistrer"}</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-navy-deep">{title}</h1>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <Btn onClick={() => open(null)}><Plus className="size-4" /> Ajouter</Btn>
      </header>
      <Card className="p-0 sm:p-0">
        {rows === null ? (
          <p className="p-6 text-sm text-muted">Chargement…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted">Rien pour l’instant.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((r) => (
              <li key={r.$id}>
                <button type="button" onClick={() => open(r)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cloud">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-navy-deep">{String(r[titleKey] ?? "(sans titre)")}</span>
                    {subtitleKey && <span className="block truncate text-sm text-muted">{String(r[subtitleKey] ?? "")}</span>}
                  </span>
                  <span className={r.published === false ? "shrink-0 rounded-full bg-cloud px-3 py-1 text-xs text-muted" : "shrink-0 rounded-full bg-sky-soft px-3 py-1 text-xs text-navy-deep"}>
                    {r.published === false ? "Masqué" : "En ligne"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
