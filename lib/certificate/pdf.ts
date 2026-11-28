import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import type { CertData } from "./index";

/* Palette « vert & or » */
const GREEN = rgb(0.055, 0.302, 0.227); // #0E4D3A
const GREEN_DK = rgb(0.035, 0.22, 0.165);
const GOLD = rgb(0.83, 0.686, 0.216); // #D4AF37
const GOLD_DK = rgb(0.72, 0.537, 0.169); // #B8892B
const GOLD_LT = rgb(0.945, 0.85, 0.54); // #F1D98A
const CREAM = rgb(0.984, 0.973, 0.945);
const INK = rgb(0.12, 0.14, 0.15);
const WHITE = rgb(1, 1, 1);

const FONT_DIR = path.join(process.cwd(), "lib/certificate/fonts");
const fontCache = new Map<string, Uint8Array>();
async function fontBytes(file: string) {
  if (!fontCache.has(file)) fontCache.set(file, new Uint8Array(await readFile(path.join(FONT_DIR, file))));
  return fontCache.get(file)!;
}

const clean = (s: string) => s.replace(/[  ]/g, " ").replace(/\s+/g, " ").trim();

function wrap(text: string, font: PDFFont, size: number, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > max && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderCertificate(c: CertData) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const [cinzel, vibes, mont, montSb] = await Promise.all([
    doc.embedFont(await fontBytes("Cinzel-Bold.ttf")),
    doc.embedFont(await fontBytes("GreatVibes.ttf")),
    doc.embedFont(await fontBytes("Montserrat-Regular.ttf")),
    doc.embedFont(await fontBytes("Montserrat-SemiBold.ttf")),
  ]);
  const training = c.k === "training";
  doc.setTitle(`Certification ${training ? "de fin de formation" : "de réussite"} — ${clean(c.n)}`);

  const page = doc.addPage([842, 595]); // A4 paysage
  const W = page.getWidth(), H = page.getHeight();
  /** Dessin SVG en coordonnées « haut-gauche » (comme une maquette). */
  const svg = (d: string, o: { color?: RGB; borderColor?: RGB; borderWidth?: number; x?: number; y?: number; scale?: number; rotate?: number; opacity?: number } = {}) =>
    page.drawSvgPath(d, { x: o.x ?? 0, y: H - (o.y ?? 0), color: o.color, borderColor: o.borderColor, borderWidth: o.borderWidth, scale: o.scale, rotate: o.rotate ? { type: "degrees", angle: o.rotate } as never : undefined, opacity: o.opacity });
  const text = (t: string, f: PDFFont, size: number, y: number, color: RGB = INK, spacing = 0) => {
    const w = f.widthOfTextAtSize(t, size) + spacing * Math.max(0, t.length - 1);
    let x = (W - w) / 2;
    if (!spacing) return page.drawText(t, { x, y: H - y, size, font: f, color }), w;
    for (const ch of t) {
      page.drawText(ch, { x, y: H - y, size, font: f, color });
      x += f.widthOfTextAtSize(ch, size) + spacing;
    }
    return w;
  };

  /* ───────── Fond, ondulations et cadres ───────── */
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: CREAM });
  for (let k = 0; k < 7; k++) {
    svg(`M ${560 + k * 9},${330 + k * 6} C ${640 + k * 9},${300 + k * 6} ${720 + k * 9},${390 + k * 6} ${842},${350 + k * 8}`, { borderColor: rgb(0.93, 0.9, 0.84), borderWidth: 0.5 });
    svg(`M 0,${300 + k * 8} C ${90 + k * 6},${280 + k * 6} ${180 + k * 6},${360 + k * 6} ${280 + k * 8},${330 + k * 6}`, { borderColor: rgb(0.93, 0.9, 0.84), borderWidth: 0.5 });
  }
  page.drawRectangle({ x: 12, y: 12, width: W - 24, height: H - 24, borderColor: GOLD, borderWidth: 1.4 });
  page.drawRectangle({ x: 18, y: 18, width: W - 36, height: H - 36, borderColor: GOLD_LT, borderWidth: 0.6 });

  /* ───────── Rubans d'angle (haut droit, bas gauche) ───────── */
  svg("M 650,0 C 735,22 805,95 842,215 L 842,0 Z", { color: GREEN });
  svg("M 700,0 C 770,25 825,80 842,140 L 842,0 Z", { color: GREEN_DK, opacity: 0.6 });
  svg("M 622,0 C 718,26 795,100 842,250", { borderColor: GOLD_DK, borderWidth: 9 });
  svg("M 622,0 C 718,26 795,100 842,250", { borderColor: GOLD, borderWidth: 6 });
  svg("M 628,0 C 722,27 797,101 842,240", { borderColor: GOLD_LT, borderWidth: 1.5 });
  svg("M 0,395 C 45,470 125,555 215,595 L 0,595 Z", { color: GREEN });
  svg("M 0,450 C 30,500 80,560 140,595 L 0,595 Z", { color: GREEN_DK, opacity: 0.6 });
  svg("M 0,365 C 55,460 135,560 250,595", { borderColor: GOLD_DK, borderWidth: 9 });
  svg("M 0,365 C 55,460 135,560 250,595", { borderColor: GOLD, borderWidth: 6 });
  svg("M 0,372 C 52,462 132,560 240,595", { borderColor: GOLD_LT, borderWidth: 1.5 });

  /* ───────── Fanion haut gauche (domaine) ───────── */
  svg("M 50,0 L 148,0 L 148,138 L 99,118 L 50,138 Z", { color: GREEN, borderColor: GOLD, borderWidth: 2.5 });
  svg("M 55,0 L 143,0 L 143,130 L 99,112 L 55,130 Z", { borderColor: GOLD_LT, borderWidth: 0.6 });
  // Icône graphique + flèche
  [[0, 12], [11, 18], [22, 25], [33, 33]].forEach(([dx, h]) => page.drawRectangle({ x: 80 + dx, y: H - 66, width: 7, height: h, color: WHITE }));
  svg("M 78,46 L 92,36 L 102,40 L 118,24", { borderColor: WHITE, borderWidth: 2 });
  svg("M 112,22 L 120,22 L 120,30", { borderColor: WHITE, borderWidth: 2 });
  page.drawLine({ start: { x: 76, y: H - 67 }, end: { x: 124, y: H - 67 }, thickness: 1.2, color: WHITE });
  const badgeWords = clean(c.b || "Formation").toUpperCase().split(" ");
  const badge: string[] = [];
  for (const w of badgeWords) {
    const last = badge[badge.length - 1];
    if (last && cinzel.widthOfTextAtSize(`${last} ${w}`, 9.5) <= 84) badge[badge.length - 1] = `${last} ${w}`;
    else badge.push(w);
  }
  badge.slice(0, 3).forEach((l, k) => {
    const size = Math.min(9.5, 84 / Math.max(1, cinzel.widthOfTextAtSize(l, 1)));
    page.drawText(l, { x: 99 - cinzel.widthOfTextAtSize(l, size) / 2, y: H - (84 + k * 12), size, font: cinzel, color: WHITE });
  });

  /* ───────── Lauriers + toque ───────── */
  const leaf = "M 0,0 C 3,-3.2 9,-3.2 12,0 C 9,3.2 3,3.2 0,0 Z";
  const laurel = (cx: number, cy: number, dir: 1 | -1, scale = 1, color = GOLD) => {
    // Branche en arc (bas → haut), feuilles de part et d'autre orientées vers le haut
    const P = (t: number) => ({ x: cx - dir * 24 * scale * Math.sin(t * Math.PI * 0.8), y: cy - 50 * scale * t });
    svg(`M ${P(0).x},${P(0).y} Q ${cx - dir * 30 * scale},${cy - 24 * scale} ${P(1).x},${P(1).y}`, { borderColor: color, borderWidth: 1.3 * scale });
    const n = 7;
    for (let k = 0; k < n; k++) {
      const t = 0.1 + (k / (n - 1)) * 0.88;
      const p = P(t), q = P(Math.min(1, t + 0.02));
      const phi = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI; // angle SVG (y vers le bas)
      const sz = scale * (1.25 - t * 0.45);
      svg(leaf, { x: p.x, y: p.y, color, scale: sz, rotate: -(phi - 38) });
      svg(leaf, { x: p.x, y: p.y, color, scale: sz, rotate: -(phi + 38) });
    }
    svg(leaf, { x: P(1).x, y: P(1).y, color, scale: scale * 0.8, rotate: -((Math.atan2(P(1).y - P(0.97).y, P(1).x - P(0.97).x) * 180) / Math.PI) });
  };
  laurel(352, 76, 1, 1, GOLD_DK);
  laurel(490, 76, -1, 1, GOLD_DK);
  // Toque
  svg("M 381,46 L 421,33 L 461,46 L 421,59 Z", { color: GREEN });
  svg("M 397,52 L 397,66 C 410,73 432,73 445,66 L 445,52 L 421,60 Z", { color: GREEN_DK });
  svg("M 421,46 L 452,52 L 452,68", { borderColor: GOLD, borderWidth: 1.4 });
  page.drawRectangle({ x: 449.5, y: H - 76, width: 5, height: 9, color: GOLD });

  /* ───────── Titres ───────── */
  text("CERTIFICATION", cinzel, 44, 122, GREEN, 2);
  const sub = training ? "DE FIN DE FORMATION" : "DE RÉUSSITE";
  const sw = text(sub, montSb, 13.5, 146, GREEN, 3.2);
  page.drawLine({ start: { x: (W - sw) / 2 - 70, y: H - 141 }, end: { x: (W - sw) / 2 - 14, y: H - 141 }, thickness: 1, color: GOLD });
  page.drawLine({ start: { x: (W + sw) / 2 + 14, y: H - 141 }, end: { x: (W + sw) / 2 + 70, y: H - 141 }, thickness: 1, color: GOLD });

  text("Cette certification atteste que", mont, 12.5, 182, INK);
  const name = clean(c.n);
  // Police manuscrite : on place les mots un à un (l'espace de la police est trop étroit)
  const words = name.split(" ");
  const gap = 0.32;
  const unit = words.reduce((w, x) => w + vibes.widthOfTextAtSize(x, 1), 0) + gap * (words.length - 1);
  const nameSize = Math.min(46, 470 / Math.max(1, unit));
  let nx = (W - unit * nameSize) / 2;
  for (const w of words) {
    page.drawText(w, { x: nx, y: H - 232, size: nameSize, font: vibes, color: GREEN });
    nx += vibes.widthOfTextAtSize(w, nameSize) + gap * nameSize;
  }
  page.drawLine({ start: { x: 220, y: H - 246 }, end: { x: 622, y: H - 246 }, thickness: 1, color: GOLD });

  text(training ? "a suivi avec succès la formation en" : "a réussi avec succès le test", mont, 13, 278, INK);
  const big = clean(training ? c.f || c.t : c.t).toUpperCase();
  const bigLines = wrap(big, cinzel, 32, 600);
  const bigSize = bigLines.length > 1 ? Math.min(26, 600 / Math.max(...bigLines.map((l) => cinzel.widthOfTextAtSize(l, 1)))) : Math.min(34, 620 / Math.max(1, cinzel.widthOfTextAtSize(big, 1)));
  let y = bigLines.length > 1 ? 312 : 318;
  for (const l of bigLines.slice(0, 2)) {
    text(l, cinzel, bigSize, y, GREEN, 0.6);
    y += bigSize + 4;
  }

  const body = wrap(clean(c.x), mont, 11, 470).slice(0, 4);
  let by = Math.max(y + 12, 348);
  for (const l of body) {
    text(l, mont, 11, by, INK);
    by += 16.5;
  }

  /* ───────── Bas : date · sceau · score ───────── */
  const date = new Date(c.d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  // Calendrier
  page.drawRectangle({ x: 118, y: H - 486, width: 15, height: 14, borderColor: GOLD_DK, borderWidth: 1.2 });
  page.drawRectangle({ x: 118, y: H - 476, width: 15, height: 4, color: GOLD_DK });
  for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) page.drawRectangle({ x: 121 + k * 4, y: H - 483 + r * 3.5, width: 2, height: 2, color: GOLD_DK });
  page.drawText(training ? "Date de fin de formation :" : "Date du test :", { x: 140, y: H - 476, size: 10, font: mont, color: INK });
  page.drawText(date, { x: 140, y: H - 492, size: 12, font: montSb, color: INK });
  page.drawLine({ start: { x: 134, y: H - 503 }, end: { x: 300, y: H - 503 }, thickness: 1, color: GOLD });

  page.drawText("Score obtenu :", { x: 560, y: H - 476, size: 10, font: mont, color: INK });
  page.drawText(clean(c.s), { x: 560, y: H - 492, size: 12, font: montSb, color: INK });
  page.drawLine({ start: { x: 554, y: H - 503 }, end: { x: 720, y: H - 503 }, thickness: 1, color: GOLD });
  // Numéro de certificat (unique, inscrit dans le lien signé : il ne peut pas être modifié)
  const refLabel = "Certificat n° ";
  const refW = mont.widthOfTextAtSize(refLabel, 8.5) + montSb.widthOfTextAtSize(c.id, 8.5);
  page.drawText(refLabel, { x: (W - refW) / 2, y: 30, size: 8.5, font: mont, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(c.id, { x: (W - refW) / 2 + mont.widthOfTextAtSize(refLabel, 8.5), y: 30, size: 8.5, font: montSb, color: GREEN });

  // Sceau doré
  const sx = 421, sy = 470;
  // Rubans du sceau
  svg(`M ${sx - 26},${sy + 20} L ${sx - 6},${sy + 26} L ${sx - 18},${sy + 76} L ${sx - 27},${sy + 64} L ${sx - 40},${sy + 70} Z`, { color: GREEN, borderColor: GOLD, borderWidth: 1 });
  svg(`M ${sx + 26},${sy + 20} L ${sx + 6},${sy + 26} L ${sx + 18},${sy + 76} L ${sx + 27},${sy + 64} L ${sx + 40},${sy + 70} Z`, { color: GREEN, borderColor: GOLD, borderWidth: 1 });
  const pts: string[] = [];
  for (let k = 0; k < 48; k++) {
    const a = (k / 48) * Math.PI * 2;
    const r = k % 2 ? 40 : 45;
    pts.push(`${(sx + Math.cos(a) * r).toFixed(2)},${(sy + Math.sin(a) * r).toFixed(2)}`);
  }
  svg(`M ${pts.join(" L ")} Z`, { color: GOLD, borderColor: GOLD_DK, borderWidth: 1 });
  page.drawCircle({ x: sx, y: H - sy, size: 35, color: GOLD_LT, borderColor: GOLD_DK, borderWidth: 1.2 });
  page.drawCircle({ x: sx, y: H - sy, size: 30, color: GOLD, borderColor: GOLD_LT, borderWidth: 1 });
  laurel(sx - 8, sy + 24, 1, 0.55, GOLD_DK);
  laurel(sx + 8, sy + 24, -1, 0.55, GOLD_DK);
  // Presse-papiers coché
  page.drawRectangle({ x: sx - 10, y: H - sy - 13, width: 20, height: 25, color: GOLD_LT, borderColor: GOLD_DK, borderWidth: 1.4 });
  page.drawRectangle({ x: sx - 5, y: H - sy + 9, width: 10, height: 5, color: GOLD_DK });
  for (let k = 0; k < 3; k++) {
    const ly = sy - 5 + k * 6.5;
    svg(`M ${sx - 7},${ly} L ${sx - 5.5},${ly + 1.8} L ${sx - 2.5},${ly - 1.8}`, { borderColor: GREEN, borderWidth: 1.1 });
    page.drawLine({ start: { x: sx, y: H - ly }, end: { x: sx + 7, y: H - ly }, thickness: 1, color: GOLD_DK });
  }

  return doc.save();
}
