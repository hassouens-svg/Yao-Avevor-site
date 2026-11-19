import { cn } from "@/lib/cn";

type Tone = "light" | "dark";

const inputBase =
  "block w-full rounded-[var(--radius-sm)] border bg-transparent px-4 h-12 text-[0.9375rem] transition-colors duration-300 outline-none placeholder:opacity-60";

const inputTone: Record<Tone, string> = {
  light: "border-line text-ink placeholder:text-muted hover:border-navy/40 focus:border-navy focus-visible:outline-2 focus-visible:outline-navy",
  dark: "border-white/20 text-white placeholder:text-mist hover:border-white/40 focus:border-sky",
};

export function Field({
  label,
  name,
  error,
  tone = "light",
  className,
  textarea,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
  tone?: Tone;
  className?: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `f-${name}`;
  const describedBy = error ? `${id}-err` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className={cn("mb-2 block text-sm font-medium", tone === "dark" ? "text-white/85" : "text-navy")}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(inputBase, inputTone[tone], "h-auto min-h-36 py-3 leading-relaxed")}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          name={name}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(inputBase, inputTone[tone])}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p id={describedBy} className={cn("mt-2 text-sm", tone === "dark" ? "text-sky" : "text-[#9b1c1c]")}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Consent({ tone = "light", error }: { tone?: Tone; error?: string }) {
  return (
    <div>
      <label className={cn("flex items-start gap-3 text-sm leading-relaxed", tone === "dark" ? "text-mist" : "text-muted")}>
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={!!error || undefined}
          className={cn("mt-1 size-4 shrink-0 rounded-[3px]", tone === "dark" ? "accent-sky" : "accent-navy")}
        />
        <span>
          J’accepte que mes données soient utilisées pour me répondre, conformément à la{" "}
          <a href="/confidentialite" className={cn("underline underline-offset-2", tone === "dark" ? "text-white" : "text-navy")}>
            politique de confidentialité
          </a>
          .
        </span>
      </label>
      {error && <p className={cn("mt-2 text-sm", tone === "dark" ? "text-sky" : "text-[#9b1c1c]")}>{error}</p>}
    </div>
  );
}

/** Champ piège anti-spam, invisible et ignoré par les lecteurs d'écran. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Site web
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ pending, children, tone = "light" }: { pending: boolean; children: React.ReactNode; tone?: Tone }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[0.9375rem] font-medium transition-colors duration-500 disabled:opacity-60",
        tone === "dark" ? "bg-white text-navy hover:bg-sky" : "bg-navy text-white hover:bg-navy-deep",
      )}
    >
      {pending ? "Envoi…" : children}
    </button>
  );
}

export function FormMessage({ status, message, tone = "light" }: { status: string; message?: string; tone?: Tone }) {
  if (!message || status === "idle") return null;
  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={cn(
        "text-sm",
        status === "success" ? (tone === "dark" ? "text-sky" : "text-navy") : tone === "dark" ? "text-sky" : "text-[#9b1c1c]",
      )}
    >
      {message}
    </p>
  );
}
