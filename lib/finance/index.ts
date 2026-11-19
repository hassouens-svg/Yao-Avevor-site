/**
 * Moteurs de calcul des simulateurs (fonctions pures).
 * Résultats pédagogiques et indicatifs : ne constituent pas un conseil financier ou fiscal.
 */

/* ───────────── Intérêts composés ───────────── */
export type CompoundInput = { initial: number; monthly: number; ratePct: number; years: number };
export type CompoundPoint = { year: number; invested: number; value: number };

export function compound({ initial, monthly, ratePct, years }: CompoundInput): CompoundPoint[] {
  const r = ratePct / 100 / 12;
  let value = initial;
  let invested = initial;
  const out: CompoundPoint[] = [{ year: 0, invested, value }];
  for (let m = 1; m <= Math.round(years * 12); m++) {
    value = value * (1 + r) + monthly;
    invested += monthly;
    if (m % 12 === 0) out.push({ year: m / 12, invested, value });
  }
  return out;
}

/* ───────────── Impôt sur le revenu (France) ─────────────
 * Barème et paramètres centralisés ici : à mettre à jour chaque année (voir A_VERIFIER.md).
 */
export const IR_PARAMS = {
  label: "Barème 2026 — revenus 2025",
  brackets: [
    { upTo: 11_600, rate: 0 },
    { upTo: 29_579, rate: 0.11 },
    { upTo: 84_577, rate: 0.3 },
    { upTo: 181_917, rate: 0.41 },
    { upTo: Infinity, rate: 0.45 },
  ],
  /** Plafond de l'avantage par demi-part supplémentaire */
  qfCapPerHalfShare: 1_807,
  /** Abattement forfaitaire de 10 % sur les salaires */
  deduction: { rate: 0.1, min: 509, max: 14_555 },
  /** Décote : montant forfaitaire − 45,25 % de l'impôt brut, si impôt brut sous le seuil */
  decote: { single: { threshold: 1_982, base: 897 }, couple: { threshold: 3_277, base: 1_483 }, rate: 0.4525 },
} as const;

export type TaxInput = {
  /** Revenu net imposable annuel du foyer (après abattement si `applyDeduction` est faux) */
  income: number;
  couple: boolean;
  children: number;
  applyDeduction: boolean;
};

export type TaxResult = {
  taxableIncome: number;
  parts: number;
  tax: number;
  averageRate: number;
  marginalRate: number;
  byBracket: { from: number; to: number; rate: number; amount: number }[];
  qfCapped: boolean;
  decote: number;
};

export function familyParts(couple: boolean, children: number) {
  const base = couple ? 2 : 1;
  const kids = children <= 2 ? children * 0.5 : 1 + (children - 2);
  return base + kids;
}

function rawTax(perPart: number) {
  let prev = 0;
  let tax = 0;
  const byBracket: TaxResult["byBracket"] = [];
  let marginal = 0;
  for (const b of IR_PARAMS.brackets) {
    const slice = Math.max(0, Math.min(perPart, b.upTo) - prev);
    const amount = slice * b.rate;
    byBracket.push({ from: prev, to: b.upTo, rate: b.rate, amount });
    if (slice > 0) marginal = b.rate;
    tax += amount;
    prev = b.upTo;
    if (perPart <= b.upTo) break;
  }
  return { tax, byBracket, marginal };
}

export function incomeTax({ income, couple, children, applyDeduction }: TaxInput): TaxResult {
  const d = IR_PARAMS.deduction;
  const deduction = applyDeduction ? Math.min(d.max * (couple ? 2 : 1), Math.max(d.min, income * d.rate)) : 0;
  const taxableIncome = Math.max(0, income - deduction);
  const parts = familyParts(couple, children);
  const baseParts = couple ? 2 : 1;

  const withAll = rawTax(taxableIncome / parts);
  const withBase = rawTax(taxableIncome / baseParts);
  let tax = withAll.tax * parts;
  const taxBase = withBase.tax * baseParts;
  const halfShares = (parts - baseParts) * 2;
  const maxAdvantage = halfShares * IR_PARAMS.qfCapPerHalfShare;
  let qfCapped = false;
  if (taxBase - tax > maxAdvantage) {
    tax = taxBase - maxAdvantage;
    qfCapped = true;
  }

  const dc = couple ? IR_PARAMS.decote.couple : IR_PARAMS.decote.single;
  let decote = 0;
  if (tax > 0 && tax < dc.threshold) {
    decote = Math.max(0, Math.min(tax, dc.base - tax * IR_PARAMS.decote.rate));
    tax -= decote;
  }
  tax = Math.max(0, Math.round(tax));

  // Si le quotient familial est plafonné, l'impôt suit le barème calculé sur les parts de base
  const ref = qfCapped ? { r: withBase, p: baseParts } : { r: withAll, p: parts };
  return {
    taxableIncome,
    parts,
    tax,
    averageRate: taxableIncome > 0 ? tax / taxableIncome : 0,
    marginalRate: ref.r.marginal,
    byBracket: ref.r.byBracket.map((b) => ({ ...b, amount: b.amount * ref.p })),
    qfCapped,
    decote: Math.round(decote),
  };
}

