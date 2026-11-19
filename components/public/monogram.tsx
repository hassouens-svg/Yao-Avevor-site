import { cn } from "@/lib/cn";

/**
 * Monogramme « YA » en trait — utilisé par le logo, le préloader et le favicon.
 * Chaque tracé porte `data-stroke` pour l'animation de dessin.
 */
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
      {/* Y */}
      <path data-stroke d="M4 4 L17 20 L30 4" />
      <path data-stroke d="M17 20 L17 36" />
      {/* A */}
      <path data-stroke d="M34 36 L47 4 L60 36" />
      <path data-stroke d="M39.5 24 L54.5 24" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Monogram className="h-[18px] w-auto" strokeWidth={3} />
      <span className="font-serif text-[1.1875rem] leading-none tracking-[-0.01em]">
        Yao <span className="tracking-[0.02em]">AVEVOR</span>
      </span>
    </span>
  );
}
