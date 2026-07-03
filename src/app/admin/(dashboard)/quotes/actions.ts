"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function markQuoteReadAction(id: string, isRead: boolean) {
  const db = supabaseAdmin();
  await db.from("quote_submissions").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/quotes");
}

export async function deleteQuoteAction(id: string) {
  const db = supabaseAdmin();
  await db.from("quote_submissions").delete().eq("id", id);
  revalidatePath("/admin/quotes");
}
