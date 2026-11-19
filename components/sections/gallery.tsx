"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/content/types";
import { SectionLabel } from "@/components/public/section-label";

/** 08 — Galerie : grille masonry + lightbox accessible (<dialog>). Masquée tant qu'elle est vide. */
export function Gallery({ content, items }: { content: { label: string; title: string }; items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d: number) => setOpen((v) => (v === null ? v : (v + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) {
      d.showModal();
      window.__lenis?.stop();
    }
    if (open === null && d.open) {
      d.close();
      window.__lenis?.start();
    }
  }, [open]);

  if (!items.length) return null;
  const current = open !== null ? items[open] : null;

  return (
    <section id="galerie" className="section-y bg-paper">
      <div className="container-site">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="mt-5 text-h2 text-navy-deep">{content.title}</h2>
        <ul className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {items.map((it, i) => (
            <li key={it.src} className="mb-6 break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full overflow-hidden rounded-[var(--radius-md)]"
                aria-label={`Agrandir : ${it.alt}`}
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  width={it.width}
                  height={it.height}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                />
              </button>
              {it.caption && <p className="mt-3 text-sm text-muted">{it.caption}</p>}
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        onClose={close}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
        aria-label="Visionneuse"
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-navy-deep/95"
      >
        {current && (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-white" onClick={(e) => e.target === e.currentTarget && close()}>
            <Image src={current.src} alt={current.alt} width={current.width} height={current.height} className="max-h-[80vh] w-auto rounded-[var(--radius-md)] object-contain" />
            {current.caption && <p className="text-sm text-mist">{current.caption}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => move(-1)} aria-label="Photo précédente" className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 hover:bg-white hover:text-navy">
                <ArrowLeft strokeWidth={1.5} className="size-4" />
              </button>
              <button type="button" onClick={close} aria-label="Fermer" className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 hover:bg-white hover:text-navy">
                <X strokeWidth={1.5} className="size-4" />
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Photo suivante" className="inline-flex size-11 items-center justify-center rounded-full border border-white/25 hover:bg-white hover:text-navy">
                <ArrowRight strokeWidth={1.5} className="size-4" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
