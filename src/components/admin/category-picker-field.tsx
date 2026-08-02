"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ImageOff, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CategoryTreeNode } from "@/lib/admin-category-tree";

/** Root-first ancestor chain from the top level down to (and including) `id`. */
function ancestorChain(byId: Map<string, CategoryTreeNode>, id: string): CategoryTreeNode[] {
  const chain: CategoryTreeNode[] = [];
  let cursor: string | undefined = id;
  while (cursor) {
    const node = byId.get(cursor);
    if (!node) break;
    chain.unshift(node);
    cursor = node.parent_id ?? undefined;
  }
  return chain;
}

/**
 * A single required field, but the choice behind it takes a few taps: open the
 * popup, tap a category photo, and if it holds subcategories the popup drills
 * into those instead of selecting it — repeating until a leaf is tapped, which
 * is the only kind of category a product can actually be filed under.
 */
export function CategoryPickerField({
  categories,
  defaultValue,
}: {
  categories: CategoryTreeNode[];
  defaultValue?: string;
}) {
  const { byParent, byId } = useMemo(() => {
    const byParent = new Map<string, CategoryTreeNode[]>();
    const byId = new Map<string, CategoryTreeNode>();
    for (const c of categories) byId.set(c.id, c);
    for (const c of categories) {
      const key = c.parent_id ?? "";
      const siblings = byParent.get(key) ?? [];
      siblings.push(c);
      byParent.set(key, siblings);
    }
    for (const siblings of byParent.values()) {
      siblings.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
    }
    return { byParent, byId };
  }, [categories]);

  const [selected, setSelected] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [browsing, setBrowsing] = useState<string | null>(null);

  const openPicker = () => {
    // Land on the level that holds the current selection, so it's visible in context.
    setBrowsing(selected ? byId.get(selected)?.parent_id ?? null : null);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const selectedNode = selected ? byId.get(selected) : undefined;
  const selectedPath = selectedNode ? ancestorChain(byId, selected).map((c) => c.name).join(" → ") : "";
  const breadcrumb = browsing ? ancestorChain(byId, browsing) : [];
  const options = byParent.get(browsing ?? "") ?? [];

  return (
    <div className="relative">
      {/* Visually hidden but rendered (not display:none) so the browser's native
          "required" validation still targets and anchors near this field, the
          same as every other required input on this form. */}
      <input
        type="text"
        name="category_id"
        value={selected}
        onChange={() => {}}
        required
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />

      <button
        type="button"
        onClick={openPicker}
        className="flex w-full items-center gap-3 rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-left text-sm text-[#1A0A53] outline-none transition-colors hover:border-[#9e4953] focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20"
      >
        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[#f6f8fc]">
          {selectedNode?.image_url ? (
            <Image src={selectedNode.image_url} alt="" fill className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-[#94a3b8]">
              <ImageOff className="size-4" />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1 truncate">
          {selectedPath || <span className="text-[#94a3b8]">Choose a category…</span>}
        </span>
        <ChevronRight className="size-4 shrink-0 text-[#94a3b8]" />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute inset-0 bg-[#000c1a]/60 backdrop-blur-sm"
                  onClick={() => setOpen(false)}
                  aria-hidden
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="category-picker-title"
                  className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#e4e9f2] bg-[#f6f8fc] px-6 py-5">
                    <div className="min-w-0">
                      <p
                        id="category-picker-title"
                        className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]"
                      >
                        Choose a category
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-1 text-sm font-bold text-[#1A0A53]">
                        <button type="button" onClick={() => setBrowsing(null)} className="hover:text-maroon-admin">
                          All categories
                        </button>
                        {breadcrumb.map((c) => (
                          <span key={c.id} className="flex items-center gap-1">
                            <ChevronRight className="size-3.5 text-[#94a3b8]" />
                            <button
                              type="button"
                              onClick={() => setBrowsing(c.id)}
                              className="hover:text-maroon-admin"
                            >
                              {c.name}
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="grid size-9 shrink-0 place-items-center rounded-full text-[#5b6b82] transition-colors hover:bg-[#eef3fb] hover:text-[#1A0A53]"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="overflow-y-auto px-6 py-6">
                    {options.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
                        No subcategories here.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {options.map((c) => {
                          const childCount = (byParent.get(c.id) ?? []).length;
                          const isBranch = childCount > 0;
                          const isSelected = c.id === selected;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                if (isBranch) {
                                  setBrowsing(c.id);
                                } else {
                                  setSelected(c.id);
                                  setOpen(false);
                                }
                              }}
                              className={cn(
                                "group overflow-hidden rounded-2xl border text-left outline-none transition-colors",
                                isSelected
                                  ? "border-[#9e4953] ring-2 ring-[#9e4953]/20"
                                  : "border-[#e4e9f2] hover:border-[#9e4953]/60",
                                "focus-visible:border-[#9e4953] focus-visible:ring-2 focus-visible:ring-[#9e4953]/40",
                              )}
                            >
                              <div className="relative aspect-[4/3] w-full bg-[#f6f8fc]">
                                {c.image_url ? (
                                  <Image
                                    src={c.image_url}
                                    alt=""
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
                                    <ImageOff className="size-6" />
                                  </div>
                                )}
                              </div>
                              <div className="px-3 py-2.5">
                                <p className="truncate text-sm font-bold text-[#1A0A53]">{c.name}</p>
                                <p className="mt-0.5 text-xs text-[#94a3b8]">
                                  {isBranch
                                    ? `${childCount} subcategor${childCount === 1 ? "y" : "ies"}`
                                    : "Tap to select"}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
