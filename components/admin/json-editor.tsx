"use client";

import { ChevronDown, ChevronUp, Plus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { errorMessage, uploadFile } from "@/lib/appwrite/browser";
import { TextArea, TextInput, Toggle, useToast } from "./ui";

/**
 * Éditeur générique d'un objet JSON : chaque texte, nombre, booléen, liste et image devient un champ de formulaire.
 * Permet de modifier tous les contenus du site sans toucher au code.
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const LABELS: Record<string, string> = {
  hero: "Haut de page (hero)", label: "Petit label", line1: "Titre — ligne 1", line2: "Titre — ligne 2 (en couleur)", keywords: "Mots-clés",
  subtitle: "Sous-titre", primaryCta: "Bouton principal", secondaryCta: "Bouton secondaire", portraitAlt: "Description de la photo",
  trust: "Bandeau logos", logos: "Logos", profile: "Profil", paragraphs: "Paragraphes", stats: "Chiffres clés", bento: "Parcours (grille)",
  ticker: "Bandeau défilant", expertises: "Expertises", translator: "Traducteur de termes", terms: "Termes", tools: "Simulateurs",
  articles: "Articles", books: "Livres", pmp: "Bloc formation PMP®", coaching: "Accompagnement", speaking: "Interventions",
  testimonials: "Témoignages", newsletter: "Newsletter", contact: "Contact", title: "Titre", text: "Texte", intro: "Introduction",
  items: "Éléments", points: "Points", chips: "Pastilles", cta: "Bouton", href: "Lien", value: "Valeur", suffix: "Suffixe",
  prefix: "Préfixe", source: "Source", name: "Nom", src: "Image", email: "Email", lead: "Accroche", tag: "Étiquette", tone: "Couleur",
  image: "Image", plain: "En clair", example: "Exemple", term: "Terme", short: "Définition", years: "Années", org: "Organisation",
  place: "Lieu", logo: "Logo", year: "Année", reasons: "Motifs", interests: "Centres d’intérêt", options: "Options", tabs: "Onglets",
  badge: "Badge", note: "Note", waitlistTitle: "Titre inscription", waitlistText: "Texte inscription", moreHref: "Lien « voir plus »",
  slug: "Identifiant d’URL", isFinance: "Catégorie finance", number: "Numéro", signature: "Signature", caption: "Légende", kind: "Type",
  span: "Taille", width: "Largeur (px)", height: "Hauteur (px)", alt: "Description de l’image",
};
const label = (k: string) => LABELS[k] ?? k.charAt(0).toUpperCase() + k.slice(1);
const isImageKey = (k: string) => /^(src|image|logo|photo|poster|cover)$/i.test(k);
const isLong = (k: string, v: string) => v.length > 70 || /text|lead|pitch|intro|subtitle|plain|example|short|quote|body/i.test(k);

function emptyLike(v: Json): Json {
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, emptyLike(x)]));
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  return "";
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const toast = useToast();
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-cloud">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt="" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-muted">—</span>}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL de l’image" />
        <button type="button" onClick={() => input.current?.click()} className="inline-flex items-center gap-2 text-xs font-semibold text-blue">
          <Upload className="size-3.5" /> {busy !== null ? `Envoi… ${busy} %` : "Envoyer une image"}
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              setBusy(0);
              const r = await uploadFile(f, setBusy);
              onChange(r.url);
            } catch (err) {
              toast(errorMessage(err), "error");
            } finally {
              setBusy(null);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}

export function JsonEditor({ value, onChange, path = "", depth = 0 }: { value: Json; onChange: (v: Json) => void; path?: string; depth?: number }) {
  const key = path.split(".").pop() ?? "";

  if (typeof value === "string") {
    if (isImageKey(key)) return <ImageField value={value} onChange={onChange} />;
    return isLong(key, value) ? (
      <TextArea value={value} onChange={(e) => onChange(e.target.value)} rows={Math.min(8, Math.max(2, Math.ceil(value.length / 90)))} />
    ) : (
      <TextInput value={value} onChange={(e) => onChange(e.target.value)} />
    );
  }
  if (typeof value === "number") return <TextInput type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="max-w-40" />;
  if (typeof value === "boolean") return <Toggle checked={value} onChange={onChange} label={value ? "Oui" : "Non"} />;
  if (value === null) return <TextInput value="" onChange={(e) => onChange(e.target.value)} />;

  if (Array.isArray(value)) {
    const template = value[0] !== undefined ? emptyLike(value[0]) : "";
    const move = (i: number, d: number) => {
      const arr = [...value];
      const j = i + d;
      if (j < 0 || j >= arr.length) return;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      onChange(arr);
    };
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-line bg-cloud/60 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="label-caps text-muted">#{i + 1}</span>
              <span className="flex gap-1">
                <IconBtn label="Monter" onClick={() => move(i, -1)}><ChevronUp className="size-4" /></IconBtn>
                <IconBtn label="Descendre" onClick={() => move(i, 1)}><ChevronDown className="size-4" /></IconBtn>
                <IconBtn label="Supprimer" danger onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 className="size-4" /></IconBtn>
              </span>
            </div>
            <JsonEditor value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} path={`${path}.${key}`} depth={depth + 1} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...value, template])} className="inline-flex items-center gap-2 rounded-full border border-dashed border-navy/30 px-4 py-2 text-sm text-navy-deep hover:border-navy">
          <Plus className="size-4" /> Ajouter
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", depth > 0 && "")}>
      {Object.entries(value).map(([k, v]) => {
        const complex = v !== null && typeof v === "object";
        return complex && depth === 0 ? (
          <Section key={k} title={label(k)}>
            <JsonEditor value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} path={`${path}.${k}`} depth={depth + 1} />
          </Section>
        ) : (
          <div key={k}>
            <p className="mb-1.5 text-xs font-semibold tracking-wide text-navy-deep uppercase">{label(k)}</p>
            <div className={complex ? "border-l-2 border-line pl-3" : ""}>
              <JsonEditor value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} path={`${path}.${k}`} depth={depth + 1} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-line bg-white">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-4 text-left">
        <span className="font-semibold text-navy-deep">{title}</span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-line p-5">{children}</div>}
    </div>
  );
}

function IconBtn({ children, label, onClick, danger }: { children: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cn("inline-flex size-8 items-center justify-center rounded-full border border-line bg-white", danger ? "text-[#9b1c1c]" : "text-navy-deep")}>
      {children}
    </button>
  );
}

export type { Json };
