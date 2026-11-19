"use client";

import { useMemo, useState } from "react";
import { dca, eur, pct, rental } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { RangeField, ResultTile } from "./fields";

/** Investissement programmé en bourse (DCA) : effet des frais et de l'inflation. */
export function DcaSimulator() {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(6);
  const [fees, setFees] = useState(0.5);
  const [infl, setInfl] = useState(2);
  const [years, setYears] = useState(20);
  const r = useMemo(() => dca({ initial, monthly, ratePct: rate, feesPct: fees, inflationPct: infl, years }), [initial, monthly, rate, fees, infl, years]);
  const max = Math.max(1, ...r.series.map((p) => p.value));
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-5">
        <RangeField id="dca-i" label="Apport initial" value={initial} onChange={setInitial} min={0} max={50000} step={500} unit="€" />
        <RangeField id="dca-m" label="Investissement mensuel" value={monthly} onChange={setMonthly} min={0} max={2000} step={25} unit="€" />
        <RangeField id="dca-r" label="Rendement annuel moyen supposé" value={rate} onChange={setRate} min={0} max={12} step={0.25} unit="%" />
        <RangeField id="dca-f" label="Frais annuels (ETF, contrat…)" value={fees} onChange={setFees} min={0} max={3} step={0.05} unit="%" />
        <RangeField id="dca-inf" label="Inflation annuelle" value={infl} onChange={setInfl} min={0} max={6} step={0.1} unit="%" />
        <RangeField id="dca-y" label="Durée" value={years} onChange={setYears} min={1} max={40} unit="ans" />
      </div>
      <div className="lg:col-span-7" aria-live="polite">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultTile label="Capital final" value={eur(r.final)} accent />
          <ResultTile label="Total investi" value={eur(r.invested)} />
          <ResultTile label="Coût des frais" value={eur(r.feesCost)} />
          <ResultTile label="En euros d’aujourd’hui" value={eur(r.real)} />
        </div>
        <div className="mt-6 flex h-48 items-end gap-[2px]">
          {r.series.slice(1).map((p) => (
            <div key={p.year} className="relative flex-1" style={{ height: `${(p.value / max) * 100}%` }} title={`Année ${p.year} : ${eur(p.value)}`}>
              <div className="absolute inset-x-0 bottom-0 bg-navy-deep" style={{ height: `${(p.invested / p.value) * 100}%` }} />
              <div className="absolute inset-x-0 top-0 bg-blue-bright" style={{ height: `${(1 - p.invested / p.value) * 100}%` }} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Bleu foncé : sommes versées. Bleu clair : gains. Rendement constant supposé : en réalité, la bourse varie fortement d’une année à l’autre et le capital n’est pas garanti.</p>
      </div>
    </div>
  );
}

/** Rentabilité d'un investissement locatif (avant impôts). */
export function RentalSimulator() {
  const [v, setV] = useState({ price: 180000, notaryPct: 8, works: 10000, rent: 850, charges: 70, propertyTax: 1000, vacancyPct: 5, downPayment: 25000, loanRatePct: 3.4, loanYears: 20 });
  const set = (k: keyof typeof v) => (n: number) => setV({ ...v, [k]: n });
  const r = useMemo(() => rental(v), [v]);
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
        <RangeField id="re-p" label="Prix du bien" value={v.price} onChange={set("price")} min={30000} max={800000} step={1000} unit="€" />
        <RangeField id="re-n" label="Frais de notaire" value={v.notaryPct} onChange={set("notaryPct")} min={2} max={10} step={0.5} unit="%" />
        <RangeField id="re-w" label="Travaux" value={v.works} onChange={set("works")} min={0} max={150000} step={1000} unit="€" />
        <RangeField id="re-r" label="Loyer mensuel (hors charges)" value={v.rent} onChange={set("rent")} min={200} max={5000} step={10} unit="€" />
        <RangeField id="re-c" label="Charges non récupérables / mois" value={v.charges} onChange={set("charges")} min={0} max={800} step={5} unit="€" />
        <RangeField id="re-t" label="Taxe foncière / an" value={v.propertyTax} onChange={set("propertyTax")} min={0} max={6000} step={50} unit="€" />
        <RangeField id="re-v" label="Vacance locative" value={v.vacancyPct} onChange={set("vacancyPct")} min={0} max={25} step={1} unit="%" />
        <RangeField id="re-d" label="Apport" value={v.downPayment} onChange={set("downPayment")} min={0} max={400000} step={1000} unit="€" />
        <RangeField id="re-lr" label="Taux du crédit" value={v.loanRatePct} onChange={set("loanRatePct")} min={0} max={7} step={0.05} unit="%" />
        <RangeField id="re-ly" label="Durée du crédit" value={v.loanYears} onChange={set("loanYears")} min={5} max={25} unit="ans" />
      </div>
      <div className="lg:col-span-6" aria-live="polite">
        <div className="grid grid-cols-2 gap-3">
          <ResultTile label="Rendement brut" value={pct(r.grossYield)} accent />
          <ResultTile label="Rendement net de charges" value={pct(r.netYield)} />
          <ResultTile label="Coût total de l’opération" value={eur(r.total)} />
          <ResultTile label="Mensualité du crédit" value={eur(r.monthlyLoan)} />
        </div>
        <div className={cn("mt-4 rounded-md border p-5", r.cashflow >= 0 ? "border-teal/40 bg-[#e8f5f6]" : "border-[#c2410c]/30 bg-[#fff7ed]")}>
          <p className="text-xs text-muted">Cash-flow mensuel avant impôts</p>
          <p className={cn("tabular mt-1 font-mono text-3xl font-bold", r.cashflow >= 0 ? "text-teal" : "text-[#c2410c]")}>{eur(r.cashflow)}</p>
          <p className="mt-2 text-sm text-muted">
            {r.cashflow >= 0 ? "Les loyers couvrent les charges et le crédit." : "Effort d’épargne mensuel nécessaire pour compléter le crédit."}
          </p>
        </div>
        <p className="mt-4 text-xs text-muted">Hors fiscalité (micro-foncier, régime réel, LMNP…), assurance emprunteur, gestion locative et revalorisation du bien.</p>
      </div>
    </div>
  );
}
