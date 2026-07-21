"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { passwordError } from "@/lib/password";
import { PasswordChecklist } from "@/components/auth/password-checklist";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

/**
 * Rendered only once /auth/callback has verified the recovery link and
 * established a real (if short-lived) session — at that point
 * `supabase.auth.updateUser` can set the new password directly.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("This isn't connected yet. Please try again later.");
      return;
    }

    const strengthError = passwordError(password);
    if (strengthError) {
      setError(strengthError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setPending(true);
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("Couldn't reset your password — the link may have expired. Please request a new one.");
      setPending(false);
      return;
    }

    setDone(true);
    setPending(false);
    setTimeout(() => router.push("/profile"), 1800);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#9e4953] text-white">
          <Check className="size-6" />
        </span>
        <p className="text-base font-bold text-[#002144]">Password updated</p>
        <p className="text-sm text-[#5b6b82]">Taking you to your profile…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#002144]">New password</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a new password"
          className={inputClasses}
        />
        <PasswordChecklist password={password} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#002144]">Confirm new password</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your new password"
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
        className="group mt-1 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#02224C] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#011a38] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Reset password
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
