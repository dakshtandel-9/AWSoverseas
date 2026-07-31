"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { createCategoryAction, updateCategoryAction, type CategoryFormState } from "@/app/admin/(dashboard)/categories/actions";
import { CategoryImageUploadField } from "@/components/admin/category-image-upload-field";
import type { ChildLayout } from "@/lib/category-data";

export type CategoryRecord = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  child_layout: ChildLayout;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: CategoryFormState = {};

/**
 * Miniature of what each layout produces, so the choice reads at a glance
 * instead of having to be pictured from the description.
 */
function LayoutPreview({ variant }: { variant: ChildLayout }) {
  const block = "rounded-[3px] bg-current";

  if (variant === "cards") {
    return (
      <div aria-hidden className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex w-9 flex-col gap-1 rounded-[5px] border border-current p-1">
            <div className={cn(block, "h-5 opacity-30")} />
            <div className={cn(block, "h-1 w-6 opacity-60")} />
            <div className={cn(block, "h-1 w-4 opacity-25")} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="flex w-[126px] flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <div className="flex flex-1 flex-col gap-1">
          <div className={cn(block, "h-1 w-10 opacity-60")} />
          <div className={cn(block, "h-1 opacity-25")} />
          <div className={cn(block, "h-1 w-8 opacity-25")} />
        </div>
        <div className={cn(block, "h-8 w-10 opacity-30")} />
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={cn(block, "h-4 flex-1 opacity-30")} />
        ))}
      </div>
    </div>
  );
}

const LAYOUTS: { value: ChildLayout; label: string; hint: string }[] = [
  {
    value: "inline",
    label: "Opened out",
    hint: "Each subcategory's products are listed on this page, one section after another.",
  },
  {
    value: "cards",
    label: "Cards",
    hint: "Each subcategory gets a card that opens its own page.",
  },
];

export function CategoryForm({
  category,
  defaultParentId,
}: {
  category?: CategoryRecord;
  /** Set when arriving from "New subcategory" inside a category. */
  defaultParentId?: string;
}) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");
  const [childLayout, setChildLayout] = useState<ChildLayout>(category?.child_layout ?? "inline");

  // Where this sits is decided by how you got here — from the Categories list,
  // or from "New subcategory" inside a category — and can't be changed
  // afterwards. A subcategory is the same kind of thing as a category, just
  // nested; the wording only shifts to keep the two straight on screen.
  const parentId = category?.parent_id ?? defaultParentId ?? "";
  const isSub = Boolean(parentId);
  const noun = isSub ? "subcategory" : "category";
  const Noun = isSub ? "Subcategory" : "Category";

  return (
    <div className="mt-8 flex flex-col gap-8">
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">Subcategory layout</h2>
        <p className="mt-1.5 text-sm text-[#5b6b82]">
          How the subcategories inside this {noun} appear on its page.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {LAYOUTS.map((option) => {
            const selected = childLayout === option.value;
            return (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-colors",
                  selected
                    ? "border-[#9e4953] bg-[#fdf8f8] ring-2 ring-[#9e4953]/20"
                    : "border-[#e4e9f2] hover:bg-[#f6f8fc]",
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Sits above the save <form>, like the photo field, so the
                      value travels in the hidden input inside it. */}
                  <input
                    type="radio"
                    name="child_layout_choice"
                    value={option.value}
                    checked={selected}
                    onChange={() => setChildLayout(option.value)}
                    className="mt-0.5 size-4 shrink-0 accent-[#9e4953]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#1A0A53]">{option.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#5b6b82]">{option.hint}</p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex justify-center rounded-lg px-3 py-4",
                    selected ? "bg-white text-[#9e4953]" : "bg-[#f6f8fc] text-[#94a3b8]",
                  )}
                >
                  <LayoutPreview variant={option.value} />
                </div>
              </label>
            );
          })}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">
          Applies to subcategories that hold products. One that holds its own subcategories always
          gets a card — there is no product grid to open out.
        </p>
      </section>

      {/* Rendered outside the category-save <form>: independent server action, no nested forms. */}
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">{Noun} photo *</h2>
        <p className="mt-1.5 text-sm text-[#5b6b82]">
          {isSub
            ? "Shown on this subcategory's card, and used as the fallback for any product inside it without a photo of its own. Cropped to a wide 16:10 frame, so keep the subject centred — 1200 × 750px or larger looks sharpest."
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
        <input type="hidden" name="child_layout" value={childLayout} />

        <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">{Noun} details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#1A0A53]">{Noun} name *</label>
              <input
                name="name"
                required
                defaultValue={category?.name ?? ""}
                placeholder={isSub ? "e.g. Namkeen Snacks" : "e.g. Garments & Textiles"}
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
                placeholder={`Two or three lines about this ${noun}, shown under its name on its page…`}
                className={cn(inputClasses, "resize-none")}
              />
              <p className="text-xs text-[#94a3b8]">
                Sits under the name at the top of its page, and on its card.
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
            {pending ? "Saving…" : category ? "Save changes" : `Create ${noun}`}
          </button>
        </div>
      </form>
    </div>
  );
}
