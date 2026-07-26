import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { SIGNUP_BONUS_AMOUNT, SIGNUP_BONUS_REASON } from "@/lib/wallet-constants";

export type WalletSourceType = "quote" | "enquiry" | "signup" | "adjustment";

export type WalletTransaction = {
  id: string;
  amount: number;
  reason: string;
  source_type: WalletSourceType;
  created_at: string;
  /** Name of the referred customer whose booking generated this credit, if known. */
  referredName: string | null;
};

export type WalletSummary = {
  /** Sum of every credit row — before any admin deduction. */
  earned: number;
  /** Sum of admin deductions, as a positive number. */
  deducted: number;
  /** Current balance: credits minus deductions. */
  available: number;
};

const SOURCE_TABLE = {
  quote: "quote_submissions",
  enquiry: "product_enquiries",
} as const;

export async function getWalletSummary(userId: string): Promise<WalletSummary> {
  const db = supabaseAdmin();
  const { data } = await db.from("wallet_transactions").select("amount").eq("user_id", userId);

  let earned = 0;
  let deducted = 0;
  for (const row of data ?? []) {
    const amount = Number(row.amount);
    if (amount < 0) deducted += -amount;
    else earned += amount;
  }

  return { earned, deducted, available: earned - deducted };
}

/** Balances for many users at once, for the admin wallet list. */
export async function getWalletSummaries(userIds: string[]): Promise<Record<string, WalletSummary>> {
  const uniqueIds = [...new Set(userIds)];
  if (uniqueIds.length === 0) return {};

  const db = supabaseAdmin();
  const { data } = await db.from("wallet_transactions").select("user_id, amount").in("user_id", uniqueIds);

  const result: Record<string, WalletSummary> = {};
  for (const id of uniqueIds) result[id] = { earned: 0, deducted: 0, available: 0 };

  for (const row of data ?? []) {
    const summary = result[row.user_id];
    if (!summary) continue;
    const amount = Number(row.amount);
    if (amount < 0) summary.deducted += -amount;
    else summary.earned += amount;
  }

  for (const summary of Object.values(result)) summary.available = summary.earned - summary.deducted;
  return result;
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

/**
 * Manual admin correction to a customer's balance, not tied to any booking.
 * A deduction is stored as a negative ledger row rather than by editing or
 * removing earlier credits, so the history stays append-only: the customer
 * can still see what they earned and what was taken back, and the two always
 * add up to the balance on screen.
 *
 * `amount` is always given as a positive number; `direction` decides the sign.
 */
export async function adjustWalletBalance(
  userId: string,
  direction: "add" | "deduct",
  amount: number,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Enter an amount greater than zero" };
  }

  const trimmedReason = reason.trim();
  if (!trimmedReason) return { ok: false, error: "Add a reason — the customer sees it in their wallet activity" };

  const db = supabaseAdmin();
  const { data: profile } = await db.from("user_profiles").select("id").eq("id", userId).maybeSingle();
  if (!profile) return { ok: false, error: "That customer no longer exists" };

  // Rounded to cents so a stray float can't leave a balance that renders as
  // one number but sums to another.
  const magnitude = Math.round(amount * 100) / 100;

  if (direction === "deduct") {
    const { available } = await getWalletSummary(userId);
    if (magnitude > available) {
      return { ok: false, error: `That's more than the $${available.toLocaleString("en-US")} balance` };
    }
  }

  const { error } = await db.from("wallet_transactions").insert({
    user_id: userId,
    amount: direction === "deduct" ? -magnitude : magnitude,
    reason: trimmedReason,
    source_type: "adjustment",
    source_id: null,
  });

  if (error) return { ok: false, error: "Could not update the wallet. Please try again." };

  return { ok: true };
}

/**
 * Credits a brand-new account with the one-time welcome bonus. Safe to call
 * more than once for the same user: a partial unique index on
 * (user_id) where source_type = 'signup' caps it at one row, and the
 * resulting duplicate-key error is swallowed. Never throws — a failed bonus
 * must not block the signup itself.
 */
export async function grantSignupBonus(userId: string): Promise<void> {
  const db = supabaseAdmin();
  await db.from("wallet_transactions").insert({
    user_id: userId,
    amount: SIGNUP_BONUS_AMOUNT,
    reason: SIGNUP_BONUS_REASON,
    source_type: "signup",
    source_id: null,
  });
}
