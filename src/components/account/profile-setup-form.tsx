"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Gift, Loader2, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  completeProfileAction,
  checkUsernameAction,
  suggestUsernameAction,
  type ProfileFormState,
} from "@/app/actions/account";
import { PhoneInput } from "@/components/account/phone-input";
import { CountrySelect } from "@/components/quote/country-select";
import { SignOutButton } from "@/components/account/sign-out-button";
import type { IdType, UserProfile } from "@/lib/account";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

const idCopy: Record<IdType, { toggleLabel: string; numberLabel: string; numberPlaceholder: string }> = {
  passport: { toggleLabel: "Passport", numberLabel: "Passport number", numberPlaceholder: "e.g. A1234567" },
  aadhaar: { toggleLabel: "Aadhaar", numberLabel: "Aadhaar number", numberPlaceholder: "e.g. 1234 5678 9012" },
  national_id: {
    toggleLabel: "National ID",
    numberLabel: "National ID number",
    numberPlaceholder: "e.g. N1234567",
  },
};

/** Each country picks between two document types: India between Aadhaar and passport, everyone else between passport and national ID. */
const idOptionsFor = (isIndia: boolean): readonly IdType[] => (isIndia ? ["aadhaar", "passport"] : ["passport", "national_id"]);

const initialState: ProfileFormState = {};

