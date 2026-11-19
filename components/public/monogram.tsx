import { cn } from "@/lib/cn";

/** Monogramme « YA » en trait (préloader, filigranes). */
export function Monogram({ className, strokeWidth = 2.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 64 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("block", className)}
    >
      <path data-stroke d="M4 4 L17 20 L30 4" />
      <path data-stroke d="M17 20 L17 36" />
      <path data-stroke d="M34 36 L47 4 L60 36" />
      <path data-stroke d="M39.5 24 L54.5 24" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("display text-[1.375rem] leading-none tracking-[0.01em]", className)}>
      Yao Avevor<span className="text-blue-bright">.</span>
    </span>
  );
}
