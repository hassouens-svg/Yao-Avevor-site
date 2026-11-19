"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { LinkedinIcon } from "@/components/public/icons";

/** Barre de progression de lecture fine, en haut de l'écran. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.getElementById("article-body");
      if (!el || !bar.current) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      bar.current.style.transform = `scaleX(${p})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-blue-bright" />
    </div>
  );
}

/** Sommaire généré automatiquement à partir des h2 de l'article ; met en évidence la partie en cours. */
export function Toc() {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const heads = Array.from(document.querySelectorAll<HTMLHeadingElement>("#article-body h2"));
    heads.forEach((h, i) => {
      if (!h.id) h.id = `partie-${i + 1}`;
    });
    // Lecture du DOM rendu (source externe à React) : setState dans un callback de frame
    const raf = requestAnimationFrame(() => setItems(heads.map((h) => ({ id: h.id, text: h.textContent ?? "" }))));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    heads.forEach((h) => io.observe(h));
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  if (!items.length) return null;
  return (
    <nav aria-label="Sommaire" className="text-sm">
      <p className="label-caps text-muted">Sommaire</p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors",
                active === it.id ? "border-blue font-semibold text-navy-deep" : "border-transparent text-muted hover:text-navy-deep",
              )}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Partage : LinkedIn, WhatsApp, copie du lien. */
export function ShareBar({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? window.location.origin + path : path);
  const btn = "inline-flex size-10 items-center justify-center rounded-full border border-line text-navy-deep transition-colors hover:border-navy-deep hover:bg-navy-deep hover:text-white";
  return (
    <div className="flex items-center gap-2">
      <span className="label-caps mr-1 text-muted">Partager</span>
      <a className={btn} aria-label="Partager sur LinkedIn" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(path)}`} onClick={(e) => (e.currentTarget.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url())}`)}>
        <LinkedinIcon className="size-4" />
      </a>
      <a className={cn(btn, "font-mono text-[0.7rem] font-bold")} aria-label="Partager sur WhatsApp" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(title)}`} onClick={(e) => (e.currentTarget.href = `https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`)}>
        WA
      </a>
      <button
        type="button"
        className={btn}
        aria-label="Copier le lien"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {}
        }}
      >
        {copied ? <Check strokeWidth={1.75} className="size-4" /> : <Link2 strokeWidth={1.75} className="size-4" />}
      </button>
    </div>
  );
}
