"use client";

import { useState } from "react";
import { Gift, ListFilter } from "lucide-react";
import { cn } from "@/lib/cn";
import { WithdrawalStatusBadge } from "@/components/account/withdrawal-status-badge";
import type { WalletTransaction, WalletWithdrawal } from "@/lib/wallet";

type ActivityEntry =
  | { kind: "credit"; id: string; date: string; data: WalletTransaction }
  | { kind: "withdrawal"; id: string; date: string; data: WalletWithdrawal };

type Filter = "all" | "credit" | "withdrawal";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "credit", label: "Credits" },
  { value: "withdrawal", label: "Withdrawals" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function WalletActivityList({
  credits,
  withdrawals,
}: {
  credits: WalletTransaction[];
  withdrawals: WalletWithdrawal[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const entries: ActivityEntry[] = [
    ...credits.map((tx): ActivityEntry => ({ kind: "credit", id: tx.id, date: tx.created_at, data: tx })),
    ...withdrawals.map((w): ActivityEntry => ({ kind: "withdrawal", id: w.id, date: w.created_at, data: w })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filtered = entries.filter((e) => filter === "all" || e.kind === filter);

  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#002144]">
          <ListFilter className="size-4 text-[#8d1a32]" />
          Wallet activity
        </h2>

        <div className="inline-flex items-center gap-1 rounded-full border border-[#e4e9f2] p-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                filter === value ? "bg-[#002144] text-white" : "text-[#5b6b82] hover:text-[#002144]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-8 text-center text-sm text-[#94a3b8]">
          {filter === "credit"
            ? "No wallet credits yet — refer someone and once their booking is approved, you'll see credit here."
            : filter === "withdrawal"
              ? "No withdrawal requests yet."
              : "No wallet activity yet."}
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-[#eef3fb]">
          {filtered.map((entry) =>
            entry.kind === "credit" ? (
              <li key={`credit-${entry.id}`} className="flex items-start justify-between gap-3 py-4 text-sm">
                <div className="flex min-w-0 items-start gap-2.5">
                  <Gift className="mt-0.5 size-3.5 shrink-0 text-[#8d1a32]" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#002144]">{entry.data.reason || "Referral reward"}</p>
                    <p className="mt-0.5 text-xs text-[#5b6b82]">
                      {entry.data.referredName
                        ? `From ${entry.data.referredName}'s ${entry.data.source_type}`
                        : `${entry.data.source_type} reward`}
                      {" · "}
                      {formatDate(entry.data.created_at)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-sm font-semibold text-emerald-600">
                  +${entry.data.amount.toLocaleString("en-US")}
                </span>
              </li>
            ) : (
              <li
                key={`withdrawal-${entry.id}`}
                className="flex flex-col gap-2 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[#002144]">Withdrawal · ${entry.data.amount.toLocaleString("en-US")}</p>
                  <p className="mt-0.5 text-xs text-[#5b6b82]">
                    {entry.data.bank_name} · {formatDate(entry.data.created_at)}
                  </p>
                  {entry.data.status === "rejected" && entry.data.rejection_reason && (
                    <p className="mt-0.5 text-xs text-red-600">Reason: {entry.data.rejection_reason}</p>
                  )}
                </div>
                <WithdrawalStatusBadge status={entry.data.status} />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
