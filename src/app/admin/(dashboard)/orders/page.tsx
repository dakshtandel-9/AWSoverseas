import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getReferrerInfoForUsers, getWalletCreditsForSources, getProfilesForUsers } from "@/lib/wallet-admin";
import { SetupNotice } from "@/components/admin/setup-notice";
import { OrderRow } from "@/components/admin/order-row";
import { AdminPageHeader } from "@/components/admin/page-header";
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
          .select("id, name, category_id, categories(name)")
          .eq("is_active", true)
          .order("name", { ascending: true }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const items = itemsRes.data ?? [];
  const users = (usersRes.data as OrderUserOption[] | null) ?? [];
  const products = (
    (productsRes.data as { id: string; name: string; categories: { name: string } | null }[] | null) ?? []
  ).map((p) => ({ id: p.id, name: p.name, category: p.categories?.name ?? null }));

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
      <AdminPageHeader href="/admin/orders" action={configured && <CreateOrderButton users={users} products={products} />} />

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
          <OrderRow
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
