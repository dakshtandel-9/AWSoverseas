import { BadgeCheck, Clock3, ShieldAlert } from "lucide-react";
import type { AccountStatus } from "@/lib/account";

const STATUS_STYLES: Record<Exclude<AccountStatus, "incomplete">, { icon: typeof Clock3; classes: string; label: string }> = {
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
  const style = STATUS_STYLES[status === "incomplete" ? "pending" : status];
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
