"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { account, errorMessage, teams } from "@/lib/appwrite/browser";
import { Btn, Field, TextInput } from "@/components/admin/ui";

/** Acceptation de l'invitation administrateur + choix du mot de passe. */
function Invitation() {
  const p = useSearchParams();
  const [step, setStep] = useState<"accept" | "password" | "done">("accept");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function accept() {
    try {
      await teams.updateMembershipStatus({ teamId: p.get("teamId") ?? "", membershipId: p.get("membershipId") ?? "", userId: p.get("userId") ?? "", secret: p.get("secret") ?? "" });
      setStep("password");
      setMsg(null);
    } catch (err) {
      setMsg(errorMessage(err));
    }
  }
  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      await account.updatePassword({ password });
      setStep("done");
    } catch (err) {
      setMsg(errorMessage(err));
    }
  }

  if (step === "done") return <div className="space-y-4"><p className="text-sm text-blue">C’est prêt ! Votre accès administrateur est actif.</p><a href="/admin" className="inline-flex h-10 items-center rounded-full bg-navy-deep px-5 text-sm text-white">Ouvrir l’administration</a></div>;
  if (step === "password")
    return (
      <form onSubmit={savePassword} className="space-y-4">
        <p className="text-sm text-muted">Invitation acceptée. Choisissez votre mot de passe.</p>
        <Field label="Mot de passe">
          <TextInput type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {msg && <p className="text-sm text-[#9b1c1c]">{msg}</p>}
        <Btn type="submit" className="w-full">Enregistrer</Btn>
      </form>
    );
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Vous êtes invité(e) à administrer le site.</p>
      {msg && <p className="text-sm text-[#9b1c1c]">{msg}</p>}
      <Btn onClick={accept} className="w-full">Accepter l’invitation</Btn>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Invitation />
    </Suspense>
  );
}
