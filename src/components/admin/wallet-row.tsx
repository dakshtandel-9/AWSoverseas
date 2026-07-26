"use client";

import { useRef, useState, useTransition } from "react";
import { ChevronDown, Gift, Minus, Plus, RotateCcw, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import { adjustWalletAction } from "@/app/admin/(dashboard)/wallets/actions";
import type { WalletSourceType } from "@/lib/wallet";

export type AdminWalletEntry = {
  id: string;
  amount: number;
  reason: string;
  source_type: WalletSourceType;
  created_at: string;
  referredName: string | null;
};

export type AdminWalletCustomer = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  earned: number;
  deducted: number;
  available: number;
  history: AdminWalletEntry[];
};

const money = (value: number) => `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** What produced a ledger row, in the admin's words. */
function entryLabel(entry: AdminWalletEntry) {
  if (entry.source_type === "adjustment") return entry.amount < 0 ? "Deducted by admin" : "Added by admin";
  if (entry.source_type === "signup") return "Welcome bonus";
  return entry.referredName
    ? `Referral — ${entry.referredName}'s ${entry.source_type}`
    : `Referral — ${entry.source_type}`;
}

function AdjustForm({ customer }: { customer: AdminWalletCustomer }) {
  const [direction, setDirection] = useState<"add" | "deduct">("add");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(null);

    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));
    const reason = String(form.get("reason") ?? "").trim();

    if (!amount || amount <= 0) {
      setError("Enter an amount greater than zero");
      return;
    }
    if (!reason) {
      setError("Add a reason — the customer sees it in their wallet activity");
      return;
    }
    if (direction === "deduct" && amount > customer.available) {
      setError(`That's more than the ${money(customer.available)} balance`);
      return;
    }

    startTransition(async () => {
      const result = await adjustWalletAction(customer.id, direction, amount, reason);
      if (!result.ok) {
        setError(result.error ?? "Could not update the wallet");
        return;
      }
      formRef.current?.reset();
      setDone(`${direction === "add" ? "Added" : "Deducted"} ${money(amount)}.`);
    });
  }

  const toggle = "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="mt-5 border-t border-[#e4e9f2] pt-5">
      <p className="text-sm font-semibold text-[#002144]">Adjust balance</p>
      <p className="mt-1 text-xs text-[#5b6b82]">
        Adding or deducting writes a new line in this customer&apos;s wallet activity. Earlier entries are never
        changed.
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-2.5">
        <div className="flex w-full max-w-[220px] items-center gap-1 rounded-xl border border-[#e4e9f2] p-1">
          <button
            type="button"
            onClick={() => setDirection("add")}
            aria-pressed={direction === "add"}
            className={cn(
              toggle,
              direction === "add" ? "bg-emerald-600 text-white" : "text-[#5b6b82] hover:text-[#002144]",
            )}
          >
            <Plus className="mr-1 inline size-3.5" />
            Add
          </button>
          <button
            type="button"
            onClick={() => setDirection("deduct")}
            aria-pressed={direction === "deduct"}
            className={cn(
              toggle,
              direction === "deduct" ? "bg-red-600 text-white" : "text-[#5b6b82] hover:text-[#002144]",
            )}
          >
            <Minus className="mr-1 inline size-3.5" />
            Deduct
          </button>
        </div>

        <label className="flex w-28 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Amount ($)</span>
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="25"
            className="w-full rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#002144] placeholder:text-[#94a3b8]"
          />
        </label>

        <label className="flex min-w-[200px] flex-1 flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Reason</span>
          <input
            name="reason"
            required
            placeholder={direction === "add" ? "Goodwill credit" : "Reversed duplicate referral"}
            className="w-full rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#002144] placeholder:text-[#94a3b8]"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50",
            direction === "add" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700",
          )}
        >
          {direction === "add" ? "Add to wallet" : "Deduct from wallet"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      {done && <p className="mt-2 text-xs font-medium text-emerald-700">{done}</p>}
    </form>
  );
}

export function WalletRow({ customer }: { customer: AdminWalletCustomer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#e4e9f2] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#002144]">{customer.name}</p>
          <p className="truncate text-xs text-[#94a3b8]">
            {customer.username ? `@${customer.username} · ` : ""}
            {customer.email}
          </p>
        </div>

        <span className="shrink-0 text-right">
          <span className="block font-mono text-sm font-bold text-[#002144]">{money(customer.available)}</span>
          <span className="block text-[11px] text-[#94a3b8]">balance</span>
        </span>

        <ChevronDown className={cn("size-4 shrink-0 text-[#94a3b8] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-[#e4e9f2] px-5 py-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f7f9fd] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Balance</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-[#002144]">{money(customer.available)}</p>
            </div>
            <div className="rounded-xl bg-[#f7f9fd] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Credited</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-emerald-700">{money(customer.earned)}</p>
            </div>
            <div className="rounded-xl bg-[#f7f9fd] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Deducted</p>
              <p className="mt-0.5 font-mono text-lg font-bold text-[#002144]">
                {customer.deducted > 0 ? `−${money(customer.deducted)}` : money(0)}
              </p>
            </div>
          </div>

          <AdjustForm customer={customer} />

          <div className="mt-5 border-t border-[#e4e9f2] pt-4">
            <p className="text-sm font-semibold text-[#002144]">Wallet activity</p>
            {customer.history.length === 0 ? (
              <p className="mt-2 text-xs text-[#94a3b8]">Nothing in this wallet yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-[#eef3fb]">
                {customer.history.map((entry) => {
                  const isDeduction = entry.amount < 0;
                  const Icon = entry.source_type === "adjustment" ? (isDeduction ? RotateCcw : Wallet) : Gift;
                  return (
                    <li key={entry.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <Icon
                          className={cn(
                            "mt-0.5 size-3.5 shrink-0",
                            isDeduction ? "text-red-500" : "text-maroon-admin",
                          )}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-[#002144]">{entry.reason || entryLabel(entry)}</p>
                          <p className="mt-0.5 text-xs text-[#5b6b82]">
                            {entryLabel(entry)} · {formatDate(entry.created_at)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 font-mono text-sm font-semibold",
                          isDeduction ? "text-red-600" : "text-emerald-600",
                        )}
                      >
                        {isDeduction ? "−" : "+"}
                        {money(Math.abs(entry.amount))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
