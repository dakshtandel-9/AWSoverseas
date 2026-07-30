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
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    parent_id: parentId || null,
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
  if (error.message?.includes("parent_has_products")) {
    return "This category has subproducts filed directly in it, so it can't also hold products. Move those subproducts into a product first — open the category and edit each one under “Filed directly in this category”.";
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
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
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
