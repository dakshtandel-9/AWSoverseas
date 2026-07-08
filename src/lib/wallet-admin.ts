import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Batch-resolves each auth user id to their referrer's display name (if
 * they have one), for the admin quote/enquiry list pages. Users with no
 * referrer are simply absent from the returned map.
 */
export async function getReferrerInfoForUsers(userIds: string[]): Promise<Record<string, string | null>> {
  const uniqueIds = [...new Set(userIds)];
  if (uniqueIds.length === 0) return {};

  const db = supabaseAdmin();
  const { data: buyers } = await db.from("user_profiles").select("id, referred_by").in("id", uniqueIds);
  const referrerIds = [...new Set((buyers ?? []).map((b) => b.referred_by).filter((id): id is string => Boolean(id)))];
  if (referrerIds.length === 0) return {};

  const { data: referrers } = await db.from("user_profiles").select("id, first_name, last_name").in("id", referrerIds);
  const nameByReferrerId: Record<string, string> = {};
  for (const r of referrers ?? []) nameByReferrerId[r.id] = `${r.first_name} ${r.last_name}`.trim();

  const result: Record<string, string | null> = {};
  for (const b of buyers ?? []) {
    result[b.id] = b.referred_by ? nameByReferrerId[b.referred_by] ?? null : null;
  }
  return result;
}

/** Batch-resolves which of the given quote/enquiry ids already have a wallet credit granted. */
export async function getWalletCreditsForSources(
  sourceType: "quote" | "enquiry",
  sourceIds: string[],
): Promise<Record<string, { amount: number }>> {
  if (sourceIds.length === 0) return {};

  const db = supabaseAdmin();
  const { data } = await db
    .from("wallet_transactions")
    .select("source_id, amount")
    .eq("source_type", sourceType)
    .in("source_id", sourceIds);

  const result: Record<string, { amount: number }> = {};
  for (const row of data ?? []) result[row.source_id] = { amount: Number(row.amount) };
  return result;
}
