import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type PublicProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
};

const getCachedProducts = unstable_cache(
  async (): Promise<PublicProduct[]> => {
    const db = supabasePublic();
    const { data } = await db
      .from("products")
      .select("id, name, description, category, image_url")
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
