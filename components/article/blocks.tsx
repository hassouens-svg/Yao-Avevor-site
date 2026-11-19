import { cn } from "@/lib/cn";

/** Encadré « À retenir » / « Attention » / « Exemple ». */
export function Callout({
  kind = "retenir",
  title,
  children,
}: {
  kind?: "retenir" | "attention" | "exemple";
  title?: string;
  children: React.ReactNode;
}) {
  const conf = {
    retenir: { label: "À retenir", cls: "bg-sky-soft border-blue" },
    attention: { label: "Attention", cls: "bg-[#fff7ed] border-[#c2410c]" },
    exemple: { label: "Exemple chiffré", cls: "bg-cloud border-navy-deep" },
  }[kind];
  return (
    <aside className={cn("not-prose my-10 rounded-r-[16px] border-l-4 p-6 sm:p-8", conf.cls)}>
      <p className="label-caps text-navy-deep">◆ {title ?? conf.label}</p>
      <div className="mt-3 space-y-3 text-[1.0625rem] leading-relaxed text-ink/85 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-navy-deep">{children}</div>
    </aside>
  );
}

/** Bandeau obligatoire des articles finance. */
export function FinanceDisclaimer() {
  return (
    <p className="not-prose rounded-md border border-line bg-cloud px-5 py-3 text-sm text-muted">
      <strong className="text-navy-deep">Contenu pédagogique</strong> — ne constitue pas un conseil financier ou fiscal personnalisé. Règles et taux à vérifier sur service-public.fr, impots.gouv.fr et urssaf.fr.
    </p>
  );
}

/** Grand chiffre mis en avant dans le texte. */
export function BigFigure({ value, label }: { value: string; label: string }) {
  return (
    <div className="not-prose my-10 flex flex-col items-start gap-2 border-y border-line py-8">
      <p className="display text-[clamp(3rem,7vw,5rem)] text-blue">{value}</p>
      <p className="max-w-lg text-muted">{label}</p>
    </div>
  );
}
