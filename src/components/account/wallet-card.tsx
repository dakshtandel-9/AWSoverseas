import { Wallet } from "lucide-react";
import type { WalletTransaction } from "@/lib/wallet";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function WalletCard({ balance, history }: { balance: number; history: WalletTransaction[] }) {
  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-[#04162f] p-7 text-white">
      <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#48b8f8]">
        <Wallet className="size-3.5" />
        Your wallet
      </p>

      <p className="mt-4 text-3xl font-bold tracking-tight">₹{balance.toLocaleString("en-IN")}</p>
      <p className="mt-1 text-sm leading-relaxed text-white/60">
        Credit earned when someone you referred gets a quote or product enquiry approved.
      </p>

      {history.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-xs text-white/50">
          No wallet credits yet — refer someone and once their booking is approved, you&apos;ll see credit here.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4">
          {history.slice(0, 5).map((tx) => (
            <li key={tx.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold">{tx.reason || "Referral reward"}</p>
                <p className="text-xs text-white/50">{formatDate(tx.created_at)}</p>
              </div>
              <span className="shrink-0 font-mono text-sm font-semibold text-[#48b8f8]">
                +₹{tx.amount.toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
