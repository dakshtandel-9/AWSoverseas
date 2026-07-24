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
  sort_order: number;
  is_active: boolean;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: CategoryFormState = {};

export function CategoryForm({ category }: { category?: CategoryRecord }) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Rendered outside the category-save <form>: independent server action, no nested forms. */}
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#002144]">Category photo</h2>
        <div className="mt-5">
          <CategoryImageUploadField value={imageUrl} onUploaded={setImageUrl} />
        </div>
      </section>

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="image_url" value={imageUrl} />

        <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#002144]">Category details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#002144]">Name *</label>
              <input name="name" required defaultValue={category?.name ?? ""} placeholder="e.g. Handicrafts" className={inputClasses} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">Sort order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={category?.sort_order ?? 0}
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#002144]">Short description</label>
              <textarea
                name="description"
                defaultValue={category?.description ?? ""}
                rows={3}
                placeholder="Shown on the category card and its detail page…"
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
            disabled={pending}
            className="inline-flex h-12 items-center justify-center rounded-full btn-navy px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {pending ? "Saving…" : category ? "Save changes" : "Create category"}
          </button>
        </div>
      </form>
    </div>
  );
}
