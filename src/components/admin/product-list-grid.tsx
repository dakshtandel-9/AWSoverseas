"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { Pencil, Trash2, ImageOff, ExternalLink, TriangleAlert, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { deleteProductAction, toggleProductActiveAction } from "@/app/admin/(dashboard)/products/actions";

type Product = {
  id: string;
  name: string;
  /** Full path of the category it sits in; empty when it isn't filed anywhere. */
  categoryName: string;
  /** Slug of that category, for the "view on site" link. */
  categorySlug?: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

type ProductListGridProps = {
  products: Product[];
  /** When on, cards toggle selection instead of exposing their per-item actions. */
  selectMode?: boolean;
  selected?: Set<string>;
  onToggleSelect?: (id: string) => void;
};

export function ProductListGrid({ products, selectMode = false, selected, onToggleSelect }: ProductListGridProps) {
  const [pending, startTransition] = useTransition();

  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
        No products yet — add your first one.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const isSelected = selected?.has(product.id) ?? false;
        return (
          <div
            key={product.id}
            role={selectMode ? "button" : undefined}
            tabIndex={selectMode ? 0 : undefined}
            onClick={selectMode ? () => onToggleSelect?.(product.id) : undefined}
            onKeyDown={
              selectMode
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggleSelect?.(product.id);
                    }
                  }
                : undefined
            }
            className={cn(
              "overflow-hidden rounded-2xl border bg-white transition-colors",
              selectMode ? "cursor-pointer" : "",
              isSelected ? "border-maroon-admin ring-2 ring-maroon-admin/30" : "border-[#e4e9f2]",
            )}
          >
            <div className="relative aspect-[4/3] w-full bg-[#f6f8fc]">
              {product.image_url ? (
                <Image src={product.image_url} alt="" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
                  <ImageOff className="size-6" />
                </div>
              )}

              {selectMode ? (
                <span
                  className={cn(
                    "absolute left-3 top-3 flex size-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors",
                    isSelected
                      ? "border-maroon-admin bg-maroon-admin text-white"
                      : "border-white bg-white/70 text-transparent",
                  )}
                  aria-hidden="true"
                >
                  <Check className="size-4" />
                </span>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => toggleProductActiveAction(product.id, !product.is_active))}
                  className={cn(
                    "absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50",
                    product.is_active ? "bg-[#f8f1f2] text-maroon-admin" : "bg-white text-[#94a3b8]",
                  )}
                >
                  {product.is_active ? "Visible" : "Hidden"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#1A0A53]">{product.name}</p>
                {product.categoryName ? (
                  <p className="truncate text-xs text-[#94a3b8]">{product.categoryName}</p>
                ) : (
                  <p className="flex items-center gap-1 truncate text-xs font-semibold text-[#b45309]">
                    <TriangleAlert className="size-3 shrink-0" />
                    Not filed — hidden from the site
                  </p>
                )}
              </div>

              {!selectMode && (
                <>
                  {product.categorySlug && (
                    <Link
                      href={`/products/${product.categorySlug}`}
                      target="_blank"
                      className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-[#f6f8fc]"
                      aria-label="View on site"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-[#f6f8fc]"
                    aria-label="Edit"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (confirm(`Delete "${product.name}"? This can't be undone.`)) {
                        startTransition(() => deleteProductAction(product.id));
                      }
                    }}
                    className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
