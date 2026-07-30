import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { WalletRow, type AdminWalletCustomer, type AdminWalletEntry } from "@/components/admin/wallet-row";

// Balances change from other admin screens (crediting a referral on a quote
// or order row), so this list must never be served stale.
export const dynamic = "force-dynamic";

const money = (value: number) => `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

/**
 * One pass over profiles plus one over the whole ledger, then grouped in
 * memory — a per-customer balance query would be one round trip per row.
 */
async function getWallets(): Promise<AdminWalletCustomer[]> {
  const db = supabaseAdmin();

  const [{ data: profiles }, { data: ledger }] = await Promise.all([
    db
      .from("user_profiles")
      .select("id, email, first_name, last_name, username")
      .order("created_at", { ascending: false }),
    db
      .from("wallet_transactions")
      .select("id, user_id, amount, reason, source_type, created_at, referred:referred_user_id(first_name, last_name)")
      .order("created_at", { ascending: false }),
  ]);

  const historyByUser: Record<string, AdminWalletEntry[]> = {};
  for (const row of ledger ?? []) {
    const referred = row.referred as unknown as { first_name: string; last_name: string } | null;
    (historyByUser[row.user_id] ??= []).push({
      id: row.id,
      amount: Number(row.amount),
      reason: row.reason,
      source_type: row.source_type,
      created_at: row.created_at,
      referredName: referred ? `${referred.first_name} ${referred.last_name}`.trim() : null,
    });
  }

  return (profiles ?? []).map((profile) => {
    const history = historyByUser[profile.id] ?? [];
    let earned = 0;
    let deducted = 0;
    for (const entry of history) {
      if (entry.amount < 0) deducted += -entry.amount;
      else earned += entry.amount;
    }

    return {
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`.trim() || profile.email,
      email: profile.email,
      username: profile.username,
      earned,
      deducted,
      available: earned - deducted,
      history,
    };
  });
}

export default async function AdminWalletsPage() {
  const configured = isSupabaseConfigured();
  const customers = configured ? await getWallets() : [];

  const withBalance = customers.filter((c) => c.history.length > 0);
  const empty = customers.filter((c) => c.history.length === 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + c.available, 0);

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Customers</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Wallets</h1>
      <p className="mt-2 text-sm text-[#5b6b82]">
        Every customer&apos;s referral balance. Open a customer to add credit or deduct it — each adjustment is
        recorded as its own line in the wallet activity they see.
      </p>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      {configured && (
        <p className="mt-6 inline-flex items-baseline gap-2 rounded-2xl border border-[#e4e9f2] bg-white px-5 py-3">
          <span className="font-mono text-xl font-bold text-[#1A0A53]">{money(totalOutstanding)}</span>
          <span className="text-sm text-[#5b6b82]">
            held across {withBalance.length} wallet{withBalance.length === 1 ? "" : "s"}
          </span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {withBalance.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No wallet activity yet.
          </p>
        )}
        {withBalance.map((customer) => (
          <WalletRow key={customer.id} customer={customer} />
        ))}
      </div>

      {empty.length > 0 && (
        <>
          <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-[#5b6b82]">
            Empty wallets ({empty.length})
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {empty.map((customer) => (
              <WalletRow key={customer.id} customer={customer} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
