"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import type { Testimonial } from "@/lib/content/types";

function embedUrl(url: string) {
  const yt = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&dnt=1`;
  return null;
}

/** Témoignage vidéo : vignette + bouton play animé ; le lecteur n'est chargé qu'au clic (performance, RGPD). */
export function VideoTestimonial({ item }: { item: Testimonial }) {
  const [playing, setPlaying] = useState(false);
  const embed = item.videoUrl ? embedUrl(item.videoUrl) : null;
  // Vignette « visage » extraite de la vidéo (si elle existe), sinon photo ou affiche
  const face = item.poster?.startsWith("/videos/") ? item.poster.replace(/\.jpg$/, "-face.jpg") : undefined;

  return (
    <figure data-cursor-label="Voir">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-navy shadow-lift">
        {playing ? (
          embed ? (
            <iframe
              src={embed}
              title={`Témoignage vidéo de ${item.name}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <video src={item.videoUrl} poster={item.poster} controls autoPlay playsInline className="absolute inset-0 size-full bg-black object-contain" />
          )
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Lire le témoignage vidéo de ${item.name}`}
            className="group absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-navy-deep text-white"
          >
            {(item.poster ?? item.photo) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.poster ?? item.photo} alt="" className="absolute inset-0 size-full scale-125 object-cover opacity-50 blur-2xl saturate-150" />
            )}
            <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_20%,rgb(7_21_40/0.85)_75%)]" />
            <span className="relative block aspect-square w-[clamp(7rem,30%,12rem)]">
              <span className="relative block size-full overflow-hidden rounded-full border-[3px] border-copper-light shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {face || item.photo ? (
                  <img src={face ?? item.photo} alt="" className="size-full object-cover" />
                ) : (
                  // Affiche « félicitations » : on zoome sur le médaillon du visage, au centre de l'image
                  <img src={item.poster} alt="" className="absolute top-1/2 left-1/2 w-[370%] max-w-none -translate-x-1/2 -translate-y-[47%]" />
                )}
              </span>
              <span className="absolute -right-1 -bottom-1 inline-flex size-12 items-center justify-center rounded-full bg-white text-navy shadow-lift transition-transform duration-500 group-hover:scale-110">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/40 motion-reduce:hidden" />
                <Play strokeWidth={1.5} className="relative ml-0.5 size-5 fill-navy" />
              </span>
            </span>
            <span className="label-caps relative mt-5 text-copper-light">{item.role?.split("—")[0]?.trim() || "Témoignage"}</span>
            <span className="display relative mt-2 px-4 text-center text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight">{item.name}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-4">
        <span className="block font-medium text-navy">{item.name}</span>
        <span className="block text-sm text-muted">{item.role}</span>
      </figcaption>
    </figure>
  );
}
