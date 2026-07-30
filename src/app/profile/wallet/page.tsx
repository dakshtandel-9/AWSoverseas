import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAccount } from "@/lib/account";
import { getWalletSummary, getWalletHistory } from "@/lib/wallet";
import { AccountHero } from "@/components/account/account-hero";
import { WalletActivityList } from "@/components/account/wallet-activity-list";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Your wallet — aws overseas impex",
  robots: { index: false },
};

export default async function WalletPage() {
  const account = await getAccount();
  if (!account) redirect("/login?next=/profile/wallet");
  if (account.profile.status === "incomplete") redirect("/profile/setup");

  const { profile } = account;
  const [summary, credits] = await Promise.all([
    getWalletSummary(profile.id),
    getWalletHistory(profile.id),
  ]);

  return (
    <>
      <AccountHero
        eyebrow="Account"
        title="Your wallet"
        subtitle="Credit earned from your welcome bonus and referrals."
      />

      <Section spacing="md" tone="soft">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-admin hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to profile
          </Link>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e4e9f2] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Balance</p>
              <p className="mt-1.5 text-2xl font-bold text-[#1A0A53]">${summary.available.toLocaleString("en-US")}</p>
            </div>
            <div className="rounded-2xl border border-[#e4e9f2] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Lifetime earned</p>
              <p className="mt-1.5 text-2xl font-bold text-[#1A0A53]">${summary.earned.toLocaleString("en-US")}</p>
            </div>
          </div>

          <div className="mt-6">
            <WalletActivityList credits={credits} />
          </div>
        </div>
      </Section>
    </>
  );
}
