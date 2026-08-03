import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

/** One footer contact column — a heading plus its own address, phone and email. */
export type FooterContact = {
  id: string;
  headline: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  sort_order: number;
};

const COLUMNS = "id, headline, address, phone, email, is_active, sort_order";

const getCachedFooterContacts = unstable_cache(
  async (): Promise<FooterContact[]> => {
    const db = supabasePublic();
    const { data } = await db
      .from("footer_contacts")
      .select(COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return (data ?? []) as unknown as FooterContact[];
  },
  ["footer-contacts"],
  // Admin edits refresh this instantly via updateTag("footer-contacts"); the
  // window covers rows edited straight in Supabase, which never hit an action.
  { tags: ["footer-contacts"], revalidate: 300 },
);

/** Active columns, in display order, for the public footer. */
export async function getPublicFooterContacts(): Promise<FooterContact[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await getCachedFooterContacts();
  } catch {
    return [];
  }
}

/** Every column, active or not, for the admin page. */
export async function listAdminFooterContacts(): Promise<FooterContact[]> {
  if (!isSupabaseConfigured()) return [];
  const db = supabaseAdmin();
  const { data } = await db
    .from("footer_contacts")
    .select(COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as unknown as FooterContact[];
}

/** One column, for the edit form. */
export async function getAdminFooterContact(id: string): Promise<FooterContact | null> {
  if (!isSupabaseConfigured()) return null;
  const db = supabaseAdmin();
  const { data } = await db.from("footer_contacts").select(COLUMNS).eq("id", id).single();
  return (data as unknown as FooterContact) ?? null;
}
