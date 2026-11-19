"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Bulletin de paie interactif (format « clarifié » français), entièrement fictif : entreprise, salarié et montants inventés.
 * Montants calculés de façon cohérente ; taux indicatifs. Survolez / touchez un bloc pour son explication.
 */

type Zone = "entete" | "brut" | "sante" | "retraite" | "chomage" | "csg" | "employeur" | "netavant" | "imposable" | "pas" | "net" | "netsocial" | "conges";

const explanations: Record<Zone, { title: string; text: string }> = {
  entete: { title: "L’en-tête", text: "Identité de l’employeur (SIRET, code APE, convention collective) et du salarié (emploi, classification, date d’entrée). Vérifiez votre classification : elle conditionne votre salaire minimum conventionnel." },
  brut: { title: "Le salaire brut", text: "Salaire de base (heures × taux horaire), plus primes, heures supplémentaires et avantages. C’est la base de presque tous les calculs qui suivent." },
  sante: { title: "Santé", text: "Assurance maladie (payée par l’employeur) et complémentaire santé obligatoire, dont une partie est à votre charge. La part patronale de la mutuelle est réintégrée dans votre net imposable." },
  retraite: { title: "Retraite", text: "Retraite de base de la Sécurité sociale (plafonnée et déplafonnée) et retraite complémentaire AGIRC-ARRCO. C’est souvent la plus grosse ligne de cotisations salariales : elle vous ouvre des droits." },
  chomage: { title: "Assurance chômage", text: "Financée uniquement par l’employeur pour les salariés du privé (plus la cotisation AGS qui garantit les salaires en cas de faillite)." },
  csg: { title: "CSG / CRDS", text: "Contributions prélevées sur 98,25 % du brut. La CSG déductible (6,8 %) réduit votre revenu imposable ; la CSG non déductible et la CRDS (2,9 % au total) restent imposables." },
  employeur: { title: "Ce que paie l’employeur en plus", text: "Les cotisations patronales ne sortent pas de votre salaire, mais elles font partie du coût de votre poste. Des allègements (réduction générale) les diminuent sur les bas salaires." },
  netavant: { title: "Net à payer avant impôt", text: "Brut moins toutes vos cotisations et contributions salariales. C’est ce que vous toucheriez sans prélèvement à la source." },
  imposable: { title: "Net imposable", text: "Net avant impôt + CSG/CRDS non déductible + part patronale de la mutuelle. C’est lui qui sert de base au prélèvement à la source et qui est pré-rempli dans votre déclaration." },
  pas: { title: "Prélèvement à la source", text: "Impôt sur le revenu retenu par l’employeur : net imposable × taux transmis par l’administration fiscale. Le taux et le montant figurent sur la fiche." },
  net: { title: "Net payé", text: "La somme réellement virée sur votre compte : net avant impôt moins le prélèvement à la source." },
  netsocial: { title: "Montant net social", text: "Affiché depuis 2023 : c’est le revenu à déclarer à la CAF ou à la MSA pour la prime d’activité et le RSA. Ne le confondez pas avec le net imposable." },
  conges: { title: "Congés payés", text: "Jours acquis, pris et restants (2,5 jours ouvrables par mois de travail effectif). Vérifiez-les : une erreur ici se paie en jours de repos." },
};

const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Données fictives
const BRUT = 2800;
const lines: { zone: Zone; label: string; base?: number; tauxS?: string; partS?: number; tauxE?: string; partE?: number; heading?: boolean }[] = [
  { zone: "sante", label: "SANTÉ", heading: true },
  { zone: "sante", label: "Sécurité sociale – Maladie Maternité Invalidité Décès", base: BRUT, tauxE: "7,00", partE: 196 },
  { zone: "sante", label: "Complémentaire santé", partS: 30, partE: 30 },
  { zone: "employeur", label: "ACCIDENTS DU TRAVAIL – MALADIES PRO.", base: BRUT, tauxE: "1,50", partE: 42 },
  { zone: "retraite", label: "RETRAITE", heading: true },
  { zone: "retraite", label: "Sécurité sociale plafonnée", base: BRUT, tauxS: "6,90", partS: 193.2, tauxE: "8,55", partE: 239.4 },
  { zone: "retraite", label: "Sécurité sociale déplafonnée", base: BRUT, tauxS: "0,40", partS: 11.2, tauxE: "2,11", partE: 59.08 },
  { zone: "retraite", label: "Complémentaire Tranche 1", base: BRUT, tauxS: "4,01", partS: 112.28, tauxE: "6,01", partE: 168.28 },
  { zone: "employeur", label: "FAMILLE", base: BRUT, tauxE: "3,45", partE: 96.6 },
  { zone: "chomage", label: "ASSURANCE CHÔMAGE", base: BRUT, tauxE: "4,25", partE: 119 },
  { zone: "employeur", label: "AUTRES CONTRIBUTIONS DUES PAR L’EMPLOYEUR", partE: 60 },
  { zone: "csg", label: "CSG déductible de l’impôt sur le revenu", base: 2781, tauxS: "6,80", partS: 189.11 },
  { zone: "csg", label: "CSG/CRDS non déductible de l’impôt sur le revenu", base: 2781, tauxS: "2,90", partS: 80.65 },
];
const totalS = lines.reduce((a, l) => a + (l.partS ?? 0), 0); // 616,44
const totalE = lines.reduce((a, l) => a + (l.partE ?? 0), 0);
const NET_AVANT = BRUT - totalS; // 2 183,56
const NET_IMPOSABLE = NET_AVANT + 80.65 + 30; // 2 294,21
const TAUX_PAS = 4.5;
const PAS = Math.round(NET_IMPOSABLE * TAUX_PAS) / 100; // 103,24
const NET_PAYE = NET_AVANT - PAS;

