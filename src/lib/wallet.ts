import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";

export type WalletTransaction = {
  id: string;
  amount: number;
  reason: string;
  source_type: "quote" | "enquiry";
  created_at: string;
  /** Name of the referred customer whose booking generated this credit, if known. */
  referredName: string | null;
};

export type WithdrawalStatus = "pending" | "paid" | "rejected";

export type WalletWithdrawal = {
  id: string;
  amount: number;
  status: WithdrawalStatus;
  bank_account_number: string;
  bank_account_holder: string;
  bank_name: string;
  bank_ifsc: string;
  rejection_reason: string;
  created_at: string;
  decided_at: string | null;
};

export type WalletSummary = {
  earned: number;
  pendingWithdrawals: number;
  paidWithdrawals: number;
  /** Spendable balance: earned minus amounts pending or already paid out. */
  available: number;
};

const SOURCE_TABLE = {
  quote: "quote_submissions",
  enquiry: "product_enquiries",
} as const;

async function sumColumn(table: string, userId: string, filters?: Record<string, string>) {
  const db = supabaseAdmin();
  let query = db.from(table).select("amount").eq("user_id", userId);
  for (const [key, value] of Object.entries(filters ?? {})) query = query.eq(key, value);
  const { data } = await query;
  return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
}

export async function getWalletSummary(userId: string): Promise<WalletSummary> {
  const [earned, pendingWithdrawals, paidWithdrawals] = await Promise.all([
    sumColumn("wallet_transactions", userId),
    sumColumn("wallet_withdrawals", userId, { status: "pending" }),
    sumColumn("wallet_withdrawals", userId, { status: "paid" }),
  ]);
  return {
    earned,
    pendingWithdrawals,
    paidWithdrawals,
    available: earned - pendingWithdrawals - paidWithdrawals,
  };
}

export async function getWalletHistory(userId: string): Promise<WalletTransaction[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("wallet_transactions")
    .select("id, amount, reason, source_type, created_at, referred:referred_user_id(first_name, last_name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => {
    const referred = row.referred as unknown as { first_name: string; last_name: string } | null;
    return {
      id: row.id,
      amount: Number(row.amount),
      reason: row.reason,
      source_type: row.source_type,
      created_at: row.created_at,
      referredName: referred ? `${referred.first_name} ${referred.last_name}`.trim() : null,
    };
  });
}

export async function getWithdrawalHistory(userId: string): Promise<WalletWithdrawal[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("wallet_withdrawals")
    .select(
      "id, amount, status, bank_account_number, bank_account_holder, bank_name, bank_ifsc, rejection_reason, created_at, decided_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as WalletWithdrawal[] | null) ?? [];
}

/**
 * Credits the referrer of the booking's submitter with a wallet reward.
 * Fails cleanly (no throw) if the submitter has no referrer. Can be called
 * more than once for the same booking (e.g. a top-up bonus) — each call
 * adds a new ledger row rather than replacing one.
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

  if (error) return { ok: false, error: "Could not credit wallet" };

  return { ok: true };
}
