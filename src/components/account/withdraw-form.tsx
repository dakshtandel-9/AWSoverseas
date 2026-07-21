"use client";

import { useState, useTransition } from "react";
import { AlertCircle, ArrowDownToLine, Check } from "lucide-react";
import { requestWithdrawalAction } from "@/app/actions/wallet";
import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/wallet-constants";

export function WithdrawForm({ available, hasBankDetails }: { available: number; hasBankDetails: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const disabled = !hasBankDetails || available < MIN_WITHDRAWAL_AMOUNT;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));
    if (!amount || amount < MIN_WITHDRAWAL_AMOUNT) {
      setError(`Minimum withdrawal is $${MIN_WITHDRAWAL_AMOUNT}`);
      return;
    }
    startTransition(async () => {
      const result = await requestWithdrawalAction(amount);
      if (!result.ok) setError(result.error ?? "Could not submit your request");
      else {
        setSuccess(true);
        e.currentTarget?.reset();
      }
    });
  }

  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7">
      <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#002144]">
        <ArrowDownToLine className="size-4 text-[#861b28]" />
        Request a withdrawal
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">
        {hasBankDetails
          ? `Sent to your saved bank account once approved by our team. Minimum withdrawal is $${MIN_WITHDRAWAL_AMOUNT}.`
          : "Add your bank details above before requesting a withdrawal."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="w-40">
          <label className="text-sm font-semibold text-[#002144]">Amount ($)</label>
          <input
            name="amount"
            type="number"
            min={MIN_WITHDRAWAL_AMOUNT}
            step="0.01"
            max={available}
            required
            disabled={disabled}
            placeholder={String(MIN_WITHDRAWAL_AMOUNT)}
            className="mt-2 w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20 disabled:bg-[#f6f8fc] disabled:text-[#94a3b8]"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || pending}
          className="rounded-full bg-[#02224C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#011a38] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Submitting…" : "Request withdrawal"}
        </button>
        <span className="text-xs text-[#94a3b8]">${available.toLocaleString("en-US")} available</span>
      </form>

      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check className="mt-0.5 size-4 shrink-0" />
          Withdrawal requested — we&apos;ll review it shortly.
        </div>
      )}
    </div>
  );
}
