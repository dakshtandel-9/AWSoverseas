"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { Pencil, Trash2, ImageOff, ExternalLink, FolderTree, Package } from "lucide-react";
import { cn } from "@/lib/cn";
import { deleteCategoryAction, toggleCategoryActiveAction } from "@/app/admin/(dashboard)/categories/actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  childCount: number;
  productCount: number;
};

/** What the category holds today, which is also what it can hold from now on. */
function holdingLabel({ childCount, productCount }: Category) {
  if (childCount > 0) {
    return `${childCount} ${childCount === 1 ? "subcategory" : "subcategories"}`;
  }
  if (productCount > 0) {
    return `${productCount} ${productCount === 1 ? "product" : "products"}`;
  }
  return "Empty";
}

export function CategoryListGrid({ categories }: { categories: Category[] }) {
  const [pending, startTransition] = useTransition();

  if (categories.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
        No categories yet — add your first one.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const isBranch = category.childCount > 0;

        return (
          <div
            key={category.id}
            className="overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white"
          >
            <div className="relative aspect-[4/3] w-full bg-[#f6f8fc]">
              <Link href={`/admin/categories/${category.id}`} className="block h-full w-full">
                {category.image_url ? (
                  <Image src={category.image_url} alt="" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
                    <ImageOff className="size-6" />
                  </div>
                )}
              </Link>

              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => toggleCategoryActiveAction(category.id, !category.is_active))}
                className={cn(
                  "absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50",
                  category.is_active ? "bg-[#f8f1f2] text-maroon-admin" : "bg-white text-[#94a3b8]",
                )}
              >
                {category.is_active ? "Visible" : "Hidden"}
              </button>
            </div>

            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/categories/${category.id}`}
                  className="block truncate text-sm font-bold text-[#1A0A53] hover:text-maroon-admin"
                >
                  {category.name}
                </Link>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-[#94a3b8]">
                  {isBranch ? <FolderTree className="size-3" /> : <Package className="size-3" />}
                  {holdingLabel(category)}
                </p>
              </div>

              <Link
                href={`/products/${category.slug}`}
                target="_blank"
                className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-[#f6f8fc]"
                aria-label="View on site"
              >
                <ExternalLink className="size-4" />
              </Link>
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-[#f6f8fc]"
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </Link>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  const warning = isBranch
                    ? `Delete "${category.name}"? Its ${category.childCount} ${category.childCount === 1 ? "subcategory" : "subcategories"} and everything inside them will be deleted too. This can't be undone.`
                    : `Delete "${category.name}"? Products in it won't be deleted, but will lose this category. This can't be undone.`;
                  if (confirm(warning)) {
                    startTransition(() => deleteCategoryAction(category.id));
                  }
                }}
                className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
