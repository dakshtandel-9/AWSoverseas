"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { FloatingPanel, useCloseTimer } from "@/components/layout/nav-flyout";
import type { CategoryNode } from "@/lib/category-data";

/**
 * The top-level "Products" dropdown — one flat list of root categories, each
 * a direct link. A root's own subcategories (Dals & Pulses, Leather
 * Footwear, ...) live inline on that category's page, not as a nested
 * flyout here, so this ignores `children` entirely.
 */
function CategoryRootColumn({ nodes, onNavigate }: { nodes: CategoryNode[]; onNavigate: () => void }) {
  return (
    <ul role="menu" className="max-h-[70vh] w-64 overflow-y-auto p-1.5">
      {nodes.map((node) => (
        <li key={node.id} role="none">
          <Link
            href={`/products/${node.slug}`}
            role="menuitem"
            onClick={onNavigate}
            className="block truncate rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
          >
            {node.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Desktop "Products" nav item — a real link, plus a hover/click dropdown of categories. */
export function ProductsNavItem({
  tree,
  isActive,
  className,
}: {
  tree: CategoryNode[];
  isActive: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const { cancel, schedule } = useCloseTimer(() => setOpen(false));

  const openNow = () => {
    cancel();
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !rootRef.current) return;
    const update = () => setRect(rootRef.current!.getBoundingClientRect());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (rootRef.current?.contains(target) || target.closest("[data-nav-flyout]")) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn("relative flex shrink-0 items-center", className)}
      onMouseEnter={() => tree.length > 0 && openNow()}
      onMouseLeave={schedule}
    >
      <Link
        href="/products"
        data-active={isActive}
        className="nav-underline whitespace-nowrap rounded-full py-2 ps-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink xl:ps-3.5"
      >
        Products
      </Link>
      {tree.length > 0 && (
        <button
          type="button"
          aria-label="Show product categories"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : openNow())}
          className="rounded-full py-2 pe-2.5 ps-1 text-ink-soft transition-colors hover:text-ink xl:pe-3.5"
        >
          <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
        </button>
      )}

      {open && tree.length > 0 && rect && (
        <FloatingPanel anchorRect={rect} placement="below" onMouseEnter={cancel} onMouseLeave={schedule}>
          <CategoryRootColumn nodes={tree} onNavigate={() => setOpen(false)} />
        </FloatingPanel>
      )}
    </div>
  );
}

/**
 * Mobile drawer — one flat list of root categories, each a direct link. A
 * root's own subcategories live inline on that category's page, not as a
 * nested expand-in-place here, mirroring CategoryRootColumn on desktop.
 */
function CategoryAccordionList({ nodes, onNavigate }: { nodes: CategoryNode[]; onNavigate: () => void }) {
  return (
    <ul className="flex flex-col">
      {nodes.map((node) => (
        <li key={node.id}>
          <Link
            href={`/products/${node.slug}`}
            onClick={onNavigate}
            className="block truncate rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
            style={{ paddingInlineStart: "1.75rem" }}
          >
            {node.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProductsMobileAccordion({
  tree,
  isActive,
  onNavigate,
}: {
  tree: CategoryNode[];
  isActive: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (tree.length === 0) {
    return (
      <Link
        href="/products"
        onClick={onNavigate}
        className={cn(
          "rounded-2xl px-4 py-3.5 text-lg font-semibold transition-colors",
          isActive ? "bg-brand-50 text-ink" : "text-ink-soft hover:bg-surface-soft",
        )}
      >
        Products
      </Link>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-2xl transition-colors",
          isActive ? "bg-brand-50 text-ink" : "text-ink-soft",
        )}
      >
        <Link href="/products" onClick={onNavigate} className="flex-1 px-4 py-3.5 text-lg font-semibold">
          Products
        </Link>
        <button
          type="button"
          aria-label="Show product categories"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="px-4 py-3.5"
        >
          <ChevronDown className={cn("size-5 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <CategoryAccordionList nodes={tree} onNavigate={onNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
