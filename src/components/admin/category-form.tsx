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
  badge: string;
  about_body: string;
  about_image_url: string;
  about_caption: string;
};

export type ParentOption = { id: string; name: string };

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: CategoryFormState = {};

export function CategoryForm({
  category,
  parentOptions,
  defaultParentId,
}: {
  category?: CategoryRecord;
  parentOptions: ParentOption[];
  /** Preselected when arriving from "New subcategory" inside a category. */
  defaultParentId?: string;
}) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");
  const [aboutImageUrl, setAboutImageUrl] = useState(category?.about_image_url ?? "");

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Rendered outside the category-save <form>: independent server action, no nested forms. */}
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">Category photo *</h2>
        <p className="mt-1.5 text-sm text-[#5b6b82]">
          Shown on the category card, and on any product in it that has no photo of its own.
          Cropped to a wide 16:10 frame, so keep the subject centred — 1200 × 750px or larger
          looks sharpest.
        </p>
        <div className="mt-5">
          <CategoryImageUploadField value={imageUrl} onUploaded={setImageUrl} />
        </div>
        {!imageUrl && (
          <p className="mt-3 text-sm font-medium text-[#5b6b82]">
            Add a photo to save this category.
          </p>
        )}
      </section>

      {/* Second standalone upload, same reason as above — its own action. */}
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">About photo</h2>
        <p className="mt-1.5 text-sm text-[#5b6b82]">
          The large photo beside the About text on the category page. Leave it empty to reuse the
          category photo above. Shown in a 4:3 frame, with the caption laid over its lower-left
          corner.
        </p>
        <div className="mt-5">
          <CategoryImageUploadField
            value={aboutImageUrl}
            onUploaded={setAboutImageUrl}
            label="Click to upload an About photo"
            hint="1600 × 1200px or larger, JPG or PNG under 8MB"
          />
        </div>
      </section>

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="image_url" value={imageUrl} />
        <input type="hidden" name="about_image_url" value={aboutImageUrl} />

        <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">Category details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Name *</label>
              <input name="name" required defaultValue={category?.name ?? ""} placeholder="e.g. Handicrafts" className={inputClasses} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Sits inside</label>
              <select
                name="parent_id"
                defaultValue={category?.parent_id ?? defaultParentId ?? ""}
                className={inputClasses}
              >
                <option value="">Top level</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#94a3b8]">
                Categories that already hold products aren&apos;t listed — they can&apos;t also hold subcategories.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Sort order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={category?.sort_order ?? 0}
                className={inputClasses}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Short description</label>
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

        <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#1A0A53]">About block</h2>
          <p className="mt-1.5 text-sm text-[#5b6b82]">
            Opens the category page, and is reused wherever this category is shown inside its
            parent. The heading reads &ldquo;About Our {category?.name || "…"}&rdquo; and is built
            from the name above.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Badge</label>
              <input
                name="badge"
                defaultValue={category?.badge ?? ""}
                placeholder="e.g. 🍊 Fresh Fruits"
                className={inputClasses}
              />
              <p className="text-xs text-[#94a3b8]">
                The small pill above the heading. Emoji are fine. Leave empty to hide it.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1A0A53]">Photo caption</label>
              <input
                name="about_caption"
                defaultValue={category?.about_caption ?? ""}
                placeholder="e.g. Farm Fresh"
                className={inputClasses}
              />
              <p className="text-xs text-[#94a3b8]">
                Sits over the About photo. Two or three words read best.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#1A0A53]">About text</label>
              <textarea
                name="about_body"
                defaultValue={category?.about_body ?? ""}
                rows={8}
                placeholder={
                  "India is known for its diverse range of food products…\n\nWe source directly from farmers and trusted manufacturers…"
                }
                className={cn(inputClasses, "resize-y leading-relaxed")}
              />
              <p className="text-xs text-[#94a3b8]">
                Leave a blank line between paragraphs. Falls back to the short description when
                empty.
              </p>
            </div>
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
            {pending ? "Saving…" : category ? "Save changes" : "Create category"}
          </button>
        </div>
      </form>
    </div>
  );
}
