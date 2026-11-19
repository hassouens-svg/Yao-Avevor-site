"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { LinkedinIcon } from "@/components/public/icons";
import { sendContact } from "@/lib/actions/forms";
import type { FormState } from "@/lib/validations/forms";
import type { HomeContent } from "@/lib/content/types";
import { Consent, Field, FormMessage, Honeypot, SubmitButton } from "@/components/public/form-fields";
import { SectionLabel } from "@/components/public/section-label";

export function Contact({ content, email, linkedin }: { content: HomeContent["contact"]; email: string; linkedin: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendContact, { status: "idle" });

  return (
    <section id="contact" className="section-y bg-white">
      <div className="container-site grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel>{content.label}</SectionLabel>
          <h2 className="mt-5 text-h2 text-navy-deep">{content.title}</h2>
          <p className="mt-6 max-w-md text-lead text-muted">{content.text}</p>
          <ul className="mt-10 space-y-4">
            <li>
              <a href={`mailto:${email}`} className="group inline-flex items-center gap-3 text-navy">
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-navy">
                  <Mail strokeWidth={1.5} className="size-4" aria-hidden="true" />
                </span>
                <span className="link-underline pb-0.5">{email}</span>
              </a>
            </li>
            <li>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-navy">
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-navy">
                  <LinkedinIcon className="size-4" />
                </span>
                <span className="link-underline pb-0.5">LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {state.status === "success" ? (
            <div role="status" className="rounded-[var(--radius-lg)] bg-sky-soft p-10">
              <p className="display text-h2 text-navy-deep">Merci.</p>
              <p className="mt-4 text-muted">{state.message}</p>
            </div>
          ) : (
            <form action={action} className="relative space-y-5" noValidate>
              <Honeypot />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom" name="name" required autoComplete="name" error={state.fieldErrors?.name} />
                <Field label="Email" name="email" type="email" required autoComplete="email" inputMode="email" error={state.fieldErrors?.email} />
              </div>
              <div>
                <label htmlFor="f-reason" className="mb-2 block text-sm font-medium text-navy">
                  Motif
                </label>
                <select
                  id="f-reason"
                  name="reason"
                  defaultValue={content.reasons[0]}
                  className="block h-12 w-full appearance-none rounded-[var(--radius-sm)] border border-line bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%230B1F3A%22 stroke-width=%221.5%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[position:right_1rem_center] bg-no-repeat px-4 text-[0.9375rem] text-ink hover:border-navy/40 focus:border-navy"
                >
                  {content.reasons.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <Field label="Message" name="message" textarea required rows={6} error={state.fieldErrors?.message} />
              <Consent error={state.fieldErrors?.consent} />
              <div className="flex flex-wrap items-center gap-4">
                <SubmitButton pending={pending}>Envoyer le message</SubmitButton>
                <FormMessage status={state.status} message={state.status === "error" ? state.message : undefined} />
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
