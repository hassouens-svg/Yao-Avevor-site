"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { mainNav, site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Menu mobile plein écran : rideau bleu marine, liens révélés en cascade. */
export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const opener = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => firstLink.current?.focus());
    return () => {
      opener?.focus();
      window.__lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const items = [...mainNav, { href: "/contact", label: "Contact" }];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-navy-deep text-white lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.55, ease: EASE, delay: 0.1 } }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <nav aria-label="Navigation mobile" className="container-site flex flex-1 flex-col justify-center pt-[var(--header-h)]">
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    exit={reduce ? undefined : { y: "110%", transition: { duration: 0.35, ease: EASE } }}
                    transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.15 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      ref={i === 0 ? firstLink : undefined}
                      onClick={onClose}
                      className="flex items-baseline gap-4 py-2 display text-[clamp(2.5rem,10vw,4rem)]"
                    >
                      <span className="label-caps tabular text-sky">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="container-site flex flex-col gap-2 border-t border-white/10 py-8 text-sm text-mist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.5 } }}
            exit={{ opacity: 0 }}
          >
            <a href={`mailto:${site.email}`} className="hover:text-white">
              {site.email}
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              LinkedIn ↗
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
