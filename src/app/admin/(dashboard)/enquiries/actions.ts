"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { creditReferrerForSource } from "@/lib/wallet";
import {
  getReferrerInfoForUsers,
  getWalletCreditsForSources,
  getProfilesForUsers,
} from "@/lib/wallet-admin";

export type CreateOrderState = { success?: boolean; error?: string; orderId?: string };

/**
 * Admin places an order on behalf of a specific customer. Contact details are
 * snapshotted from the user's profile so the row matches a self-placed order,
 * and it shows up in that user's profile dashboard (queried by user_id).
 * An optional quote (price/quantity/weight/delivery date) can be entered at
 * creation — if a price is given the order is saved already "quoted".
 */
export async function createOrderForUserAction(
  _prevState: CreateOrderState,
  formData: FormData,
): Promise<CreateOrderState> {
  const userId = String(formData.get("user-id") ?? "").trim();
  const productId = String(formData.get("product-id") ?? "").trim();
  const productName = String(formData.get("product-name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const priceRaw = String(formData.get("price") ?? "").trim();
  const price = priceRaw ? Number(priceRaw) : null;
  const quantity = String(formData.get("quantity") ?? "").trim();
  const weightRaw = String(formData.get("weight") ?? "").trim();
  const weightKg = weightRaw ? Number(weightRaw) : null;
  const deliveryDate = String(formData.get("delivery-date") ?? "").trim();

  if (!userId) return { error: "Pick a customer to place this order for." };
  if (!productName) return { error: "Pick a product (or enter a product name)." };
  if (priceRaw && (!price || price <= 0)) return { error: "Enter a price greater than zero, or leave it blank." };

  const db = supabaseAdmin();

  const { data: profile } = await db
    .from("user_profiles")
    .select("first_name, last_name, email, phone")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return { error: "That customer no longer exists." };

  // A price at creation means the order is already priced out ("quoted").
  const priced = price != null;

  const { data: inserted, error } = await db
    .from("product_enquiries")
    .insert({
      request_type: "order",
      product_id: productId || null,
      product_name: productName,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`.trim(),
      email: profile.email,
      phone: profile.phone,
      message,
      user_id: userId,
      // Admin-created, so it's already "seen" — no unread dot needed.
      is_read: true,
      quote_status: priced ? "quoted" : "awaiting_quote",
      quoted_price: price,
      quoted_quantity: priced ? quantity : "",
      quoted_weight_kg: priced ? weightKg : null,
      delivery_date: priced && deliveryDate ? deliveryDate : null,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { error: "Something went wrong creating the order. Please try again." };
  }

  revalidatePath("/admin/enquiries");
  revalidatePath("/profile");
  return { success: true, orderId: inserted.id };
}

export type OrderContext = {
  item: import("@/components/admin/enquiry-row").AdminOrder;
  referrerName: string | null;
  alreadyCredited: { amount: number; count: number } | null;
  profile: import("@/components/admin/user-profile-modal").AdminUserProfile | null;
};

/** Full context for one order — used to render the same decision UI in the create-order modal. */
export async function getOrderContextAction(id: string): Promise<OrderContext | null> {
  const db = supabaseAdmin();
  const { data: item } = await db.from("product_enquiries").select("*").eq("id", id).maybeSingle();
  if (!item) return null;

  const userId: string | null = item.user_id ?? null;
  const [referrerByUserId, creditBySourceId, profileByUserId] = await Promise.all([
    getReferrerInfoForUsers(userId ? [userId] : []),
    getWalletCreditsForSources("enquiry", [id]),
    getProfilesForUsers(userId ? [userId] : []),
  ]);

  return {
    item: item as OrderContext["item"],
    referrerName: userId ? referrerByUserId[userId] ?? null : null,
    alreadyCredited: creditBySourceId[id] ?? null,
    profile: userId ? profileByUserId[userId] ?? null : null,
  };
}

export async function markEnquiryReadAction(id: string, isRead: boolean) {
  const db = supabaseAdmin();
  await db.from("product_enquiries").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/enquiries-open");
}

export async function deleteEnquiryAction(id: string) {
  const db = supabaseAdmin();
  await db.from("product_enquiries").delete().eq("id", id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/enquiries-open");
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
  revalidatePath("/admin/enquiries-open");
}

/** Admin declines an enquiry — the customer sees the decision (and reason) on their profile. */
export async function rejectEnquiryAction(id: string, reason: string) {
  const db = supabaseAdmin();
  await db
    .from("product_enquiries")
    .update({ quote_status: "rejected", rejection_reason: reason })
    .eq("id", id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/enquiries-open");
}

/** Reverts an enquiry back to awaiting review — undoes an accidental approve/reject. */
export async function resetEnquiryStatusAction(id: string) {
  const db = supabaseAdmin();
  await db
    .from("product_enquiries")
    .update({ quote_status: "awaiting_quote", rejection_reason: "" })
    .eq("id", id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/enquiries-open");
}

/** Grants the referrer of this enquiry's submitter a wallet credit. */
export async function creditEnquiryReferrerAction(enquiryId: string, amount: number, reason: string) {
  const result = await creditReferrerForSource("enquiry", enquiryId, amount, reason);
  revalidatePath("/admin/enquiries");
  return result;
}
