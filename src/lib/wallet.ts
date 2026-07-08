import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";

export type WalletTransaction = {
  id: string;
  amount: number;
  reason: string;
  source_type: "quote" | "enquiry";
  created_at: string;
};

const SOURCE_TABLE = {
  quote: "quote_submissions",
  enquiry: "product_enquiries",
} as const;

export async function getWalletBalance(userId: string): Promise<number> {
  const db = supabaseAdmin();
  const { data } = await db.from("wallet_transactions").select("amount").eq("user_id", userId);
  return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
}

export async function getWalletHistory(userId: string): Promise<WalletTransaction[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("wallet_transactions")
    .select("id, amount, reason, source_type, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as WalletTransaction[] | null) ?? [];
}

/** Whether a given quote/enquiry has already had a referral credit granted for it. */
export async function getWalletCreditForSource(
  sourceType: "quote" | "enquiry",
  sourceId: string,
): Promise<{ amount: number; referrerName: string } | null> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("wallet_transactions")
    .select("amount, user:user_id(first_name, last_name)")
    .eq("source_type", sourceType)
    .eq("source_id", sourceId)
    .maybeSingle();
  if (!data) return null;
  const referrer = data.user as unknown as { first_name: string; last_name: string } | null;
  return {
    amount: Number(data.amount),
    referrerName: referrer ? `${referrer.first_name} ${referrer.last_name}`.trim() : "Referrer",
  };
}

/**
 * Credits the referrer of the booking's submitter with a wallet reward.
 * Fails cleanly (no throw) if the submitter has no referrer, or if this
 * exact booking has already been credited (unique index on source_type +
 * source_id).
 */
export async function creditReferrerForSource(
  sourceType: "quote" | "enquiry",
  sourceId: string,
  amount: number,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!amount || amount <= 0) return { ok: false, error: "Enter an amount greater than zero" };

  const db = supabaseAdmin();
  const { data: source } = await db
    .from(SOURCE_TABLE[sourceType])
    .select("user_id")
    .eq("id", sourceId)
    .maybeSingle();

  if (!source?.user_id) return { ok: false, error: "This booking isn't linked to an account" };

  const { data: buyer } = await db
    .from("user_profiles")
    .select("id, referred_by")
    .eq("id", source.user_id)
    .maybeSingle();

  if (!buyer?.referred_by) return { ok: false, error: "This customer has no referrer" };

  const { error } = await db.from("wallet_transactions").insert({
    user_id: buyer.referred_by,
    amount,
    reason,
    source_type: sourceType,
    source_id: sourceId,
    referred_user_id: buyer.id,
  });

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Already credited for this booking" };
    return { ok: false, error: "Could not credit wallet" };
  }

  return { ok: true };
}
