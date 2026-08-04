import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

/** One city tile on the Contact page — a photo, its city, and the local agent's details. */
export type CityAgent = {
  id: string;
  city: string;
  image_url: string;
  agent_name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  sort_order: number;
};

const COLUMNS = "id, city, image_url, agent_name, address, phone, email, is_active, sort_order";

const getCachedCityAgents = unstable_cache(
  async (): Promise<CityAgent[]> => {
    const db = supabasePublic();
    const { data } = await db
      .from("city_agents")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return (data ?? []) as unknown as CityAgent[];
  },
  ["city-agents"],
  // Admin edits refresh this instantly via updateTag("city-agents"); the
  // window covers rows edited straight in Supabase, which never hit an action.
  { tags: ["city-agents"], revalidate: 300 },
);

/** Active tiles, in display order, for the public Contact page. */
export async function getPublicCityAgents(): Promise<CityAgent[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await getCachedCityAgents();
  } catch {
    return [];
  }
}

/** Every tile, active or not, for the admin page. */
export async function listAdminCityAgents(): Promise<CityAgent[]> {
  if (!isSupabaseConfigured()) return [];
  const db = supabaseAdmin();
  const { data } = await db
    .from("city_agents")
    .select(COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as unknown as CityAgent[];
}

/** One tile, for the edit form. */
export async function getAdminCityAgent(id: string): Promise<CityAgent | null> {
  if (!isSupabaseConfigured()) return null;
  const db = supabaseAdmin();
  const { data } = await db.from("city_agents").select(COLUMNS).eq("id", id).single();
  return (data as unknown as CityAgent) ?? null;
}
