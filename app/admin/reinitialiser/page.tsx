"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { account, errorMessage } from "@/lib/appwrite/browser";
import { Btn, Field, TextInput } from "@/components/admin/ui";

function Reset() {
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok?: boolean } | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await account.updateRecovery({ userId: params.get("userId") ?? "", secret: params.get("secret") ?? "", password });
      setMsg({ text: "Mot de passe enregistré. Vous pouvez vous connecter.", ok: true });
    } catch (err) {
      setMsg({ text: errorMessage(err) });
    }
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted">Choisissez votre mot de passe (8 caractères minimum).</p>
      <Field label="Nouveau mot de passe">
        <TextInput type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      {msg && <p className={msg.ok ? "text-sm text-blue" : "text-sm text-[#9b1c1c]"}>{msg.text}</p>}
      <Btn type="submit" className="w-full">Enregistrer</Btn>
      {msg?.ok && <a href="/admin" className="block text-center text-sm underline">Aller à la connexion</a>}
    </form>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Reset />
    </Suspense>
  );
}
