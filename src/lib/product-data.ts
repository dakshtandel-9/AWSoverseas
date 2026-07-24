import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type PublicProduct = {
  id: string;
  name: string;
  description: string;
  category_id: string | null;
  image_url: string;
};

const getCachedProducts = unstable_cache(
  async (): Promise<PublicProduct[]> => {
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
  { tags: ["products"] },
);

export async function getActiveProducts(): Promise<PublicProduct[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await getCachedProducts();
  } catch {
    return [];
  }
}

export async function getActiveProductsByCategory(categoryId: string): Promise<PublicProduct[]> {
  const products = await getActiveProducts();
  return products.filter((p) => p.category_id === categoryId);
}
