"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";

export type OfficeFormState = { error?: string; success?: boolean };

function revalidateOffices() {
  updateTag("office-locations");
  revalidatePath("/admin/offices");
  revalidatePath("/contact");
}

// ============================================================
// Groups — the headings on the Contact page ("India Offices", …)
// ============================================================

function readGroupFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_active: formData.get("is_active") !== "false",
  };
}

export async function createGroupAction(
  _prevState: OfficeFormState,
  formData: FormData,
): Promise<OfficeFormState> {
  const fields = readGroupFields(formData);

  if (!fields.title) {
    return { error: "Give the group a heading, e.g. India Offices." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("office_groups").insert(fields);

  if (error) {
    return { error: messageForOfficeError(error) };
  }

  revalidateOffices();
  return { success: true };
}

export async function updateGroupAction(
  id: string,
  _prevState: OfficeFormState,
  formData: FormData,
): Promise<OfficeFormState> {
  const fields = readGroupFields(formData);

  if (!fields.title) {
    return { error: "Give the group a heading, e.g. India Offices." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("office_groups").update(fields).eq("id", id);

  if (error) {
    return { error: messageForOfficeError(error) };
  }

  revalidateOffices();
  return { success: true };
}

export async function toggleGroupActiveAction(id: string, isActive: boolean) {
  const db = supabaseAdmin();
  await db.from("office_groups").update({ is_active: isActive }).eq("id", id);
  revalidateOffices();
}

/** Removes the group and, by the FK cascade, every office inside it. */
export async function deleteGroupAction(id: string) {
  const db = supabaseAdmin();
  await db.from("office_groups").delete().eq("id", id);
  revalidateOffices();
}

// ============================================================
// Offices — one card each
// ============================================================

function readOfficeFields(formData: FormData) {
  return {
    group_id: String(formData.get("group_id") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone_1: String(formData.get("phone_1") ?? "").trim(),
    phone_2: String(formData.get("phone_2") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    map_url: String(formData.get("map_url") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_active: formData.get("is_active") !== "false",
  };
}

function validateOffice(fields: ReturnType<typeof readOfficeFields>): string | null {
  if (!fields.group_id) return "Choose which group this office belongs to.";
  if (!fields.name) return "Office name is required.";
  if (fields.map_url && !/^https?:\/\//i.test(fields.map_url)) {
    return "The map link must start with http:// or https://.";
  }
  return null;
}

/**
 * The tables arrive with the 2026-07-31 migration. Say so plainly instead of a
 * bare "couldn't save" when they're missing.
 */
function messageForOfficeError(error: { code?: string; message?: string }) {
  if (error.code === "42P01" || error.message?.includes("office_groups") || error.message?.includes("office_locations")) {
    return "The database is missing the office tables. Run supabase/migrations/2026-07-31-office-locations.sql in the Supabase SQL editor, then save again.";
  }
  return "Couldn't save. Please try again.";
}

export async function createOfficeAction(
  _prevState: OfficeFormState,
  formData: FormData,
): Promise<OfficeFormState> {
  const fields = readOfficeFields(formData);
  const invalid = validateOffice(fields);
  if (invalid) return { error: invalid };

  const db = supabaseAdmin();
  const { error } = await db.from("office_locations").insert(fields);

  if (error) {
    return { error: messageForOfficeError(error) };
  }

  revalidateOffices();
  redirect("/admin/offices");
}

export async function updateOfficeAction(
  id: string,
  _prevState: OfficeFormState,
  formData: FormData,
): Promise<OfficeFormState> {
  const fields = readOfficeFields(formData);
  const invalid = validateOffice(fields);
  if (invalid) return { error: invalid };

  const db = supabaseAdmin();
  const { error } = await db.from("office_locations").update(fields).eq("id", id);

  if (error) {
    return { error: messageForOfficeError(error) };
  }

  revalidateOffices();
  redirect("/admin/offices");
}

export async function deleteOfficeAction(id: string) {
  const db = supabaseAdmin();
  await db.from("office_locations").delete().eq("id", id);
  revalidateOffices();
}

export async function toggleOfficeActiveAction(id: string, isActive: boolean) {
  const db = supabaseAdmin();
  await db.from("office_locations").update({ is_active: isActive }).eq("id", id);
  revalidateOffices();
}
