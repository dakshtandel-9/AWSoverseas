import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { ReferralGroup, type ReferralUser } from "@/components/admin/referral-group";
import { AdminPageHeader } from "@/components/admin/page-header";

const PROFILE_COLUMNS = "id, first_name, last_name, username, email, referral_code, referred_by, status, created_at";

async function getReferralUsers(): Promise<ReferralUser[]> {
  const db = supabaseAdmin();
  const { data } = await db.from("user_profiles").select(PROFILE_COLUMNS).order("created_at", { ascending: true });
  return (data as ReferralUser[] | null) ?? [];
}

export default async function AdminReferralsPage() {
  const configured = isSupabaseConfigured();
  const users = configured ? await getReferralUsers() : [];

  const byId = new Map(users.map((user) => [user.id, user]));
  const referredByReferrer = new Map<string, ReferralUser[]>();
  for (const user of users) {
    if (!user.referred_by) continue;
    const list = referredByReferrer.get(user.referred_by) ?? [];
    list.push(user);
    referredByReferrer.set(user.referred_by, list);
  }

  const referrers = [...referredByReferrer.entries()]
    .map(([referrerId, referred]) => ({ referrer: byId.get(referrerId) ?? null, referred }))
    .filter((group): group is { referrer: ReferralUser; referred: ReferralUser[] } => group.referrer !== null)
    .sort((a, b) => b.referred.length - a.referred.length);

  const totalReferred = users.filter((user) => user.referred_by).length;

  return (
    <div>
      <AdminPageHeader
        href="/admin/referrals"
        description={
          <>
            Every sign-up that used someone else&apos;s referral code, grouped by who sent them. Pay out a
            reward from{" "}
            <Link href="/admin/wallets" className="font-semibold text-maroon-admin hover:underline">
              Wallets
            </Link>
            .
          </>
        }
      />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      {configured && (
        <p className="mt-6 inline-flex items-baseline gap-2 rounded-2xl border border-[#e4e9f2] bg-white px-5 py-3">
          <span className="font-mono text-xl font-bold text-[#1A0A53]">{totalReferred}</span>
          <span className="text-sm text-[#5b6b82]">
            referred sign-up{totalReferred === 1 ? "" : "s"} across {referrers.length} referrer
            {referrers.length === 1 ? "" : "s"}
          </span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {referrers.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No one has signed up with a referral code yet.
          </p>
        )}
        {referrers.map(({ referrer, referred }) => (
          <ReferralGroup key={referrer.id} referrer={referrer} referred={referred} />
        ))}
      </div>
    </div>
  );
}
