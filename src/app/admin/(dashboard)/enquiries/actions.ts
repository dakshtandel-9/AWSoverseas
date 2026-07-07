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

/** Admin prices out an enquiry — the customer then sees this on their profile. */
export async function setEnquiryQuoteAction(
  id: string,
  price: number,
  quantity: string,
  weightKg: number | null,
  deliveryDate: string,
) {
  const db = supabaseAdmin();
  await db
    .from("product_enquiries")
    .update({
      quoted_price: price,
      quoted_quantity: quantity,
      quoted_weight_kg: weightKg,
      delivery_date: deliveryDate || null,
      quote_status: "quoted",
    })
    .eq("id", id);
  revalidatePath("/admin/enquiries");
}
