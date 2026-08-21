import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import type { AdminInboxKey } from "@/lib/admin-nav";

export type AdminCounts = Record<AdminInboxKey, number>;

export const EMPTY_ADMIN_COUNTS: AdminCounts = {
  orders: 0,
  enquiries: 0,
  quotes: 0,
  "warehouse-bookings": 0,
  messages: 0,
  users: 0,
};

/**
 * Head-only counts (no rows transferred). This runs on every admin page render
 * to keep the sidebar badges honest, which is why every query is `head: true`.
 */
export async function getAdminCounts(): Promise<AdminCounts> {
  if (!isSupabaseConfigured()) return EMPTY_ADMIN_COUNTS;

  const db = supabaseAdmin();
  const unread = (table: string) =>
    db.from(table).select("id", { count: "exact", head: true }).eq("is_read", false);

  const [orders, enquiries, quotes, warehouse, messages, users] = await Promise.all([
    unread("product_enquiries").eq("request_type", "order"),
    unread("product_enquiries").eq("request_type", "enquiry"),
    unread("quote_submissions"),
    unread("warehouse_bookings"),
    unread("contact_submissions"),
    db.from("user_profiles").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return {
    orders: orders.count ?? 0,
    enquiries: enquiries.count ?? 0,
    quotes: quotes.count ?? 0,
    "warehouse-bookings": warehouse.count ?? 0,
    messages: messages.count ?? 0,
    users: users.count ?? 0,
  };
}
