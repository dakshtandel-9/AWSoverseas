import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getActiveCategories, type PublicCategory } from "@/lib/category-data";

type ProductRow = {
  id: string;
  name: string;
  description: string;
  category_id: string | null;
  image_url: string;
};

export type PublicProduct = ProductRow & {
  /**
   * What the product card actually shows: the product's own photo, or the
   * borrowed one below. Empty only when nothing up the chain has a photo.
   */
  display_image_url: string;
};

const getCachedProducts = unstable_cache(
  async (): Promise<ProductRow[]> => {
    const db = supabasePublic();
    const { data } = await db
      .from("products")
      .select("id, name, description, category_id, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data ?? [];
  },
  ["products"],
  // Same as categories: updateTag("products") covers admin edits, the window
  // covers anything written directly to the database.
  { tags: ["products"], revalidate: 300 },
);

/**
 * A product photo is optional, a category photo isn't — so a product without
 * one borrows from the category it sits in, walking up to the nearest ancestor
 * that has a photo. In practice that's the subcategory it was filed under.
 */
function borrowedImage(product: ProductRow, byId: Map<string, PublicCategory>): string {
  if (product.image_url) return product.image_url;

  const seen = new Set<string>();
  let cursor = product.category_id;

  while (cursor && !seen.has(cursor)) {
    seen.add(cursor);
    const category = byId.get(cursor);
    if (!category) break;
    if (category.image_url) return category.image_url;
    cursor = category.parent_id;
  }

  return "";
}

export async function getActiveProducts(): Promise<PublicProduct[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const [rows, categories] = await Promise.all([getCachedProducts(), getActiveCategories()]);
    const byId = new Map(categories.map((c) => [c.id, c]));
    return rows.map((row) => ({ ...row, display_image_url: borrowedImage(row, byId) }));
  } catch {
    return [];
  }
}

export async function getActiveProductsByCategory(categoryId: string): Promise<PublicProduct[]> {
  const products = await getActiveProducts();
  return products.filter((p) => p.category_id === categoryId);
}
