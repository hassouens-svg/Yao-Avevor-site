import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, degrees, rgb, type PDFFont } from "pdf-lib";
import type { CertData } from "./index";

const NAVY = rgb(7 / 255, 21 / 255, 40 / 255);
const BLUE = rgb(29 / 255, 79 / 255, 145 / 255);
const SKY = rgb(140 / 255, 200 / 255, 240 / 255);
const COPPER = rgb(168 / 255, 90 / 255, 36 / 255);
const MUTED = rgb(91 / 255, 100 / 255, 116 / 255);
const LINE = rgb(227 / 255, 231 / 255, 237 / 255);

/** Les polices standard PDF n'acceptent que le jeu WinAnsi : on remplace le reste. */
const clean = (s: string) =>
  s
    .replace(/[  ]/g, " ")
    .replace(/[“”«»]/g, (c) => ({ "“": "“", "”": "”", "«": "«", "»": "»" })[c]!)
    .replace(/[^\x20-\x7E -ÿ‘’“”–—…€•]/g, "");

function wrap(text: string, font: PDFFont, size: number, max: number) {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > max && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

export async function renderCertificate(c: CertData) {
  const doc = await PDFDocument.create();
  doc.setTitle(clean(`${c.k === "training" ? "Attestation de fin de formation" : "Attestation de réussite"} — ${c.n}`));
  doc.setAuthor("Yao AVEVOR");
  const page = doc.addPage([842, 595]); // A4 paysage
  const W = page.getWidth(), H = page.getHeight();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const ital = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Fond : bandeau bleu nuit à gauche + grille fine « plan d'ingénieur »
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(1, 1, 1) });
  for (let x = 120; x < W; x += 24) page.drawLine({ start: { x, y: 0 }, end: { x, y: H }, thickness: 0.3, color: rgb(0.94, 0.96, 0.985) });
  for (let y = 0; y < H; y += 24) page.drawLine({ start: { x: 96, y }, end: { x: W, y }, thickness: 0.3, color: rgb(0.94, 0.96, 0.985) });
  page.drawRectangle({ x: 0, y: 0, width: 96, height: H, color: NAVY });
  page.drawRectangle({ x: 96, y: 0, width: 5, height: H, color: COPPER });
  page.drawRectangle({ x: 125, y: 24, width: W - 149, height: H - 48, borderColor: LINE, borderWidth: 1 });

  // Monogramme vertical
  page.drawText("YAO AVEVOR", { x: 58, y: 150, size: 22, font: bold, color: rgb(1, 1, 1), rotate: degrees(90) });

  const cx0 = 101, cw = W - 101;
  const mid = (t: string, y: number, f: PDFFont, s: number, col = NAVY, sp = 0) => {
    const w = f.widthOfTextAtSize(t, s) + sp * (t.length - 1);
    const x = cx0 + (cw - w) / 2;
    if (!sp) return page.drawText(t, { x, y, size: s, font: f, color: col });
    let xx = x;
    for (const ch of t) { page.drawText(ch, { x: xx, y, size: s, font: f, color: col }); xx += f.widthOfTextAtSize(ch, s) + sp; }
  };

  mid("CONCEPTION · MANAGEMENT · PILOTAGE · INNOVATION", H - 70, reg, 8, MUTED, 1.6);
  mid(c.k === "training" ? "ATTESTATION DE FIN DE FORMATION" : "ATTESTATION DE RÉUSSITE", H - 125, bold, 30, NAVY, 0.5);
  page.drawRectangle({ x: cx0 + cw / 2 - 40, y: H - 145, width: 80, height: 3, color: COPPER });

  mid("Décernée à", H - 190, ital, 13, MUTED);
  const name = clean(c.n);
  const nameSize = Math.min(40, (cw - 120) / Math.max(1, bold.widthOfTextAtSize(name, 1)));
  mid(name, H - 240, bold, nameSize, BLUE);

  const body = wrap(clean(c.x), reg, 13, cw - 170);
  let y = H - 290;
  for (const l of body.slice(0, 7)) { mid(l, y, reg, 13, NAVY); y -= 20; }

  // Bloc infos
  const infoY = 120;
  const col = (label: string, value: string, x: number) => {
    page.drawText(label.toUpperCase(), { x, y: infoY + 18, size: 7.5, font: bold, color: MUTED });
    page.drawText(clean(value), { x, y: infoY, size: 11.5, font: reg, color: NAVY });
  };
  const date = new Date(c.d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  col(c.k === "training" ? "Test de fin de formation" : "Test", c.t.length > 42 ? c.t.slice(0, 40) + "…" : c.t, 150);
  col("Score", c.s, 430);
  col("Date", date, 540);

  // Sceau cuivre
  const sx = W - 120, sy = 150;
  page.drawCircle({ x: sx, y: sy, size: 46, color: COPPER });
  page.drawCircle({ x: sx, y: sy, size: 40, borderColor: rgb(1, 1, 1), borderWidth: 1, color: COPPER });
  const sealTxt = c.k === "training" ? "FORMATION" : "RÉUSSITE";
  page.drawText(sealTxt, { x: sx - bold.widthOfTextAtSize(sealTxt, 8) / 2, y: sy + 6, size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText("VALIDÉE", { x: sx - bold.widthOfTextAtSize("VALIDÉE", 8) / 2, y: sy - 8, size: 8, font: bold, color: rgb(1, 1, 1) });

  // Signature + photo
  page.drawLine({ start: { x: 150, y: 88 }, end: { x: W - 60, y: 88 }, thickness: 0.6, color: LINE });
  try {
    const jpg = await doc.embedJpg(await readFile(path.join(process.cwd(), "public/images/email-yao.jpg")));
    page.drawImage(jpg, { x: 150, y: 38, width: 40, height: 40 });
  } catch {}
  page.drawText("Yao AVEVOR, Ph.D, PMP®", { x: 200, y: 62, size: 11, font: bold, color: NAVY });
  page.drawText("Formateur PMP® (PMI ATP) · Gestion de projets industriels", { x: 200, y: 48, size: 8.5, font: reg, color: MUTED });
  const ref = `N° ${c.id} · yaoavevor.com`;
  page.drawText(ref, { x: W - 60 - reg.widthOfTextAtSize(ref, 7.5), y: 48, size: 7.5, font: reg, color: MUTED });

  return doc.save();
}
