import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { contact } from "@/lib/content";

/** One footer contact column — a label plus two phones, an email and an address. */
export type FooterContact = {
  label: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
};

/** Footer contact columns 2-4; column 1 comes from the top-level phone/email/address fields. */
export const EXTRA_FOOTER_CONTACTS = 3;

export type SiteSettings = {
  phone1: string;
  phone2: string;
  email: string;
  whatsappNumber: string;
  address: string;
  contactLabel: string;
  footerContacts: FooterContact[];
  btnNavy: string;
  btnNavyHover: string;
  btnMaroon: string;
  btnMaroonHover: string;
  textMaroon: string;
};

/** Defaults matching the values the site shipped with, used until Supabase is configured or a row exists. */
const BUTTON_COLOR_DEFAULTS = {
  btnNavy: "#02224C",
  btnNavyHover: "#011a38",
  btnMaroon: "#902d39",
  btnMaroonHover: "#861b28",
  textMaroon: "#9e4953",
} as const;

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

/** Guards against malformed/malicious values reaching the inline <style> override in the root layout. */
function sanitizeHex(value: string | null | undefined, fallback: string): string {
  return value && HEX_COLOR.test(value) ? value : fallback;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Normalizes the jsonb column into exactly EXTRA_FOOTER_CONTACTS blocks so form indices stay stable. */
export function parseFooterContacts(value: unknown): FooterContact[] {
  const rows = Array.isArray(value) ? value : [];
  return Array.from({ length: EXTRA_FOOTER_CONTACTS }, (_, i) => {
    const row = (rows[i] ?? {}) as Record<string, unknown>;
    return {
      label: str(row.label),
      phone1: str(row.phone1),
      phone2: str(row.phone2),
      email: str(row.email),
      address: str(row.address),
    };
  });
}

/** True when a column has anything worth rendering in the footer. */
export function hasContactDetails(c: FooterContact): boolean {
  return Boolean(c.phone1 || c.phone2 || c.email || c.address);
}

/** Fallback values sourced from the original static JSON, used only until Supabase is configured. */
function fallbackSettings(): SiteSettings {
  const phone = contact.contactInfo?.items?.find((i: { type: string }) => i.type === "Phone")?.value ?? "";
  const email = contact.contactInfo?.items?.find((i: { type: string }) => i.type === "Email")?.value ?? "";
  const office = contact.officeLocations?.locations?.[0];
  const address = office ? `${office.address}, ${office.city}, ${office.country}` : "";
  return {
    phone1: phone,
    phone2: "",
    email,
    whatsappNumber: "",
    address,
    contactLabel: "Head office",
    footerContacts: parseFooterContacts([]),
    ...BUTTON_COLOR_DEFAULTS,
  };
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
      contactLabel: data.contact_label || "Head office",
      footerContacts: parseFooterContacts(data.footer_contacts),
      btnNavy: sanitizeHex(data.btn_navy, BUTTON_COLOR_DEFAULTS.btnNavy),
      btnNavyHover: sanitizeHex(data.btn_navy_hover, BUTTON_COLOR_DEFAULTS.btnNavyHover),
      btnMaroon: sanitizeHex(data.btn_maroon, BUTTON_COLOR_DEFAULTS.btnMaroon),
      btnMaroonHover: sanitizeHex(data.btn_maroon_hover, BUTTON_COLOR_DEFAULTS.btnMaroonHover),
      textMaroon: sanitizeHex(data.text_maroon, BUTTON_COLOR_DEFAULTS.textMaroon),
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