/** Danger confirmation shown before an ID number change is submitted on an approved account. */
function ConfirmIdChangeModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#000c1a]/60 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="passport-change-title"
            className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-[#e4e9f2] bg-white p-8 text-center shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
              <ShieldAlert className="size-6" />
            </span>
            <div>
              <p id="passport-change-title" className="text-base font-bold text-[#1A0A53]">
                Your account will go back for review
              </p>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5b6b82]">
                You&rsquo;ve changed your ID verification details. Since these are what we verify your
                identity against, your account moves back to pending until our team reviews the change —
                you won&rsquo;t be able to request quotes or send enquiries/inquiries until then.
              </p>
            </div>
            <div className="mt-2 flex w-full items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-full border border-[#e4e9f2] px-5 py-2.5 text-sm font-semibold text-[#1A0A53] transition-colors hover:border-[#9e4953]"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-full btn-maroon px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Save anyway
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function ProfileSetupForm({
  profile,
  suggestedUsername,
  referrerLabel,
  defaultReferralCode,
}: {
  profile: UserProfile;
  suggestedUsername: string;
  /** "Name (@username)" of the account whose code this user already used. */
  referrerLabel?: string;
  /** Pre-fill from a shared referral link's ?ref= param, still editable. */
  defaultReferralCode?: string;
}) {
  const [state, formAction, pending] = useActionState(completeProfileAction, initialState);

  const firstTime = profile.status === "incomplete";
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [username, setUsername] = useState(profile.username ?? suggestedUsername);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [country, setCountry] = useState(profile.country);
  const isIndia = country === "India";
  const [idType, setIdType] = useState<IdType>(
    idOptionsFor(profile.country === "India").includes(profile.id_type) ? profile.id_type : "passport",
  );
  const [idNumber, setIdNumber] = useState(profile.id_number);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  const idChanged = idType !== profile.id_type || idNumber !== profile.id_number;

  // Saving only reaches the review queue when the number is actually new —
  // otherwise (an approved account re-saving the same number) this is a
  // plain details save.
  const entersReview = profile.status !== "approved" || idChanged;
  const submitLabel = pending ? "Saving…" : entersReview ? "Submit for verification" : "Save changes";

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (profile.status === "approved" && idChanged && !confirmedRef.current) {
      e.preventDefault();
      setConfirmOpen(true);
    }
  }

  // Switching to/from India changes which document pair applies and clears
  // the ID number — a passport number and an Aadhaar number aren't
  // interchangeable, and carrying one over as the other's value would submit
  // garbage silently.
  function onCountryChanged(nextCountry: string) {
    const wasIndia = country === "India";
    const nextIsIndia = nextCountry === "India";
    setCountry(nextCountry);
    if (wasIndia !== nextIsIndia) {
      setIdType("passport");
      setIdNumber("");
    }
  }

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
      ref={formRef}
      action={formAction}
      onSubmit={onFormSubmit}
      className="mx-auto max-w-3xl rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]"
    >
      <div className="flex items-center justify-between rounded-t-3xl border-b border-[#e4e9f2] bg-[#f6f8fc] px-7 py-5 sm:px-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {firstTime ? "Account Verification — New" : "Account Details"}
        </p>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8] sm:block">
            {firstTime ? "3 sections" : "2 sections"}
          </span>
          {firstTime && <SignOutButton />}
        </div>
      </div>

      {/* 01 — Personal details */}
      <div className="border-b border-[#e4e9f2] px-7 py-8 sm:px-10">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs font-bold text-[#94a3b8]">01</span>
          <h2 className="text-lg font-bold text-[#1A0A53]">Your details</h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1A0A53]">
              First name <span className="text-maroon-admin">*</span>
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
            <label className="text-sm font-semibold text-[#1A0A53]">
              Last name <span className="text-maroon-admin">*</span>
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
            <label className="text-sm font-semibold text-[#1A0A53]">
              Username <span className="text-maroon-admin">*</span>
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
            <label className="text-sm font-semibold text-[#1A0A53]">
              Phone number <span className="text-maroon-admin">*</span>
            </label>
            <PhoneInput name="phone" required defaultValue={profile.phone} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1A0A53]">
              Country <span className="text-maroon-admin">*</span>
            </label>
            <CountrySelect
              name="country"
              required
              placeholder="Search countries…"
              defaultValue={profile.country}
              onChange={onCountryChanged}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1A0A53]">Company name</label>
            <input name="company-name" defaultValue={profile.company_name} placeholder="Your company (optional)" className={inputClasses} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#1A0A53]">Email</label>
            <input value={profile.email} disabled className={cn(inputClasses, "bg-[#f6f8fc] text-[#5b6b82]")} />
            <p className="text-xs text-[#94a3b8]">Your account email — used to sign in.</p>
          </div>
        </div>
      </div>

      {/* 02 — ID verification */}
      <div className="border-b border-[#e4e9f2] px-7 py-8 sm:px-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="font-mono text-xs font-bold text-[#94a3b8]">02</span>
          <h2 className="text-lg font-bold text-[#1A0A53]">ID verification</h2>
        </div>
        <p className="mt-1.5 pl-7 text-sm leading-relaxed text-[#5b6b82]">
          {isIndia
            ? "Verify your identity with your Aadhaar or passport number."
            : "Verify your identity with your passport or national ID number."}{" "}
          Our team reviews it once you submit — quotes and enquiries/inquiries unlock once your
          account is approved.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-[#e4e9f2] bg-[#f6f8fc] p-1">
          {idOptionsFor(isIndia).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setIdType(option)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                idType === option ? "bg-white text-maroon-admin shadow-sm" : "text-[#5b6b82]",
              )}
            >
              {idCopy[option].toggleLabel}
            </button>
          ))}
        </div>

        <input type="hidden" name="id-type" value={idType} />

        <div className="mt-6 max-w-sm">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#1A0A53]">
              {idCopy[idType].numberLabel} <span className="text-maroon-admin">*</span>
            </label>
            <input
              name="id-number"
              required
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder={idCopy[idType].numberPlaceholder}
              autoComplete="off"
              className={inputClasses}
            />
          </div>
        </div>
      </div>

      {/* 03 — Referral code (locked after first submission) */}
      {firstTime && !profile.referred_by ? (
        <div className="border-b border-[#e4e9f2] px-7 py-8 sm:px-10">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-bold text-[#94a3b8]">03</span>
            <h2 className="text-lg font-bold text-[#1A0A53]">Referral code</h2>
          </div>
          <p className="mt-1.5 pl-7 text-sm leading-relaxed text-[#5b6b82]">
            Were you referred by an existing customer? Enter their code — this can&rsquo;t be changed
            later.
          </p>
          <div className="mt-6 max-w-xs">
            <input
              name="referral-code"
              placeholder="XXXXXX (optional)"
              defaultValue={defaultReferralCode}
              autoComplete="off"
              spellCheck={false}
              className={cn(inputClasses, "font-mono uppercase placeholder:normal-case placeholder:font-sans")}
            />
            {defaultReferralCode && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <Check className="size-3" /> Applied from your invite link — edit if this isn&rsquo;t right.
              </p>
            )}
          </div>
        </div>
      ) : (
        referrerLabel && (
          <div className="flex items-center gap-3 border-b border-[#e4e9f2] px-7 py-6 text-sm text-[#5b6b82] sm:px-10">
            <Gift className="size-4 shrink-0 text-maroon-admin" />
            Referred by <span className="font-semibold text-[#1A0A53]">{referrerLabel}</span>
          </div>
        )
      )}

      <div className="px-7 py-8 sm:px-10">
        {profile.status === "approved" && idChanged && (
          <div
            className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            role="alert"
          >
            <ShieldAlert className="mt-0.5 size-4 shrink-0" />
            You&rsquo;ve changed your ID verification details — saving will send your account back for
            review.
          </div>
        )}

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
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full btn-navy px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
        >
          {submitLabel}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>

        {firstTime && (
          <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">
            After you submit, our team reviews your details — you&rsquo;ll be able to request quotes and
            send product enquiries/inquiries once your account is approved.
          </p>
        )}
      </div>

      <ConfirmIdChangeModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          confirmedRef.current = true;
          setConfirmOpen(false);
          formRef.current?.requestSubmit();
        }}
      />
    </form>
  );
}
