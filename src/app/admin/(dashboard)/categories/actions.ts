"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { uploadCategoryImage } from "@/lib/cloudinary";

export type CategoryFormState = { error?: string; success?: boolean };

export type ImageUploadState = { url?: string; error?: string };

export async function uploadCategoryImageAction(
  _prevState: ImageUploadState,
  formData: FormData,
): Promise<ImageUploadState> {
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "That file isn't an image." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "Image is too large (max 8MB)." };
  }

  try {
    const url = await uploadCategoryImage(file);
    return { url };
  } catch (err) {
    console.error("[uploadCategoryImageAction] Cloudinary upload failed:", err);
    return { error: "Upload failed. Please try again." };
  }
}

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readCategoryFields(formData: FormData) {
  const parentId = String(formData.get("parent_id") ?? "").trim();
  const childLayout = String(formData.get("child_layout") ?? "");
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    parent_id: parentId || null,
    // Anything unrecognised falls back to the column default rather than
    // tripping the check constraint.
    child_layout: childLayout === "cards" ? "cards" : "inline",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_active: formData.get("is_active") === "true",
  };
}

/**
 * The branch-or-leaf triggers raise named exceptions; Supabase surfaces them in
 * `message`. Turn them into something an admin can act on.
 */
function messageForCategoryError(error: { code?: string; message?: string }) {
  if (error.code === "23505") {
    return "A category with that name already exists.";
  }
  // The Subcategory layout toggle writes a column added by the 2026-07-31
  // migration. Say so plainly instead of a bare "couldn't save".
  if (error.code === "PGRST204" && error.message?.includes("child_layout")) {
    return "The database is missing the child_layout column. Run supabase/migrations/2026-07-31-category-child-layout.sql in the Supabase SQL editor, then save again.";
  }
  if (error.message?.includes("parent_has_products")) {
    return "This category holds products directly, so it can't also hold subcategories. Move its products into a subcategory first, then add subcategories here.";
  }
  if (error.message?.includes("category_cycle")) {
    return "A category can't be placed inside itself.";
  }
  return "Couldn't save.";
}

/** Where to land after saving: the list the category actually lives in. */
function listPathFor(parentId: string | null) {
  return parentId ? `/admin/categories/${parentId}` : "/admin/categories";
}

function revalidateCategories() {
  updateTag("categories");
  updateTag("products");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/categories/[id]", "page");
  // The header's category dropdown is rendered by the root layout, so a new or
  // renamed category has to invalidate every page, not just /products —
  // otherwise the nav only picks it up on the catalog routes.
  revalidatePath("/", "layout");
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const fields = readCategoryFields(formData);

  if (!fields.name) {
    return { error: "Category name is required." };
  }
  if (!fields.image_url) {
    return { error: "Upload a category photo before saving." };
  }

  const db = supabaseAdmin();
  const slug = slugify(fields.name);
  const { error } = await db.from("categories").insert({ ...fields, slug });

  if (error) {
    return { error: messageForCategoryError(error) };
  }

  revalidateCategories();
  redirect(listPathFor(fields.parent_id));
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const fields = readCategoryFields(formData);

  if (!fields.name) {
    return { error: "Category name is required." };
  }
  if (!fields.image_url) {
    return { error: "Upload a category photo before saving." };
  }

  const db = supabaseAdmin();
  const slug = slugify(fields.name);
  const { error } = await db.from("categories").update({ ...fields, slug }).eq("id", id);

  if (error) {
    return { error: messageForCategoryError(error) };
  }

  revalidateCategories();
  redirect(listPathFor(fields.parent_id));
}

export async function deleteCategoryAction(id: string) {
  const db = supabaseAdmin();
  await db.from("categories").delete().eq("id", id);
  revalidateCategories();
}

export async function toggleCategoryActiveAction(id: string, isActive: boolean) {
  const db = supabaseAdmin();
  await db.from("categories").update({ is_active: isActive }).eq("id", id);
  revalidateCategories();
}
