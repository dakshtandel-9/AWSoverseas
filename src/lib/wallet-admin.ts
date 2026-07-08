import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { AdminUserProfile } from "@/components/admin/user-profile-modal";

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

const PROFILE_COLUMNS =
  "id, email, first_name, last_name, username, phone, company_name, passport_number, passport_front_url, passport_back_url, referral_code, status, created_at";

/**
 * Batch-fetches full profiles (for the "View profile" popup on quote/
 * enquiry/withdrawal rows) keyed by user_id, so each admin list page can
 * look one up per row without a query per row.
 */
export async function getProfilesForUsers(userIds: string[]): Promise<Record<string, AdminUserProfile>> {
  const uniqueIds = [...new Set(userIds)];
  if (uniqueIds.length === 0) return {};

  const db = supabaseAdmin();
  const { data } = await db.from("user_profiles").select(PROFILE_COLUMNS).in("id", uniqueIds);

  const result: Record<string, AdminUserProfile> = {};
  for (const row of (data as AdminUserProfile[] | null) ?? []) result[row.id] = row;
  return result;
}

/**
 * Batch-resolves total credit already granted per source (a booking can be
 * credited more than once, e.g. a top-up bonus, so this sums all rows and
 * also reports how many separate credits make up that total).
 */
export async function getWalletCreditsForSources(
  sourceType: "quote" | "enquiry",
  sourceIds: string[],
): Promise<Record<string, { amount: number; count: number }>> {
  if (sourceIds.length === 0) return {};

  const db = supabaseAdmin();
  const { data } = await db
    .from("wallet_transactions")
    .select("source_id, amount")
    .eq("source_type", sourceType)
    .in("source_id", sourceIds);

  const result: Record<string, { amount: number; count: number }> = {};
  for (const row of data ?? []) {
    const existing = result[row.source_id] ?? { amount: 0, count: 0 };
    existing.amount += Number(row.amount);
    existing.count += 1;
    result[row.source_id] = existing;
  }
  return result;
}
