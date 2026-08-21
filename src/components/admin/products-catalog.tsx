"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Plus, Trash2, TriangleAlert, X } from "lucide-react";
import { ProductListGrid } from "@/components/admin/product-list-grid";
import { deleteProductsAction } from "@/app/admin/(dashboard)/products/actions";
import { AdminPageHeader } from "@/components/admin/page-header";

type Product = {
  id: string;
  name: string;
  categoryName: string;
  categorySlug?: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

export function ProductsCatalog({ unfiled, filed }: { unfiled: Product[]; filed: Product[] }) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const all = [...unfiled, ...filed];

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(all.map((p) => p.id)));
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function handleDeleteSelected() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} product${ids.length === 1 ? "" : "s"}? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteProductsAction(ids);
      exitSelectMode();
    });
  }

  return (
    <div>
      <AdminPageHeader
        href="/admin/products"
        action={
          selectMode ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[#1A0A53]">
              {selected.size} selected
            </span>
            <button
              type="button"
              onClick={selectAll}
              className="rounded-full border border-[#e4e9f2] px-4 py-2 text-sm font-semibold text-[#5b6b82] transition-colors hover:bg-[#f6f8fc]"
            >
              Select all
            </button>
            <button
              type="button"
              disabled={selected.size === 0 || pending}
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
            <button
              type="button"
              onClick={exitSelectMode}
              className="rounded-full p-2.5 text-[#5b6b82] transition-colors hover:bg-[#f6f8fc]"
              aria-label="Cancel selection"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {all.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectMode(true)}
                className="rounded-full border border-[#e4e9f2] px-4 py-2 text-sm font-semibold text-[#5b6b82] transition-colors hover:bg-[#f6f8fc]"
              >
                Select
              </button>
            )}
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              <Plus className="size-4" />
              New product
            </Link>
          </div>
          )
        }
      />

      {unfiled.length > 0 && (
        <section className="mt-8">
          <div className="flex items-start gap-3 rounded-2xl border border-[#fcd9a4] bg-[#fffbf3] px-5 py-4">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-[#b45309]" />
            <div>
              <h2 className="text-sm font-bold text-[#1A0A53]">
                {unfiled.length} {unfiled.length === 1 ? "product isn't" : "products aren't"} filed in a
                category
              </h2>
              <p className="mt-1 text-sm text-[#5b6b82]">
                Nothing links to them, so they appear nowhere on the site. Edit each one and pick the
                category it belongs in.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ProductListGrid
              products={unfiled}
              selectMode={selectMode}
              selected={selected}
              onToggleSelect={toggleSelect}
            />
          </div>
        </section>
      )}

      <div className="mt-8">
        {unfiled.length > 0 && (
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-[#1A0A53]">
            Filed products
          </h2>
        )}
        <ProductListGrid
          products={filed}
          selectMode={selectMode}
          selected={selected}
          onToggleSelect={toggleSelect}
        />
      </div>
    </div>
  );
}
