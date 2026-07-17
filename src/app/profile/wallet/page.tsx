import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAccount } from "@/lib/account";
import { getWalletSummary, getWalletHistory, getWithdrawalHistory } from "@/lib/wallet";
import { AccountHero } from "@/components/account/account-hero";
import { BankDetailsForm } from "@/components/account/bank-details-form";
import { WithdrawForm } from "@/components/account/withdraw-form";
import { WalletActivityList } from "@/components/account/wallet-activity-list";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Your wallet — AWSOverseas",
  robots: { index: false },
};

export default async function WalletPage() {
  const account = await getAccount();
  if (!account) redirect("/login?next=/profile/wallet");
  if (account.profile.status === "incomplete") redirect("/profile/setup");

  const { profile } = account;
  const [summary, credits, withdrawals] = await Promise.all([
    getWalletSummary(profile.id),
    getWalletHistory(profile.id),
    getWithdrawalHistory(profile.id),
  ]);

  const hasBankDetails = Boolean(
    profile.bank_account_number && profile.bank_account_holder && profile.bank_name && profile.bank_ifsc,
  );

  return (
    <>
      <AccountHero
        eyebrow="Account"
        title="Your wallet"
        subtitle="Referral credit earned, and withdrawals to your bank account."
      />

      <Section spacing="md" tone="soft">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8e1b2e] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to profile
          </Link>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e4e9f2] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Available</p>
              <p className="mt-1.5 text-2xl font-bold text-[#01214a]">₹{summary.available.toLocaleString("en-IN")}</p>
            </div>
            <div className="rounded-2xl border border-[#e4e9f2] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Pending withdrawal</p>
              <p className="mt-1.5 text-2xl font-bold text-[#01214a]">
                ₹{summary.pendingWithdrawals.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e4e9f2] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8]">Lifetime earned</p>
              <p className="mt-1.5 text-2xl font-bold text-[#01214a]">₹{summary.earned.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <div className="mt-6">
            <BankDetailsForm profile={profile} />
          </div>

          <div className="mt-6">
            <WithdrawForm available={summary.available} hasBankDetails={hasBankDetails} />
          </div>

          <div className="mt-6">
            <WalletActivityList credits={credits} withdrawals={withdrawals} />
          </div>
        </div>
      </Section>
    </>
  );
}
