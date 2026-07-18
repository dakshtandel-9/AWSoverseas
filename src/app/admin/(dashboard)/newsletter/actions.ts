"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function deleteSubscriberAction(id: string) {
  const db = supabaseAdmin();
  await db.from("newsletter_subscribers").delete().eq("id", id);
  revalidatePath("/admin/newsletter");
}
