import { supabaseAdmin } from "@/lib/supabase/server";

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
  /** Direct subcategories. */
  childCount: number;
  /** Products attached directly to this category. */
  productCount: number;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  is_active: boolean;
  sort_order: number;
};

/**
 * Children of `parentId` (or the top level when null), each with the counts the
 * list needs to show what it holds and what can still be added to it.
 */
export async function listAdminCategories(parentId: string | null): Promise<AdminCategoryRow[]> {
  const db = supabaseAdmin();

  const query = db
    .from("categories")
    .select("id, name, slug, image_url, parent_id, is_active, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const [{ data: rows }, { data: childRows }, { data: productRows }] = await Promise.all([
    parentId ? query.eq("parent_id", parentId) : query.is("parent_id", null),
    db.from("categories").select("parent_id").not("parent_id", "is", null),
    db.from("products").select("category_id").not("category_id", "is", null),
  ]);

  const childCounts = new Map<string, number>();
  for (const row of childRows ?? []) {
    if (!row.parent_id) continue;
    childCounts.set(row.parent_id, (childCounts.get(row.parent_id) ?? 0) + 1);
  }

  const productCounts = new Map<string, number>();
  for (const row of productRows ?? []) {
    if (!row.category_id) continue;
    productCounts.set(row.category_id, (productCounts.get(row.category_id) ?? 0) + 1);
  }

  return (rows ?? []).map((c) => ({
    ...c,
    childCount: childCounts.get(c.id) ?? 0,
    productCount: productCounts.get(c.id) ?? 0,
  }));
}

export async function getAdminCategory(id: string): Promise<AdminCategory | null> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("categories")
    .select("id, name, slug, description, image_url, parent_id, is_active, sort_order")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

/** Root-first chain down to `id`, inclusive — the admin breadcrumb. */
export async function getAdminTrail(id: string): Promise<AdminCategory[]> {
  const trail: AdminCategory[] = [];
  let cursor: string | null = id;

  while (cursor && trail.length < 100) {
    const category: AdminCategory | null = await getAdminCategory(cursor);
    if (!category) break;
    trail.unshift(category);
    cursor = category.parent_id;
  }

  return trail;
}

/**
 * Categories a product may be filed under: leaves only, labelled with their full
 * path so "Cotton" from two different parents stay distinguishable.
 */
export async function listProductTargets(): Promise<{ id: string; name: string }[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("categories")
    .select("id, name, parent_id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  const parents = new Set(rows.map((r) => r.parent_id).filter(Boolean) as string[]);
  const byId = new Map(rows.map((r) => [r.id, r]));

  const pathOf = (id: string) => {
    const parts: string[] = [];
    let cursor: string | null = id;
    while (cursor && parts.length < 100) {
      const row = byId.get(cursor);
      if (!row) break;
      parts.unshift(row.name);
      cursor = row.parent_id;
    }
    return parts.join(" → ");
  };

  return rows
    .filter((r) => !parents.has(r.id))
    .map((r) => ({ id: r.id, name: pathOf(r.id) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
