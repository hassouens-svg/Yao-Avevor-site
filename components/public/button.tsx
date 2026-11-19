"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion/use-reduced-motion";

type Variant = "primary" | "secondary" | "ghost" | "light";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 rounded-full px-7 h-13 text-[0.9375rem] font-medium tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] will-change-transform";

const variants: Record<Variant, string> = {
  // Sur fond clair
  primary: "bg-navy text-white hover:bg-navy-deep hover:shadow-lift",
  secondary: "border border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-white",
  ghost: "px-0 h-auto rounded-none text-navy",
  // Sur fond sombre
  light: "bg-white text-navy hover:bg-sky hover:text-navy-deep",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function Button({
  href,
  children,
  variant = "primary",
  arrow = true,
  magnetic = false,
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.PointerEvent) {
    if (!magnetic || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.32;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    el.style.transition = "transform 0.25s cubic-bezier(0.22,1,0.36,1)";
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.transition = "transform 0.7s cubic-bezier(0.22,1,0.36,1)";
  }

  const external = /^(https?:|mailto:|tel:)/.test(href);

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor="link"
      {...(external && href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      <span className={cn(variant === "ghost" && "link-underline pb-0.5")}>{children}</span>
      {arrow && (
        <span className="relative inline-flex size-4 overflow-hidden" aria-hidden="true">
          <ArrowRight
            strokeWidth={1.5}
            className="absolute inset-0 size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-full"
          />
          <ArrowRight
            strokeWidth={1.5}
            className="absolute inset-0 size-4 -translate-x-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0"
          />
        </span>
      )}
    </Link>
  );
}