/* ───────────── Brut → net (estimation) ───────────── */
export const STATUS_RATES = {
  "non-cadre": { label: "Salarié non-cadre", rate: 0.22 },
  cadre: { label: "Cadre", rate: 0.25 },
  public: { label: "Fonction publique", rate: 0.15 },
} as const;
export type Status = keyof typeof STATUS_RATES;

export function grossToNet(grossMonthly: number, status: Status, pasRatePct: number) {
  const contributions = grossMonthly * STATUS_RATES[status].rate;
  const netBeforeTax = grossMonthly - contributions;
  const pas = netBeforeTax * (pasRatePct / 100);
  return { contributions, netBeforeTax, pas, net: netBeforeTax - pas };
}

/* ───────────── Valeur acquise (EVM) ───────────── */
export type EvmInput = { bac: number; plannedPct: number; donePct: number; actualCost: number };

export function evm({ bac, plannedPct, donePct, actualCost }: EvmInput) {
  const pv = (bac * plannedPct) / 100;
  const ev = (bac * donePct) / 100;
  const ac = actualCost;
  const spi = pv > 0 ? ev / pv : 0;
  const cpi = ac > 0 ? ev / ac : 0;
  const eac = cpi > 0 ? bac / cpi : 0;
  return { pv, ev, ac, sv: ev - pv, cv: ev - ac, spi, cpi, eac, etc: eac - ac, vac: bac - eac };
}

/* ───────────── Crédit (mensualité constante) ───────────── */
export function loanPayment(principal: number, ratePct: number, years: number) {
  const n = Math.round(years * 12);
  const r = ratePct / 100 / 12;
  const monthly = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
  const total = monthly * n;
  return { monthly, total, interest: total - principal };
}

/* ───────────── Fonds d'urgence ───────────── */
export function emergencyFund(monthlyExpenses: number, months: number, current: number, monthlySaving: number) {
  const target = monthlyExpenses * months;
  const missing = Math.max(0, target - current);
  const monthsToGoal = monthlySaving > 0 ? Math.ceil(missing / monthlySaving) : Infinity;
  return { target, missing, monthsToGoal, progress: target > 0 ? Math.min(1, current / target) : 0 };
}

/* ───────────── Budget 50/30/20 ───────────── */
export function budget503020(netIncome: number) {
  return { needs: netIncome * 0.5, wants: netIncome * 0.3, savings: netIncome * 0.2 };
}

/* ───────────── Formatage ───────────── */
export const eur = (n: number, digits = 0) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(
    Number.isFinite(n) ? n : 0,
  );
export const pct = (n: number, digits = 1) =>
  new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
export const num = (n: number, digits = 2) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);

/* ───────────── Investissement programmé (DCA) ───────────── */
export type DcaInput = { initial: number; monthly: number; ratePct: number; feesPct: number; inflationPct: number; years: number };

export function dca({ initial, monthly, ratePct, feesPct, inflationPct, years }: DcaInput) {
  const months = Math.round(years * 12);
  const gross = (ratePct / 100) / 12;
  const net = ((ratePct - feesPct) / 100) / 12;
  let vGross = initial, vNet = initial, invested = initial;
  const series: { year: number; invested: number; value: number }[] = [{ year: 0, invested, value: vNet }];
  for (let m = 1; m <= months; m++) {
    vGross = vGross * (1 + gross) + monthly;
    vNet = vNet * (1 + net) + monthly;
    invested += monthly;
    if (m % 12 === 0) series.push({ year: m / 12, invested, value: vNet });
  }
  const real = vNet / Math.pow(1 + inflationPct / 100, years);
  return { invested, final: vNet, finalNoFees: vGross, feesCost: vGross - vNet, real, gain: vNet - invested, series };
}

/* ───────────── Investissement locatif ───────────── */
export type RentalInput = {
  price: number;
  notaryPct: number;
  works: number;
  rent: number;
  charges: number;
  propertyTax: number;
  vacancyPct: number;
  downPayment: number;
  loanRatePct: number;
  loanYears: number;
};

export function rental(i: RentalInput) {
  const total = i.price * (1 + i.notaryPct / 100) + i.works;
  const annualRent = i.rent * 12;
  const netIncome = annualRent * (1 - i.vacancyPct / 100) - i.charges * 12 - i.propertyTax;
  const borrowed = Math.max(0, total - i.downPayment);
  const loan = borrowed > 0 ? loanPayment(borrowed, i.loanRatePct, i.loanYears) : { monthly: 0, total: 0, interest: 0 };
  return {
    total,
    grossYield: total > 0 ? annualRent / total : 0,
    netYield: total > 0 ? netIncome / total : 0,
    borrowed,
    monthlyLoan: loan.monthly,
    cashflow: netIncome / 12 - loan.monthly,
    loanInterest: loan.interest,
  };
}
