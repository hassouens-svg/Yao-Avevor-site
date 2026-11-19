"use client";

import { useMemo, useState } from "react";
import { STATUS_RATES, budget503020, emergencyFund, eur, evm, grossToNet, loanPayment, num, type Status } from "@/lib/finance";
import { cn } from "@/lib/cn";
import { RangeField, ResultTile, Segmented } from "./fields";

/* ───────────── Brut → net ───────────── */
export function GrossNetSimulator() {
  const [gross, setGross] = useState(2800);
  const [status, setStatus] = useState<Status>("non-cadre");
  const [pas, setPas] = useState(4.5);
  const r = useMemo(() => grossToNet(gross, status, pas), [gross, status, pas]);
  const steps = [
    { label: "Salaire brut", value: gross, tone: "bg-navy-deep" },
    { label: "− Cotisations salariales (estim.)", value: -r.contributions, tone: "bg-muted" },
    { label: "= Net avant impôt", value: r.netBeforeTax, tone: "bg-blue" },
    { label: "− Prélèvement à la source", value: -r.pas, tone: "bg-muted" },
    { label: "= Net versé sur votre compte", value: r.net, tone: "bg-sky" },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <Segmented label="Statut" value={status} onChange={setStatus} options={(Object.keys(STATUS_RATES) as Status[]).map((k) => ({ value: k, label: STATUS_RATES[k].label }))} />
        <RangeField id="bn-gross" label="Salaire brut mensuel" value={gross} onChange={setGross} min={1000} max={12000} step={50} unit="€" />
        <RangeField id="bn-pas" label="Taux de prélèvement à la source" value={pas} onChange={setPas} min={0} max={30} step={0.1} unit="%" />
        <p className="text-xs text-muted">Taux de cotisations moyens indicatifs ({Math.round(STATUS_RATES[status].rate * 100)} % pour ce statut). Le vrai montant dépend de votre convention, de votre mutuelle et de votre entreprise : votre fiche de paie fait foi.</p>
      </div>
      <div className="lg:col-span-7">
        <ul className="space-y-2.5" aria-live="polite">
          {steps.map((s) => (
            <li key={s.label} className="text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-navy-deep">{s.label}</span>
                <span className="tabular font-mono font-semibold text-navy-deep">{eur(s.value)}</span>
              </div>
              <span className="relative mt-1.5 block h-2.5 overflow-hidden rounded-full bg-cloud">
                <span className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-500", s.tone)} style={{ width: `${(Math.abs(s.value) / gross) * 100}%` }} />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <ResultTile label="Net annuel versé" value={eur(r.net * 12)} accent />
          <ResultTile label="Brut annuel" value={eur(gross * 12)} />
        </div>
      </div>
    </div>
  );
}

/* ───────────── Valeur acquise ───────────── */
function Gauge({ label, value }: { label: string; value: number }) {
  const ok = value >= 1;
  const w = Math.min(100, (value / 1.5) * 100);
  return (
    <div className="rounded-[14px] border border-line bg-white p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-muted">{label}</p>
        <p className={cn("tabular font-mono text-xl font-bold", ok ? "text-blue" : "text-[#9b1c1c]")}>{num(value)}</p>
      </div>
      <div className="relative mt-3 h-2 rounded-full bg-cloud">
        <span className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-500", ok ? "bg-blue" : "bg-[#c2410c]")} style={{ width: `${w}%` }} />
        <span className="absolute top-[-4px] h-4 w-px bg-navy-deep" style={{ left: `${(1 / 1.5) * 100}%` }} title="1,00" />
      </div>
      <p className="mt-2 text-xs text-muted">{ok ? "Dans les clous" : "Sous l’objectif (< 1)"}</p>
    </div>
  );
}

export function EvmSimulator() {
  const [bac, setBac] = useState(120000);
  const [planned, setPlanned] = useState(50);
  const [done, setDone] = useState(40);
  const [ac, setAc] = useState(55000);
  const r = useMemo(() => evm({ bac, plannedPct: planned, donePct: done, actualCost: ac }), [bac, planned, done, ac]);
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <RangeField id="evm-bac" label="Budget total (BAC)" value={bac} onChange={setBac} min={10000} max={1000000} step={5000} unit="€" />
        <RangeField id="evm-planned" label="Avancement prévu à date" value={planned} onChange={setPlanned} min={0} max={100} unit="%" />
        <RangeField id="evm-done" label="Avancement réel (travail terminé)" value={done} onChange={setDone} min={0} max={100} unit="%" />
        <RangeField id="evm-ac" label="Coût réel dépensé (CR / AC)" value={ac} onChange={setAc} min={0} max={1000000} step={1000} unit="€" />
      </div>
      <div className="space-y-4 lg:col-span-7" aria-live="polite">
        <div className="grid grid-cols-3 gap-3">
          <ResultTile label="Valeur planifiée (VP)" value={eur(r.pv)} />
          <ResultTile label="Valeur acquise (VA)" value={eur(r.ev)} accent />
          <ResultTile label="Coût réel (CR)" value={eur(r.ac)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Gauge label="SPI — délais (VA ÷ VP)" value={r.spi} />
          <Gauge label="CPI — coûts (VA ÷ CR)" value={r.cpi} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ResultTile label="Coût final estimé (EAC)" value={eur(r.eac)} />
          <ResultTile label="Reste à dépenser (ETC)" value={eur(r.etc)} />
          <ResultTile label="Écart final (VAC)" value={eur(r.vac)} />
        </div>
        <p className="text-sm text-muted">
          {r.spi < 1 ? "Le projet est en retard" : "Le projet est dans les temps"} et {r.cpi < 1 ? "dépense plus que prévu" : "respecte son budget"}. Au rythme actuel, il coûtera {eur(r.eac)} au lieu de {eur(bac)}.
        </p>
      </div>
    </div>
  );
}

/* ───────────── Fonds d'urgence ───────────── */
export function EmergencySimulator() {
  const [expenses, setExpenses] = useState(1800);
  const [months, setMonths] = useState(4);
  const [current, setCurrent] = useState(2000);
  const [saving, setSaving] = useState(250);
  const r = useMemo(() => emergencyFund(expenses, months, current, saving), [expenses, months, current, saving]);
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <RangeField id="ef-exp" label="Dépenses incompressibles / mois" value={expenses} onChange={setExpenses} min={300} max={8000} step={50} unit="€" />
        <RangeField id="ef-months" label="Mois de sécurité visés" value={months} onChange={setMonths} min={1} max={12} unit="mois" />
        <RangeField id="ef-cur" label="Épargne de précaution actuelle" value={current} onChange={setCurrent} min={0} max={50000} step={100} unit="€" />
        <RangeField id="ef-save" label="Épargne mensuelle possible" value={saving} onChange={setSaving} min={0} max={3000} step={25} unit="€" />
      </div>
      <div className="lg:col-span-7" aria-live="polite">
        <div className="grid grid-cols-3 gap-3">
          <ResultTile label="Objectif" value={eur(r.target)} accent />
          <ResultTile label="Il manque" value={eur(r.missing)} />
          <ResultTile label="Objectif atteint dans" value={Number.isFinite(r.monthsToGoal) ? `${r.monthsToGoal} mois` : "—"} />
        </div>
        <div className="mt-8">
          <div className="flex justify-between text-sm text-muted">
            <span>Progression</span>
            <span className="tabular font-mono text-navy-deep">{Math.round(r.progress * 100)} %</span>
          </div>
          <div className="mt-2 h-4 overflow-hidden rounded-full bg-cloud">
            <span className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-blue),var(--color-sky))] transition-[width] duration-700" style={{ width: `${r.progress * 100}%` }} />
          </div>
        </div>
        <p className="mt-6 text-sm text-muted">Repère courant : 3 à 6 mois de dépenses, sur un support disponible immédiatement et sans risque (livret).</p>
      </div>
    </div>
  );
}

