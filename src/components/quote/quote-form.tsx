"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AlertCircle, Check, ChevronDown, ImagePlus, PackageSearch } from "lucide-react";
import { cn } from "@/lib/cn";
import { submitQuoteAction, type QuoteFormState } from "@/app/actions/quote";
import { trackLead } from "@/lib/track-lead";
import { CountrySelect } from "@/components/quote/country-select";
import { CountryStateSelect } from "@/components/quote/country-state-select";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";

type Field = {
  label: string;
  /** Shown in the field's <label> instead of `label` when set — `label` still drives the form field `name`, so this only affects what the user reads. */
  displayLabel?: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "number"
    | "select"
    | "textarea"
    | "file"
    | "country-select"
    /** Options come from whichever country `dependsOn` names, so it must be paired with a country-select. */
    | "state-select"
    /** Placeholder expanded at render time into the active direction's origin/destination pair. */
    | "route";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  /** `label` of the country field this one follows (state-select only). */
  dependsOn?: string;
};

export type Direction = "export" | "import";

type RouteVariant = { label: string; hint: string; fields: Field[] };

type FieldGroup = {
  title: string;
  description?: string;
  fields: Field[];
  route?: Record<Direction, RouteVariant>;
};
type Submit = {
  title: string;
  description: string;
  buttonText: string;
  successMessage: string;
  privacyText: string;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

function FieldControl({
  field,
  defaultValue,
  gated,
  dependsOnValue,
  onValueChange,
}: {
  field: Field;
  defaultValue?: string;
  /** True while the submitter isn't approved yet — native `required` is dropped so an empty submit still redirects to sign-in instead of getting stuck on browser validation. */
  gated?: boolean;
  /** Current value of the field named by `field.dependsOn`. */
  dependsOnValue?: string;
  /** Reports this field's value up so fields that depend on it can react. */
  onValueChange?: (value: string) => void;
}) {
  const id = useId();
  const name = field.label.toLowerCase().replace(/\s+/g, "-");
  const required = field.required && !gated;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  if (field.type === "file") {
    return (
      <>
        <label
          htmlFor={id}
          className="flex h-[46px] cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-[#e4e9f2] bg-[#f6f8fc] px-4 text-sm text-[#5b6b82] transition-colors hover:border-[#9e4953]"
        >
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="" className="size-7 shrink-0 rounded-md object-cover" />
          ) : (
            <ImagePlus className="size-4 shrink-0 text-[#94a3b8]" />
          )}
          <span className="truncate">
            {imagePreview ? "Image selected" : (field.placeholder ?? "Upload an image…")}
          </span>
        </label>
        <input
          id={id}
          name={name}
          type="file"
          accept="image/*"
          required={required}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </>
    );
  }

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
        onChange={onValueChange}
      />
    );
  }

  if (field.type === "state-select") {
    return <CountryStateSelect name={name} required={required} country={dependsOnValue ?? ""} />;
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

/**
 * Export and import are the same waybill read in opposite directions, so they
 * share one control rather than one form each: the segmented switch swaps only
 * the origin/destination pair beneath it. Rendered as a two-up switch instead
 * of a select because there are exactly two states and the choice reshapes the
 * fields below — a change worth seeing before you make it.
 */
function DirectionToggle({
  route,
  direction,
  onChange,
}: {
  route: Record<Direction, RouteVariant>;
  direction: Direction;
  onChange: (d: Direction) => void;
}) {
  const directions: Direction[] = ["export", "import"];

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Trade direction"
        className="inline-flex rounded-xl border border-[#e4e9f2] bg-[#f6f8fc] p-1"
      >
        {directions.map((d) => {
          const active = d === direction;
          return (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(d)}
              className={cn(
                "rounded-lg px-5 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4953]/40",
                active
                  ? "bg-[#9e4953] text-white shadow-[0_1px_3px_rgba(4,22,47,0.18)]"
                  : "text-[#5b6b82] hover:text-[#1A0A53]",
              )}
            >
              {route[d].label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-[#5b6b82]">{route[direction].hint}</p>
    </div>
  );
}

function FormSection({
  index,
  group,
  fieldDefaults,
  gated,
  direction,
  toolbar,
}: {
  index: string;
  group: FieldGroup;
  fieldDefaults?: Record<string, string>;
  gated?: boolean;
  /** Only set for the group carrying a `route` block. */
  direction?: Direction;
  toolbar?: React.ReactNode;
}) {
  // A `route` field is a placeholder: it expands in place into the active
  // direction's origin/destination pair, so the JSON keeps field order
  // without duplicating the fields shared by both directions.
  const fields = group.fields.flatMap((field) =>
    field.type === "route" ? (direction && group.route ? group.route[direction].fields : []) : [field],
  );

  // Values of the fields other fields depend on (a state list follows its
  // country), keyed by field label.
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="border-b border-[#e4e9f2] px-7 py-8 last:border-b-0 sm:px-10">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs font-bold text-[#94a3b8]">{index}</span>
        <h2 className="text-lg font-bold text-[#1A0A53]">{group.title}</h2>
      </div>
      {group.description && (
        <p className="mt-1.5 pl-7 text-sm leading-relaxed text-[#5b6b82]">{group.description}</p>
      )}

      {toolbar && <div className="mt-6">{toolbar}</div>}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className={cn(
              "flex flex-col gap-2",
              (field.type === "textarea" || field.type === "select" || field.type === "file") &&
                "sm:col-span-2",
            )}
          >
            <label className="text-sm font-semibold text-[#1A0A53]">
              {field.displayLabel ?? field.label}
              {field.required && <span className="ml-1 text-maroon-admin">*</span>}
            </label>
            <FieldControl
              field={field}
              defaultValue={fieldDefaults?.[field.label]}
              gated={gated}
              dependsOnValue={field.dependsOn ? values[field.dependsOn] : undefined}
              onValueChange={(value) => setValues((prev) => ({ ...prev, [field.label]: value }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const initialState: QuoteFormState = {};

/**
 * Where a submitter without a usable profile should land, per auth state.
 * Verification status (unverified/pending/rejected) no longer blocks
 * submitting — only a missing account or an unfinished profile does, since
 * those are the states with no contact details to quote against.
 */
function gateHrefFor(auth: EnquiryAuth, next: string): string | null {
  switch (auth.state) {
    case "guest":
      return `/login?next=${encodeURIComponent(next)}`;
    case "setup":
      return "/profile/setup";
    default:
      return null;
  }
}

/** Submit-button copy for a submitter without a usable profile, per auth state. */
const GATE_BUTTON_TEXT: Record<"guest" | "setup", string> = {
  guest: "Sign in to submit",
  setup: "Complete your profile to submit",
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
  const [direction, setDirection] = useState<Direction>("export");
  const shipmentDefaults = product
    ? { "Cargo Description": `Enquiry/Inquiry about: ${product}` }
    : undefined;

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      trackLead();
    }
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
          {product
            ? `Product Enquiry/Inquiry — ${product}`
            : `Shipment Waybill — ${quoteForm.route ? `${quoteForm.route[direction].label} ` : ""}Draft`}
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
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#9e4953] text-white">
              <Check className="size-6" />
            </span>
            <p className="max-w-sm text-base font-medium leading-relaxed text-maroon-admin">
              {submit.successMessage}
            </p>

            {state.trackingNumber && (
              <div className="mt-2 flex flex-col items-center gap-3 rounded-2xl border border-[#e4e9f2] bg-[#f6f8fc] px-6 py-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
                  Your tracking number
                </p>
                <p className="font-mono text-lg font-bold text-[#1A0A53]">{state.trackingNumber}</p>
                <p className="max-w-xs text-xs leading-relaxed text-[#5b6b82]">
                  Save this number — no account needed to check your shipment's progress.
                </p>
                <Link
                  href={`/tracking?ref=${encodeURIComponent(state.trackingNumber)}`}
                  className="inline-flex items-center gap-1.5 rounded-full btn-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors"
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
            <input type="hidden" name="direction" value={direction} />

            <FormSection
              index="01"
              group={quoteForm}
              gated={Boolean(gateHref)}
              direction={direction}
              toolbar={
                quoteForm.route && (
                  <DirectionToggle
                    route={quoteForm.route}
                    direction={direction}
                    onChange={setDirection}
                  />
                )
              }
            />
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
              <h3 className="text-base font-bold text-[#1A0A53]">{submit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{submit.description}</p>

              {gateHref && (
                <div
                  className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#eef3fb] px-4 py-3 text-sm font-medium text-[#1A0A53]"
                  role="status"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {auth.state === "guest" &&
                    "Fill in your shipment details — we'll ask you to sign in before submitting."}
                  {auth.state === "setup" &&
                    "Almost there — finish your profile details before submitting."}
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
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full btn-navy px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_4px_rgba(144, 45, 57,0.18),0_8px_24px_rgba(3,62,141,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {redirecting
                  ? "Redirecting…"
                  : pending
                    ? "Submitting…"
                    : gateHref
                      ? GATE_BUTTON_TEXT[auth.state as "guest" | "setup"]
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
