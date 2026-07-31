import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";

/**
 * How a category lays out the subcategories inside it. Admin-chosen, per
 * category — see `rendersAsCard`.
 */
export type ChildLayout = "cards" | "inline";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  child_layout: ChildLayout;
};

const BASE_COLUMNS = "id, name, slug, description, image_url, parent_id";

const getCachedCategories = unstable_cache(
  async (): Promise<PublicCategory[]> => {
    const db = supabasePublic();
    const read = (columns: string) =>
      db
        .from("categories")
        .select(columns)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    const { data, error } = await read(`${BASE_COLUMNS}, child_layout`);
    if (!error) return (data ?? []) as unknown as PublicCategory[];

    // child_layout arrives with the 2026-07-31 migration. Until that has been
    // run against this database, fall back to the columns that do exist rather
    // than failing the whole read and blanking the catalog.
    const { data: legacy } = await read(BASE_COLUMNS);
    return ((legacy ?? []) as unknown as Omit<PublicCategory, "child_layout">[]).map((c) => ({
      ...c,
      child_layout: "inline" as const,
    }));
  },
  ["categories"],
  // Admin edits refresh this instantly via updateTag("categories"). The window
  // is the safety net for changes that never go through a Server Action — a
  // seed script, a row edited straight in Supabase — which would otherwise sit
  // behind a cache that never expires.
  { tags: ["categories"], revalidate: 300 },
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

export async function getActiveCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  const categories = await getActiveCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export type CategoryNode = PublicCategory & { children: CategoryNode[] };

/**
 * Whether a subcategory renders as a clickable card on its parent's page rather
 * than being opened out inline (its own About block plus its product grid).
 *
 * The parent's admin-chosen `child_layout` decides, with one exception: a
 * subcategory that holds its own subcategories always gets a card, because
 * there is no product grid to open out — inlining it would render an empty one.
 *
 * This is a layout rule only. Every active category has a real page either way,
 * so it must never be used to decide what the nav lists — the header shows the
 * whole tree.
 */
export function rendersAsCard(
  child: { children: unknown[] },
  parentLayout: ChildLayout,
): boolean {
  return child.children.length > 0 || parentLayout === "cards";
}

/**
 * All active categories as a root-first tree (via `parent_id`), for the header
 * dropdown — nesting mirrors the DB's arbitrary-depth branch/leaf rule, so a
 * subcategory with its own children gets its own `children` array too.
 */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const categories = await getActiveCategories();
  const byId = new Map<string, CategoryNode>(
    categories.map((c) => [c.id, { ...c, children: [] }]),
  );

  const roots: CategoryNode[] = [];
  for (const category of categories) {
    const node = byId.get(category.id)!;
    if (category.parent_id && byId.has(category.parent_id)) {
      byId.get(category.parent_id)!.children.push(node);
    } else if (!category.parent_id) {
      roots.push(node);
    }
  }

  return roots;
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
