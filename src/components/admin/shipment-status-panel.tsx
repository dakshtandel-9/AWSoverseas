"use client";

import { useRef, useState, useTransition } from "react";
import { PackageSearch } from "lucide-react";
import { addShipmentMilestoneAction } from "@/app/admin/(dashboard)/quotes/actions";
import type { ShipmentStatus } from "@/lib/tracking";

const STAGES: { value: ShipmentStatus; label: string }[] = [
  { value: "pending", label: "Pending pickup" },
  { value: "collected", label: "Collected" },
  { value: "customs_cleared", label: "Customs cleared" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
];

type Milestone = { id: string; status: string; location: string; note: string; created_at: string };

export function ShipmentStatusPanel({
  quoteId,
  trackingNumber,
  currentStatus,
  milestones,
}: {
  quoteId: string;
  trackingNumber: string | null;
  currentStatus: string;
  milestones: Milestone[];
}) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus as ShipmentStatus);
  const formRef = useRef<HTMLFormElement>(null);

  if (!trackingNumber) return null;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const location = String(form.get("location") ?? "").trim();
    const note = String(form.get("note") ?? "").trim();
    startTransition(async () => {
      await addShipmentMilestoneAction(quoteId, status, location, note);
      formRef.current?.reset();
    });
  }

  return (
    <div className="mt-4 border-t border-[#e4e9f2] pt-4">
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#06234d]">
        <PackageSearch className="size-3.5 text-[#0489c2]" />
        Tracking: <span className="font-mono">{trackingNumber}</span>
      </p>

      {milestones.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 text-xs text-[#5b6b82]">
          {milestones.map((m) => (
            <li key={m.id}>
              <span className="font-semibold text-[#06234d]">
                {STAGES.find((s) => s.value === m.status)?.label ?? m.status}
              </span>
              {m.location && ` · ${m.location}`}
              {m.note && ` · ${m.note}`}
            </li>
          ))}
        </ul>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
          className="rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs font-semibold text-[#06234d]"
        >
          {STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          name="location"
          placeholder="Location (optional)"
          className="min-w-0 flex-1 rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#06234d] placeholder:text-[#94a3b8]"
        />
        <input
          name="note"
          placeholder="Note (optional)"
          className="min-w-0 flex-1 rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#06234d] placeholder:text-[#94a3b8]"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#033e8d] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#052f69] disabled:opacity-50"
        >
          Update status
        </button>
      </form>
    </div>
  );
}
