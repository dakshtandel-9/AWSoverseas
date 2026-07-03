import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { contact } from "@/lib/content";

export type SiteSettings = {
  phone1: string;
  phone2: string;
  email: string;
  whatsappNumber: string;
  address: string;
};

/** Fallback values sourced from the original static JSON, used only until Supabase is configured. */
function fallbackSettings(): SiteSettings {
  const phone = contact.contactInfo?.items?.find((i: { type: string }) => i.type === "Phone")?.value ?? "";
  const email = contact.contactInfo?.items?.find((i: { type: string }) => i.type === "Email")?.value ?? "";
  const office = contact.officeLocations?.locations?.[0];
  const address = office ? `${office.address}, ${office.city}, ${office.country}` : "";
  return { phone1: phone, phone2: "", email, whatsappNumber: "", address };
}

const getCachedSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const db = supabasePublic();
    const { data } = await db.from("site_settings").select("*").eq("id", 1).single();
    if (!data) return fallbackSettings();
    return {
      phone1: data.phone_1 || "",
      phone2: data.phone_2 || "",
      email: data.email || "",
      whatsappNumber: data.whatsapp_number || "",
      address: data.address || "",
    };
  },
  ["site-settings"],
  { tags: ["site-settings"] },
);

/** Single call site for phone/email/WhatsApp/address — reads from Supabase, admin-editable. */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return fallbackSettings();
  try {
    return await getCachedSettings();
  } catch {
    return fallbackSettings();
  }
}
