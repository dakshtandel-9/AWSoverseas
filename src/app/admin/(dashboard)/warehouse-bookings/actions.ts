"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function markWarehouseBookingReadAction(id: string, isRead: boolean) {
  const db = supabaseAdmin();
  await db.from("warehouse_bookings").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/warehouse-bookings");
}

export async function deleteWarehouseBookingAction(id: string) {
  const db = supabaseAdmin();
  await db.from("warehouse_bookings").delete().eq("id", id);
  revalidatePath("/admin/warehouse-bookings");
}
