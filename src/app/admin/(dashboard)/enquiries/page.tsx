import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getReferrerInfoForUsers, getWalletCreditsForSources, getProfilesForUsers } from "@/lib/wallet-admin";
import { SetupNotice } from "@/components/admin/setup-notice";
import { EnquiryRow } from "@/components/admin/enquiry-row";
import {
  CreateOrderButton,
  type OrderUserOption,
  type OrderProductOption,
} from "@/components/admin/create-order-form";

export default async function AdminOrdersPage() {
  const configured = isSupabaseConfigured();
  const db = supabaseAdmin();

  const [itemsRes, usersRes, productsRes] = configured
    ? await Promise.all([
        db
          .from("product_enquiries")
          .select("*")
          .eq("request_type", "order")
          .order("created_at", { ascending: false }),
        db
          .from("user_profiles")
          .select("id, first_name, last_name, username, email, status")
          .neq("status", "incomplete")
          .order("first_name", { ascending: true }),
        db
          .from("products")
          .select("id, name, category")
          .eq("is_active", true)
          .order("name", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const items = itemsRes.data ?? [];
  const users = (usersRes.data as OrderUserOption[] | null) ?? [];
  const products = (productsRes.data as OrderProductOption[] | null) ?? [];

  const userIds = items.map((i) => i.user_id).filter((id): id is string => Boolean(id));
  const [referrerByUserId, creditBySourceId, profileByUserId] = await Promise.all([
    getReferrerInfoForUsers(userIds),
    getWalletCreditsForSources(
      "enquiry",
      items.map((i) => i.id),
    ),
    getProfilesForUsers(userIds),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Requests</p>
          <h1 className="mt-2 text-2xl font-bold text-[#06234d] sm:text-3xl">Orders</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
            Submissions from the Order button on the Products page — from signed-in, approved customers, or
            placed here for a customer. Price them out or reject; the customer sees the decision on their
            profile.
          </p>
        </div>
        {configured && <CreateOrderButton users={users} products={products} />}
      </div>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {items.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No orders yet.
          </p>
        )}
        {items.map((item) => (
          <EnquiryRow
            key={item.id}
            item={item}
            referrerName={item.user_id ? referrerByUserId[item.user_id] ?? null : null}
            alreadyCredited={creditBySourceId[item.id] ?? null}
            profile={item.user_id ? profileByUserId[item.user_id] ?? null : null}
          />
        ))}
      </div>
    </div>
  );
}
