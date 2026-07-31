"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getAccount } from "@/lib/account";

export type WarehouseBookingState = { success?: boolean; error?: string };

/**
 * Open to everyone, same as product enquiries — no account needed to ask
 * about warehouse space. Only used to stamp a user id when the visitor
 * happens to be signed in, so the request shows up against their profile.
 */
export async function submitWarehouseBookingAction(
  _prevState: WarehouseBookingState,
  formData: FormData,
): Promise<WarehouseBookingState> {
  const account = await getAccount();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const warehouseType = String(formData.get("warehouse-type") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !email || !phone || !address || !warehouseType) {
    return { error: "Please fill in all required fields." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "This form isn't connected yet. Please try again later." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("warehouse_bookings").insert({
    full_name: name,
    email,
    phone,
    address,
    warehouse_type: warehouseType,
    notes,
    user_id: account?.user.id ?? null,
  });

  if (error) {
    console.error("[warehouse-booking] insert failed:", error);
    return { error: "Something went wrong submitting your request. Please try again." };
  }

  return { success: true };
}
