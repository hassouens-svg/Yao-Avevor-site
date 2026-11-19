// Captures desktop 1440 + mobile 390. Usage : node scripts/screenshots.mjs http://localhost:3100 out-dir /path1 /path2
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import fs from "node:fs";

const [base, out, ...paths] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
  await ctx.addInitScript(() => sessionStorage.setItem("ya-preloaded", "1"));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  page.on("console", (m) => m.type() === "error" && console.log("CONSOLE", m.text()));
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    // Fait défiler pour déclencher les révélations, puis revient en haut
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    const slug = p === "/" ? "home" : p.replace(/\//g, "_").replace(/^_/, "");
    await page.screenshot({ path: `${out}/${slug}-${name}.png`, fullPage: process.env.FULL === "1" });
  }
  await ctx.close();
}
await browser.close();
