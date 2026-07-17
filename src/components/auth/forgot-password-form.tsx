"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#01214a] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#d72846] focus:ring-2 focus:ring-[#d72846]/20";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("This isn't connected yet. Please try again later.");
      return;
    }

    setPending(true);
    setError("");

    // Always show the same "check your inbox" result whether or not the
    // email exists — Supabase silently no-ops for unknown emails, so
    // treating any non-error response as success avoids leaking who has
    // an account and matches the sign-up form's behavior.
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
    });

    if (resetError) {
      setError("Couldn't send the reset link. Please try again.");
      setPending(false);
      return;
    }

    setSent(true);
    setPending(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#eef3fb] text-[#01214a]">
          <Mail className="size-6" />
        </span>
        <div>
          <p className="text-base font-bold text-[#01214a]">Check your inbox</p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5b6b82]">
            If <span className="font-semibold">{email}</span> has an account, we&rsquo;ve sent a link to reset
            its password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#01214a]">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={inputClasses}
        />
      </div>

      {error && (
        <p className="flex items-start gap-2 text-sm font-medium text-red-600" role="alert">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-1 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#01214a] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#011938] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Send reset link
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
