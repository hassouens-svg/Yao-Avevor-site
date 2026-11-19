"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { OVERVIEW_TABS, TICKER_SYMBOLS, TradingViewWidget } from "./tradingview";

const chartChoices = [
  { s: "EURONEXT:PX1", l: "CAC 40", d: "Les 40 plus grandes capitalisations de la Bourse de Paris." },
  { s: "FOREXCOM:SPXUSD", l: "S&P 500", d: "Les 500 grandes entreprises américaines : la référence mondiale." },
  { s: "AMEX:VNQ", l: "Immobilier US", d: "ETF des foncières cotées américaines (REIT)." },
  { s: "EURONEXT:GFC", l: "Gecina", d: "Foncière de bureaux parisiens, cotée à Paris." },
  { s: "OANDA:XAUUSD", l: "Or", d: "Valeur refuge, souvent utilisée pour diversifier." },
  { s: "BITSTAMP:BTCUSD", l: "Bitcoin", d: "Actif très volatil : à réserver à une petite part du patrimoine." },
];

export function TickerTape() {
  const config = useMemo(() => ({ symbols: TICKER_SYMBOLS, showSymbolLogo: true, displayMode: "adaptive" }), []);
  return <TradingViewWidget widget="ticker-tape" config={config} className="min-h-[46px] border-y border-line bg-white" />;
}

/** Graphique interactif (temps réel / différé selon la place) + explication de l'actif sélectionné. */
export function MarketsBoard() {
  const [sel, setSel] = useState(0);
  const c = chartChoices[sel];
  const chartConfig = useMemo(
    () => ({ symbol: c.s, interval: "D", timezone: "Europe/Paris", style: "3", allow_symbol_change: true, hide_side_toolbar: true, autosize: true, withdateranges: true, details: false, calendar: false }),
    [c.s],
  );
  const overviewConfig = useMemo(
    () => ({
      dateRange: "12M",
      showChart: true,
      width: "100%",
      height: "100%",
      plotLineColorGrowing: "#1d4f91",
      plotLineColorFalling: "#c2410c",
      belowLineFillColorGrowing: "rgba(47,111,192,0.12)",
      belowLineFillColorFalling: "rgba(194,65,16,0.08)",
      gridLineColor: "rgba(227,231,237,0.6)",
      scaleFontColor: "#5b6474",
      tabs: OVERVIEW_TABS.map((t) => ({ title: t.title, symbols: t.symbols.map((x) => ({ s: x.s, d: x.d })) })),
    }),
    [],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div role="tablist" aria-label="Choisir un marché" className="flex flex-wrap gap-1.5">
          {chartChoices.map((x, i) => (
            <button
              key={x.s}
              role="tab"
              aria-selected={i === sel}
              onClick={() => setSel(i)}
              className={cn("h-9 rounded-full border px-3.5 font-mono text-[0.75rem]", i === sel ? "border-navy-deep bg-navy-deep text-white" : "border-line bg-white text-navy-deep hover:border-navy/40")}
            >
              {x.l}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{c.d}</p>
        <TradingViewWidget key={c.s} widget="advanced-chart" config={chartConfig} height={460} className="mt-4 rounded-md border border-line bg-white" />
      </div>
      <div className="lg:col-span-4">
        <TradingViewWidget widget="market-overview" config={overviewConfig} height={560} className="rounded-md border border-line bg-white" />
      </div>
    </div>
  );
}
