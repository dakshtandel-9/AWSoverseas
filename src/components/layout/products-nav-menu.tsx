"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CategoryNode } from "@/lib/category-data";

/** Bridges the mouse gap between a trigger and its (portaled) panel before closing. */
const CLOSE_DELAY = 150;

function useCloseTimer(close: () => void) {
  const timer = useRef<number | null>(null);

  const cancel = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const schedule = () => {
    cancel();
    timer.current = window.setTimeout(close, CLOSE_DELAY);
  };

  useEffect(() => cancel, []);

  return { cancel, schedule };
}

/**
 * The nav header clips overflow (it scrolls horizontally on cramped desktop
 * widths), so a plain `absolute` panel gets cut off. Portal it to <body> and
 * position it from the trigger's live bounding rect instead.
 */
function FloatingPanel({
  anchorRect,
  placement,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  anchorRect: DOMRect;
  placement: "below" | "right";
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: ReactNode;
}) {
  if (typeof document === "undefined") return null;

  const style: React.CSSProperties =
    placement === "below"
      ? { position: "fixed", top: anchorRect.bottom + 8, left: anchorRect.left, zIndex: 70 }
      : { position: "fixed", top: anchorRect.top, left: anchorRect.right + 6, zIndex: 70 };

  return createPortal(
    <div
      data-products-menu
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="overflow-hidden rounded-2xl border border-line bg-white shadow-lg"
    >
      {children}
    </div>,
    document.body,
  );
}

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
  const hasChildren = node.children.length > 0;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !triggerRef.current) return;
    const update = () => setRect(triggerRef.current!.getBoundingClientRect());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isActive]);

  if (!hasChildren) {
    return (
      <li role="none">
        <Link
          href={`/products/${node.slug}`}
          role="menuitem"
          onClick={onNavigate}
          className="block truncate rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-brand-900"
        >
          {node.name}
        </Link>
      </li>
    );
  }

  return (
    <li role="none" onMouseEnter={onOpen} onMouseLeave={onScheduleClose}>
      <button
        ref={triggerRef}
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isActive}
        onFocus={onOpen}
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-start text-sm font-semibold transition-colors",
          isActive ? "bg-surface-soft text-brand-900" : "text-ink-soft hover:bg-surface-soft hover:text-brand-900",
        )}
      >
        <span className="truncate">{node.name}</span>
        <ChevronRight className="size-4 shrink-0" />
      </button>

      {isActive && rect && (
        <FloatingPanel anchorRect={rect} placement="right" onMouseEnter={onCancelClose} onMouseLeave={onScheduleClose}>
          <CategoryFlyoutColumn nodes={node.children} onNavigate={onNavigate} />
        </FloatingPanel>
      )}
    </li>
  );
}

/** One column of a cascading flyout — a branch node opens the next column to its right. */
function CategoryFlyoutColumn({
  nodes,
  onNavigate,
}: {
  nodes: CategoryNode[];
  onNavigate: () => void;
}) {
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
      if (rootRef.current?.contains(target) || target.closest("[data-products-menu]")) return;
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
        className="nav-underline whitespace-nowrap rounded-full py-2 ps-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-900 xl:ps-3.5"
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
          className="rounded-full py-2 pe-2.5 ps-1 text-ink-soft transition-colors hover:text-brand-900 xl:pe-3.5"
        >
          <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
        </button>
      )}

      {open && tree.length > 0 && rect && (
        <FloatingPanel anchorRect={rect} placement="below" onMouseEnter={cancel} onMouseLeave={schedule}>
          <CategoryFlyoutColumn nodes={tree} onNavigate={() => setOpen(false)} />
        </FloatingPanel>
      )}
    </div>
  );
}

/** Mobile drawer — nested single-open accordion, same branch/leaf rule as the desktop flyout. */
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

  return (
    <ul className="flex flex-col">
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isOpen = openId === node.id;

        return (
          <li key={node.id}>
            {hasChildren ? (
              <>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : node.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-start text-base font-semibold text-ink transition-colors hover:bg-surface-soft"
                  style={{ paddingInlineStart: `${0.75 + depth * 1}rem` }}
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
                      <CategoryAccordionList nodes={node.children} depth={depth + 1} onNavigate={onNavigate} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={`/products/${node.slug}`}
                onClick={onNavigate}
                className="block truncate rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-brand-900"
                style={{ paddingInlineStart: `${0.75 + depth * 1}rem` }}
              >
                {node.name}
              </Link>
            )}
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
          isActive ? "bg-brand-50 text-brand-900" : "text-ink-soft hover:bg-surface-soft",
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
          isActive ? "bg-brand-50 text-brand-900" : "text-ink-soft",
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
            <CategoryAccordionList nodes={tree} depth={1} onNavigate={onNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
