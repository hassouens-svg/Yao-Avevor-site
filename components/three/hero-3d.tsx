"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlassScene = dynamic(() => import("./glass-scene"), { ssr: false });

/**
 * Charge la scène 3D après le premier rendu (n'impacte pas le LCP),
 * uniquement si WebGL est disponible et si l'utilisateur n'a pas demandé moins d'animations.
 */
export function Hero3D({ className }: { className?: string }) {
  const [state, setState] = useState<{ ready: boolean; compact: boolean }>({ ready: false, compact: false });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return;
    const compact = window.innerWidth < 768;
    const run = () => setState({ ready: true, compact });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1200 });
    else setTimeout(run, 300);
  }, []);

  if (!state.ready) return null;
  return (
    <div className={className}>
      <GlassScene compact={state.compact} />
    </div>
  );
}
