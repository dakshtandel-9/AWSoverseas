import { BadgeCheck, Clock3, IdCard, ShieldAlert } from "lucide-react";
import type { AccountStatus } from "@/lib/account";

const STATUS_STYLES: Record<Exclude<AccountStatus, "incomplete">, { icon: typeof Clock3; classes: string; label: string }> = {
  unverified: {
    icon: IdCard,
    classes: "border-[#c7d7ee] bg-[#eef3fb] text-[#5b6b82]",
    label: "Unverified",
  },
  pending: {
    icon: Clock3,
    classes: "border-amber-200 bg-amber-50 text-amber-800",
    label: "Pending",
  },
  approved: {
    icon: BadgeCheck,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
    label: "Approved",
  },
  rejected: {
    icon: ShieldAlert,
    classes: "border-red-200 bg-red-50 text-red-700",
    label: "Rejected",
  },
};

export function ReferralStatusBadge({ status }: { status: AccountStatus }) {
  // A referred signup that never finished setup reads as unverified rather
  // than pending — nothing of theirs is waiting on our review.
  const style = STATUS_STYLES[status === "incomplete" ? "unverified" : status];
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.classes}`}
    >
      <Icon className="size-3" />
      {style.label}
    </span>
  );
}
