"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/cn";
import { supabaseBrowser } from "@/lib/supabase/browser";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#06234d] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0fade8] focus:ring-2 focus:ring-[#0fade8]/20";

type Mode = "sign-in" | "sign-up";

/**
 * Email/password auth — one form, two modes. Sign-up sends Supabase's
 * confirmation email (project has "Confirm email" enabled) and shows a
 * "check your inbox" state instead of signing the user in immediately;
 * sign-in goes straight through and the caller navigates on success.
 */
export function EmailAuthForm({ mode: initialMode, next }: { mode: Mode; next?: string }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = supabaseBrowser();
    if (!supabase) {
      setError("Sign-in isn't connected yet. Please try again later.");
      return;
    }

    setPending(true);
    setError("");

    if (mode === "sign-up") {
      const emailRedirectTo = `${window.location.origin}/auth/callback${
        next ? `?next=${encodeURIComponent(next)}` : ""
      }`;
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo },
      });
      if (signUpError) {
        setError(
          signUpError.message.includes("already registered")
            ? "That email already has an account — try signing in instead."
            : signUpError.message || "Couldn't create your account. Please try again.",
        );
        setPending(false);
        return;
      }
      setSentTo(email);
      setPending(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(
        signInError.message.includes("Invalid login credentials")
          ? "Incorrect email or password."
          : signInError.message.includes("Email not confirmed")
            ? "Please confirm your email first — check your inbox for the link we sent."
            : "Couldn't sign in. Please try again.",
      );
      setPending(false);
      return;
    }

    window.location.assign(next || "/profile");
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#eef3fb] text-[#033e8d]">
          <Mail className="size-6" />
        </span>
        <div>
          <p className="text-base font-bold text-[#06234d]">Check your inbox</p>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5b6b82]">
            We&rsquo;ve sent a confirmation link to <span className="font-semibold">{sentTo}</span>. Click it to
            activate your account, then come back and sign in.
          </p>
        </div>
      </div>
    );
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
            }}
            className={cn(
              "rounded-lg py-2 text-sm font-semibold transition-colors",
              mode === m ? "bg-white text-[#06234d] shadow-[0_1px_2px_rgba(4,22,47,0.08)]" : "text-[#5b6b82]",
            )}
          >
            {m === "sign-in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#06234d]">Email</label>
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
          <label className="text-sm font-semibold text-[#06234d]">Password</label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "sign-up" ? "At least 6 characters" : "Your password"}
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
          className="group mt-1 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#033e8d] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#052f69] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
