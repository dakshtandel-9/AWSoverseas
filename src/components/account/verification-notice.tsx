import Link from "next/link";
import { Clock3, ShieldAlert } from "lucide-react";
import type { AccountStatus } from "@/lib/account";

/**
 * Shown in place of a gated form (quote page) while the account is still
 * pending review or was declined.
 */
export function VerificationNotice({ status }: { status: AccountStatus }) {
  const declined = status === "rejected";
  const Icon = declined ? ShieldAlert : Clock3;

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-[#e4e9f2] bg-white px-8 py-14 text-center shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
      <span
        className={`mx-auto grid size-14 place-items-center rounded-full ${
          declined ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
        }`}
      >
        <Icon className="size-7" />
      </span>

      <h2 className="mt-5 text-xl font-bold text-[#06234d]">
        {declined ? "Verification declined" : "Verification pending"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5b6b82]">
        {declined
          ? "We couldn't verify your account details. Update your passport information and resubmit — you'll be able to continue once approved."
          : "Our team is reviewing your account. This form unlocks as soon as you're approved — we'll take it from there."}
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {declined && (
          <Link
            href="/profile/setup"
            className="inline-flex items-center rounded-full bg-[#033e8d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#052f69]"
          >
            Update details
          </Link>
        )}
        <Link
          href="/profile"
          className="inline-flex items-center rounded-full border border-[#e4e9f2] px-6 py-3 text-sm font-semibold text-[#06234d] transition-colors hover:border-[#0fade8]"
        >
          View your profile
        </Link>
      </div>
    </div>
  );
}
