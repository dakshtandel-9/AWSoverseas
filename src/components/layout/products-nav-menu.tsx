"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { FloatingPanel, useCloseTimer } from "@/components/layout/nav-flyout";
import { isOwnPage, type CategoryNode } from "@/lib/category-data";

/**
 * One row of the top-level "Products" dropdown. Most root categories'
 * subcategories (Dals & Pulses, Leather Footwear, ...) live inline on that
 * root's own page, not as separate pages, so they're not worth a submenu —
 * the row is a plain link. A root whose children DO get their own page (see
 * isOwnPage; today only Food Products, whose Fruits & Vegetables / Grocery
 * Products / Indian Spices / Namkeen & Frozen Foods are each a real
 * destination) opens a one-level flyout listing those pages instead.
 */
function CategoryRootRow({
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
  const linkedChildren = node.children.filter((c) => isOwnPage(c, node.children));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !triggerRef.current) return;
    const update = () => setRect(triggerRef.current!.getBoundingClientRect());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isActive]);

  if (linkedChildren.length === 0) {
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
          <ul role="menu" className="max-h-[70vh] w-64 overflow-y-auto p-1.5">
            {linkedChildren.map((child) => (
              <li key={child.id} role="none">
                <Link
                  href={`/products/${child.slug}`}
                  role="menuitem"
                  onClick={onNavigate}
                  className="block truncate rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </FloatingPanel>
      )}
    </li>
  );
}

/** The top-level "Products" dropdown — one column of root categories. */
function CategoryRootColumn({ nodes, onNavigate }: { nodes: CategoryNode[]; onNavigate: () => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { cancel, schedule } = useCloseTimer(() => setActiveId(null));

  const openNow = (id: string) => {
    cancel();
    setActiveId(id);
  };

  return (
    <ul role="menu" className="max-h-[70vh] w-64 overflow-y-auto p-1.5">
      {nodes.map((node) => (
        <CategoryRootRow
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
          <CategoryRootColumn nodes={tree} onNavigate={() => setOpen(false)} />
        </FloatingPanel>
      )}
    </div>
  );
}

/**
 * Mobile drawer — one list of root categories. Most are a direct link, since
 * their subcategories live inline on their own page rather than being
 * separate pages. A root whose children DO get their own page (see
 * isOwnPage) expands in place to list those pages instead, mirroring
 * CategoryRootRow on desktop.
 */
function CategoryAccordionList({ nodes, onNavigate }: { nodes: CategoryNode[]; onNavigate: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="flex flex-col">
      {nodes.map((node) => {
        const linkedChildren = node.children.filter((c) => isOwnPage(c, node.children));
        const isOpen = openId === node.id;

        if (linkedChildren.length === 0) {
          return (
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
          );
        }

        return (
          <li key={node.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : node.id)}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-start text-base font-semibold text-ink transition-colors hover:bg-surface-soft"
              style={{ paddingInlineStart: "1.75rem" }}
            >
              <span className="truncate">{node.name}</span>
              <ChevronDown
                className={cn("size-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col">
                    {linkedChildren.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/products/${child.slug}`}
                          onClick={onNavigate}
                          className="block truncate rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
                          style={{ paddingInlineStart: "2.75rem" }}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
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
            <CategoryAccordionList nodes={tree} onNavigate={onNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
