"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { FloatingPanel, useCloseTimer } from "@/components/layout/nav-flyout";
import type { CategoryNode } from "@/lib/category-data";

/**
 * One row of a category menu, at any depth. Every active category has a real
 * page at /products/<slug>, so the row is always a link; a category that holds
 * subcategories additionally opens a submenu listing them, which nests as deep
 * as the tree does. The menu deliberately mirrors the category tree exactly —
 * how a subcategory happens to *render* on its parent's page (a card, or opened
 * out in place) is a layout decision and must not decide whether it is
 * reachable from the nav.
 */
function CategoryRow({
  node,
  isActive,
  onOpen,
  onScheduleClose,
  onCancelClose,
  onToggle,
  onNavigate,
}: {
  node: CategoryNode;
  isActive: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !triggerRef.current) return;
    const update = () => setRect(triggerRef.current!.getBoundingClientRect());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isActive]);

  if (node.children.length === 0) {
    return (
      <li role="none">
        <Link
          href={`/products/${node.slug}`}
          role="menuitem"
          onClick={onNavigate}
          className="block truncate rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
        >
          {node.name}
        </Link>
      </li>
    );
  }

  return (
    <li role="none" onMouseEnter={onOpen} onMouseLeave={onScheduleClose}>
      <div
        className={cn(
          "flex w-full items-center gap-1 rounded-xl text-sm font-semibold transition-colors",
          isActive ? "bg-surface-soft text-ink" : "text-ink-soft hover:bg-surface-soft hover:text-ink",
        )}
      >
        <Link
          href={`/products/${node.slug}`}
          role="menuitem"
          onFocus={onOpen}
          onClick={onNavigate}
          className="flex-1 truncate rounded-xl px-3.5 py-2.5 text-start"
        >
          {node.name}
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-label={`Show ${node.name} subcategories`}
          aria-haspopup="true"
          aria-expanded={isActive}
          onClick={onToggle}
          className="rounded-xl py-2.5 pe-3.5 ps-1"
        >
          <ChevronRight className="size-4 shrink-0" />
        </button>
      </div>

      {isActive && rect && (
        <FloatingPanel anchorRect={rect} placement="right" onMouseEnter={onCancelClose} onMouseLeave={onScheduleClose}>
          <CategoryMenuList nodes={node.children} onNavigate={onNavigate} />
        </FloatingPanel>
      )}
    </li>
  );
}

/** A column of category rows. Each row may open another one of these. */
function CategoryMenuList({ nodes, onNavigate }: { nodes: CategoryNode[]; onNavigate: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { cancel, schedule } = useCloseTimer(() => setActiveId(null));

  const openNow = (id: string) => {
    cancel();
    setActiveId(id);
  };

  return (
    <ul role="menu" className="max-h-[70vh] w-64 overflow-y-auto p-1.5">
      {nodes.map((node) => (
        <CategoryRow
          key={node.id}
          node={node}
          isActive={activeId === node.id}
          onOpen={() => openNow(node.id)}
          onScheduleClose={schedule}
          onCancelClose={cancel}
          onToggle={() => (activeId === node.id ? setActiveId(null) : openNow(node.id))}
          onNavigate={onNavigate}
        />
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
          <CategoryMenuList nodes={tree} onNavigate={() => setOpen(false)} />
        </FloatingPanel>
      )}
    </div>
  );
}

/**
 * Mobile drawer — the same tree as an accordion. A category with subcategories
 * expands in place to reveal them, at any depth; its own name stays tappable so
 * the category page itself is never out of reach.
 */
function CategoryAccordionList({
  nodes,
  depth,
  onNavigate,
}: {
  nodes: CategoryNode[];
  depth: number;
  onNavigate: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  // Each level steps in by the same amount, so nesting reads as nesting.
  const indent = `${1.75 + depth}rem`;

  return (
    <ul className="flex flex-col">
      {nodes.map((node) => {
        const isOpen = openId === node.id;

        if (node.children.length === 0) {
          return (
            <li key={node.id}>
              <Link
                href={`/products/${node.slug}`}
                onClick={onNavigate}
                className="block truncate rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
                style={{ paddingInlineStart: indent }}
              >
                {node.name}
              </Link>
            </li>
          );
        }

        return (
          <li key={node.id}>
            <div className="flex items-center gap-1">
              <Link
                href={`/products/${node.slug}`}
                onClick={onNavigate}
                className="min-w-0 flex-1 truncate rounded-xl px-3 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface-soft"
                style={{ paddingInlineStart: indent }}
              >
                {node.name}
              </Link>
              <button
                type="button"
                aria-label={`Show ${node.name} subcategories`}
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : node.id)}
                className="shrink-0 rounded-xl px-3 py-3 text-ink transition-colors hover:bg-surface-soft"
              >
                <ChevronDown
                  className={cn("size-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>
            </div>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <CategoryAccordionList nodes={node.children} depth={depth + 1} onNavigate={onNavigate} />
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
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
            <CategoryAccordionList nodes={tree} depth={0} onNavigate={onNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
