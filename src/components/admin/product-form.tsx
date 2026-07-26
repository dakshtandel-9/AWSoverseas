"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { createProductAction, updateProductAction, type ProductFormState } from "@/app/admin/(dashboard)/products/actions";
import { ProductImageUploadField } from "@/components/admin/product-image-upload-field";

export type ProductRecord = {
  id: string;
  name: string;
  description: string;
  category_id: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
};

export type CategoryOption = { id: string; name: string };

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: ProductFormState = {};

export function ProductForm({
  product,
  categories,
  defaultCategoryId,
}: {
  product?: ProductRecord;
  /** Leaf categories only — ones that hold subcategories can't take products. */
  categories: CategoryOption[];
  /** Preselected when arriving from "New product" inside a category. */
  defaultCategoryId?: string;
}) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Rendered outside the product-save <form>: independent server action, no nested forms. */}
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#002144]">Product photo</h2>
        <p className="mt-1.5 text-sm text-[#5b6b82]">
          Shown on the product card. Cropped to a square, so keep the subject centred —
          1200 × 1200px or larger looks sharpest.
        </p>
        <div className="mt-5">
          <ProductImageUploadField value={imageUrl} onUploaded={setImageUrl} />
        </div>
      </section>

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="image_url" value={imageUrl} />

        <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#002144]">Product details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#002144]">Name *</label>
              <input name="name" required defaultValue={product?.name ??""} className={inputClasses} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">Category</label>
              <select
                name="category_id"
                defaultValue={product?.category_id ?? defaultCategoryId ?? ""}
                className={inputClasses}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8]">
                Only categories without subcategories are listed — products go in the deepest one.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">Sort order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={product?.sort_order ?? 0}
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#002144]">Description</label>
              <textarea
                name="description"
                defaultValue={product?.description ?? ""}
                rows={4}
                placeholder="What it is, materials, sizing, notes for the enquiry team…"
                className={cn(inputClasses, "resize-none")}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-[#e4e9f2] pt-5">
            <label className="flex items-center gap-2 text-sm font-medium text-[#002144]">
              <input
                type="checkbox"
                name="is_active"
                value="true"
                defaultChecked={product?.is_active ?? true}
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
            disabled={pending}
            className="inline-flex h-12 items-center justify-center rounded-full btn-navy px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {pending ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}
