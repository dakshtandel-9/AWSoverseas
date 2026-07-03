"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function markMessageReadAction(id: string, isRead: boolean) {
  const db = supabaseAdmin();
  await db.from("contact_submissions").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(id: string) {
  const db = supabaseAdmin();
  await db.from("contact_submissions").delete().eq("id", id);
  revalidatePath("/admin/messages");
}
