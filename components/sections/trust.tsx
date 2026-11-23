import Image from "next/image";
import type { HomeContent, Logo } from "@/lib/content/types";

function LogoItem({ logo, hidden }: { logo: Logo; hidden?: boolean }) {
  const square = logo.width / logo.height < 1.6;
  return (
    <li className="group/logo flex shrink-0 items-center px-7 sm:px-11" aria-hidden={hidden || undefined}>
      <Image
        src={logo.src}
        alt={hidden ? "" : logo.name}
        width={logo.width}
        height={logo.height}
        className={
          "w-auto object-contain opacity-80 grayscale-[0.7] transition-[filter,opacity] duration-500 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 " +
          (square ? "h-11" : "h-7 sm:h-8")
        }
      />
    </li>
  );
}

/** Bandeau de logos : défilement infini, niveaux de gris → couleur au survol. */
export function Trust({ content }: { content: HomeContent["trust"] }) {
  return (
    <section aria-label="Parcours : entreprises et institutions" className="border-y border-line bg-white">
      <div className="container-site flex items-center gap-8 py-7">
        <p className="label-caps hidden shrink-0 text-muted sm:block">{content.label}</p>
        <div className="group/marquee relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="flex w-max animate-[marquee_38s_linear_infinite] items-center group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
            {content.logos.map((logo) => (
              <LogoItem key={logo.name} logo={logo} />
            ))}
            {content.logos.map((logo) => (
              <LogoItem key={`${logo.name}-dup`} logo={logo} hidden />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
