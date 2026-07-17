import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { getAccount } from "@/lib/account";
import { supabaseAdmin } from "@/lib/supabase/server";
import { AccountHero } from "@/components/account/account-hero";
import { ReferralStatusBadge } from "@/components/account/referral-status-badge";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Your referrals — AWSOverseas",
  robots: { index: false },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ReferralsPage() {
  const account = await getAccount();
  if (!account) redirect("/login?next=/profile/referrals");
  if (account.profile.status === "incomplete") redirect("/profile/setup");

  const { profile } = account;
  const db = supabaseAdmin();

  const { data: referrals } = await db
    .from("user_profiles")
    .select("id, first_name, last_name, username, status, created_at")
    .eq("referred_by", profile.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <AccountHero
        eyebrow="Account"
        title="Your referrals"
        subtitle={`People who signed up with your code ${profile.referral_code}.`}
      />

      <Section spacing="md" tone="soft">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8e1b2e] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to profile
          </Link>

          <div className="mt-5 rounded-3xl border border-[#e4e9f2] bg-white p-7">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#01214a]">
              <Users className="size-4 text-[#8e1b2e]" />
              {referrals?.length ?? 0} {referrals?.length === 1 ? "referral" : "referrals"}
            </h2>

            {!referrals || referrals.length === 0 ? (
              <p className="mt-5 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
                No referrals yet — share your code to get started.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-[#eef3fb]">
                {referrals.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#01214a]">
                        {r.first_name} {r.last_name}
                      </p>
                      {r.username && <p className="truncate text-xs text-[#5b6b82]">@{r.username}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <ReferralStatusBadge status={r.status} />
                      <span className="text-xs text-[#94a3b8]">Joined {formatDate(r.created_at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
