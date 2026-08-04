"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { uploadCityAgentImage } from "@/lib/cloudinary";

export type CityAgentFormState = { error?: string; success?: boolean };

export type ImageUploadState = { url?: string; error?: string };

export async function uploadCityAgentImageAction(
  _prevState: ImageUploadState,
  formData: FormData,
): Promise<ImageUploadState> {
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "That file isn't an image." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "Image is too large (max 8MB)." };
  }

  try {
    const url = await uploadCityAgentImage(file);
    return { url };
  } catch (err) {
    console.error("[uploadCityAgentImageAction] Cloudinary upload failed:", err);
    return { error: "Upload failed. Please try again." };
  }
}

function revalidateCityAgents() {
  updateTag("city-agents");
  revalidatePath("/admin/city-agents");
  revalidatePath("/contact");
}

function readFields(formData: FormData) {
  return {
    city: String(formData.get("city") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    agent_name: String(formData.get("agent_name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_active: formData.get("is_active") !== "false",
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.city) return "Give this tile a city.";
  if (!fields.image_url) return "Upload a photo for this city.";
  if (!fields.agent_name) return "Give the agent a name.";
  return null;
}

/**
 * The table arrives with the 2026-08-05 migration. Say so plainly instead of a
 * bare "couldn't save" when it's missing.
 */
function messageForError(error: { code?: string; message?: string }) {
  if (error.code === "42P01" || error.message?.includes("city_agents")) {
    return "The database is missing the city_agents table. Run supabase/migrations/2026-08-05-city-agents-table.sql in the Supabase SQL editor, then save again.";
  }
  return "Couldn't save. Please try again.";
}

export async function createCityAgentAction(
  _prevState: CityAgentFormState,
  formData: FormData,
): Promise<CityAgentFormState> {
  const fields = readFields(formData);
  const invalid = validate(fields);
  if (invalid) return { error: invalid };

  const db = supabaseAdmin();
  const { error } = await db.from("city_agents").insert(fields);

  if (error) {
    return { error: messageForError(error) };
  }

  revalidateCityAgents();
  redirect("/admin/city-agents");
}

export async function updateCityAgentAction(
  id: string,
  _prevState: CityAgentFormState,
  formData: FormData,
): Promise<CityAgentFormState> {
  const fields = readFields(formData);
  const invalid = validate(fields);
  if (invalid) return { error: invalid };

  const db = supabaseAdmin();
  const { error } = await db.from("city_agents").update(fields).eq("id", id);

  if (error) {
    return { error: messageForError(error) };
  }

  revalidateCityAgents();
  redirect("/admin/city-agents");
}

export async function deleteCityAgentAction(id: string) {
  const db = supabaseAdmin();
  await db.from("city_agents").delete().eq("id", id);
  revalidateCityAgents();
}

export async function toggleCityAgentActiveAction(id: string, isActive: boolean) {
  const db = supabaseAdmin();
  await db.from("city_agents").update({ is_active: isActive }).eq("id", id);
  revalidateCityAgents();
}
