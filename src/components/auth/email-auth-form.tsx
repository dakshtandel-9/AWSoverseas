"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { passwordError } from "@/lib/password";
import { PasswordChecklist } from "@/components/auth/password-checklist";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#01214a] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#d72846] focus:ring-2 focus:ring-[#d72846]/20";

type Mode = "sign-in" | "sign-up";

/**
 * Email/password auth — one form, two modes. Email confirmation is OFF
 * for now (Supabase's "Confirm email" toggle is disabled — see
 * awsoversea-customer-auth memory) because outbound email is unreliable
 * pre-launch, so sign-up signs the user in immediately, same as sign-in.
 * Re-enable the "check your inbox" step once email delivery is fixed and
 * "Confirm email" is turned back on in Supabase.
 */
export function EmailAuthForm({ mode: initialMode, next }: { mode: Mode; next?: string }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Sign-in isn't connected yet. Please try again later.");
      return;
    }

    setError("");

    if (mode === "sign-up") {
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
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError) {
        setError(
          signUpError.message.includes("already registered")
            ? "That email already has an account — try signing in instead."
            : signUpError.message || "Couldn't create your account. Please try again.",
        );
        setPending(false);
        return;
      }

      // Supabase doesn't error on a duplicate + already-confirmed email (to
      // avoid leaking which emails are registered) — it silently returns a
      // user with no identities instead. That's the only signal we get.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("That email already has an account — try signing in instead.");
        setPending(false);
        return;
      }

      // With "Confirm email" off, signUp already returns a live session.
      window.location.assign(next || "/profile");
      return;
    }

    setPending(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(
        signInError.message.includes("Invalid login credentials")
          ? "Incorrect email or password."
          : "Couldn't sign in. Please try again.",
      );
      setPending(false);
      return;
    }

    window.location.assign(next || "/profile");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 rounded-xl border border-[#e4e9f2] bg-[#f6f8fc] p-1">
        {(["sign-in", "sign-up"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError("");
              setConfirmPassword("");
            }}
            className={cn(
              "rounded-lg py-2 text-sm font-semibold transition-colors",
              mode === m ? "bg-white text-[#01214a] shadow-[0_1px_2px_rgba(4,22,47,0.08)]" : "text-[#5b6b82]",
            )}
          >
            {m === "sign-in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

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

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label className="text-sm font-semibold text-[#01214a]">Password</label>
            {mode === "sign-in" && (
              <Link href="/forgot-password" className="text-xs font-semibold text-[#8e1b2e] hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <input
            type="password"
            required
            minLength={mode === "sign-up" ? 8 : undefined}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "sign-up" ? "Create a password" : "Your password"}
            className={inputClasses}
          />
          {mode === "sign-up" && password && <PasswordChecklist password={password} />}
        </div>

        {mode === "sign-up" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#01214a]">Confirm password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={inputClasses}
            />
          </div>
        )}

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
              {mode === "sign-up" ? "Create account" : "Sign in"}
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
