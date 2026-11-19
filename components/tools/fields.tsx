"use client";

import { cn } from "@/lib/cn";

/** Curseur + champ numérique synchronisés, accessibles. */
export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  tone = "light",
  id,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  tone?: "light" | "dark";
  id: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={cn("text-sm font-medium", tone === "dark" ? "text-white/85" : "text-navy-deep")}>
          {label}
        </label>
        <span className="flex items-baseline gap-1">
          <input
            type="number"
            inputMode="decimal"
            aria-label={`${label} (valeur)`}
            value={Number.isFinite(value) ? value : 0}
            min={min}
            max={max * 10}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              "tabular w-28 rounded-md border bg-transparent px-2 py-1 text-right font-mono text-sm outline-none",
              tone === "dark" ? "border-white/20 text-white focus:border-sky" : "border-line text-navy-deep focus:border-navy",
            )}
          />
          {unit && <span className={cn("text-sm", tone === "dark" ? "text-mist" : "text-muted")}>{unit}</span>}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--p": `${pct}%` } as React.CSSProperties}
        className={cn("range mt-3 w-full", tone === "dark" ? "range-dark" : "range-light")}
      />
    </div>
  );
}

export function ResultTile({ label, value, accent, tone = "light" }: { label: string; value: string; accent?: boolean; tone?: "light" | "dark" }) {
  return (
    <div
      className={cn(
        "rounded-[14px] border p-4",
        tone === "dark" ? "border-white/12 bg-white/[0.04]" : "border-line bg-white",
        accent && (tone === "dark" ? "border-sky/50 bg-sky/10" : "border-blue/30 bg-sky-soft"),
      )}
    >
      <p className={cn("text-xs", tone === "dark" ? "text-mist" : "text-muted")}>{label}</p>
      <p className={cn("tabular mt-1.5 font-mono text-lg font-semibold", tone === "dark" ? "text-white" : "text-navy-deep")}>{value}</p>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-cloud p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm transition-colors",
            o.value === value ? "bg-navy-deep text-white" : "text-navy-deep hover:bg-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
