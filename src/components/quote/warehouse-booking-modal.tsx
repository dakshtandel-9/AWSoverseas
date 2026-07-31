"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, AlertCircle, Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { submitWarehouseBookingAction, type WarehouseBookingState } from "@/app/actions/warehouse-booking";
import { trackLead } from "@/lib/track-lead";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#1A0A53] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#9e4953] focus:ring-2 focus:ring-[#9e4953]/20";

const WAREHOUSE_TYPES = [
  "General Storage",
  "Bonded / Customs Warehouse",
  "Cold Storage (Temperature-Controlled)",
  "Bulk & Palletized Storage",
  "Distribution & Fulfillment",
  "Short-Term / Transit Storage",
  "Other",
];

const initialState: WarehouseBookingState = {};

export function WarehouseBookingModal({
  auth,
  open,
  onClose,
}: {
  auth: EnquiryAuth;
  open: boolean;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitWarehouseBookingAction, initialState);
  const [name] = useState([auth.firstName, auth.lastName].filter(Boolean).join(" "));
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
            aria-labelledby="warehouse-booking-title"
            className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#e4e9f2] bg-[#f6f8fc] px-6 py-5">
              <div className="min-w-0">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
                  Separate Request
                </p>
                <h2 id="warehouse-booking-title" className="mt-1 truncate text-base font-bold text-[#1A0A53]">
                  Book Warehouse Space
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid size-9 shrink-0 place-items-center rounded-full text-[#5b6b82] transition-colors hover:bg-[#eef3fb] hover:text-[#1A0A53]"
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
                    Thanks — we&rsquo;ve received your warehouse booking request and will get back to you
                    shortly with availability and next steps.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 inline-flex h-10 items-center justify-center rounded-full border border-[#e4e9f2] px-5 text-sm font-semibold text-[#1A0A53] hover:border-[#9e4953]"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  action={formAction}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 overflow-y-auto px-6 py-6"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#1A0A53]">
                      Name <span className="text-maroon-admin">*</span>
                    </label>
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      defaultValue={name}
                      className={inputClasses}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-[#1A0A53]">
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
                      <label className="text-sm font-semibold text-[#1A0A53]">
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
                    <label className="text-sm font-semibold text-[#1A0A53]">
                      Address <span className="text-maroon-admin">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      placeholder="Where should we pick up from, or where is the cargo now?"
                      className={cn(inputClasses, "resize-none")}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#1A0A53]">
                      Type of warehouse needed <span className="text-maroon-admin">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="warehouse-type"
                        required
                        defaultValue=""
                        className={cn(inputClasses, "appearance-none pr-10")}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {WAREHOUSE_TYPES.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#5b6b82]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#1A0A53]">
                      Additional details <span className="font-normal text-[#94a3b8]">(optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Space needed, storage duration, or anything else about your cargo…"
                      className={cn(inputClasses, "resize-none")}
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
                    {pending ? "Sending…" : "Send booking request"}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>

                  <p className="text-center text-xs leading-relaxed text-[#94a3b8]">
                    We&rsquo;ll reply by email or phone to confirm availability — this is separate from the
                    shipment waybill above.
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
