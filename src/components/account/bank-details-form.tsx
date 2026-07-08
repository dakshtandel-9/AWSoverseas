"use client";

import { useActionState, useEffect, useState } from "react";
import { AlertCircle, Check, Landmark, Pencil } from "lucide-react";
import { updateBankDetailsAction, type BankDetailsFormState } from "@/app/actions/wallet";
import type { UserProfile } from "@/lib/account";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#06234d] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0fade8] focus:ring-2 focus:ring-[#0fade8]/20";

const initialState: BankDetailsFormState = {};

/** Masks all but the last 4 characters, e.g. "1234567890" -> "••••••7890". */
function mask(value: string) {
  if (value.length <= 4) return value;
  return "•".repeat(value.length - 4) + value.slice(-4);
}

export function BankDetailsForm({ profile }: { profile: UserProfile }) {
  const [state, formAction, pending] = useActionState(updateBankDetailsAction, initialState);

  const hasSavedDetails = Boolean(
    profile.bank_account_number && profile.bank_account_holder && profile.bank_name && profile.bank_ifsc,
  );
  const [editing, setEditing] = useState(!hasSavedDetails);

  // Once a save succeeds, drop back to the read-only view.
  useEffect(() => {
    if (state.success) setEditing(false);
  }, [state.success]);

  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-white p-7">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-[#06234d]">
          <Landmark className="size-4 text-[#0489c2]" />
          Bank details
        </h2>
        {hasSavedDetails && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0489c2] hover:underline"
          >
            <Pencil className="size-3.5" /> Edit
          </button>
        )}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">
        Where we send your wallet withdrawals. Saved here and reused for every request.
      </p>

      {!editing ? (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Account holder", value: profile.bank_account_holder },
            { label: "Account number", value: mask(profile.bank_account_number) },
            { label: "IFSC code", value: profile.bank_ifsc },
            { label: "Bank name", value: profile.bank_name },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">{label}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-[#06234d]">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <form action={formAction} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#06234d]">Account holder name</label>
            <input
              name="bank-account-holder"
              required
              defaultValue={profile.bank_account_holder}
              placeholder="As it appears on the account"
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">Account number</label>
            <input
              name="bank-account-number"
              required
              defaultValue={profile.bank_account_number}
              placeholder="1234567890"
              autoComplete="off"
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">IFSC code</label>
            <input
              name="bank-ifsc"
              required
              defaultValue={profile.bank_ifsc}
              placeholder="SBIN0001234"
              autoComplete="off"
              spellCheck={false}
              className={`${inputClasses} font-mono uppercase placeholder:normal-case placeholder:font-sans`}
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#06234d]">Bank name</label>
            <input
              name="bank-name"
              required
              defaultValue={profile.bank_name}
              placeholder="e.g. State Bank of India"
              className={inputClasses}
            />
          </div>

          {state.error && (
            <div
              className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2"
              role="alert"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[#033e8d] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#052f69] disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save bank details"}
            </button>
            {hasSavedDetails && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm font-semibold text-[#5b6b82] hover:underline"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {state.success && !editing && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <Check className="mt-0.5 size-4 shrink-0" />
          Bank details saved.
        </div>
      )}
    </div>
  );
}
