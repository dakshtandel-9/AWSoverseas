"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { CircleAlert, CircleCheck, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { sendAdminEmailAction, type SendEmailState } from "@/app/admin/(dashboard)/email/actions";
import type { EmailSender } from "@/lib/email-senders";

/** A reply half-written from an inbox submission. See src/lib/email-reply-draft.ts. */
export type ComposerPrefill = { to: string; subject: string; body: string; from: string };

const initialState: SendEmailState = {};

const EMPTY_FIELDS = { to: "", cc: "", bcc: "", subject: "", body: "" };

/** Where the operator's name and title are remembered between emails. */
const SIGNATURE_KEY = "aws-admin-email-signature";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const BODY_PLACEHOLDER = `Dear Priya,

Thank you for your enquiry. Our team has reviewed it and we can ship on the schedule you asked about.

Warm regards,
Team AWS OVERSEAS impex`;

/**
 * The compose form at /admin/email.
 *
 * Every field is controlled rather than left to the DOM, so a successful send
 * can clear the message while leaving the From address exactly where the
 * operator set it — the next email in a session is nearly always from the same
 * mailbox, and silently reverting to admin@ would send it under the wrong name.
 *
 * `prefill` arrives when the page was opened from an inbox row's Reply button.
 * It only seeds the fields: everything stays editable, and nothing is sent
 * until Send is pressed here.
 */
