"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import type { Models } from "appwrite";
import { BUCKET_ID, Query, errorMessage, storage, uploadFile } from "@/lib/appwrite/browser";
import { fileViewUrl } from "@/lib/appwrite/config";
import { Btn, Card, useToast } from "@/components/admin/ui";

export default function MediasPage() {
  const [files, setFiles] = useState<Models.File[] | null>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const r = await storage.listFiles({ bucketId: BUCKET_ID, queries: [Query.limit(200), Query.orderDesc("$createdAt")] });
      setFiles(r.files);
    } catch (e) {
      toast(errorMessage(e), "error");
      setFiles([]);
    }
  }, [toast]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function send(list: FileList | null) {
    if (!list?.length) return;
    for (const f of Array.from(list)) {
      try {
        setPct(0);
        await uploadFile(f, setPct);
        toast(`${f.name} envoyé.`);
      } catch (e) {
        toast(`${f.name} : ${errorMessage(e)}`, "error");
      }
    }
    setPct(null);
    load();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-navy-deep">Médias</h1>
          <p className="mt-1 text-sm text-muted">Images, vidéos et PDF. Copiez le lien d’un fichier pour l’utiliser n’importe où sur le site.</p>
        </div>
        <Btn onClick={() => input.current?.click()}><Upload className="size-4" /> {pct !== null ? `Envoi… ${pct} %` : "Envoyer des fichiers"}</Btn>
        <input ref={input} type="file" multiple hidden accept="image/*,video/*,application/pdf" onChange={(e) => { send(e.target.files); e.target.value = ""; }} />
      </header>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); send(e.dataTransfer.files); }}
        className={`rounded-2xl border-2 border-dashed p-8 text-center text-sm ${drag ? "border-blue bg-sky-soft" : "border-line bg-white text-muted"}`}
      >
        Glissez-déposez vos fichiers ici (50 Mo max par fichier)
      </div>
      <Card>
        {files === null ? (
          <p className="text-sm text-muted">Chargement…</p>
        ) : files.length === 0 ? (
          <p className="text-sm text-muted">Aucun fichier.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {files.map((f) => {
              const url = fileViewUrl(f.$id);
              return (
                <li key={f.$id} className="overflow-hidden rounded-xl border border-line">
                  <div className="flex aspect-video items-center justify-center bg-cloud">
                    {f.mimeType.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt="" className="max-h-full max-w-full object-contain" />
                    ) : f.mimeType.startsWith("video/") ? (
                      <video src={url} className="max-h-full max-w-full" muted controls />
                    ) : (
                      <span className="text-xs text-muted">{f.mimeType}</span>
                    )}
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="truncate text-sm font-medium text-navy-deep">{f.name}</p>
                    <div className="flex gap-2">
                      <Btn variant="secondary" className="h-8 px-3 text-xs" onClick={() => { navigator.clipboard.writeText(url); toast("Lien copié."); }}><Copy className="size-3.5" /> Copier le lien</Btn>
                      <Btn variant="danger" className="h-8 px-3 text-xs" onClick={async () => { if (!confirm("Supprimer ce fichier ? S’il est utilisé sur le site, il n’y apparaîtra plus.")) return; await storage.deleteFile({ bucketId: BUCKET_ID, fileId: f.$id }); load(); }}><Trash2 className="size-3.5" /></Btn>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
