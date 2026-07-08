"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { creditReferrerForSource } from "@/lib/wallet";

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

/** Admin approves and prices out an enquiry — the customer then sees this on their profile. */
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
      rejection_reason: "",
    })
    .eq("id", id);
  revalidatePath("/admin/enquiries");
}

/** Admin declines an enquiry — the customer sees the decision (and reason) on their profile. */
export async function rejectEnquiryAction(id: string, reason: string) {
  const db = supabaseAdmin();
  await db
    .from("product_enquiries")
    .update({ quote_status: "rejected", rejection_reason: reason })
    .eq("id", id);
  revalidatePath("/admin/enquiries");
}

/** Reverts an enquiry back to awaiting review — undoes an accidental approve/reject. */
export async function resetEnquiryStatusAction(id: string) {
  const db = supabaseAdmin();
  await db
    .from("product_enquiries")
    .update({ quote_status: "awaiting_quote", rejection_reason: "" })
    .eq("id", id);
  revalidatePath("/admin/enquiries");
}

/** Grants the referrer of this enquiry's submitter a wallet credit. */
export async function creditEnquiryReferrerAction(enquiryId: string, amount: number, reason: string) {
  const result = await creditReferrerForSource("enquiry", enquiryId, amount, reason);
  revalidatePath("/admin/enquiries");
  return result;
}
