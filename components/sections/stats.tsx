import type { Stat } from "@/lib/content/types";
import { Counter } from "./counter";

/** Chiffres clés confirmés : filet supérieur, grand chiffre condensé, légende. */
export function Stats({ stats }: { stats: Stat[] }) {
  const visible = stats.filter((s) => s.value !== null);
  if (!visible.length) return null;
  return (
    <section aria-label="Chiffres clés" className="blueprint blueprint-dark relative overflow-hidden bg-navy-deep py-14 text-white sm:py-20">
      <div className="container-site">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-10">
          {visible.map((s) => (
            <div key={s.label} className="flex flex-col gap-3 border-t-2 border-sky/60 pt-5">
              <dd className="tabular display order-1 text-[clamp(3rem,6vw,5rem)] text-white">
                {s.prefix}
                <Counter value={s.value!} />
                <span className="text-copper-light">{s.suffix}</span>
              </dd>
              <dt className="order-2 max-w-[24ch] text-sm leading-snug text-mist">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
