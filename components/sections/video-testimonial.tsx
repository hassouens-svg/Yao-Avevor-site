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

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)] bg-navy">
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
            <video src={item.videoUrl} controls autoPlay className="absolute inset-0 size-full object-cover" />
          )
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Lire le témoignage vidéo de ${item.name}`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            {item.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.photo} alt="" className="absolute inset-0 size-full object-cover opacity-70" />
            )}
            <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-white text-navy transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
              <span className="absolute inset-0 animate-ping rounded-full bg-white/40 motion-reduce:hidden" />
              <Play strokeWidth={1.5} className="relative ml-0.5 size-6 fill-navy" />
            </span>
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
