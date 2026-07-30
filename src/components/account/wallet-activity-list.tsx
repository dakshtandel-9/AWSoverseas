import { Gift, ListFilter, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { WalletTransaction } from "@/lib/wallet";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Where the money came from or went, in the customer's own terms. */
function sourceLine(tx: WalletTransaction) {
  if (tx.source_type === "adjustment") {
    return tx.amount < 0 ? "Deducted by aws overseas" : "Added by aws overseas";
  }
  if (tx.source_type === "signup") return "Credited when you created your account";
  if (tx.referredName) return `From ${tx.referredName}'s ${tx.source_type}`;
  return `${tx.source_type} reward`;
}

export function WalletActivityList({ credits }: { credits: WalletTransaction[] }) {
  const entries = [...credits].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7">
      <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#1A0A53]">
        <ListFilter className="size-4 text-maroon-admin" />
        Wallet activity
      </h2>

      {entries.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
          No wallet credits yet — refer someone and once their booking is approved, you&apos;ll see credit here.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-[#eef3fb]">
          {entries.map((tx) => {
            const isDeduction = tx.amount < 0;
            const Icon =
              tx.source_type === "adjustment" ? (isDeduction ? MinusCircle : PlusCircle) : Gift;

            return (
              <li key={tx.id} className="flex items-start justify-between gap-3 py-4 text-sm">
                <div className="flex min-w-0 items-start gap-2.5">
                  <Icon
                    className={cn("mt-0.5 size-3.5 shrink-0", isDeduction ? "text-red-500" : "text-maroon-admin")}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1A0A53]">{tx.reason || "Referral reward"}</p>
                    <p className="mt-0.5 text-xs text-[#5b6b82]">
                      {sourceLine(tx)} · {formatDate(tx.created_at)}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 font-mono text-sm font-semibold",
                    isDeduction ? "text-red-600" : "text-emerald-600",
                  )}
                >
                  {isDeduction ? "−" : "+"}${Math.abs(tx.amount).toLocaleString("en-US")}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
