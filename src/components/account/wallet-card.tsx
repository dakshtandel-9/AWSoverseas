import Link from "next/link";
import { ArrowRight, Wallet } from "lucide-react";
import type { WalletSummary } from "@/lib/wallet";

export function WalletCard({ summary }: { summary: WalletSummary }) {
  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-[#CFE8FF] p-7 text-ink">
      <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-admin">
        <Wallet className="size-3.5" />
        Your wallet
      </p>

      <p className="mt-4 text-3xl font-bold tracking-tight">${summary.available.toLocaleString("en-US")}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink/60">
        {summary.pendingWithdrawals > 0
          ? `Available to withdraw · $${summary.pendingWithdrawals.toLocaleString("en-US")} pending review`
          : "Available to withdraw — credit earned from your referrals."}
      </p>

      <Link
        href="/profile/wallet"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-admin hover:text-ink"
      >
        View wallet & withdraw <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
