"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { FloatingPanel, useCloseTimer } from "@/components/layout/nav-flyout";

/** Recursive so any entry (at any depth) can carry its own sub-flyout. */
type ServiceEntry = { label: string; href?: string; children?: ServiceEntry[] };

/** Static services menu — every leaf links directly to an existing page. */
const SERVICES_MENU: ServiceEntry[] = [
  { label: "Imports", href: "/services/import-services" },
  { label: "Exports", href: "/services/export-services" },
  { label: "Sourcing Partner", href: "/sourcing-agent" },
  {
    label: "Warehousing",
    children: [
      { label: "General", href: "/services/warehousing" },
      { label: "Reefer", href: "/services/warehousing" },
    ],
  },
  {
    label: "Shipments",
    children: [
      {
        label: "Air Freight",
        children: [
          { label: "General Cargo", href: "/services/air-freight" },
          { label: "Special Cargo", href: "/services/air-freight" },
        ],
      },
      {
        label: "Sea Freight",
        children: [
          { label: "FCL", href: "/services/sea-freight" },
          { label: "LCL", href: "/services/sea-freight" },
          { label: "Ro-Ro", href: "/services/sea-freight" },
          { label: "Dry Bulk", href: "/services/sea-freight" },
          { label: "Liquid Bulk", href: "/services/sea-freight" },
          { label: "Break Bulk", href: "/services/sea-freight" },
          { label: "Reefer", href: "/services/sea-freight" },
        ],
      },
    ],
  },
];

/** One row of a services flyout — recurses into its own right-hand panel when it has children. */
function ServiceRow({ entry, onNavigate }: { entry: ServiceEntry; onNavigate: () => void }) {
  const hasChildren = !!entry.children?.length;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const { cancel, schedule } = useCloseTimer(() => setOpen(false));

  const openNow = () => {
    cancel();
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = () => setRect(triggerRef.current!.getBoundingClientRect());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  if (!hasChildren) {
    return (
      <li role="none">
        <Link
          href={entry.href!}
          role="menuitem"
          onClick={onNavigate}
          className="block truncate rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
        >
          {entry.label}
        </Link>
      </li>
    );
  }

  return (
    <li role="none" onMouseEnter={openNow} onMouseLeave={schedule}>
      <button
        ref={triggerRef}
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={openNow}
        onClick={() => (open ? setOpen(false) : openNow())}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-start text-sm font-semibold transition-colors",
          open ? "bg-surface-soft text-ink" : "text-ink-soft hover:bg-surface-soft hover:text-ink",
        )}
      >
        <span className="truncate">{entry.label}</span>
        <ChevronRight className="size-4 shrink-0" />
      </button>

      {open && rect && (
        <FloatingPanel anchorRect={rect} placement="right" onMouseEnter={cancel} onMouseLeave={schedule}>
          <ul role="menu" className="w-56 p-1.5">
            {entry.children!.map((child) => (
              <ServiceRow key={child.label} entry={child} onNavigate={onNavigate} />
            ))}
          </ul>
        </FloatingPanel>
      )}
    </li>
  );
}

/** Desktop "Services" nav item — a real link, plus a hover/click dropdown of services. */
export function ServicesNavItem({ isActive, className }: { isActive: boolean; className?: string }) {
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
      onMouseEnter={openNow}
      onMouseLeave={schedule}
    >
      <Link
        href="/services"
        data-active={isActive}
        className="nav-underline whitespace-nowrap rounded-full py-2 ps-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink xl:ps-3.5"
      >
        Services
      </Link>
      <button
        type="button"
        aria-label="Show service categories"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openNow())}
        className="rounded-full py-2 pe-2.5 ps-1 text-ink-soft transition-colors hover:text-ink xl:pe-3.5"
      >
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && rect && (
        <FloatingPanel anchorRect={rect} placement="below" onMouseEnter={cancel} onMouseLeave={schedule}>
          <ul role="menu" className="w-64 p-1.5">
            {SERVICES_MENU.map((entry) => (
              <ServiceRow key={entry.label} entry={entry} onNavigate={() => setOpen(false)} />
            ))}
          </ul>
        </FloatingPanel>
      )}
    </div>
  );
}

/** Mobile drawer — accordion that nests to arbitrary depth (Shipments → Sea Freight → cargo types). */
export function ServicesMobileAccordion({ isActive, onNavigate }: { isActive: boolean; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-2xl transition-colors",
          isActive ? "bg-brand-50 text-ink" : "text-ink-soft",
        )}
      >
        <Link href="/services" onClick={onNavigate} className="flex-1 px-4 py-3.5 text-lg font-semibold">
          Services
        </Link>
        <button
          type="button"
          aria-label="Show service categories"
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
            <ul className="flex flex-col">
              {SERVICES_MENU.map((entry) => (
                <MobileServiceRow key={entry.label} entry={entry} depth={0} onNavigate={onNavigate} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** One row of the mobile accordion — recurses into its own nested list when it has children. */
function MobileServiceRow({
  entry,
  depth,
  onNavigate,
}: {
  entry: ServiceEntry;
  depth: number;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!entry.children?.length;
  const linkIndent = `${1.75 + depth}rem`;

  if (!hasChildren) {
    return (
      <li>
        <Link
          href={entry.href!}
          onClick={onNavigate}
          className="block truncate rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-ink"
          style={{ paddingInlineStart: linkIndent }}
        >
          {entry.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-start text-base font-semibold text-ink transition-colors hover:bg-surface-soft"
        style={{ paddingInlineStart: `${0.75 + depth}rem` }}
      >
        <span className="truncate">{entry.label}</span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ul className="flex flex-col">
              {entry.children!.map((child) => (
                <MobileServiceRow key={child.label} entry={child} depth={depth + 1} onNavigate={onNavigate} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
