"use client";

import { useActionState, useRef, useState } from "react";
import { Camera, Star } from "lucide-react";
import { submitReview } from "@/lib/actions/reviews";
import type { FormState } from "@/lib/validations/forms";
import { Field, FormMessage, Honeypot, SubmitButton } from "@/components/public/form-fields";
import { cn } from "@/lib/cn";

/** Réduit la photo dans le navigateur (max 800 px, JPEG) avant l'envoi. */
async function shrink(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 800 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85));
    return blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

export function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [preview, setPreview] = useState<string | null>(null);
  const photo = useRef<File | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState<FormState, FormData>(async (prev, fd) => {
    fd.delete("photo");
    if (photo.current) fd.set("photo", photo.current);
    fd.set("rating", String(rating));
    return submitReview(prev, fd);
  }, { status: "idle" });

  if (state.status === "success")
    return (
      <div role="status" className="rounded-md border border-teal/30 bg-[#e8f5f6] p-8">
        <p className="display text-3xl text-teal">Merci !</p>
        <p className="mt-3 text-ink/80">{state.message}</p>
      </div>
    );

  return (
    <form action={action} className="relative space-y-5" noValidate>
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" required autoComplete="given-name" error={state.fieldErrors?.firstName} />
        <Field label="Nom" name="lastName" required autoComplete="family-name" error={state.fieldErrors?.lastName} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Poste / entreprise (facultatif)" name="role" placeholder="Ex. Chef de projet, PMP®" />
        <Field label="Email (facultatif, non publié)" name="email" type="email" autoComplete="email" error={state.fieldErrors?.email} />
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-navy">Votre note</legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Note sur 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} sur 5`} onClick={() => setRating(n)} className="p-1">
              <Star className={cn("size-7 transition-colors", n <= rating ? "fill-[#e0a400] text-[#e0a400]" : "text-line")} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Votre avis" name="message" textarea rows={6} required placeholder="Comment s’est passé l’accompagnement ? Qu’en avez-vous retiré ?" error={state.fieldErrors?.message} />

      <div>
        <p className="mb-2 block text-sm font-medium text-navy">Votre photo (facultatif)</p>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => input.current?.click()} className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-dashed border-navy/30 bg-cloud text-muted hover:border-navy">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview ? <img src={preview} alt="Aperçu de votre photo" className="size-full object-cover" /> : <Camera className="size-6" strokeWidth={1.5} />}
          </button>
          <div className="text-sm text-muted">
            <button type="button" onClick={() => input.current?.click()} className="font-semibold text-blue underline">{preview ? "Changer la photo" : "Ajouter une photo"}</button>
            <p>JPG ou PNG, elle sera affichée à côté de votre avis.</p>
            {state.fieldErrors?.photo && <p className="text-[#9b1c1c]">{state.fieldErrors.photo}</p>}
          </div>
        </div>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const small = await shrink(f);
            photo.current = small;
            setPreview(URL.createObjectURL(small));
          }}
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-muted">
        <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-navy" />
        <span>J’accepte que mon avis, mon nom et ma photo soient publiés sur ce site après validation.</span>
      </label>
      {state.fieldErrors?.consent && <p className="text-sm text-[#9b1c1c]">{state.fieldErrors.consent}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pending={pending}>Envoyer mon avis</SubmitButton>
        <FormMessage status={state.status} message={state.status === "error" ? state.message : undefined} />
      </div>
    </form>
  );
}
