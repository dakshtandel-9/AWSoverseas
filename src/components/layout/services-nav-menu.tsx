"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { FloatingPanel, useCloseTimer } from "@/components/layout/nav-flyout";

type ServiceLink = { label: string; href: string };
type ServiceEntry = { label: string; href?: string; children?: ServiceLink[] };

/** Static services menu — every leaf links directly to an existing page. */
const SERVICES_MENU: ServiceEntry[] = [
  { label: "Imports", href: "/services/import-services" },
  { label: "Exports", href: "/services/export-services" },
  { label: "Sourcing Partner", href: "/sourcing-agent" },
  { label: "Warehousing", href: "/services/warehousing" },
  {
    label: "Shipments",
    children: [
      { label: "Air Freight", href: "/services/air-freight" },
      { label: "Sea Freight", href: "/services/sea-freight" },
    ],
  },
  { label: "Marine Insurance", href: "/services/marine-insurance" },
];

function ServiceRow({
  entry,
  isActive,
  onOpen,
  onScheduleClose,
  onCancelClose,
  onToggle,
  onNavigate,
}: {
  entry: ServiceEntry;
  isActive: boolean;
  onOpen: () => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const hasChildren = !!entry.children?.length;
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
          href={entry.href!}
          role="menuitem"
          onClick={onNavigate}
          className="block truncate rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-brand-900"
        >
          {entry.label}
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
        <span className="truncate">{entry.label}</span>
        <ChevronRight className="size-4 shrink-0" />
      </button>

      {isActive && rect && (
        <FloatingPanel anchorRect={rect} placement="right" onMouseEnter={onCancelClose} onMouseLeave={onScheduleClose}>
          <ul role="menu" className="w-56 p-1.5">
            {entry.children!.map((child) => (
              <li key={child.href} role="none">
                <Link
                  href={child.href}
                  role="menuitem"
                  onClick={onNavigate}
                  className="block truncate rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-brand-900"
                >
                  {child.label}
                </Link>
              </li>
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
  const [activeChild, setActiveChild] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const { cancel, schedule } = useCloseTimer(() => setOpen(false));
  const { cancel: cancelChild, schedule: scheduleChild } = useCloseTimer(() => setActiveChild(null));

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
        className="nav-underline whitespace-nowrap rounded-full py-2 ps-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-900 xl:ps-3.5"
      >
        Services
      </Link>
      <button
        type="button"
        aria-label="Show service categories"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openNow())}
        className="rounded-full py-2 pe-2.5 ps-1 text-ink-soft transition-colors hover:text-brand-900 xl:pe-3.5"
      >
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && rect && (
        <FloatingPanel anchorRect={rect} placement="below" onMouseEnter={cancel} onMouseLeave={schedule}>
          <ul role="menu" className="w-64 p-1.5">
            {SERVICES_MENU.map((entry) => (
              <ServiceRow
                key={entry.label}
                entry={entry}
                isActive={activeChild === entry.label}
                onOpen={() => {
                  cancelChild();
                  setActiveChild(entry.label);
                }}
                onScheduleClose={scheduleChild}
                onCancelClose={cancelChild}
                onToggle={() => setActiveChild((v) => (v === entry.label ? null : entry.label))}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ul>
        </FloatingPanel>
      )}
    </div>
  );
}

/** Mobile drawer — accordion with one nested level for Shipments (Air / Sea). */
export function ServicesMobileAccordion({ isActive, onNavigate }: { isActive: boolean; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const [openChild, setOpenChild] = useState<string | null>(null);

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-2xl transition-colors",
          isActive ? "bg-brand-50 text-brand-900" : "text-ink-soft",
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
              {SERVICES_MENU.map((entry) => {
                const hasChildren = !!entry.children?.length;

                if (!hasChildren) {
                  return (
                    <li key={entry.label}>
                      <Link
                        href={entry.href!}
                        onClick={onNavigate}
                        className="block truncate rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-brand-900"
                        style={{ paddingInlineStart: "1.75rem" }}
                      >
                        {entry.label}
                      </Link>
                    </li>
                  );
                }

                const childOpen = openChild === entry.label;
                return (
                  <li key={entry.label}>
                    <button
                      type="button"
                      aria-expanded={childOpen}
                      onClick={() => setOpenChild(childOpen ? null : entry.label)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-start text-base font-semibold text-ink transition-colors hover:bg-surface-soft"
                      style={{ paddingInlineStart: "0.75rem" }}
                    >
                      <span className="truncate">{entry.label}</span>
                      <ChevronDown
                        className={cn("size-4 shrink-0 transition-transform duration-200", childOpen && "rotate-180")}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {childOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="flex flex-col">
                            {entry.children!.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={onNavigate}
                                  className="block truncate rounded-xl px-3 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-surface-soft hover:text-brand-900"
                                  style={{ paddingInlineStart: "2.75rem" }}
                                >
                                  {child.label}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
