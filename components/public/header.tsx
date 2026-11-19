"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { mainNav } from "@/lib/site";
import { Wordmark } from "./monogram";
import { MobileMenu } from "./mobile-menu";

/**
 * Header clair : transparent en haut de page, puis blanc flouté.
 * Se rétracte au scroll vers le bas, réapparaît vers le haut.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Le menu est « ouvert pour une page donnée » : il se referme de lui-même à la navigation.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const closeMenu = useCallback(() => setMenuPath(null), []);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
      >
        Aller au contenu
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow,color] duration-700 ease-[var(--ease-out-expo)]",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          scrolled && !menuOpen && "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl backdrop-saturate-150",
          menuOpen ? "text-white" : "text-navy-deep",
        )}
      >
        <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-8">
          <Link href="/" aria-label="Yao AVEVOR — accueil" className="relative z-[60]">
            <Wordmark />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.875rem] font-medium">
              {mainNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn("link-underline pb-1", active && "bg-[length:100%_1px]")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden h-10 items-center rounded-full bg-navy-deep px-5 text-sm font-medium text-white transition-colors duration-500 hover:bg-blue lg:inline-flex"
            >
              Me contacter
            </Link>
            <button
              type="button"
              onClick={() => setMenuPath(menuOpen ? null : pathname)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative z-[60] -mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                    menuOpen ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[1.5px] bg-current transition-all duration-500 ease-[var(--ease-out-expo)]",
                    menuOpen ? "top-1.5 w-6 -rotate-45" : "top-3 w-4",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
