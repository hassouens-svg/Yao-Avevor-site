import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";
import { MarketsBoard, TickerTape } from "@/components/markets/markets-board";

/** Accueil : les marchés en direct (TradingView) + accès aux simulateurs bourse & immobilier. */
export function MarketsSection() {
  return (
    <section id="marches" className="bg-cloud">
      <TickerTape />
      <div className="container-site py-[clamp(3.5rem,7vw,6rem)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader label="Bourse & immobilier" title="Les marchés, en direct." intro="Indices, foncières cotées, or, devises : suivez les marchés, puis simulez vos propres projets d’investissement." />
          <Link href="/marches" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-navy-deep">
            <span className="link-underline pb-0.5">Investir : comprendre et simuler</span>
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
        <div className="mt-10">
          <MarketsBoard />
        </div>
        <p className="mt-4 text-xs text-muted">Données fournies par TradingView, en temps réel ou différées selon les places. Contenu pédagogique, sans recommandation d’investissement.</p>
      </div>
    </section>
  );
}
