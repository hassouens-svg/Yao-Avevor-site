import { cn } from "@/lib/cn";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";

/** En-tête de section : label mono + grand titre condensé révélé ligne par ligne + intro. */
export function SectionHeader({
  label,
  title,
  intro,
  tone = "light",
  className,
  titleClassName,
  align = "left",
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
  tone?: "light" | "dark";
  className?: string;
  titleClassName?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", className)}>
      <SectionLabel tone={tone}>{label}</SectionLabel>
      <Reveal
        as="h2"
        mode="lines"
        className={cn("mt-5 max-w-5xl text-h2", tone === "dark" ? "text-white" : "text-navy-deep", titleClassName)}
      >
        {title}
      </Reveal>
      {intro && (
        <Reveal as="p" className={cn("mt-5 max-w-2xl text-lead", tone === "dark" ? "text-mist" : "text-muted")}>
          {intro}
        </Reveal>
      )}
    </div>
  );
}
