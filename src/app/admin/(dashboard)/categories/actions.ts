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
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_active: formData.get("is_active") === "true",
  };
}

function revalidateCategories() {
  updateTag("categories");
  updateTag("products");
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const fields = readCategoryFields(formData);

  if (!fields.name) {
    return { error: "Category name is required." };
  }

  const db = supabaseAdmin();
  const slug = slugify(fields.name);
  const { error } = await db.from("categories").insert({ ...fields, slug });

  if (error) {
    return { error: error.code === "23505" ? "A category with that name already exists." : "Couldn't create the category." };
  }

  revalidateCategories();
  redirect("/admin/categories");
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

  const db = supabaseAdmin();
  const slug = slugify(fields.name);
  const { error } = await db.from("categories").update({ ...fields, slug }).eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "A category with that name already exists." : "Couldn't save the category." };
  }

  revalidateCategories();
  redirect("/admin/categories");
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
