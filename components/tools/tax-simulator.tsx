"use client";

import { useMemo, useState } from "react";
import { IR_PARAMS, eur, incomeTax, pct } from "@/lib/finance";
import { RangeField, ResultTile, Segmented } from "./fields";

/** Impôt sur le revenu : barème progressif, quotient familial (plafonné), décote — avec la décomposition par tranche. */
export function TaxSimulator() {
  const [income, setIncome] = useState(36000);
  const [couple, setCouple] = useState<"seul" | "couple">("seul");
  const [children, setChildren] = useState(0);
  const [mode, setMode] = useState<"net" | "salaire">("salaire");

  const r = useMemo(
    () => incomeTax({ income, couple: couple === "couple", children, applyDeduction: mode === "salaire" }),
    [income, couple, children, mode],
  );
  const maxAmount = Math.max(1, ...r.byBracket.map((b) => b.amount));

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-5">
        <div className="flex flex-wrap gap-3">
          <Segmented label="Situation" value={couple} onChange={setCouple} options={[{ value: "seul", label: "Seul(e)" }, { value: "couple", label: "Marié(e) / Pacsé(e)" }]} />
        </div>
        <Segmented
          label="Montant saisi"
          value={mode}
          onChange={setMode}
          options={[
            { value: "salaire", label: "Salaires déclarés" },
            { value: "net", label: "Revenu net imposable" },
          ]}
        />
        <RangeField id="ir-income" label={mode === "salaire" ? "Salaires annuels du foyer" : "Revenu net imposable du foyer"} value={income} onChange={setIncome} min={0} max={250000} step={500} unit="€" />
        <RangeField id="ir-children" label="Enfants à charge" value={children} onChange={setChildren} min={0} max={6} step={1} />
        <p className="text-xs text-muted">
          {mode === "salaire" ? "Un abattement forfaitaire de 10 % pour frais professionnels est appliqué automatiquement. " : ""}
          {IR_PARAMS.label}. Estimation simplifiée : hors réductions et crédits d’impôt, revenus exceptionnels et contributions spécifiques. Vérifiez sur impots.gouv.fr.
        </p>
      </div>

      <div className="lg:col-span-7">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
          <ResultTile label="Impôt estimé" value={eur(r.tax)} accent />
          <ResultTile label="Taux moyen" value={pct(r.averageRate)} />
          <ResultTile label="Taux marginal" value={pct(r.marginalRate, 0)} />
          <ResultTile label="Parts fiscales" value={String(r.parts).replace(".", ",")} />
        </div>

        <div className="mt-8">
          <p className="label-caps text-muted">Ce que chaque tranche vous coûte</p>
          <ul className="mt-4 space-y-2.5">
            {IR_PARAMS.brackets.map((b, i) => {
              const row = r.byBracket[i];
              const from = i === 0 ? 0 : IR_PARAMS.brackets[i - 1].upTo;
              const touched = !!row && (row.amount > 0 || b.rate === 0) && r.taxableIncome / (r.qfCapped ? (couple === "couple" ? 2 : 1) : r.parts) > from;
              return (
                <li key={i} className="grid grid-cols-[3.5rem_1fr_6rem] items-center gap-3 text-sm">
                  <span className="tabular font-mono font-semibold text-navy-deep">{pct(b.rate, 0)}</span>
                  <span>
                    <span className="block text-xs text-muted">
                      {Number.isFinite(b.upTo) ? `de ${eur(from)} à ${eur(b.upTo)}` : `au-delà de ${eur(from)}`} par part
                    </span>
                    <span className="relative mt-1 block h-2.5 overflow-hidden rounded-full bg-cloud">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-blue transition-[width] duration-500 ease-[var(--ease-out-expo)]"
                        style={{ width: `${row ? (row.amount / maxAmount) * 100 : 0}%`, opacity: touched ? 1 : 0.25 }}
                      />
                    </span>
                  </span>
                  <span className="tabular text-right font-mono text-navy-deep">{eur(row?.amount ?? 0)}</span>
                </li>
              );
            })}
          </ul>
          {(r.decote > 0 || r.qfCapped) && (
            <div className="mt-5 space-y-1.5 rounded-md bg-sky-soft p-4 text-sm text-navy-deep">
              {r.decote > 0 && <p>Décote appliquée : −{eur(r.decote)} (mécanisme qui allège l’impôt des revenus modestes).</p>}
              {r.qfCapped && <p>Plafonnement du quotient familial : l’avantage lié aux enfants est limité à {eur(IR_PARAMS.qfCapPerHalfShare)} par demi-part.</p>}
            </div>
          )}
          <p className="mt-5 text-sm text-muted">
            Le <strong className="text-navy-deep">taux marginal</strong> ne s’applique qu’à la dernière tranche de vos revenus : passer dans une tranche supérieure ne fait jamais baisser votre revenu après impôt.
          </p>
        </div>
      </div>
    </div>
  );
}
