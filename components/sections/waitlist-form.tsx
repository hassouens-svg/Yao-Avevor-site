"use client";

import { useActionState } from "react";
import { subscribe } from "@/lib/actions/forms";
import type { FormState } from "@/lib/validations/forms";
import { Consent, Field, FormMessage, Honeypot, SubmitButton } from "@/components/public/form-fields";

/** Liste d'attente du livre → abonné avec le segment `livre`. */
export function WaitlistForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: "idle" });
  if (state.status === "success") {
    return <p role="status" className="mt-6 text-lg font-semibold text-blue">{state.message}</p>;
  }
  return (
    <form action={action} className="relative mt-6 space-y-5" noValidate>
      <Honeypot />
      <input type="hidden" name="segments" value="livre" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" autoComplete="given-name" error={state.fieldErrors?.firstName} />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          error={state.fieldErrors?.email}
        />
      </div>
      <Consent error={state.fieldErrors?.consent} />
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pending={pending}>Me prévenir</SubmitButton>
        <FormMessage status={state.status} message={state.status === "error" ? state.message : undefined} />
      </div>
    </form>
  );
}