export function Payslip() {
  const [zone, setZone] = useState<Zone>("brut");
  const z = (id: Zone) => ({
    onPointerEnter: () => setZone(id),
    onFocus: () => setZone(id),
    onClick: () => setZone(id),
    tabIndex: 0,
    "data-active": zone === id || undefined,
    className: "payslip-zone",
  });
  const exp = explanations[zone];

  return (
    <figure className="not-prose relative my-12">
      {/* Le bulletin */}
      <div className="relative -rotate-[0.6deg] overflow-x-auto rounded-[6px] border border-[#d9dde3] bg-[#fdfdfb] shadow-[0_2px_4px_rgba(10,14,23,0.06),0_24px_60px_-20px_rgba(10,14,23,0.35)]">
        <div className="min-w-[640px] p-5 font-mono text-[10.5px] leading-[1.45] text-[#1b1f27]">
          <div {...z("entete")}>
            <div className="flex items-start justify-between border-b-2 border-[#1b1f27] pb-2">
              <div>
                <p className="text-[13px] font-bold tracking-wide">BULLETIN DE PAIE</p>
                <p>Période du 01/10/2026 au 31/10/2026 — Paiement le 31/10/2026</p>
              </div>
              <p className="rounded-sm bg-[#1b1f27] px-2 py-0.5 text-[9px] font-bold text-white">EXEMPLE FICTIF</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-b border-[#c9ced6] py-2">
              <div>
                <p className="font-bold">ATELIERS DU VERRE EXEMPLE SAS</p>
                <p>12 rue de l’Exemple — 71100 Chalon-sur-Saône</p>
                <p>SIRET 000 000 000 00000 — APE 2313Z</p>
                <p>Convention collective : Industries de l’exemple</p>
              </div>
              <div>
                <p className="font-bold">M. Camille DUPONT</p>
                <p>Emploi : Technicien qualité — Coef. 250</p>
                <p>Entrée le 01/09/2021 — N° SS 1 00 00 00 000 000 00</p>
                <p>Statut : Non-cadre — 151,67 h / mois</p>
              </div>
            </div>
          </div>

          {/* En-têtes de colonnes */}
          <div className="grid grid-cols-[1fr_70px_52px_74px_52px_74px] gap-x-2 border-b border-[#1b1f27] py-1 font-bold">
            <span>Éléments de paie</span>
            <span className="text-right">Base</span>
            <span className="text-right">Taux sal.</span>
            <span className="text-right">Part salarié</span>
            <span className="text-right">Taux pat.</span>
            <span className="text-right">Part employeur</span>
          </div>

          <div {...z("brut")}>
            <Row label="Salaire de base" base="151,67" taux="18,4611" s={null} e={null} gain={fmt(BRUT)} />
            <div className="grid grid-cols-[1fr_74px] border-y border-[#c9ced6] bg-[#eef2f6] py-1 font-bold">
              <span>SALAIRE BRUT</span>
              <span className="text-right">{fmt(BRUT)}</span>
            </div>
          </div>

          {lines.map((l, i) => (
            <div key={i} {...z(l.zone)}>
              {l.heading ? (
                <p className="pt-1.5 font-bold">{l.label}</p>
              ) : (
                <div className="grid grid-cols-[1fr_70px_52px_74px_52px_74px] gap-x-2 py-[1px]">
                  <span className={cn(l.label === l.label.toUpperCase() && "font-bold")}>{l.label}</span>
                  <span className="text-right">{l.base ? fmt(l.base) : ""}</span>
                  <span className="text-right">{l.tauxS ?? ""}</span>
                  <span className="text-right">{l.partS ? fmt(l.partS) : ""}</span>
                  <span className="text-right">{l.tauxE ?? ""}</span>
                  <span className="text-right">{l.partE ? fmt(l.partE) : ""}</span>
                </div>
              )}
            </div>
          ))}

          <div className="mt-1 grid grid-cols-[1fr_70px_52px_74px_52px_74px] gap-x-2 border-t border-[#1b1f27] py-1 font-bold">
            <span>TOTAL DES COTISATIONS ET CONTRIBUTIONS</span>
            <span />
            <span />
            <span className="text-right">{fmt(totalS)}</span>
            <span />
            <span {...z("employeur")}><span className="block text-right">{fmt(totalE)}</span></span>
          </div>

          <div {...z("netavant")}>
            <div className="grid grid-cols-[1fr_120px] border-y border-[#1b1f27] bg-[#eef2f6] py-1.5 text-[11.5px] font-bold">
              <span>NET À PAYER AVANT IMPÔT SUR LE REVENU</span>
              <span className="text-right">{fmt(NET_AVANT)}</span>
            </div>
          </div>
          <div {...z("imposable")}>
            <div className="grid grid-cols-[1fr_120px] py-1">
              <span>Dont évolution de la rémunération liée à la suppression des cotisations chômage et maladie : {fmt(BRUT * 0.0315)}</span>
              <span />
            </div>
            <div className="grid grid-cols-[1fr_120px] py-0.5 font-bold">
              <span>Net imposable</span>
              <span className="text-right">{fmt(NET_IMPOSABLE)}</span>
            </div>
          </div>
          <div {...z("pas")}>
            <div className="grid grid-cols-[1fr_70px_60px_74px] gap-x-2 py-0.5">
              <span>Impôt sur le revenu prélevé à la source — Taux personnalisé</span>
              <span className="text-right">{fmt(NET_IMPOSABLE)}</span>
              <span className="text-right">{fmt(TAUX_PAS)} %</span>
              <span className="text-right">{fmt(PAS)}</span>
            </div>
          </div>
          <div {...z("net")}>
            <div className="mt-1 grid grid-cols-[1fr_140px] border-2 border-[#1b1f27] bg-[#1b1f27] px-2 py-2 text-[13px] font-bold text-white">
              <span>NET À PAYER AU SALARIÉ (en euros)</span>
              <span className="text-right">{fmt(NET_PAYE)}</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div {...z("netsocial")}>
              <div className="grid grid-cols-[1fr_80px] border border-[#c9ced6] px-2 py-1 font-bold">
                <span>MONTANT NET SOCIAL</span>
                <span className="text-right">{fmt(NET_AVANT)}</span>
              </div>
            </div>
            <div {...z("conges")}>
              <div className="grid grid-cols-4 border border-[#c9ced6] px-2 py-1 text-center">
                <span className="text-left font-bold">CONGÉS</span>
                <span>Acquis 25,00</span>
                <span>Pris 5,00</span>
                <span>Solde 20,00</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-[9px] text-[#5b6474]">
            Total versé par l’employeur (avant allègements) : {fmt(BRUT + totalE)} € — Dans votre intérêt et pour vous aider à faire valoir vos droits, conservez ce bulletin de paie sans limitation de durée.
          </p>
        </div>
      </div>

      {/* Explication */}
      <figcaption className="sticky bottom-4 z-10 mt-6" aria-live="polite">
        <div className="rounded-[18px] bg-navy-deep/95 p-4 text-white shadow-lift backdrop-blur sm:p-6">
          <p className="label-caps text-sky">Décryptage</p>
          <p className="mt-1.5 text-[1.0625rem] font-bold sm:mt-2 sm:text-[1.25rem]">{exp.title}</p>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-white/85 sm:mt-2 sm:text-[0.9375rem]">{exp.text}</p>
        </div>
        <p className="mt-2 hidden rounded-md bg-white/90 px-2 py-1 text-xs text-muted sm:block">Survolez ou touchez une zone du bulletin. Exemple entièrement fictif, taux indicatifs (à vérifier sur urssaf.fr et service-public.fr).</p>
      </figcaption>
    </figure>
  );
}

function Row({ label, base, taux, gain }: { label: string; base: string; taux: string; s: null; e: null; gain: string }) {
  return (
    <div className="grid grid-cols-[1fr_70px_52px_74px_52px_74px] gap-x-2 py-[1px]">
      <span>{label}</span>
      <span className="text-right">{base}</span>
      <span className="text-right">{taux}</span>
      <span className="text-right">{gain}</span>
      <span />
      <span />
    </div>
  );
}
