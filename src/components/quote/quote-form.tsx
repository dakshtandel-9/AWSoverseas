"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AlertCircle, Check, ChevronDown, PackageSearch } from "lucide-react";
import { cn } from "@/lib/cn";
import { submitQuoteAction, type QuoteFormState } from "@/app/actions/quote";
import { CountrySelect } from "@/components/quote/country-select";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";

type Field = {
  label: string;
  type: "text" | "email" | "tel" | "date" | "number" | "select" | "textarea" | "country-select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

type FieldGroup = { title: string; description?: string; fields: Field[] };
type Submit = {
  title: string;
  description: string;
  buttonText: string;
  successMessage: string;
  privacyText: string;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#06234d] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0fade8] focus:ring-2 focus:ring-[#0fade8]/20";

function FieldControl({
  field,
  defaultValue,
  gated,
}: {
  field: Field;
  defaultValue?: string;
  /** True while the submitter isn't approved yet — native `required` is dropped so an empty submit still redirects to sign-in instead of getting stuck on browser validation. */
  gated?: boolean;
}) {
  const id = useId();
  const name = field.label.toLowerCase().replace(/\s+/g, "-");
  const required = field.required && !gated;

  if (field.type === "textarea") {
    return (
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={field.placeholder}
        defaultValue={defaultValue}
        rows={4}
        className={cn(inputClasses, "resize-none")}
      />
    );
  }

  if (field.type === "country-select") {
    return (
      <CountrySelect
        name={name}
        required={required}
        placeholder={field.placeholder}
        defaultValue={defaultValue}
      />
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          defaultValue=""
          className={cn(inputClasses, "appearance-none pr-10")}
        >
          <option value="" disabled>
            Select an option
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b6b82]" />
      </div>
    );
  }

  return (
    <input
      id={id}
      name={name}
      type={field.type}
      required={required}
      placeholder={field.placeholder}
      defaultValue={defaultValue}
      className={cn(inputClasses, field.type === "date" && "text-[#5b6b82]")}
    />
  );
}

function FormSection({
  index,
  group,
  fieldDefaults,
  gated,
}: {
  index: string;
  group: FieldGroup;
  fieldDefaults?: Record<string, string>;
  gated?: boolean;
}) {
  return (
    <div className="border-b border-[#e4e9f2] px-7 py-8 last:border-b-0 sm:px-10">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs font-bold text-[#94a3b8]">{index}</span>
        <h2 className="text-lg font-bold text-[#06234d]">{group.title}</h2>
      </div>
      {group.description && (
        <p className="mt-1.5 pl-7 text-sm leading-relaxed text-[#5b6b82]">{group.description}</p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {group.fields.map((field) => (
          <div
            key={field.label}
            className={cn(
              "flex flex-col gap-2",
              (field.type === "textarea" || field.type === "select") && "sm:col-span-2",
            )}
          >
            <label className="text-sm font-semibold text-[#06234d]">
              {field.label}
              {field.required && <span className="ml-1 text-[#0489c2]">*</span>}
            </label>
            <FieldControl field={field} defaultValue={fieldDefaults?.[field.label]} gated={gated} />
          </div>
        ))}
      </div>
    </div>
  );
}

const initialState: QuoteFormState = {};

/** Where an unapproved submitter should land, per auth state. */
function gateHrefFor(auth: EnquiryAuth, next: string): string | null {
  switch (auth.state) {
    case "guest":
      return `/login?next=${encodeURIComponent(next)}`;
    case "setup":
      return "/profile/setup";
    case "pending":
    case "rejected":
      return "/profile";
    default:
      return null;
  }
}

/** Submit-button copy for an unapproved submitter, per auth state. */
const GATE_BUTTON_TEXT: Record<Exclude<EnquiryAuth["state"], "approved">, string> = {
  guest: "Sign in to submit",
  setup: "Complete your profile to submit",
  pending: "Verification pending",
  rejected: "Update details to submit",
};

/**
 * Rendered as one continuous waybill document rather than three separate
 * cards — a real bill of lading groups consignor / cargo / routing under one
 * form, so the three JSON blocks (quoteForm, shipmentDetails, contactDetails)
 * become numbered document sections sharing a single submit at the bottom.
 * Submits via submitQuoteAction to Supabase; field `name` attributes are
 * derived from labels (lowercased, spaces to hyphens).
 */
export function QuoteForm({
  quoteForm,
  shipmentDetails,
  contactDetails,
  submit,
  product,
  contactDefaults,
  auth,
}: {
  quoteForm: FieldGroup;
  shipmentDetails: FieldGroup;
  contactDetails: FieldGroup;
  submit: Submit;
  product?: string;
  /** Prefills keyed by field label — from the signed-in user's profile. */
  contactDefaults?: Record<string, string>;
  /** Auth snapshot computed server-side — the form stays visible to guests, and only gates on submit. */
  auth: EnquiryAuth;
}) {
  const [state, formAction, pending] = useActionState(submitQuoteAction, initialState);
  const done = Boolean(state.success);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const shipmentDefaults = product
    ? { "Cargo Description": `Enquiry about: ${product}` }
    : undefined;

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const next = product ? `/quote?product=${product}` : "/quote";
  const gateHref = gateHrefFor(auth, next);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (gateHref) {
      e.preventDefault();
      setRedirecting(true);
      router.push(gateHref);
    }
  }

  return (
    <div
      id="quote-form"
      className="mx-auto max-w-3xl scroll-mt-28 rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]"
    >
      <div className="flex items-center justify-between rounded-t-3xl border-b border-[#e4e9f2] bg-[#f6f8fc] px-7 py-5 sm:px-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {product ? `Product Enquiry — ${product}` : "Shipment Waybill — Draft"}
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8] sm:block">
          3 sections
        </span>
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 px-8 py-16 text-center"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#0fade8] text-white">
              <Check className="size-6" />
            </span>
            <p className="max-w-sm text-base font-medium leading-relaxed text-[#0489c2]">
              {submit.successMessage}
            </p>

            {state.trackingNumber && (
              <div className="mt-2 flex flex-col items-center gap-3 rounded-2xl border border-[#e4e9f2] bg-[#f6f8fc] px-6 py-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
                  Your tracking number
                </p>
                <p className="font-mono text-lg font-bold text-[#06234d]">{state.trackingNumber}</p>
                <p className="max-w-xs text-xs leading-relaxed text-[#5b6b82]">
                  Save this number — no account needed to check your shipment's progress.
                </p>
                <Link
                  href={`/tracking?ref=${encodeURIComponent(state.trackingNumber)}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#033e8d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#052f69]"
                >
                  <PackageSearch className="size-4" /> Track this shipment
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            action={formAction}
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FormSection index="01" group={quoteForm} gated={Boolean(gateHref)} />
            <FormSection
              index="02"
              group={shipmentDetails}
              fieldDefaults={shipmentDefaults}
              gated={Boolean(gateHref)}
            />
            <FormSection
              index="03"
              group={contactDetails}
              fieldDefaults={contactDefaults}
              gated={Boolean(gateHref)}
            />

            <div className="px-7 py-8 sm:px-10">
              <h3 className="text-base font-bold text-[#06234d]">{submit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{submit.description}</p>

              {gateHref && (
                <div
                  className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#eef3fb] px-4 py-3 text-sm font-medium text-[#033e8d]"
                  role="status"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {auth.state === "guest" &&
                    "Fill in your shipment details — we'll ask you to sign in before submitting."}
                  {auth.state === "setup" &&
                    "Almost there — finish your profile details before submitting."}
                  {auth.state === "pending" &&
                    "Our team is reviewing your account. You can prepare this request now; submitting unlocks once you're approved."}
                  {auth.state === "rejected" &&
                    "We couldn't verify your account. Update your passport details before submitting."}
                </div>
              )}

              {state.error && (
                <div
                  className="mt-5 flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={pending || redirecting}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#033e8d] px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#052f69] hover:shadow-[0_0_0_4px_rgba(15,173,232,0.18),0_8px_24px_rgba(3,62,141,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {redirecting
                  ? "Redirecting…"
                  : pending
                    ? "Submitting…"
                    : gateHref
                      ? GATE_BUTTON_TEXT[auth.state as Exclude<EnquiryAuth["state"], "approved">]
                      : submit.buttonText}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">{submit.privacyText}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
