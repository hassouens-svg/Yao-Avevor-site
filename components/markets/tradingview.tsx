"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Widget TradingView officiel (données de marché en temps réel ou différées selon la place).
 * Chargé seulement quand il entre dans l'écran, pour ne pas ralentir la page.
 */
export function TradingViewWidget({
  widget,
  config,
  className,
  height,
}: {
  widget: "ticker-tape" | "market-overview" | "advanced-chart" | "symbol-overview" | "mini-symbol-overview";
  config: Record<string, unknown>;
  className?: string;
  height?: number | string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setVisible(true);
        io.disconnect();
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!visible || !el) return;
    el.innerHTML = '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>';
    const s = document.createElement("script");
    s.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widget}.js`;
    s.async = true;
    s.type = "text/javascript";
    s.innerHTML = JSON.stringify({ locale: "fr", colorTheme: "light", isTransparent: true, ...config });
    el.appendChild(s);
    // Masque le squelette dès que l'iframe TradingView a fini de charger
    const mo = new MutationObserver(() => {
      const f = el.querySelector("iframe");
      if (!f) return;
      mo.disconnect();
      f.addEventListener("load", () => setTimeout(() => setLoaded(true), 250), { once: true });
    });
    mo.observe(el, { childList: true, subtree: true });
    const fallback = setTimeout(() => setLoaded(true), 8000);
    return () => {
      mo.disconnect();
      clearTimeout(fallback);
      el.innerHTML = "";
    };
  }, [visible, widget, config]);

  // Cadre extérieur : garde la taille et le style ; TradingView réécrit le style du conteneur intérieur.
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ height }} aria-label="Données de marché TradingView" aria-busy={!loaded}>
      <div aria-hidden="true" className={cn("skeleton pointer-events-none absolute inset-0 transition-opacity duration-500", loaded && "opacity-0")}>
        {widget !== "ticker-tape" && (
          <div className="flex h-full flex-col gap-3 p-5">
            <span className="h-4 w-1/3 rounded-sm bg-line/70" />
            <span className="h-3 w-1/5 rounded-sm bg-line/60" />
            <span className="mt-auto h-1/2 w-full rounded-sm bg-[linear-gradient(180deg,transparent,rgb(227_231_237/0.7))] [clip-path:polygon(0_80%,12%_62%,24%_70%,38%_40%,52%_52%,66%_28%,80%_38%,100%_10%,100%_100%,0_100%)]" />
          </div>
        )}
      </div>
      <div ref={root} className={cn("tradingview-widget-container relative h-full w-full transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")} />
    </div>
  );
}

export const TICKER_SYMBOLS = [
  { proName: "EURONEXT:PX1", title: "CAC 40" },
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
  { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
  { proName: "XETR:DAX", title: "DAX" },
  { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
  { proName: "OANDA:XAUUSD", title: "Or" },
  { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
  { proName: "EURONEXT:URW", title: "Unibail (immobilier)" },
];

export const OVERVIEW_TABS = [
  {
    title: "Indices",
    symbols: [
      { s: "EURONEXT:PX1", d: "CAC 40" },
      { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
      { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
      { s: "XETR:DAX", d: "DAX" },
      { s: "INDEX:NKY", d: "Nikkei 225" },
    ],
  },
  {
    title: "Immobilier coté",
    symbols: [
      { s: "EURONEXT:URW", d: "Unibail-Rodamco-Westfield" },
      { s: "EURONEXT:LI", d: "Klépierre" },
      { s: "EURONEXT:COV", d: "Covivio" },
      { s: "EURONEXT:GFC", d: "Gecina" },
      { s: "AMEX:VNQ", d: "ETF immobilier US (VNQ)" },
    ],
  },
  {
    title: "Matières premières",
    symbols: [
      { s: "OANDA:XAUUSD", d: "Or" },
      { s: "TVC:UKOIL", d: "Pétrole Brent" },
      { s: "OANDA:XAGUSD", d: "Argent" },
    ],
  },
  {
    title: "Devises & crypto",
    symbols: [
      { s: "FX_IDC:EURUSD", d: "EUR/USD" },
      { s: "FX_IDC:EURGBP", d: "EUR/GBP" },
      { s: "BITSTAMP:BTCUSD", d: "Bitcoin" },
      { s: "BITSTAMP:ETHUSD", d: "Ethereum" },
    ],
  },
];
