"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { markWithdrawalPaidAction, rejectWithdrawalAction } from "@/app/admin/(dashboard)/withdrawals/actions";
import { ViewProfileButton, type AdminUserProfile } from "@/components/admin/user-profile-modal";

type Withdrawal = {
  id: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  bank_account_number: string;
  bank_account_holder: string;
  bank_name: string;
  bank_ifsc: string;
  rejection_reason: string;
  created_at: string;
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-[#eef3fb] text-[#002144]",
  paid: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting review",
  paid: "Paid",
  rejected: "Rejected",
};

function DecisionPanel({ item }: { item: Withdrawal }) {
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");

  if (item.status !== "pending") {
    return (
      item.status === "rejected" &&
      item.rejection_reason && <p className="mt-3 text-xs text-[#5b6b82]">Reason: {item.rejection_reason}</p>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-end gap-2.5 border-t border-[#e4e9f2] pt-4">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => markWithdrawalPaidAction(item.id))}
        className="rounded-lg bg-[#02224C] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#011a38] disabled:opacity-50"
      >
        Mark as paid
      </button>
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Rejection reason (optional)"
        className="min-w-[200px] flex-1 rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#002144] placeholder:text-[#94a3b8]"
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => rejectWithdrawalAction(item.id, reason))}
        className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}

export function WithdrawalRow({
  item,
  requesterName,
  profile,
}: {
  item: Withdrawal;
  requesterName: string;
  profile: AdminUserProfile | null;
}) {
  const [open, setOpen] = useState(false);
  const createdAt = new Date(item.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-[#e4e9f2] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#002144]">{requesterName}</p>
          <p className="truncate text-xs text-[#94a3b8]">{item.bank_name}</p>
        </div>
        <span
          className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:block ${STATUS_BADGE[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
        <span className="shrink-0 font-mono text-xs text-[#94a3b8]">${item.amount.toLocaleString("en-US")}</span>
        <span className="shrink-0 text-xs text-[#94a3b8]">{createdAt}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#94a3b8] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-[#e4e9f2] px-5 py-4">
          {profile && (
            <div className="mb-3 flex justify-end">
              <ViewProfileButton profile={profile} />
            </div>
          )}
          <div className="grid gap-2 text-sm leading-relaxed text-[#002144]">
            <p>
              <span className="font-semibold">Amount:</span> ${item.amount.toLocaleString("en-US")}
            </p>
            <p>
              <span className="font-semibold">Account holder:</span> {item.bank_account_holder}
            </p>
            <p>
              <span className="font-semibold">Account number:</span> {item.bank_account_number}
            </p>
            <p>
              <span className="font-semibold">Bank:</span> {item.bank_name}
            </p>
            <p>
              <span className="font-semibold">IFSC:</span> {item.bank_ifsc}
            </p>
          </div>
          <DecisionPanel item={item} />
        </div>
      )}
    </div>
  );
}
