import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Monogram } from "./monogram";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white" data-header-dark>
      <div className="container-site pt-24 pb-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-serif text-h2 leading-[1.05]">
              Piloter vos <em className="italic-accent text-sky">projets</em>.
              <br />
              Maîtriser votre <em className="italic-accent text-sky">argent</em>.
            </p>
            <p className="mt-6 max-w-sm text-mist">
              Une lettre occasionnelle, sans bruit : nouveaux articles, outils et sortie du livre.
            </p>
            {/* Formulaire newsletter compact : branché en phase 7 */}
            <Link
              href="/#newsletter"
              className="mt-6 inline-flex items-center gap-2 border-b border-sky/60 pb-1 text-sm hover:border-sky"
            >
              S’inscrire à la newsletter <span aria-hidden="true">→</span>
            </Link>
          </div>

          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <div>
              <p className="label-caps text-mist">Explorer</p>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                {footerNav.explorer.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline pb-0.5 text-white/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-caps text-mist">Informations</p>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                {footerNav.legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline pb-0.5 text-white/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="label-caps text-mist">Contact</p>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                <li>
                  <a href={`mailto:${site.email}`} className="link-underline pb-0.5 break-all text-white/85 hover:text-white">
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline pb-0.5 text-white/85 hover:text-white"
                  >
                    LinkedIn ↗
                  </a>
                </li>
                <li className="text-mist">{site.location}</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-24 flex flex-col-reverse gap-6 border-t border-white/10 pt-8 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© <CopyrightYear /> Yao AVEVOR. Tous droits réservés.</p>
          <p className="max-w-md text-xs leading-relaxed">
            PMP®, PMBOK® et PMI® sont des marques déposées du Project Management Institute, Inc. ITIL® est une marque
            déposée de PeopleCert.
          </p>
        </div>
      </div>
      <Monogram
        className="pointer-events-none absolute -right-10 -bottom-16 h-auto w-[min(46vw,560px)] text-white/[0.035]"
        strokeWidth={1.2}
      />
    </footer>
  );
}

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
