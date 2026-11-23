import Link from "next/link";
import type { HomeContent } from "@/lib/content/types";
import { CompoundSimulator } from "@/components/tools/compound-simulator";

/** Bloc sombre : simulateur d'intérêts composés en direct + accès aux autres simulateurs. */
export function ToolsTeaser({ content }: { content: HomeContent["tools"] }) {
  return (
    <section id="simulateurs" className="bg-white pt-[clamp(2rem,4vw,3rem)] pb-[clamp(4rem,8vw,7rem)]">
      <div className="container-site">
        <div className="grow-in blueprint blueprint-dark relative overflow-hidden rounded-md bg-navy-deep px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(140_200_240/0.22),transparent)]" />
          <div className="relative text-center">
            <p className="label-caps text-sky">— {content.label}</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-h2">{content.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-mist">{content.text}</p>
          </div>
          <div className="relative mt-12 rounded-md border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="label-caps mb-6 text-sky">Intérêts composés — essayez</p>
            <CompoundSimulator tone="dark" />
          </div>
          <ul className="relative mt-10 flex flex-wrap justify-center gap-2">
            {content.chips.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="inline-flex h-10 items-center rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white/90 transition-colors hover:border-sky hover:bg-sky hover:text-navy-deep">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
