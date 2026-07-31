import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

/** One office card — a name, an address, up to two phone numbers and an email. */
export type OfficeLocation = {
  id: string;
  group_id: string;
  name: string;
  address: string;
  phone_1: string;
  phone_2: string;
  email: string;
  map_url: string;
  is_active: boolean;
  sort_order: number;
};

/** A heading on the Contact page — "India Offices", "International Offices", or anything the admin adds. */
export type OfficeGroup = {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
};

export type OfficeGroupWithOffices = OfficeGroup & { offices: OfficeLocation[] };

const GROUP_COLUMNS = "id, title, description, is_active, sort_order";
const OFFICE_COLUMNS =
  "id, group_id, name, address, phone_1, phone_2, email, map_url, is_active, sort_order";

/** Attaches each office to its group, dropping offices whose group is gone or hidden. */
function groupOffices(groups: OfficeGroup[], offices: OfficeLocation[]): OfficeGroupWithOffices[] {
  return groups.map((group) => ({
    ...group,
    offices: offices.filter((office) => office.group_id === group.id),
  }));
}

const getCachedOfficeGroups = unstable_cache(
  async (): Promise<OfficeGroupWithOffices[]> => {
    const db = supabasePublic();
    const [{ data: groups }, { data: offices }] = await Promise.all([
      db
        .from("office_groups")
        .select(GROUP_COLUMNS)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      db
        .from("office_locations")
        .select(OFFICE_COLUMNS)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    return groupOffices(
      (groups ?? []) as unknown as OfficeGroup[],
      (offices ?? []) as unknown as OfficeLocation[],
    );
  },
  ["office-locations"],
  // Admin edits refresh this instantly via updateTag("office-locations"); the
  // window covers rows edited straight in Supabase, which never hit an action.
  { tags: ["office-locations"], revalidate: 300 },
);

/**
 * Groups shown on the Contact page, offices attached, in display order. A group
 * with no offices is dropped — an empty heading has nothing to say.
 */
export async function getPublicOfficeGroups(): Promise<OfficeGroupWithOffices[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const groups = await getCachedOfficeGroups();
    return groups.filter((group) => group.offices.length > 0);
  } catch {
    return [];
  }
}

/** Every group and office, active or not, for the admin page. */
export async function listAdminOfficeGroups(): Promise<OfficeGroupWithOffices[]> {
  if (!isSupabaseConfigured()) return [];
  const db = supabaseAdmin();
  const [{ data: groups }, { data: offices }] = await Promise.all([
    db
      .from("office_groups")
      .select(GROUP_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    db
      .from("office_locations")
      .select(OFFICE_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  return groupOffices(
    (groups ?? []) as unknown as OfficeGroup[],
    (offices ?? []) as unknown as OfficeLocation[],
  );
}

/** One office, for the edit form. */
export async function getAdminOffice(id: string): Promise<OfficeLocation | null> {
  if (!isSupabaseConfigured()) return null;
  const db = supabaseAdmin();
  const { data } = await db.from("office_locations").select(OFFICE_COLUMNS).eq("id", id).single();
  return (data as unknown as OfficeLocation) ?? null;
}
