"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AlertCircle, Check, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { submitProductEnquiryAction, type EnquiryFormState } from "@/app/actions/product-enquiry";
import { trackLead } from "@/lib/track-lead";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#002144] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const initialState: EnquiryFormState = {};

/**
 * Auth snapshot computed server-side on the products page. Enquiries are open
 * to everyone, so this only prefills the form — it never gates it.
 */
export type EnquiryAuth = {
  state: "guest" | "setup" | "pending" | "rejected" | "approved";
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export function EnquiryModal({
  productId,
  productName,
  auth,
  open,
  onClose,
}: {
  productId: string;
  productName: string;
  auth: EnquiryAuth;
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitProductEnquiryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const done = Boolean(state.success);

  useEffect(() => {
    if (state.success) trackLead();
  }, [state.success]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

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
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#e4e9f2] bg-[#f6f8fc] px-6 py-5">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
                  Product Enquiry
                </p>
                <h2 id="enquiry-modal-title" className="mt-1 truncate text-base font-bold text-[#002144]">
                  {productName}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-full text-[#5b6b82] transition-colors hover:bg-[#eef3fb] hover:text-[#002144]"
              >
                <X className="size-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 overflow-y-auto px-8 py-14 text-center"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#9e4953] text-white">
                    <Check className="size-6" />
                  </span>
                  <p className="max-w-xs text-sm font-medium leading-relaxed text-maroon-admin">
                    Thanks — we&rsquo;ve received your enquiry about {productName} and will get back to you
                    shortly.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 inline-flex h-10 items-center justify-center rounded-full border border-[#e4e9f2] px-5 text-sm font-semibold text-[#002144] hover:border-[#9e4953]"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  action={formAction}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 overflow-y-auto px-6 py-6"
                >
                  <input type="hidden" name="product-id" value={productId} />
                  <input type="hidden" name="product-name" value={productName} />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#002144]">
                      Name <span className="text-maroon-admin">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      defaultValue={[auth.firstName, auth.lastName].filter(Boolean).join(" ")}
                      className={inputClasses}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[#002144]">
                        Email <span className="text-maroon-admin">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@company.com"
                        defaultValue={auth.email}
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[#002144]">
                        Phone number <span className="text-maroon-admin">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        defaultValue={auth.phone}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#002144]">Message</label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={`Quantity, specs, or anything else about ${productName}…`}
                      className={cn(inputClasses, "resize-none")}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#002144]">
                      Attach an image{" "}
                      <span className="font-normal text-[#94a3b8]">(optional)</span>
                    </label>
                    <label
                      htmlFor="attachment"
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#e4e9f2] bg-[#f6f8fc] px-4 py-3 text-sm text-[#5b6b82] transition-colors hover:border-[#9e4953]"
                    >
                      <Paperclip className="size-4 shrink-0 text-[#94a3b8]" />
                      <span className="truncate">{attachmentName || "Choose a photo…"}</span>
                    </label>
                    <input
                      id="attachment"
                      type="file"
                      name="attachment"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setAttachmentName(e.target.files?.[0]?.name ?? "")}
                    />
                  </div>

                  {state.error && (
                    <div
                      className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                      role="alert"
                    >
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      {state.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="group mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full btn-navy px-6 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {pending ? "Sending…" : "Send enquiry"}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>

                  <p className="text-center text-xs leading-relaxed text-[#94a3b8]">
                    We&rsquo;ll reply by email or phone — no pricing is shown online, so this is how you get a
                    quote for this product.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
