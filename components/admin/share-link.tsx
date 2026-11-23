"use client";

import { Copy, MessageCircle } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useToast } from "./ui";

const subscribe = () => () => {};

/** Lien public à copier / envoyer par WhatsApp. Utilise le domaine sur lequel l'admin est ouvert. */
export function ShareLink({ path, label, message }: { path: string; label: string; message: string }) {
  const origin = useSyncExternalStore(subscribe, () => window.location.origin, () => "");
  const url = `${origin}${path}`;
  const toast = useToast();
  return (
    <div className="rounded-md border border-blue/30 bg-sky-soft p-4">
      <p className="text-xs font-semibold tracking-wide text-navy-deep uppercase">{label}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded bg-white px-3 py-2 text-sm text-navy-deep">{url}</code>
        <button type="button" onClick={() => { navigator.clipboard.writeText(url); toast("Lien copié."); }} className="inline-flex h-9 items-center gap-2 rounded-full bg-navy-deep px-4 text-sm text-white">
          <Copy className="size-4" /> Copier
        </button>
        <a href={`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-full bg-[#1f9d55] px-4 text-sm text-white">
          <MessageCircle className="size-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
