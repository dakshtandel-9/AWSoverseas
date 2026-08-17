"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { uploadProductImage } from "@/lib/storage";

export type ProductFormState = { error?: string; success?: boolean };

export type ImageUploadState = { url?: string; error?: string };

export async function uploadProductImageAction(
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
    const url = await uploadProductImage(file);
    return { url };
  } catch (err) {
    console.error("[uploadProductImageAction] Cloudinary upload failed:", err);
    return { error: "Upload failed. Please try again." };
  }
}

function readProductFields(formData: FormData) {
  const categoryId = String(formData.get("category_id") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category_id: categoryId || null,
    image_url: String(formData.get("image_url") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_active: formData.get("is_active") === "true",
  };
}

function revalidateProducts() {
  updateTag("products");
  updateTag("categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories/[id]", "page");
  // The header's category dropdown is rendered by the root layout, so it is on
  // every page, not just /products — refresh the whole tree or the nav goes
  // stale everywhere else.
  revalidatePath("/", "layout");
}

/**
 * The branch-or-leaf trigger rejects products aimed at a category that holds
 * subcategories. Say which fix the admin needs rather than "couldn't save".
 */
function messageForProductError(error: { message?: string }, fallback: string) {
  if (error.message?.includes("category_has_subcategories")) {
    return "That category holds subcategories, so a product can't sit in it directly. Pick one of its subcategories instead.";
  }
  return fallback;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const fields = readProductFields(formData);

  if (!fields.name) {
    return { error: "Product name is required." };
  }
  if (!fields.category_id) {
    return { error: "Choose a category for this product." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("products").insert(fields);

  if (error) {
    return { error: messageForProductError(error, "Couldn't create the product.") };
  }

  revalidateProducts();
  redirect(`/admin/categories/${fields.category_id}`);
}

export async function updateProductAction(
  id: string,
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const fields = readProductFields(formData);

  if (!fields.name) {
    return { error: "Product name is required." };
  }
  if (!fields.category_id) {
    return { error: "Choose a category for this product." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("products").update(fields).eq("id", id);

  if (error) {
    return { error: messageForProductError(error, "Couldn't save the product.") };
  }

  revalidateProducts();
  redirect(`/admin/categories/${fields.category_id}`);
}

export async function deleteProductAction(id: string) {
  const db = supabaseAdmin();
  await db.from("products").delete().eq("id", id);
  revalidateProducts();
}

export async function deleteProductsAction(ids: string[]) {
  if (ids.length === 0) return;
  const db = supabaseAdmin();
  await db.from("products").delete().in("id", ids);
  revalidateProducts();
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  const db = supabaseAdmin();
  await db.from("products").update({ is_active: isActive }).eq("id", id);
  revalidateProducts();
}
