"use server";

import { updateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export type SettingsState = { error?: string; success?: boolean };

export async function updateSettingsAction(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const phone1 = String(formData.get("phone_1") ?? "").trim();
  const phone2 = String(formData.get("phone_2") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsappNumber = String(formData.get("whatsapp_number") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!phone1 || !email) {
    return { error: "Primary phone and email are required." };
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
    })
    .eq("id", 1);

  if (error) {
    return { error: "Couldn't save settings. Please try again." };
  }

  updateTag("site-settings");
  return { success: true };
}
