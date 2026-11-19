"use client";

import { useMemo, useState } from "react";
import { compound, eur } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { RangeField, ResultTile } from "./fields";

/** Simulateur d'intérêts composés avec graphique (capital versé vs intérêts gagnés), survol année par année. */
export function CompoundSimulator({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);
  const [hover, setHover] = useState<number | null>(null);

  const series = useMemo(() => compound({ initial, monthly, ratePct: rate, years }), [initial, monthly, rate, years]);
  const last = series[series.length - 1];
  const shown = hover !== null ? series[hover] : last;
  const max = Math.max(1, ...series.map((p) => p.value));
  const dark = tone === "dark";

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="space-y-6 lg:col-span-5">
        <RangeField tone={tone} id="ci-initial" label="Capital de départ" value={initial} onChange={setInitial} min={0} max={100000} step={500} unit="€" />
        <RangeField tone={tone} id="ci-monthly" label="Versement mensuel" value={monthly} onChange={setMonthly} min={0} max={3000} step={25} unit="€" />
        <RangeField tone={tone} id="ci-rate" label="Rendement annuel" value={rate} onChange={setRate} min={0} max={12} step={0.25} unit="%" />
        <RangeField tone={tone} id="ci-years" label="Durée" value={years} onChange={setYears} min={1} max={40} step={1} unit="ans" />
      </div>

      <div className="lg:col-span-7">
        <div className="grid grid-cols-3 gap-3" aria-live="polite">
          <ResultTile tone={tone} label={hover !== null ? `Valeur — année ${shown.year}` : "Valeur finale"} value={eur(shown.value)} accent />
          <ResultTile tone={tone} label="Total versé" value={eur(shown.invested)} />
          <ResultTile tone={tone} label="Intérêts gagnés" value={eur(shown.value - shown.invested)} />
        </div>

        <div className="mt-6" onPointerLeave={() => setHover(null)}>
          <svg viewBox={`0 0 ${series.length * 10} 100`} preserveAspectRatio="none" className="h-56 w-full overflow-visible" role="img" aria-label={`Évolution sur ${years} ans : ${eur(last.value)} au final, dont ${eur(last.value - last.invested)} d’intérêts.`}>
            {series.map((p, i) => {
              const hInv = (p.invested / max) * 100;
              const hTot = (p.value / max) * 100;
              const on = hover === null || hover === i;
              return (
                <g key={i} onPointerEnter={() => setHover(i)} className="cursor-crosshair">
                  <rect x={i * 10} y={0} width={10} height={100} fill="transparent" />
                  <rect x={i * 10 + 1.5} y={100 - hTot} width={7} height={Math.max(0, hTot - hInv)} rx={1.2} className={cn("transition-opacity", dark ? "fill-sky" : "fill-blue-bright", on ? "opacity-100" : "opacity-35")} />
                  <rect x={i * 10 + 1.5} y={100 - hInv} width={7} height={hInv} rx={1.2} className={cn("transition-opacity", dark ? "fill-white/35" : "fill-navy-deep", on ? "opacity-100" : "opacity-35")} />
                </g>
              );
            })}
          </svg>
          <div className={cn("mt-3 flex items-center justify-between text-xs", dark ? "text-mist" : "text-muted")}>
            <span>Année 0</span>
            <span className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className={cn("size-2.5 rounded-sm", dark ? "bg-white/35" : "bg-navy-deep")} />Versé</span>
              <span className="flex items-center gap-1.5"><span className={cn("size-2.5 rounded-sm", dark ? "bg-sky" : "bg-blue-bright")} />Intérêts</span>
            </span>
            <span>Année {years}</span>
          </div>
        </div>
        <p className={cn("mt-5 text-xs", dark ? "text-mist" : "text-muted")}>
          Simulation pédagogique à taux constant, capitalisation mensuelle, hors frais et fiscalité. Les rendements passés ne préjugent pas des rendements futurs.
        </p>
      </div>
    </div>
  );
}