export function EmailComposer({ senders, prefill }: { senders: EmailSender[]; prefill?: ComposerPrefill }) {
  const [state, formAction, pending] = useActionState(sendAdminEmailAction, initialState);
  // A draft names the mailbox it should come from, but the panel is the
  // authority on which ones exist — an address dropped from the allowlist
  // falls back to the default rather than pre-selecting something unsendable.
  const [from, setFrom] = useState(
    prefill && senders.some((sender) => sender.address === prefill.from)
      ? prefill.from
      : senders[0]?.address ?? "",
  );
  const [fields, setFields] = useState(
    prefill ? { ...EMPTY_FIELDS, to: prefill.to, subject: prefill.subject, body: prefill.body } : EMPTY_FIELDS,
  );
  const [showCopies, setShowCopies] = useState(false);
  const [signedBy, setSignedBy] = useState({ name: "", role: "" });

  // Restored after mount, not during render: this component server-renders
  // too, and reading storage in a lazy initialiser would hand the server and
  // the browser different values for a controlled input.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SIGNATURE_KEY);
      if (saved) setSignedBy({ name: "", role: "", ...JSON.parse(saved) });
    } catch {
      // No stored signature, or storage is blocked. The fields stay blank.
    }
  }, []);

  useEffect(() => {
    if (!state.sentAt) return;
    setFields(EMPTY_FIELDS);
    setShowCopies(false);
  }, [state.sentAt]);

  const set = (key: keyof typeof EMPTY_FIELDS) => (event: { target: { value: string } }) =>
    setFields((current) => ({ ...current, [key]: event.target.value }));

  /** Kept in the browser so the operator types their name and title once, not once per email. */
  function updateSignature(patch: Partial<typeof signedBy>) {
    const next = { ...signedBy, ...patch };
    setSignedBy(next);
    try {
      window.localStorage.setItem(SIGNATURE_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked — the signature just won't survive a reload.
    }
  }

  return (
    <form action={formAction} className="mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white">
      {/* The From strip reads as a letterhead: the one decision that changes who
          the recipient thinks they're hearing from, so it sits above everything. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#e4e9f2] bg-[#eef3fb] px-5 py-4 sm:px-6">
        <label
          htmlFor="email-from"
          className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]"
        >
          From
        </label>
        <select
          id="email-from"
          name="from"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#1A0A53] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20"
        >
          {senders.map((sender) => (
            <option key={sender.address} value={sender.address}>
              {sender.name ? `${sender.address} — ${sender.name}` : sender.address}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 px-5 py-6 sm:px-6">
        <Field
          label="To"
          name="to"
          value={fields.to}
          onChange={set("to")}
          placeholder="priya@acme.com, buyer@example.com"
          hint="Separate several addresses with commas. Everyone here sees the others."
        />

        {showCopies ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="CC"
              name="cc"
              value={fields.cc}
              onChange={set("cc")}
              placeholder="Optional"
              hint="Copied in, and visible to everyone."
            />
            <Field
              label="BCC"
              name="bcc"
              value={fields.bcc}
              onChange={set("bcc")}
              placeholder="Optional"
              hint="Copied in without anyone else seeing it."
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCopies(true)}
            className="justify-self-start text-xs font-semibold text-maroon-admin underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
          >
            Add CC or BCC
          </button>
        )}

        <Field
          label="Subject"
          name="subject"
          value={fields.subject}
          onChange={set("subject")}
          placeholder="Your shipping quote — Mumbai to Rotterdam"
        />

        <div>
          <label htmlFor="email-body" className="text-sm font-semibold text-[#1A0A53]">
            Message
          </label>
          <textarea
            id="email-body"
            name="body"
            rows={12}
            value={fields.body}
            onChange={set("body")}
            placeholder={BODY_PLACEHOLDER}
            className={cn(inputClasses, "mt-2 resize-y font-normal leading-relaxed")}
          />
          <p className="mt-1.5 text-xs text-[#5b6b82]">
            Leave a blank line between paragraphs. Pasted links become clickable on their own.
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-[#1A0A53]">Signed by</legend>
          <p className="mt-1 text-xs text-[#5b6b82]">
            Sits above the company name in the signature. Leave both blank to sign as AWS OVERSEAS impex alone. The
            office address and phone number come from Site settings.
          </p>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            <Field
              label="Your name"
              name="signed_by"
              value={signedBy.name}
              onChange={(event) => updateSignature({ name: event.target.value })}
              placeholder="Optional"
            />
            <Field
              label="Your role"
              name="signed_role"
              value={signedBy.role}
              onChange={(event) => updateSignature({ role: event.target.value })}
              placeholder="Optional"
            />
          </div>
        </fieldset>

        {/* A reply to one person starts on Plain, an email written from scratch
            on Branded — a masthead and banner over a two-line answer to an
            enquiry reads as marketing, which is what gets filtered. */}
        <fieldset>
          <legend className="text-sm font-semibold text-[#1A0A53]">How it should look</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <LayoutChoice
              value="branded"
              defaultChecked={!prefill}
              title="Branded"
              detail="Masthead, banner, and the signature card with your logo. The same shell as the account emails — right for announcements and anything going to a list."
            />
            <LayoutChoice
              value="plain"
              defaultChecked={Boolean(prefill)}
              title="Plain"
              detail="Just your words, with the same details set as small text and no logo. Reads like a personal reply, which is what a customer answering an enquiry expects."
            />
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[#e4e9f2] bg-[#eef3fb] px-5 py-4 sm:px-6">
        <button
          type="submit"
          disabled={pending || senders.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--btn-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--btn-navy-hover)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
        >
          <SendHorizontal className="size-4" />
          {pending ? "Sending…" : "Send email"}
        </button>

        <p aria-live="polite" className="min-w-0 flex-1 text-sm">
          {state.error && (
            <span className="flex items-start gap-2 text-[#861B28]">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {state.error}
            </span>
          )}
          {state.success && !state.error && (
            <span className="flex items-start gap-2 text-emerald-700">
              <CircleCheck className="mt-0.5 size-4 shrink-0" />
              {state.success}
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = `email-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-[#1A0A53]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(inputClasses, "mt-2")}
      />
      {hint && <p className="mt-1.5 text-xs text-[#5b6b82]">{hint}</p>}
    </div>
  );
}

/** One half of the layout choice — a radio the whole card acts as. */
function LayoutChoice({
  value,
  title,
  detail,
  defaultChecked,
}: {
  value: string;
  title: string;
  detail: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="group flex cursor-pointer gap-3 rounded-xl border border-[#e4e9f2] p-4 transition-colors has-[:checked]:border-[#9e4953] has-[:checked]:bg-[#fdf7f8] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#002144]">
      <input
        type="radio"
        name="layout"
        value={value}
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 accent-[#9e4953]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#1A0A53]">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-[#5b6b82]">{detail}</span>
      </span>
    </label>
  );
}
