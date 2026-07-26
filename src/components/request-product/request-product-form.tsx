"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AlertCircle, Check, ImagePlus } from "lucide-react";
import { cn } from "@/lib/cn";
import { submitProductEnquiryAction, type EnquiryFormState } from "@/app/actions/product-enquiry";
import { trackLead } from "@/lib/track-lead";

type Data = {
  title: string;
  description: string;
  submitButton: string;
  successTitle: string;
  successMessage: string;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: EnquiryFormState = {};

type ContactDefaults = { name: string; email: string; phone: string };

/**
 * Standalone product-request form — reuses submitProductEnquiryAction with
 * no product-id, so it lands in product_enquiries as a request_type
 * "enquiry" row with product_id null (same as a catalog enquiry whose
 * product was later deleted). Only product name + one contact method are
 * required; description, image, and quantity are all optional.
 */
export function RequestProductForm({
  data,
  contactDefaults,
}: {
  data: Data;
  contactDefaults?: ContactDefaults;
}) {
  const [state, formAction, pending] = useActionState(submitProductEnquiryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const done = Boolean(state.success);

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
      className="rounded-3xl border border-[#e4e9f2] bg-white p-7 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)] sm:p-10"
    >
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
        Product Request
      </p>
      <h2 className="mt-3 text-2xl font-bold text-[#002144] sm:text-3xl">{data.title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-[#5b6b82]">{data.description}</p>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-start gap-3 rounded-2xl bg-[#f8f1f2] px-5 py-5 ring-1 ring-[#9e4953]/25"
          >
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#9e4953] text-white">
              <Check className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-maroon-admin">{data.successTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-maroon-admin">{data.successMessage}</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            action={formAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 grid gap-5 sm:grid-cols-2"
          >
            <input type="hidden" name="request-type" value="enquiry" />

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#002144]">
                Product name <span className="ml-1 text-maroon-admin">*</span>
              </label>
              <input
                name="product-name"
                required
                placeholder="e.g. Stainless steel pipe fittings"
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-sm font-semibold text-[#002144]">
                Description or message{" "}
                <span className="font-normal text-[#94a3b8]">(optional)</span>
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Specs, materials, intended use — anything that helps us source the right thing"
                className={cn(inputClasses, "resize-none")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">
                Quantity or quality needed{" "}
                <span className="font-normal text-[#94a3b8]">(optional)</span>
              </label>
              <input
                name="requested-quantity"
                placeholder="e.g. 500 units, food-grade"
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">
                Photo <span className="font-normal text-[#94a3b8]">(optional)</span>
              </label>
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
                <span className="truncate">{imagePreview ? "Photo selected" : "Upload a photo…"}</span>
              </label>
              <input
                id="attachment"
                type="file"
                name="attachment"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">Your name</label>
              <input
                name="name"
                placeholder="Your name"
                defaultValue={contactDefaults?.name}
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                defaultValue={contactDefaults?.email}
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#002144]">Phone number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                defaultValue={contactDefaults?.phone}
                className={inputClasses}
              />
            </div>

            <p className="text-xs leading-relaxed text-[#94a3b8] sm:col-span-2">
              Product name is required. We also need at least an email or a phone number so we can get
              back to you — everything else on this form is optional.
            </p>

            {state.error && (
              <div
                className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2"
                role="alert"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {state.error}
              </div>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full btn-navy px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_4px_rgba(144,45,57,0.18),0_8px_24px_rgba(3,62,141,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
              >
                {pending ? "Sending…" : data.submitButton}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
