"use client";

import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "white";
type Size = "sm" | "md" | "lg";

// primary/secondary use .btn-navy/.btn-maroon (globals.css), which read --btn-navy/--btn-maroon —
// admin-editable in /admin/settings — so a color change doesn't need a rebuild.
const VARIANTS: Record<Variant, string> = {
  primary: "btn-navy text-white shadow-soft hover:shadow-lift",
  secondary: "btn-maroon text-white shadow-soft hover:shadow-lift",
  outline:
    "border border-brand-200 bg-white/60 text-brand-900 hover:border-brand-400 hover:bg-white",
  ghost: "text-brand-900 hover:bg-brand-50",
  white: "bg-white text-brand-900 shadow-soft hover:shadow-lift",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string; onClick?: never; type?: never };
type ButtonAsButton = CommonProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const {
    variant = "primary",
    size = "md",
    className,
    magnetic = true,
    children,
  } = props;

  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  function handleMove(e: MouseEvent) {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
  }
  function handleLeave() {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  }

  const classes = cn(
    "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium",
    "transition-[background,box-shadow,color] duration-300 will-change-transform",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link
        ref={ref}
        href={props.href}
        className={classes}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={(props as ButtonAsButton).type ?? "button"}
      onClick={(props as ButtonAsButton).onClick}
      className={classes}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {children}
    </motion.button>
  );
}
