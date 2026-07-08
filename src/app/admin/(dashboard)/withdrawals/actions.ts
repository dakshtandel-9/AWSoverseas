"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

function revalidateWithdrawals() {
  revalidatePath("/admin/withdrawals");
  revalidatePath("/admin");
}

/** Admin confirms the payout was sent — permanently deducts from the customer's wallet balance. */
export async function markWithdrawalPaidAction(id: string) {
  const db = supabaseAdmin();
  await db.from("wallet_withdrawals").update({ status: "paid", decided_at: new Date().toISOString() }).eq("id", id);
  revalidateWithdrawals();
}

/** Admin declines the request — the amount becomes available again for the customer. */
export async function rejectWithdrawalAction(id: string, reason: string) {
  const db = supabaseAdmin();
  await db
    .from("wallet_withdrawals")
    .update({ status: "rejected", rejection_reason: reason, decided_at: new Date().toISOString() })
    .eq("id", id);
  revalidateWithdrawals();
}
