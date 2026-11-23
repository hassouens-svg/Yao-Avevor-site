"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { unsubscribe } from "@/lib/actions/newsletter";

export function Unsubscribe() {
  const params = useSearchParams();
  const email = params.get("e") ?? "";
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="rounded-md border border-line bg-white p-8">
      <h1 className="text-h2 text-navy-deep">Se désinscrire</h1>
      {state ? (
        <p className={state.ok ? "mt-4 text-teal" : "mt-4 text-[#9b1c1c]"}>{state.message}</p>
      ) : (
        <>
          <p className="mt-4 text-muted">Ne plus recevoir la newsletter à l’adresse <strong className="text-navy-deep">{email || "—"}</strong> ?</p>
          <button
            type="button"
            disabled={busy || !email}
            onClick={async () => {
              setBusy(true);
              setState(await unsubscribe(email, params.get("t") ?? ""));
              setBusy(false);
            }}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-navy-deep px-6 text-sm text-white disabled:opacity-50"
          >
            {busy ? "…" : "Confirmer la désinscription"}
          </button>
        </>
      )}
    </div>
  );
}
