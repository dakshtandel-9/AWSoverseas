import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
};

const getCachedCategories = unstable_cache(
  async (): Promise<PublicCategory[]> => {
    const db = supabasePublic();
    const { data } = await db
      .from("categories")
      .select("id, name, slug, description, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    return data ?? [];
  },
  ["categories"],
  { tags: ["categories"] },
);

export async function getActiveCategories(): Promise<PublicCategory[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await getCachedCategories();
  } catch {
    return [];
  }
}

export async function getActiveCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  const categories = await getActiveCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}
