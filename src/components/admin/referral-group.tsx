import { ChevronDown, GitFork } from "lucide-react";

export type ReferralUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string | null;
  email: string;
  referral_code: string;
  referred_by: string | null;
  status: "incomplete" | "unverified" | "pending" | "approved" | "rejected";
  created_at: string;
};

const STATUS_BADGE: Record<ReferralUser["status"], { label: string; classes: string }> = {
  incomplete: { label: "Incomplete", classes: "bg-[#eef3fb] text-[#5b6b82]" },
  unverified: { label: "No ID", classes: "bg-[#eef3fb] text-[#1A0A53]" },
  pending: { label: "Pending", classes: "bg-amber-100 text-amber-800" },
  approved: { label: "Approved", classes: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", classes: "bg-red-100 text-red-700" },
};

function displayName(user: Pick<ReferralUser, "first_name" | "last_name" | "email">) {
  return `${user.first_name} ${user.last_name}`.trim() || user.email;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** One referrer and everyone who signed up with their code, as a native disclosure (no client JS needed). */
export function ReferralGroup({ referrer, referred }: { referrer: ReferralUser; referred: ReferralUser[] }) {
  return (
    <details className="group rounded-2xl border border-[#e4e9f2] bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eef3fb] text-[#1A0A53]">
          <GitFork className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#1A0A53]">{displayName(referrer)}</p>
          <p className="truncate text-xs text-[#94a3b8]">
            {referrer.username ? `@${referrer.username} · ` : ""}
            code <span className="font-mono">{referrer.referral_code}</span>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#f7e8e5] px-3 py-1 text-[11px] font-bold text-maroon-admin">
          {referred.length} referred
        </span>
        <ChevronDown className="size-4 shrink-0 text-[#94a3b8] transition-transform group-open:rotate-180" />
      </summary>

      <div className="border-t border-[#e4e9f2] px-5 py-2">
        <div className="flex flex-col divide-y divide-[#eef3fb]">
          {referred.map((user) => {
            const badge = STATUS_BADGE[user.status];
            return (
              <div key={user.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#1A0A53]">{displayName(user)}</p>
                  <p className="truncate text-xs text-[#94a3b8]">
                    {user.username ? `@${user.username} · ` : ""}
                    {user.email}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${badge.classes}`}>
                  {badge.label}
                </span>
                <span className="hidden shrink-0 text-xs text-[#94a3b8] sm:block">{formatDate(user.created_at)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}
