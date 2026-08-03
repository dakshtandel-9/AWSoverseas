"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";

export type FooterContactFormState = { error?: string; success?: boolean };

function revalidateFooterContacts() {
  updateTag("footer-contacts");
  revalidatePath("/admin/footer-contacts");
  revalidatePath("/");
}

function readFields(formData: FormData) {
  return {
    headline: String(formData.get("headline") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_active: formData.get("is_active") !== "false",
  };
}

function validate(fields: ReturnType<typeof readFields>): string | null {
  if (!fields.headline) return "Give this column a heading.";
  return null;
}

/**
 * The table arrives with the 2026-08-03 migration. Say so plainly instead of a
 * bare "couldn't save" when it's missing.
 */
function messageForError(error: { code?: string; message?: string }) {
  if (error.code === "42P01" || error.message?.includes("footer_contacts")) {
    return "The database is missing the footer_contacts table. Run supabase/migrations/2026-08-03-footer-contacts-table.sql in the Supabase SQL editor, then save again.";
  }
  return "Couldn't save. Please try again.";
}

export async function createFooterContactAction(
  _prevState: FooterContactFormState,
  formData: FormData,
): Promise<FooterContactFormState> {
  const fields = readFields(formData);
  const invalid = validate(fields);
  if (invalid) return { error: invalid };

  const db = supabaseAdmin();
  const { error } = await db.from("footer_contacts").insert(fields);

  if (error) {
    return { error: messageForError(error) };
  }

  revalidateFooterContacts();
  redirect("/admin/footer-contacts");
}

export async function updateFooterContactAction(
  id: string,
  _prevState: FooterContactFormState,
  formData: FormData,
): Promise<FooterContactFormState> {
  const fields = readFields(formData);
  const invalid = validate(fields);
  if (invalid) return { error: invalid };

  const db = supabaseAdmin();
  const { error } = await db.from("footer_contacts").update(fields).eq("id", id);

  if (error) {
    return { error: messageForError(error) };
  }

  revalidateFooterContacts();
  redirect("/admin/footer-contacts");
}

export async function deleteFooterContactAction(id: string) {
  const db = supabaseAdmin();
  await db.from("footer_contacts").delete().eq("id", id);
  revalidateFooterContacts();
}

export async function toggleFooterContactActiveAction(id: string, isActive: boolean) {
  const db = supabaseAdmin();
  await db.from("footer_contacts").update({ is_active: isActive }).eq("id", id);
  revalidateFooterContacts();
}
