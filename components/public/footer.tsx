import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Monogram, Wordmark } from "./monogram";
import { LinkedinIcon } from "./icons";

const themes = [
  { href: "/articles?categorie=gestion-de-projet", label: "Gestion de projet" },
  { href: "/articles?categorie=pmp", label: "Certification PMP®" },
  { href: "/articles?categorie=finances-de-projet", label: "Finances de projet" },
  { href: "/articles?categorie=fiche-de-paie", label: "Fiche de paie" },
  { href: "/articles?categorie=impots", label: "Impôts" },
  { href: "/outils", label: "Simulateurs" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div className="container-site pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark className="text-[1.75rem]" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mist">
              Docteur-ingénieur, responsable R&amp;D chez Verallia et formateur PMP® agréé PMI. Gestion de projet, innovation
              industrielle, formation et outils pratiques.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-sky hover:text-sky">
                <LinkedinIcon className="size-4" />
              </a>
              <a href={`mailto:${site.email}`} aria-label="Email" className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-sm transition-colors hover:border-sky hover:text-sky">
                {site.email}
              </a>
            </div>
          </div>
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            <div>
              <p className="label-caps text-sky">Explorer</p>
              <ul className="mt-5 space-y-3 text-sm">
                {footerNav.explorer.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-white/75 transition-colors hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-caps text-sky">Thèmes</p>
              <ul className="mt-5 space-y-3 text-sm">
                {themes.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-white/75 transition-colors hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-caps text-sky">Infos</p>
              <ul className="mt-5 space-y-3 text-sm">
                {footerNav.legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-white/75 transition-colors hover:text-white">{l.label}</Link>
                  </li>
                ))}
                <li className="text-mist">{site.location}</li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-white/10 pt-8 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© <CopyrightYear /> Yao AVEVOR. Tous droits réservés.</p>
          <p className="max-w-lg">PMP®, PMBOK® et PMI® sont des marques déposées du Project Management Institute, Inc. ITIL® est une marque déposée de PeopleCert.</p>
        </div>
      </div>
      <Monogram className="pointer-events-none absolute -right-10 -bottom-16 h-auto w-[min(46vw,560px)] text-white/[0.035]" strokeWidth={1.2} />
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
