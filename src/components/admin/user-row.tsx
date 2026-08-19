"use client";

import { useState, useTransition } from "react";
import { BadgeCheck, ChevronDown, Gift, ShieldX, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { approveUserAction, rejectUserAction, deleteUserAction } from "@/app/admin/(dashboard)/users/actions";

export type AdminUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  phone: string;
  company_name: string;
  country: string;
  id_type: "passport" | "aadhaar" | "national_id";
  id_number: string;
  referral_code: string;
  status: "incomplete" | "unverified" | "pending" | "approved" | "rejected";
  created_at: string;
  referrer: { first_name: string; last_name: string; username: string | null } | null;
};

const ID_TYPE_LABEL: Record<AdminUser["id_type"], string> = {
  passport: "Passport",
  aadhaar: "Aadhaar",
  national_id: "National ID",
};

const STATUS_BADGE: Record<AdminUser["status"], { label: string; classes: string }> = {
  incomplete: { label: "Profile incomplete", classes: "bg-[#eef3fb] text-[#5b6b82]" },
  unverified: { label: "No ID uploaded", classes: "bg-[#eef3fb] text-[#1A0A53]" },
  pending: { label: "Pending review", classes: "bg-amber-100 text-amber-800" },
  approved: { label: "Approved", classes: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", classes: "bg-red-100 text-red-700" },
};

export function UserRow({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const badge = STATUS_BADGE[user.status];
  const name = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const createdAt = new Date(user.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const actionButton =
    "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="rounded-2xl border border-[#e4e9f2] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#1A0A53]">{name}</p>
          <p className="truncate text-xs text-[#94a3b8]">
            {user.username ? `@${user.username} · ` : ""}
            {user.email}
          </p>
        </div>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-bold", badge.classes)}>
          {badge.label}
        </span>
        <span className="hidden shrink-0 text-xs text-[#94a3b8] sm:block">{createdAt}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#94a3b8] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-[#e4e9f2] px-5 py-5">
          <div className="grid gap-x-8 gap-y-2 text-sm text-[#1A0A53] sm:grid-cols-2">
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {user.phone ? (
                <a href={`tel:${user.phone.replace(/\s+/g, "")}`} className="text-maroon-admin hover:underline">
                  {user.phone}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p>
              <span className="font-semibold">Country:</span> {user.country || "—"}
            </p>
            <p>
              <span className="font-semibold">Company:</span> {user.company_name || "—"}
            </p>
            <p>
              <span className="font-semibold">{ID_TYPE_LABEL[user.id_type]} no.:</span> {user.id_number || "—"}
            </p>
            <p>
              <span className="font-semibold">Referral code:</span>{" "}
              <span className="font-mono">{user.referral_code}</span>
            </p>
            {user.referrer && (
              <p className="sm:col-span-2">
                <Gift className="mr-1.5 inline size-3.5 text-maroon-admin" />
                <span className="font-semibold">Referred by:</span> {user.referrer.first_name}{" "}
                {user.referrer.last_name}
                {user.referrer.username ? ` (@${user.referrer.username})` : ""}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {user.status !== "approved" && (
              <button
                type="button"
                disabled={pending || user.status === "incomplete"}
                onClick={() => startTransition(() => approveUserAction(user.id))}
                className={cn(actionButton, "bg-emerald-600 text-white hover:bg-emerald-700")}
                title={
                  user.status === "incomplete"
                    ? "User hasn't submitted their details yet"
                    : user.status === "unverified"
                      ? "No ID uploaded — approving skips document verification"
                      : undefined
                }
              >
                <BadgeCheck className="size-3.5" />
                Approve
              </button>
            )}
            {user.status !== "rejected" && (
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => rejectUserAction(user.id))}
                className={cn(actionButton, "border border-[#e4e9f2] text-[#5b6b82] hover:border-red-300 hover:text-red-600")}
              >
                <ShieldX className="size-3.5" />
                {user.status === "approved" ? "Revoke approval" : "Reject"}
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (window.confirm(`Delete ${name}'s account? This can't be undone.`)) {
                  startTransition(() => deleteUserAction(user.id));
                }
              }}
              className={cn(actionButton, "ml-auto border border-[#e4e9f2] text-[#5b6b82] hover:border-red-300 hover:text-red-600")}
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
