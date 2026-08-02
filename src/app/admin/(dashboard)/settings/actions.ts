"use server";

import { updateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export type SettingsState = { error?: string; success?: boolean };

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

export async function updateSettingsAction(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const phones = [1, 2, 3, 4, 5].map((n) => String(formData.get(`phone_${n}`) ?? "").trim());
  const emails = [1, 2, 3, 4, 5].map((n) => String(formData.get(`email_${n}`) ?? "").trim());
  const whatsappNumber = String(formData.get("whatsapp_number") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const btnNavy = String(formData.get("btn_navy") ?? "").trim();
  const btnNavyHover = String(formData.get("btn_navy_hover") ?? "").trim();
  const btnMaroon = String(formData.get("btn_maroon") ?? "").trim();
  const btnMaroonHover = String(formData.get("btn_maroon_hover") ?? "").trim();
  const textMaroon = String(formData.get("text_maroon") ?? "").trim();

  if (!phones[0] || !emails[0]) {
    return { error: "Primary phone and email are required." };
  }

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
      phone_1: phones[0],
      phone_2: phones[1],
      phone_3: phones[2],
      phone_4: phones[3],
      phone_5: phones[4],
      email: emails[0],
      email_2: emails[1],
      email_3: emails[2],
      email_4: emails[3],
      email_5: emails[4],
      whatsapp_number: whatsappNumber,
      address,
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
