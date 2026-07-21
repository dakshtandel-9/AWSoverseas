import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getProfilesForUsers } from "@/lib/wallet-admin";
import { SetupNotice } from "@/components/admin/setup-notice";
import { WithdrawalRow } from "@/components/admin/withdrawal-row";

export default async function AdminWithdrawalsPage() {
  const configured = isSupabaseConfigured();
  const items = configured
    ? (
        await supabaseAdmin()
          .from("wallet_withdrawals")
          .select("*, requester:user_id(first_name, last_name)")
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  const profileByUserId = await getProfilesForUsers(items.map((i) => i.user_id));

  const pending = items.filter((i) => i.status === "pending");
  const others = items.filter((i) => i.status !== "pending");

  function requesterName(item: (typeof items)[number]) {
    const r = item.requester as unknown as { first_name: string; last_name: string } | null;
    return r ? `${r.first_name} ${r.last_name}`.trim() : "Unknown customer";
  }

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Requests</p>
      <h1 className="mt-2 text-2xl font-bold text-[#002144] sm:text-3xl">Wallet withdrawals</h1>
      <p className="mt-2 text-sm text-[#5b6b82]">Payout requests against customers&apos; referral wallet balance.</p>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      {pending.length > 0 && (
        <>
          <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-amber-700">
            Awaiting review ({pending.length})
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {pending.map((item) => (
              <WithdrawalRow
                key={item.id}
                item={item}
                requesterName={requesterName(item)}
                profile={profileByUserId[item.user_id] ?? null}
              />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-[#5b6b82]">All requests ({others.length})</h2>
      <div className="mt-4 flex flex-col gap-3">
        {others.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            {pending.length > 0 ? "Everyone else is in the review queue above." : "No withdrawal requests yet."}
          </p>
        )}
        {others.map((item) => (
          <WithdrawalRow
            key={item.id}
            item={item}
            requesterName={requesterName(item)}
            profile={profileByUserId[item.user_id] ?? null}
          />
        ))}
      </div>
    </div>
  );
}
