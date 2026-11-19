import type { ArticleMeta } from "@/lib/content/types";
import { cn } from "@/lib/cn";

/**
 * Couverture générée (SVG, duotone bleu marine) — en attendant les vraies images ajoutées depuis l'admin.
 * Chaque motif évoque le sujet : fiche de paie, courbes EVM, examen, budget, bouclier, cascade brut→net.
 */
export function ArticleCover({ motif, className }: { motif: ArticleMeta["cover"]; className?: string }) {
  const sky = "#8CC8F0";
  const line = "rgb(255 255 255 / 0.14)";
  return (
    <svg viewBox="0 0 400 250" className={cn("block h-full w-full bg-navy", className)} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`g-${motif}`} cx="0.85" cy="0.1" r="0.9">
          <stop offset="0" stopColor={sky} stopOpacity="0.32" />
          <stop offset="0.6" stopColor={sky} stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid-${motif}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#grid-${motif})`} />
      <rect width="400" height="250" fill={`url(#g-${motif})`} />

      {motif === "payslip" && (
        <g>
          <rect x="120" y="34" width="160" height="200" rx="4" fill="rgb(255 255 255 / 0.06)" stroke={line} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <rect x="134" y={56 + i * 18} width={60 + ((i * 37) % 50)} height="5" rx="2.5" fill="rgb(255 255 255 / 0.22)" />
              <rect x={236 + ((i * 11) % 14)} y={56 + i * 18} width={30 - ((i * 11) % 14)} height="5" rx="2.5" fill="rgb(255 255 255 / 0.32)" />
            </g>
          ))}
          <rect x="134" y="206" width="132" height="14" rx="3" fill={sky} />
        </g>
      )}

      {motif === "curve" && (
        <g fill="none" strokeWidth="2.5" strokeLinecap="round">
          <path d="M40 210 H360 M40 210 V40" stroke={line} strokeWidth="1.5" />
          <path d="M40 205 C 140 200, 220 120, 350 60" stroke="rgb(255 255 255 / 0.55)" strokeDasharray="6 6" />
          <path d="M40 205 C 130 202, 190 150, 260 115" stroke={sky} />
          <path d="M40 205 C 120 198, 180 130, 260 95" stroke="rgb(255 255 255 / 0.9)" />
          <circle cx="260" cy="115" r="5" fill={sky} />
          <circle cx="260" cy="95" r="5" fill="#fff" />
          <path d="M260 40 V210" stroke={line} strokeWidth="1" strokeDasharray="3 5" />
        </g>
      )}

      {motif === "exam" && (
        <g>
          {Array.from({ length: 28 }).map((_, i) => {
            const x = 70 + (i % 7) * 40;
            const y = 50 + Math.floor(i / 7) * 40;
            const on = [2, 5, 8, 11, 13, 17, 20, 22, 26].includes(i);
            const miss = [9, 18].includes(i);
            return (
              <g key={i}>
                <rect x={x} y={y} width="24" height="24" rx="5" fill={on ? sky : "none"} stroke={on ? sky : line} strokeWidth="1.5" />
                {miss && <path d={`M${x + 7} ${y + 7}l10 10m0-10l-10 10`} stroke="rgb(255 255 255 / 0.7)" strokeWidth="1.5" />}
              </g>
            );
          })}
        </g>
      )}

      {motif === "budget" && (
        <g>
          {[70, 110, 90, 140, 120, 160, 150].map((h, i) => (
            <rect key={i} x={70 + i * 40} y={210 - h} width="22" height={h} rx="3" fill={i === 5 ? sky : "rgb(255 255 255 / 0.18)"} />
          ))}
          <path d="M60 128 H350" stroke="rgb(255 255 255 / 0.6)" strokeDasharray="5 6" strokeWidth="1.5" />
          <path d="M40 210 H360" stroke={line} strokeWidth="1.5" />
        </g>
      )}

      {motif === "shield" && (
        <g fill="none">
          {[100, 78, 56, 34].map((r, i) => (
            <circle key={r} cx="200" cy="125" r={r} stroke={i === 3 ? sky : line} strokeWidth={i === 3 ? 2.5 : 1.5} />
          ))}
          <path d="M200 92 L226 102 V126 C226 144 214 156 200 162 C186 156 174 144 174 126 V102 Z" fill="rgb(140 200 240 / 0.18)" stroke={sky} strokeWidth="2" />
        </g>
      )}

      {motif === "tax" && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={60 + i * 58} y={200 - (i + 1) * 30} width="44" height={(i + 1) * 30} rx="3" fill={i === 2 ? sky : `rgb(255 255 255 / ${0.12 + i * 0.08})`} />
              <text x={82 + i * 58} y={190 - (i + 1) * 30} textAnchor="middle" fontSize="13" fontFamily="monospace" fill="rgb(255 255 255 / 0.8)">
                {["0%", "11%", "30%", "41%", "45%"][i]}
              </text>
            </g>
          ))}
          <path d="M40 200 H360" stroke={line} strokeWidth="1.5" />
        </g>
      )}

      {motif === "growth" && (
        <g fill="none" strokeLinecap="round">
          <path d="M40 210 H360 M40 210 V40" stroke={line} strokeWidth="1.5" />
          <path d="M40 200 L360 150" stroke="rgb(255 255 255 / 0.45)" strokeWidth="2" strokeDasharray="5 6" />
          <path d="M40 200 C 160 195, 260 160, 360 50" stroke={sky} strokeWidth="3" />
          <circle cx="360" cy="50" r="6" fill={sky} />
        </g>
      )}

      {motif === "net" && (
        <g>
          <rect x="70" y="60" width="260" height="26" rx="4" fill="rgb(255 255 255 / 0.22)" />
          <rect x="70" y="102" width="205" height="26" rx="4" fill="rgb(255 255 255 / 0.4)" />
          <rect x="70" y="144" width="190" height="26" rx="4" fill={sky} />
          <rect x="70" y="186" width="170" height="26" rx="4" fill="#fff" />
          <path d="M275 102 V128 M260 144 V170 M240 186 V212" stroke="rgb(255 255 255 / 0.5)" strokeDasharray="3 3" />
        </g>
      )}
    </svg>
  );
}
