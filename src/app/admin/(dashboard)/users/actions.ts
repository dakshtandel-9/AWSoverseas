"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

function revalidateUsers() {
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function approveUserAction(id: string) {
  const db = supabaseAdmin();
  await db.from("user_profiles").update({ status: "approved" }).eq("id", id);
  revalidateUsers();
}

export async function rejectUserAction(id: string) {
  const db = supabaseAdmin();
  await db.from("user_profiles").update({ status: "rejected" }).eq("id", id);
  revalidateUsers();
}

/** Removes the auth user entirely; the profile row cascades via its FK. */
export async function deleteUserAction(id: string) {
  const db = supabaseAdmin();
  await db.auth.admin.deleteUser(id);
  revalidateUsers();
}
