import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getReferrerInfoForUsers, getWalletCreditsForSources, getProfilesForUsers } from "@/lib/wallet-admin";
import { SetupNotice } from "@/components/admin/setup-notice";
import { QuoteRow } from "@/components/admin/quote-row";
import { CreateQuoteButton, type QuoteUserOption } from "@/components/admin/create-quote-form";

export default async function AdminQuotesPage() {
  const configured = isSupabaseConfigured();
  const db = supabaseAdmin();

  const [itemsRes, usersRes] = configured
    ? await Promise.all([
        db.from("quote_submissions").select("*").order("created_at", { ascending: false }),
        db
          .from("user_profiles")
          .select("id, first_name, last_name, username, email, status")
          .neq("status", "incomplete")
          .order("first_name", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }];

  const items = itemsRes.data ?? [];
  const users = (usersRes.data as QuoteUserOption[] | null) ?? [];

  const milestonesByQuote: Record<string, { id: string; status: string; location: string; note: string; created_at: string }[]> = {};
  if (configured && items.length > 0) {
    const { data: milestones } = await db
      .from("shipment_milestones")
      .select("id, quote_id, status, location, note, created_at")
      .in(
        "quote_id",
        items.map((i) => i.id),
      )
      .order("created_at", { ascending: true });
    for (const m of milestones ?? []) {
      (milestonesByQuote[m.quote_id] ??= []).push(m);
    }
  }

  const userIds = items.map((i) => i.user_id).filter((id): id is string => Boolean(id));
  const [referrerByUserId, creditBySourceId, profileByUserId] = await Promise.all([
    getReferrerInfoForUsers(userIds),
    getWalletCreditsForSources(
      "quote",
      items.map((i) => i.id),
    ),
    getProfilesForUsers(userIds),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Requests</p>
          <h1 className="mt-2 text-2xl font-bold text-[#002144] sm:text-3xl">Quote requests</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
            Submissions from the Request a Quote form — or created here for a customer.
          </p>
        </div>
        {configured && <CreateQuoteButton users={users} />}
      </div>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {items.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No quote requests yet.
          </p>
        )}
        {items.map((item) => (
          <QuoteRow
            key={item.id}
            item={item}
            milestones={milestonesByQuote[item.id] ?? []}
            referrerName={item.user_id ? referrerByUserId[item.user_id] ?? null : null}
            alreadyCredited={creditBySourceId[item.id] ?? null}
            profile={item.user_id ? profileByUserId[item.user_id] ?? null : null}
          />
        ))}
      </div>
    </div>
  );
}
