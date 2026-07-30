"use server";

import { updateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { EXTRA_FOOTER_CONTACTS } from "@/lib/site-settings";

export type SettingsState = { error?: string; success?: boolean };

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

export async function updateSettingsAction(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const phone1 = String(formData.get("phone_1") ?? "").trim();
  const phone2 = String(formData.get("phone_2") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsapp_number") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const contactLabel = String(formData.get("contact_label") ?? "").trim();
  const btnNavy = String(formData.get("btn_navy") ?? "").trim();
  const btnNavyHover = String(formData.get("btn_navy_hover") ?? "").trim();
  const btnMaroon = String(formData.get("btn_maroon") ?? "").trim();
  const btnMaroonHover = String(formData.get("btn_maroon_hover") ?? "").trim();
  const textMaroon = String(formData.get("text_maroon") ?? "").trim();

  if (!phone1 || !email) {
    return { error: "Primary phone and email are required." };
  }

  // Footer columns 2-4. Kept at a fixed length so a blank column doesn't shift the ones after it.
  const footerContacts = Array.from({ length: EXTRA_FOOTER_CONTACTS }, (_, i) => {
    const field = (key: string) => String(formData.get(`contact_${i + 2}_${key}`) ?? "").trim();
    return {
      label: field("label"),
      phone1: field("phone_1"),
      phone2: field("phone_2"),
      email: field("email"),
      address: field("address"),
    };
  });

  for (const [label, value] of [
    ["Navy button color", btnNavy],
    ["Navy button hover color", btnNavyHover],
    ["Maroon button color", btnMaroon],
    ["Maroon button hover color", btnMaroonHover],
    ["Maroon text color", textMaroon],
  ]) {
    if (!HEX_COLOR.test(value)) {
      return { error: `${label} must be a valid hex color (e.g. #02224C).` };
    }
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from("site_settings")
    .update({
      phone_1: phone1,
      phone_2: phone2,
      email,
      whatsapp_number: whatsappNumber,
      address,
      contact_label: contactLabel,
      footer_contacts: footerContacts,
      btn_navy: btnNavy,
      btn_navy_hover: btnNavyHover,
      btn_maroon: btnMaroon,
      btn_maroon_hover: btnMaroonHover,
      text_maroon: textMaroon,
    })
    .eq("id", 1);

  if (error) {
    return { error: "Couldn't save settings. Please try again." };
  }

  updateTag("site-settings");
  return { success: true };
}
