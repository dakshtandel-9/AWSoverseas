"use client";

import { useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AlertCircle, Check, ImagePlus } from "lucide-react";
import { cn } from "@/lib/cn";
import { submitProductEnquiryAction, type EnquiryFormState } from "@/app/actions/product-enquiry";
import { trackLead } from "@/lib/track-lead";

type Field = { label: string; placeholder: string; selectedLabel?: string };

type Data = {
  docket: string;
  sectionCount: string;
  optionalLabel: string;
  product: { index: string; title: string; description: string };
  contact: { index: string; title: string; description: string; prefillNote: string };
  fields: {
    productName: Field;
    message: Field;
    quantity: Field;
    photo: Field;
    name: Field;
    email: Field;
    phone: Field;
  };
  submit: { title: string; description: string; buttonText: string; privacyText: string };
  successTitle: string;
  successMessage: string;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: EnquiryFormState = {};

type ContactDefaults = { name: string; email: string; phone: string };

/** One numbered block of the docket — same construction as the quote form's sections. */
function FormSection({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#e4e9f2] px-7 py-8 last:border-b-0 sm:px-10">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs font-bold text-[#94a3b8]">{index}</span>
        <h2 className="text-lg font-bold text-[#1A0A53]">{title}</h2>
      </div>
      <p className="mt-1.5 pl-7 text-sm leading-relaxed text-[#5b6b82]">{description}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Labelled({
  label,
  required,
  optionalLabel,
  full,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  /** Printed after the label when the field can be left empty. */
  optionalLabel?: string;
  full?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", full && "sm:col-span-2")}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[#1A0A53]">
        {label}
        {required && <span className="ml-1 text-maroon-admin">*</span>}
        {optionalLabel && <span className="ml-1 font-normal text-[#94a3b8]">{optionalLabel}</span>}
      </label>
      {children}
    </div>
  );
}

/**
 * Standalone product-enquiry form — reuses submitProductEnquiryAction with no
 * product-id, so it lands in product_enquiries as an enquiry row with
 * product_id null, which the admin lists as "Not in catalog".
 *
 * Built as the same two-part docket as the quote form on /quote: what you want
 * on top, how to reach you underneath, one submit for both. Only the product
 * name, your name, and one contact method are required — description, photo
 * and quantity are all optional, and the labels say so.
 */
export function RequestProductForm({
  data,
  contactDefaults,
}: {
  data: Data;
  contactDefaults?: ContactDefaults;
}) {
  const [state, formAction, pending] = useActionState(submitProductEnquiryAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const done = Boolean(state.success);
  const prefilled = Boolean(contactDefaults?.name || contactDefaults?.email || contactDefaults?.phone);

  useEffect(() => {
    if (state.success) trackLead();
  }, [state.success]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <div
      id="request-form"
      className="mx-auto max-w-3xl scroll-mt-28 rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]"
    >
      <div className="flex items-center justify-between rounded-t-3xl border-b border-[#e4e9f2] bg-[#f6f8fc] px-7 py-5 sm:px-10">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {data.docket}
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8] sm:block">
          {data.sectionCount}
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
            <p className="text-base font-bold text-maroon-admin">{data.successTitle}</p>
            <p className="max-w-sm text-sm leading-relaxed text-maroon-admin">{data.successMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FormSection
              index={data.product.index}
              title={data.product.title}
              description={data.product.description}
            >
              <Labelled label={data.fields.productName.label} required full htmlFor="product-name">
                <input
                  id="product-name"
                  name="product-name"
                  required
                  placeholder={data.fields.productName.placeholder}
                  className={inputClasses}
                />
              </Labelled>

              <Labelled
                label={data.fields.message.label}
                optionalLabel={data.optionalLabel}
                full
                htmlFor="message"
              >
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={data.fields.message.placeholder}
                  className={cn(inputClasses, "resize-none")}
                />
              </Labelled>

              <Labelled
                label={data.fields.quantity.label}
                optionalLabel={data.optionalLabel}
                htmlFor="requested-quantity"
              >
                <input
                  id="requested-quantity"
                  name="requested-quantity"
                  placeholder={data.fields.quantity.placeholder}
                  className={inputClasses}
                />
              </Labelled>

              <Labelled label={data.fields.photo.label} optionalLabel={data.optionalLabel}>
                <label
                  htmlFor="attachment"
                  className="flex h-[46px] cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-[#e4e9f2] bg-[#f6f8fc] px-4 text-sm text-[#5b6b82] transition-colors hover:border-[#9e4953]"
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="" className="size-7 shrink-0 rounded-md object-cover" />
                  ) : (
                    <ImagePlus className="size-4 shrink-0 text-[#94a3b8]" />
                  )}
                  <span className="truncate">
                    {imagePreview ? data.fields.photo.selectedLabel : data.fields.photo.placeholder}
                  </span>
                </label>
                <input
                  id="attachment"
                  type="file"
                  name="attachment"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
              </Labelled>
            </FormSection>

            <FormSection
              index={data.contact.index}
              title={data.contact.title}
              description={data.contact.description}
            >
              {prefilled && (
                <p className="-mt-1 flex items-start gap-2 text-xs leading-relaxed text-[#5b6b82] sm:col-span-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-[#9e4953]" />
                  {data.contact.prefillNote}
                </p>
              )}

              <Labelled label={data.fields.name.label} required full htmlFor="name">
                <input
                  id="name"
                  name="name"
                  required
                  placeholder={data.fields.name.placeholder}
                  defaultValue={contactDefaults?.name}
                  className={inputClasses}
                />
              </Labelled>

              <Labelled label={data.fields.email.label} htmlFor="email">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={data.fields.email.placeholder}
                  defaultValue={contactDefaults?.email}
                  className={inputClasses}
                />
              </Labelled>

              <Labelled label={data.fields.phone.label} htmlFor="phone">
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder={data.fields.phone.placeholder}
                  defaultValue={contactDefaults?.phone}
                  className={inputClasses}
                />
              </Labelled>
            </FormSection>

            <div className="px-7 py-8 sm:px-10">
              <h2 className="text-base font-bold text-[#1A0A53]">{data.submit.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{data.submit.description}</p>

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
                disabled={pending}
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full btn-navy px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_4px_rgba(144,45,57,0.18),0_8px_24px_rgba(3,62,141,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {pending ? "Sending…" : data.submit.buttonText}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">{data.submit.privacyText}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
