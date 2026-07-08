"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Wallet } from "lucide-react";

const fieldClasses =
  "w-full rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#06234d] placeholder:text-[#94a3b8]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">{label}</span>
      {children}
    </label>
  );
}

/**
 * Referral reward control shown on a quote/enquiry row. A booking can be
 * credited more than once (e.g. a top-up bonus on top of the original
 * reward) — once at least one credit exists, the form is collapsed behind
 * an "Add more" button instead of being locked out.
 */
export function CreditWalletForm({
  referrerName,
  alreadyCredited,
  onCredit,
}: {
  referrerName: string | null;
  alreadyCredited: { amount: number; count: number } | null;
  onCredit: (amount: number, reason: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(!alreadyCredited);
  const formRef = useRef<HTMLFormElement>(null);

  if (!referrerName) {
    return (
      <div className="mt-4 border-t border-[#e4e9f2] pt-4">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#94a3b8]">
          <Wallet className="size-3.5" /> No referrer on this account — nothing to credit.
        </p>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));
    const reason = String(form.get("reason") ?? "").trim();
    if (!amount || amount <= 0) {
      setError("Enter an amount greater than zero");
      return;
    }
    startTransition(async () => {
      const result = await onCredit(amount, reason);
      if (!result.ok) setError(result.error ?? "Could not credit wallet");
      else {
        formRef.current?.reset();
        setFormOpen(false);
      }
    });
  }

  return (
    <div className="mt-4 border-t border-[#e4e9f2] pt-4">
      {alreadyCredited && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Wallet className="size-3.5" /> Credited ₹{alreadyCredited.amount.toLocaleString("en-IN")} to{" "}
            {referrerName}&apos;s wallet
            {alreadyCredited.count > 1 ? ` (${alreadyCredited.count} credits)` : ""}.
          </p>
          {!formOpen && (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0489c2] hover:underline"
            >
              <Plus className="size-3.5" /> Add more
            </button>
          )}
        </div>
      )}

      {formOpen && (
        <>
          {!alreadyCredited && (
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#06234d]">
              <Wallet className="size-3.5 text-[#0489c2]" /> Credit {referrerName}&apos;s wallet for this referral
            </p>
          )}
          <form ref={formRef} onSubmit={onSubmit} className="mt-3 flex flex-wrap items-end gap-2.5">
            <div className="w-28">
              <Field label="Amount (₹)">
                <input name="amount" type="number" min="0" step="0.01" required placeholder="500" className={fieldClasses} />
              </Field>
            </div>
            <div className="min-w-[200px] flex-1">
              <Field label="Reason (optional)">
                <input name="reason" placeholder="Referral reward" className={fieldClasses} />
              </Field>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-[#033e8d] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#052f69] disabled:opacity-50"
            >
              Credit wallet
            </button>
            {alreadyCredited && (
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-xs font-semibold text-[#5b6b82] hover:underline"
              >
                Cancel
              </button>
            )}
          </form>
          {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
}
