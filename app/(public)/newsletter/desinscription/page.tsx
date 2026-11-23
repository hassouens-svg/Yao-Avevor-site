import type { Metadata } from "next";
import { Suspense } from "react";
import { Unsubscribe } from "./unsubscribe";

export const metadata: Metadata = { title: "Désinscription", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <section className="flex min-h-[70svh] items-center bg-[radial-gradient(90%_80%_at_80%_0%,#e6f1fb,#ffffff_65%)] pt-[var(--header-h)]">
      <div className="container-site max-w-xl">
        <Suspense>
          <Unsubscribe />
        </Suspense>
      </div>
    </section>
  );
}
