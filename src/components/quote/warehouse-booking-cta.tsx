"use client";

import { useState } from "react";
import { Warehouse } from "lucide-react";
import { WarehouseBookingModal } from "@/components/quote/warehouse-booking-modal";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";

/**
 * A dashed border (vs. the solid waybill card below) signals this is a
 * lighter, separate ask — storage instead of freight — not another section
 * of the shipment form.
 */
export function WarehouseBookingCta({ auth }: { auth: EnquiryAuth }) {
  const [open, setOpen] = useState(false);
  // Bumped on each open so the modal remounts with fresh form/submit state —
  // otherwise a prior success screen would linger when reopening.
  const [openCount, setOpenCount] = useState(0);

  function openModal() {
    setOpen(true);
    setOpenCount((n) => n + 1);
  }

  return (
    <div className="mx-auto mb-8 max-w-3xl">
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-[#9e4953]/40 bg-white/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-[#9e4953]/10 text-maroon-admin">
            <Warehouse className="size-5" />
          </span>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
              Separate Request
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1A0A53]">Need storage, not freight?</p>
            <p className="mt-0.5 max-w-md text-sm leading-relaxed text-[#5b6b82]">
              Book warehouse space for your cargo — handled apart from the shipment waybill below.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#9e4953] px-5 text-sm font-semibold text-maroon-admin transition-colors duration-200 hover:bg-[#9e4953] hover:text-white"
        >
          <Warehouse className="size-4" />
          Book a Warehouse
        </button>
      </div>

      <WarehouseBookingModal key={openCount} auth={auth} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
