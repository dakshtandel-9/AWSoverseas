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
 * A category holds subcategories or products, never both — so which one it
 * already has decides what an admin is still allowed to add to it.
 */
export type CategoryKind = "empty" | "branch" | "leaf";

export function kindOf(row: { childCount: number; productCount: number }): CategoryKind {
  if (row.childCount > 0) return "branch";
  if (row.productCount > 0) return "leaf";
  return "empty";
}

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

/** Whether this category can still take products directly (leaf or untouched). */
export async function acceptsProducts(id: string): Promise<boolean> {
  const db = supabaseAdmin();
  const { count } = await db
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id);
  return (count ?? 0) === 0;
}

/**
 * Categories that may be chosen as a parent: anything not already holding
 * products. When editing, `excludeId` and its descendants drop out — a category
 * can't be moved inside itself.
 */
export async function listParentOptions(excludeId?: string): Promise<{ id: string; name: string }[]> {
  const db = supabaseAdmin();
  const [{ data }, { data: productRows }] = await Promise.all([
    db
      .from("categories")
      .select("id, name, parent_id, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    db.from("products").select("category_id").not("category_id", "is", null),
  ]);

  const rows = data ?? [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  const holdsProducts = new Set((productRows ?? []).map((p) => p.category_id as string));

  const isDescendantOfExcluded = (id: string) => {
    if (!excludeId) return false;
    let cursor: string | null = id;
    let hops = 0;
    while (cursor && hops < 100) {
      if (cursor === excludeId) return true;
      cursor = byId.get(cursor)?.parent_id ?? null;
      hops += 1;
    }
    return false;
  };

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
    .filter((r) => !holdsProducts.has(r.id) && !isDescendantOfExcluded(r.id))
    .map((r) => ({ id: r.id, name: pathOf(r.id) }))
    .sort((a, b) => a.name.localeCompare(b.name));
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
