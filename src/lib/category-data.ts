import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
};

const getCachedCategories = unstable_cache(
  async (): Promise<PublicCategory[]> => {
    const db = supabasePublic();
    const { data } = await db
      .from("categories")
      .select("id, name, slug, description, image_url, parent_id")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data ?? [];
  },
  ["categories"],
  { tags: ["categories"] },
);

/** Every active category, at every depth, in display order. */
export async function getActiveCategories(): Promise<PublicCategory[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await getCachedCategories();
  } catch {
    return [];
  }
}

/**
 * Only the categories shown on the /products grid. A category whose parent is
 * hidden is unreachable, so treat it as hidden too rather than surfacing it at
 * the root.
 */
export async function getRootCategories(): Promise<PublicCategory[]> {
  const categories = await getActiveCategories();
  return categories.filter((c) => c.parent_id === null);
}

export async function getSubcategories(parentId: string): Promise<PublicCategory[]> {
  const categories = await getActiveCategories();
  return categories.filter((c) => c.parent_id === parentId);
}

export async function getActiveCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  const categories = await getActiveCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

/**
 * Root-first chain down to `category`, inclusive — the breadcrumb on a category
 * page. Stops if a link is missing (a hidden ancestor), returning what it has.
 */
export async function getCategoryTrail(category: PublicCategory): Promise<PublicCategory[]> {
  const categories = await getActiveCategories();
  const byId = new Map(categories.map((c) => [c.id, c]));

  const trail: PublicCategory[] = [category];
  let cursor = category.parent_id;

  while (cursor && trail.length < 100) {
    const parent = byId.get(cursor);
    if (!parent) break;
    trail.unshift(parent);
    cursor = parent.parent_id;
  }

  return trail;
}
