"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function markEnquiryReadAction(id: string, isRead: boolean) {
  const db = supabaseAdmin();
  await db.from("product_enquiries").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(id: string) {
  const db = supabaseAdmin();
  await db.from("product_enquiries").delete().eq("id", id);
  revalidatePath("/admin/enquiries");
}
