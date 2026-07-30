"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { createCategoryAction, updateCategoryAction, type CategoryFormState } from "@/app/admin/(dashboard)/categories/actions";
import { CategoryImageUploadField } from "@/components/admin/category-image-upload-field";

export type CategoryRecord = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: CategoryFormState = {};

export function CategoryForm({
  category,
  defaultParentId,
}: {
  category?: CategoryRecord;
  /** Set when arriving from "New product" inside a category. */
  defaultParentId?: string;
}) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");

  // Where this sits is decided by how you got here — from the Categories list,
  // or from "New product" inside a category — and can't be changed afterwards.
  const parentId = category?.parent_id ?? defaultParentId ?? "";
  const isProduct = Boolean(parentId);
  const noun = isProduct ? "product" : "category";

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Rendered outside the category-save <form>: independent server action, no nested forms. */}
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">
          {isProduct ? "Product photo *" : "Category photo *"}
        </h2>
        <p className="mt-1.5 text-sm text-[#5b6b82]">
          {isProduct
            ? "The large photo beside this product's description on the category page, and the fallback for any subproduct without a photo of its own. Keep the subject centred — 1200 × 750px or larger looks sharpest."
            : "Shown on the category card on the public Products page. Cropped to a wide 16:10 frame, so keep the subject centred — 1200 × 750px or larger looks sharpest."}
        </p>
        <div className="mt-5">
          <CategoryImageUploadField value={imageUrl} onUploaded={setImageUrl} />
        </div>
        {!imageUrl && (
          <p className="mt-3 text-sm font-medium text-[#5b6b82]">
            Add a photo to save this {noun}.
          </p>
        )}
      </section>

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="image_url" value={imageUrl} />
        <input type="hidden" name="parent_id" value={parentId} />

        <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">
            {isProduct ? "Product details" : "Category details"}
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#1A0A53]">
                {isProduct ? "Product name *" : "Category name *"}
              </label>
              <input
                name="name"
                required
                defaultValue={category?.name ?? ""}
                placeholder={isProduct ? "e.g. Bed Sheet Products" : "e.g. Garments & Textiles"}
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Sort order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={category?.sort_order ?? 0}
                className={inputClasses}
              />
              <p className="text-xs text-[#94a3b8]">Lower numbers come first.</p>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Short description</label>
              <textarea
                name="description"
                defaultValue={category?.description ?? ""}
                rows={4}
                placeholder={
                  isProduct
                    ? "Two or three lines about this product, shown beside its photo on the category page…"
                    : "Two or three lines about this category, shown under its name on the category page…"
                }
                className={cn(inputClasses, "resize-none")}
              />
              <p className="text-xs text-[#94a3b8]">
                {isProduct
                  ? "Sits beside the product photo, under an “About " +
                    (category?.name || "…") +
                    "” heading."
                  : "Sits under the category name at the top of its page, and on its card."}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-[#e4e9f2] pt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1A0A53]">
              <input
                type="checkbox"
                name="is_active"
                value="true"
                defaultChecked={category?.is_active ?? true}
                className="size-4 accent-[#002144]"
              />
              Visible on site
            </label>
          </div>
        </section>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="flex items-center gap-2 rounded-lg bg-[#f8f1f2] px-3 py-2 text-sm font-medium text-maroon-admin" role="status">
            <Check className="size-4" />
            Saved.
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={pending || !imageUrl}
            className="inline-flex h-12 items-center justify-center rounded-full btn-navy px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {pending
              ? "Saving…"
              : category
                ? "Save changes"
                : isProduct
                  ? "Create product"
                  : "Create category"}
          </button>
        </div>
      </form>
    </div>
  );
}
