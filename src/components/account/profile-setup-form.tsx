"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Check, Gift, Loader2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  completeProfileAction,
  checkUsernameAction,
  suggestUsernameAction,
  type ProfileFormState,
} from "@/app/actions/account";
import { PassportUploadField } from "@/components/account/passport-upload-field";
import type { UserProfile } from "@/lib/account";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#06234d] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0fade8] focus:ring-2 focus:ring-[#0fade8]/20";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

const initialState: ProfileFormState = {};

export function ProfileSetupForm({
  profile,
  suggestedUsername,
  referrerLabel,
}: {
  profile: UserProfile;
  suggestedUsername: string;
  /** "Name (@username)" of the account whose code this user already used. */
  referrerLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(completeProfileAction, initialState);

  const firstTime = profile.status === "incomplete";
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [username, setUsername] = useState(profile.username ?? suggestedUsername);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [frontUrl, setFrontUrl] = useState(profile.passport_front_url);
  const [backUrl, setBackUrl] = useState(profile.passport_back_url);

  // Once the user touches the username we stop regenerating it from names.
  const usernameEdited = useRef(Boolean(profile.username));
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleUsernameWork(fn: () => void) {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(fn, 450);
  }

  function onNamesChanged(nextFirst: string, nextLast: string) {
    if (usernameEdited.current || !nextFirst.trim() || !nextLast.trim()) return;
    setUsernameStatus("checking");
    scheduleUsernameWork(async () => {
      const { username: suggestion } = await suggestUsernameAction(nextFirst, nextLast);
      if (suggestion && !usernameEdited.current) {
        setUsername(suggestion);
        setUsernameStatus("available");
      }
    });
  }

  function onUsernameChanged(raw: string) {
    usernameEdited.current = true;
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9._-]/g, "");
    setUsername(cleaned);

    if (cleaned.length < 3) {
      setUsernameStatus(cleaned ? "invalid" : "idle");
      return;
    }
    setUsernameStatus("checking");
    scheduleUsernameWork(async () => {
      const { available } = await checkUsernameAction(cleaned);
      setUsernameStatus(available ? "available" : "taken");
    });
  }

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const usernameHint: Record<UsernameStatus, React.ReactNode> = {
    idle: <span className="text-[#94a3b8]">Generated from your name — change it to anything you like.</span>,
    checking: (
      <span className="inline-flex items-center gap-1.5 text-[#5b6b82]">
        <Loader2 className="size-3 animate-spin" /> Checking availability…
      </span>
    ),
    available: (
      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
        <Check className="size-3" /> @{username} is available
      </span>
    ),
    taken: (
      <span className="inline-flex items-center gap-1.5 font-medium text-red-600">
        <X className="size-3" /> Already taken — try another
      </span>
    ),
    invalid: (
      <span className="text-red-600">At least 3 characters: letters, numbers, dots, dashes, underscores.</span>
    ),
  };

  return (
    <form
      action={formAction}
      className="mx-auto max-w-3xl rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]"
    >
      <div className="flex items-center justify-between rounded-t-3xl border-b border-[#e4e9f2] bg-[#f6f8fc] px-7 py-5 sm:px-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {firstTime ? "Account Verification — New" : "Account Details"}
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8] sm:block">
          {firstTime ? "3 sections" : "2 sections"}
        </span>
      </div>

      {/* 01 — Personal details */}
      <div className="border-b border-[#e4e9f2] px-7 py-8 sm:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs font-bold text-[#94a3b8]">01</span>
          <h2 className="text-lg font-bold text-[#06234d]">Your details</h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">
              First name <span className="text-[#0489c2]">*</span>
            </label>
            <input
              name="first-name"
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                onNamesChanged(e.target.value, lastName);
              }}
              placeholder="First name"
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">
              Last name <span className="text-[#0489c2]">*</span>
            </label>
            <input
              name="last-name"
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                onNamesChanged(firstName, e.target.value);
              }}
              placeholder="Last name"
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">
              Username <span className="text-[#0489c2]">*</span>
            </label>
            <input
              name="username"
              required
              value={username}
              onChange={(e) => onUsernameChanged(e.target.value)}
              placeholder="your.username"
              autoComplete="off"
              spellCheck={false}
              className={inputClasses}
            />
            <p className="text-xs leading-relaxed">{usernameHint[usernameStatus]}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">
              Phone number <span className="text-[#0489c2]">*</span>
            </label>
            <input name="phone" type="tel" required defaultValue={profile.phone} placeholder="+91 98765 43210" className={inputClasses} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">Company name</label>
            <input name="company-name" defaultValue={profile.company_name} placeholder="Your company (optional)" className={inputClasses} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">Email</label>
            <input value={profile.email} disabled className={cn(inputClasses, "bg-[#f6f8fc] text-[#5b6b82]")} />
            <p className="text-xs text-[#94a3b8]">Your account email — used to sign in.</p>
          </div>
        </div>
      </div>

      {/* 02 — Passport verification */}
      <div className="border-b border-[#e4e9f2] px-7 py-8 sm:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs font-bold text-[#94a3b8]">02</span>
          <h2 className="text-lg font-bold text-[#06234d]">Passport verification</h2>
        </div>
        <p className="mt-1.5 pl-7 text-sm leading-relaxed text-[#5b6b82]">
          International shipping requires identity verification — our team reviews these before your
          account is approved.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#06234d]">
              Passport number <span className="text-[#0489c2]">*</span>
            </label>
            <input
              name="passport-number"
              required
              defaultValue={profile.passport_number}
              placeholder="e.g. A1234567"
              autoComplete="off"
              className={inputClasses}
            />
          </div>

          <PassportUploadField label="Passport front" value={frontUrl} onUploaded={setFrontUrl} />
          <PassportUploadField label="Passport back" value={backUrl} onUploaded={setBackUrl} />
          <input type="hidden" name="passport-front-url" value={frontUrl} />
          <input type="hidden" name="passport-back-url" value={backUrl} />
        </div>
      </div>

      {/* 03 — Referral code (locked after first submission) */}
      {firstTime && !profile.referred_by ? (
        <div className="border-b border-[#e4e9f2] px-7 py-8 sm:px-10">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-bold text-[#94a3b8]">03</span>
            <h2 className="text-lg font-bold text-[#06234d]">Referral code</h2>
          </div>
          <p className="mt-1.5 pl-7 text-sm leading-relaxed text-[#5b6b82]">
            Were you referred by an existing customer? Enter their code — this can&rsquo;t be changed
            later.
          </p>
          <div className="mt-6 max-w-xs">
            <input
              name="referral-code"
              placeholder="AWS-XXXXXX (optional)"
              autoComplete="off"
              spellCheck={false}
              className={cn(inputClasses, "font-mono uppercase placeholder:normal-case placeholder:font-sans")}
            />
          </div>
        </div>
      ) : (
        referrerLabel && (
          <div className="flex items-center gap-3 border-b border-[#e4e9f2] px-7 py-6 text-sm text-[#5b6b82] sm:px-10">
            <Gift className="size-4 shrink-0 text-[#0489c2]" />
            Referred by <span className="font-semibold text-[#06234d]">{referrerLabel}</span>
          </div>
        )
      )}

      <div className="px-7 py-8 sm:px-10">
        {state.error && (
          <div
            className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending || usernameStatus === "taken" || usernameStatus === "checking"}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#033e8d] px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#052f69] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
        >
          {pending ? "Saving…" : firstTime ? "Submit for verification" : "Save changes"}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>

        {firstTime && (
          <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">
            After you submit, our team reviews your details — you&rsquo;ll be able to request quotes and
            send product enquiries once your account is approved.
          </p>
        )}
      </div>
    </form>
  );
}
