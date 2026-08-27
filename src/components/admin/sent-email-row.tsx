"use client";

import { useState } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export type SentEmail = {
  id: string;
  from_address: string;
  to_addresses: string[] | null;
  cc_addresses: string[] | null;
  bcc_addresses: string[] | null;
  subject: string;
  body: string;
  branded: boolean;
  status: string;
  error: string;
  created_at: string;
};

/**
 * One line in the sent list, opening to the message as it was typed.
 *
 * Deliberately not a `SubmissionRow`: that row is built around read/unread and
 * delete, and neither means anything for mail that has already left. A sent
 * email is a receipt — it can be reread, never actioned.
 */
export function SentEmailRow({ item }: { item: SentEmail }) {
  const [open, setOpen] = useState(false);

  const to = item.to_addresses ?? [];
  const cc = item.cc_addresses ?? [];
  const bcc = item.bcc_addresses ?? [];
  const failed = item.status === "failed";

  const sentAt = new Date(item.created_at).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("rounded-2xl border bg-white", failed ? "border-[#f0d3d6]" : "border-[#e4e9f2]")}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#002144]"
      >
        {failed && <CircleAlert className="size-4 shrink-0 text-[#861B28]" aria-label="Not sent" />}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1A0A53]">{item.subject}</p>
          <p className="truncate text-xs text-[#94a3b8]">
            {item.from_address} → {to.join(", ") || "no recipients"}
          </p>
        </div>
        <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#94a3b8] sm:block">
          {failed ? "Not sent" : item.branded ? "Branded" : "Plain"}
        </span>
        <span className="shrink-0 text-xs text-[#94a3b8]">{sentAt}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#94a3b8] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-[#e4e9f2] px-5 py-4 text-sm leading-relaxed text-[#1A0A53]">
          {failed && item.error && (
            <p className="mb-3 rounded-xl border border-[#f0d3d6] bg-[#fdf7f8] px-4 py-3 text-[#861B28]">
              {item.error}
            </p>
          )}
          <div className="grid gap-1.5 text-xs text-[#5b6b82]">
            <p>
              <span className="font-semibold text-[#1A0A53]">To:</span> {to.join(", ") || "—"}
            </p>
            {cc.length > 0 && (
              <p>
                <span className="font-semibold text-[#1A0A53]">CC:</span> {cc.join(", ")}
              </p>
            )}
            {bcc.length > 0 && (
              <p>
                <span className="font-semibold text-[#1A0A53]">BCC:</span> {bcc.join(", ")}
              </p>
            )}
          </div>
          <p className="mt-3 whitespace-pre-wrap text-[#5b6b82]">{item.body}</p>
        </div>
      )}
    </div>
  );
}
