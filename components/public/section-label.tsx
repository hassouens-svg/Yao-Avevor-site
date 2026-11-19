import { cn } from "@/lib/cn";

/** Label éditorial : « 01 — EXPERTISE » précédé d'un filet. */
export function SectionLabel({
  index,
  children,
  tone = "light",
  className,
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "label-caps flex items-center gap-4",
        tone === "dark" ? "text-mist" : "text-muted",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-10", tone === "dark" ? "bg-sky/60" : "bg-navy/30")} />
      {index && (
        <span className={cn("tabular", tone === "dark" ? "text-sky" : "text-navy")}>{index}</span>
      )}
      {index && <span aria-hidden="true">—</span>}
      <span>{children}</span>
    </p>
  );
}