/* ───────────── Budget 50/30/20 ───────────── */
export function BudgetSimulator() {
  const [income, setIncome] = useState(2400);
  const r = budget503020(income);
  const parts = [
    { label: "Besoins", sub: "Logement, courses, transport, assurances", value: r.needs, pct: 50, cls: "bg-navy-deep" },
    { label: "Envies", sub: "Loisirs, sorties, abonnements", value: r.wants, pct: 30, cls: "bg-blue" },
    { label: "Épargne & dettes", sub: "Fonds d’urgence, projets, remboursements", value: r.savings, pct: 20, cls: "bg-sky" },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <RangeField id="bd-income" label="Revenu net mensuel" value={income} onChange={setIncome} min={800} max={12000} step={50} unit="€" />
        <p className="text-xs text-muted">La règle 50/30/20 est un point de départ, pas une loi : ajustez-la à votre situation et à vos objectifs.</p>
      </div>
      <div className="lg:col-span-7" aria-live="polite">
        <div className="flex h-14 overflow-hidden rounded-[14px]">
          {parts.map((p) => (
            <div key={p.label} className={cn("flex items-center justify-center text-sm font-semibold", p.cls, p.cls === "bg-sky" ? "text-navy-deep" : "text-white")} style={{ width: `${p.pct}%` }}>
              {p.pct} %
            </div>
          ))}
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {parts.map((p) => (
            <li key={p.label} className="rounded-[14px] border border-line bg-white p-4">
              <p className="text-sm font-semibold text-navy-deep">{p.label}</p>
              <p className="tabular mt-1 font-mono text-xl font-bold text-navy-deep">{eur(p.value)}</p>
              <p className="mt-1.5 text-xs text-muted">{p.sub}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───────────── Mensualité de crédit ───────────── */
export function LoanSimulator() {
  const [principal, setPrincipal] = useState(200000);
  const [rate, setRate] = useState(3.4);
  const [years, setYears] = useState(20);
  const r = useMemo(() => loanPayment(principal, rate, years), [principal, rate, years]);
  const share = r.total > 0 ? r.interest / r.total : 0;
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <RangeField id="ln-p" label="Montant emprunté" value={principal} onChange={setPrincipal} min={5000} max={800000} step={1000} unit="€" />
        <RangeField id="ln-r" label="Taux nominal annuel" value={rate} onChange={setRate} min={0} max={8} step={0.05} unit="%" />
        <RangeField id="ln-y" label="Durée" value={years} onChange={setYears} min={1} max={30} unit="ans" />
        <p className="text-xs text-muted">Hors assurance emprunteur et frais (dossier, garantie). Le TAEG proposé par votre banque intègre ces coûts.</p>
      </div>
      <div className="lg:col-span-7" aria-live="polite">
        <div className="grid grid-cols-3 gap-3">
          <ResultTile label="Mensualité" value={eur(r.monthly)} accent />
          <ResultTile label="Coût des intérêts" value={eur(r.interest)} />
          <ResultTile label="Total remboursé" value={eur(r.total)} />
        </div>
        <div className="mt-8 flex h-12 overflow-hidden rounded-[14px] text-sm font-semibold">
          <div className="flex items-center justify-center bg-navy-deep text-white" style={{ width: `${(1 - share) * 100}%` }}>Capital</div>
          <div className="flex items-center justify-center bg-sky text-navy-deep" style={{ width: `${share * 100}%`, minWidth: share > 0 ? "4.5rem" : 0 }}>Intérêts</div>
        </div>
      </div>
    </div>
  );
}
