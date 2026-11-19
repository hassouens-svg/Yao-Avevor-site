"use client";

import { useActionState } from "react";
import { subscribe } from "@/lib/actions/forms";
import type { FormState } from "@/lib/validations/forms";
import type { HomeContent } from "@/lib/content/types";
import { Honeypot } from "@/components/public/form-fields";
import { cn } from "@/lib/cn";

/** Newsletter centrée : email + centres d'intérêt + consentement (double opt-in en phase 7). */
export function Newsletter({ content }: { content: HomeContent["newsletter"] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: "idle" });

  return (
    <section id="newsletter" className="bg-white py-[clamp(4rem,9vw,8rem)]">
      <div className="container-site flex flex-col items-center text-center">
        <p className="label-caps flex items-center gap-3 text-navy">
          <span aria-hidden="true" className="h-px w-6 bg-navy" />
          {content.label}
        </p>
        <h2 className="mt-5 max-w-4xl text-h2 text-navy-deep">{content.title}</h2>
        <p className="mt-4 max-w-xl text-muted">{content.text}</p>

        {state.status === "success" ? (
          <p role="status" className="mt-10 text-lg font-semibold text-blue">
            {state.message}
          </p>
        ) : (
          <form action={action} className="relative mt-10 w-full max-w-xl" noValidate>
            <Honeypot />
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="nl-email" className="sr-only">
                Votre email
              </label>
              <input
                id="nl-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Votre email"
                aria-invalid={!!state.fieldErrors?.email || undefined}
                className="h-13 flex-1 rounded-full border border-line bg-cloud px-6 text-[0.9375rem] text-ink outline-none placeholder:text-muted focus:border-navy"
              />
              <button
                type="submit"
                disabled={pending}
                className="label-caps h-13 rounded-full bg-navy-deep px-8 text-white transition-colors hover:bg-blue disabled:opacity-60"
              >
                {pending ? "Envoi…" : "S’abonner"}
              </button>
            </div>
            <fieldset className="mt-5">
              <legend className="sr-only">Centres d’intérêt</legend>
              <div className="flex flex-wrap justify-center gap-2">
                {content.interests.map((it) => (
                  <label key={it.value} className="cursor-pointer">
                    <input type="checkbox" name="segments" value={it.value} defaultChecked className="peer sr-only" />
                    <span className="inline-flex h-9 items-center rounded-full border border-line px-4 font-mono text-[0.75rem] text-muted transition-colors peer-checked:border-navy-deep peer-checked:bg-navy-deep peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy">
                      {it.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="mt-5 flex items-start justify-center gap-2 text-left text-xs text-muted">
              <input type="checkbox" name="consent" required className="mt-0.5 accent-navy" />
              <span>
                J’accepte de recevoir la newsletter. Désinscription en un clic. <a href="/confidentialite" className="underline">Confidentialité</a>.
              </span>
            </label>
            {state.status === "error" && (
              <p role="alert" className={cn("mt-4 text-sm text-[#9b1c1c]")}>
                {state.fieldErrors?.email ?? state.fieldErrors?.consent ?? state.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
