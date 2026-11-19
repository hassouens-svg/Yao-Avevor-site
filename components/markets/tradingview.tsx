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
    return () => {
      el.innerHTML = "";
    };
  }, [visible, widget, config]);

  // Cadre extérieur : garde la taille et le style ; TradingView réécrit le style du conteneur intérieur.
  return (
    <div className={cn("overflow-hidden", className)} style={{ height }} aria-label="Données de marché TradingView">
      <div ref={root} className="tradingview-widget-container h-full w-full" />
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
