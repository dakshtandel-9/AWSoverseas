"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, UserRound, X } from "lucide-react";

export type AdminUserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  phone: string;
  company_name: string;
  country: string;
  passport_number: string;
  passport_front_url: string;
  passport_back_url: string;
  referral_code: string;
  status: "incomplete" | "pending" | "approved" | "rejected";
  created_at: string;
};

const STATUS_BADGE: Record<AdminUserProfile["status"], { label: string; classes: string }> = {
  incomplete: { label: "Profile incomplete", classes: "bg-[#eef3fb] text-[#5b6b82]" },
  pending: { label: "Pending review", classes: "bg-amber-100 text-amber-800" },
  approved: { label: "Approved", classes: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", classes: "bg-red-100 text-red-700" },
};

function PassportImage({ label, url }: { label: string; url: string }) {
  if (!url) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#e4e9f2] text-xs text-[#94a3b8]">
        {label}: not uploaded
      </div>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="group block" title={`Open ${label} full size`}>
      <div className="relative h-40 overflow-hidden rounded-xl border border-[#e4e9f2]">
        <Image src={url} alt={label} fill sizes="320px" className="object-cover transition-transform group-hover:scale-105" />
      </div>
      <p className="mt-1.5 text-xs font-medium text-[#5b6b82]">{label} — click to open</p>
    </a>
  );
}

function ProfileModal({ profile, onClose }: { profile: AdminUserProfile; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  const name = `${profile.first_name} ${profile.last_name}`.trim() || profile.email;
  const badge = STATUS_BADGE[profile.status];
  const createdAt = new Date(profile.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-[#000c1a]/60 backdrop-blur-sm" onClick={onClose} aria-hidden />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-profile-modal-title"
          className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-y-auto rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#e4e9f2] px-7 py-5">
            <div className="min-w-0">
              <p id="user-profile-modal-title" className="truncate text-lg font-bold text-[#002144]">
                {name}
              </p>
              <p className="truncate text-xs text-[#94a3b8]">
                {profile.username ? `@${profile.username} · ` : ""}
                {profile.email}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-8 shrink-0 place-items-center rounded-full text-[#5b6b82] transition-colors hover:bg-[#eef3fb] hover:text-[#002144]"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="px-7 py-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${badge.classes}`}>{badge.label}</span>
              <span className="text-xs text-[#94a3b8]">Member since {createdAt}</span>
            </div>

            <div className="mt-5 grid gap-x-8 gap-y-3 text-sm text-[#002144] sm:grid-cols-2">
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {profile.phone ? (
                  <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="text-[#8d1a32] hover:underline">
                    {profile.phone}
                  </a>
                ) : (
                  "—"
                )}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a href={`mailto:${profile.email}`} className="text-[#8d1a32] hover:underline">
                  {profile.email}
                </a>
              </p>
              <p>
                <span className="font-semibold">Country:</span> {profile.country || "—"}
              </p>
              <p>
                <span className="font-semibold">Company:</span> {profile.company_name || "—"}
              </p>
              <p>
                <span className="font-semibold">Passport no.:</span> {profile.passport_number || "—"}
              </p>
              <p className="sm:col-span-2">
                <Gift className="mr-1.5 inline size-3.5 text-[#8d1a32]" />
                <span className="font-semibold">Referral code:</span>{" "}
                <span className="font-mono">{profile.referral_code}</span>
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <PassportImage label="Passport front" url={profile.passport_front_url} />
              <PassportImage label="Passport back" url={profile.passport_back_url} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

/** "View profile" trigger + popup showing a customer's full account details, for use on admin request rows. */
export function ViewProfileButton({ profile }: { profile: AdminUserProfile | null }) {
  const [open, setOpen] = useState(false);

  if (!profile) return null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e9f2] px-3.5 py-1.5 text-xs font-semibold text-[#5b6b82] transition-colors hover:border-[#d6274c] hover:text-[#8d1a32]"
      >
        <UserRound className="size-3.5" />
        View profile
      </button>
      {open && <ProfileModal profile={profile} onClose={() => setOpen(false)} />}
    </>
  );
}
