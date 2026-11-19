import { cn } from "@/lib/cn";

/** Label éditorial en police mono : « — PARCOURS ». */
export function SectionLabel({
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
    <p className={cn("label-caps flex items-center gap-3", tone === "dark" ? "text-sky" : "text-navy", className)}>
      <span aria-hidden="true" className={cn("h-px w-6", tone === "dark" ? "bg-sky" : "bg-navy")} />
      <span>{children}</span>
    </p>
  );
}
