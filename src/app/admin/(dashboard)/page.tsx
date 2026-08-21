import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminCounts } from "@/lib/admin-counts";
import { ADMIN_NAV, type AdminNavItem } from "@/lib/admin-nav";

/** Every nav entry that carries a waiting count, in sidebar order. */
const QUEUES: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items).filter((i) => i.inbox);

type FeedItem = { id: string; who: string; detail: string; createdAt: string; item: AdminNavItem };

const byHref = (href: string) => QUEUES.find((q) => q.href === href)!;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * The newest unread row from each queue, merged into one list. This is the
 * "without a second click" part of the dashboard: enough to recognise what came
 * in and decide whether it needs opening.
 */
async function getFeed(): Promise<FeedItem[]> {
  const db = supabaseAdmin();
  const recent = (table: string, cols: string) =>
    db
      .from(table)
      .select(cols)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(5);

  const [orders, enquiries, quotes, warehouse, messages, users] = await Promise.all([
    recent("product_enquiries", "id, full_name, product_name, created_at").eq("request_type", "order"),
    recent("product_enquiries", "id, full_name, product_name, created_at").eq("request_type", "enquiry"),
    recent("quote_submissions", "id, full_name, service_type, destination_country, created_at"),
    recent("warehouse_bookings", "id, full_name, warehouse_type, created_at"),
    recent("contact_submissions", "id, full_name, service_required, created_at"),
    db
      .from("user_profiles")
      .select("id, first_name, last_name, email, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  type Row = Record<string, string | null>;
  const rows = (res: { data: unknown }) => ((res.data as Row[] | null) ?? []);

  const feed: FeedItem[] = [
    ...rows(orders).map((r) => ({
      id: `order-${r.id}`,
      who: r.full_name || "Someone",
      detail: r.product_name || "Order",
      createdAt: r.created_at!,
      item: byHref("/admin/orders"),
    })),
    ...rows(enquiries).map((r) => ({
      id: `enquiry-${r.id}`,
      who: r.full_name || "Someone",
      detail: r.product_name || "Enquiry",
      createdAt: r.created_at!,
      item: byHref("/admin/enquiries"),
    })),
    ...rows(quotes).map((r) => ({
      id: `quote-${r.id}`,
      who: r.full_name || "Someone",
      detail: [r.service_type, r.destination_country].filter(Boolean).join(" → ") || "Quote enquiry",
      createdAt: r.created_at!,
      item: byHref("/admin/quotes"),
    })),
    ...rows(warehouse).map((r) => ({
      id: `warehouse-${r.id}`,
      who: r.full_name || "Someone",
      detail: r.warehouse_type || "Warehouse booking",
      createdAt: r.created_at!,
      item: byHref("/admin/warehouse-bookings"),
    })),
    ...rows(messages).map((r) => ({
      id: `message-${r.id}`,
      who: r.full_name || "Someone",
      detail: r.service_required || "Contact message",
      createdAt: r.created_at!,
      item: byHref("/admin/messages"),
    })),
    ...rows(users).map((r) => ({
      id: `user-${r.id}`,
      who: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || r.email || "New sign-up",
      detail: "Waiting for approval",
      createdAt: r.created_at!,
      item: byHref("/admin/users"),
    })),
  ];

  return feed.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
}

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const [counts, feed] = await Promise.all([getAdminCounts(), configured ? getFeed() : []]);

  const waiting = QUEUES.filter((q) => counts[q.inbox!] > 0);
  const clear = QUEUES.filter((q) => counts[q.inbox!] === 0);
  const total = waiting.reduce((n, q) => n + counts[q.inbox!], 0);

  return (
    <div>
      <AdminPageHeader href="/admin" />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      {/* Needs you now — only queues with something in them, so a clear desk looks clear. */}
      <section className="mt-8">
        <h2 className="flex flex-wrap items-baseline gap-x-3 text-sm font-bold text-[#1A0A53]">
          Needs you now
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
            {total === 0 ? "nothing waiting" : `${total} item${total === 1 ? "" : "s"}`}
          </span>
        </h2>

        {waiting.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#e4e9f2] bg-white px-5 py-6">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
            <p className="text-sm text-[#5b6b82]">
              {configured
                ? "Every queue is clear. New orders, enquiries and messages will show up here."
                : "Connect the database to see what's waiting."}
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {waiting.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className="group flex flex-col gap-4 rounded-2xl border border-[#e4e9f2] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#cfd9e8] hover:shadow-[0_18px_40px_-16px_rgba(4,22,47,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-[#eef3fb] text-[#1A0A53]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-3xl font-bold tabular-nums text-[#1A0A53]">{counts[q.inbox!]}</p>
                    <p className="mt-1 text-sm text-[#5b6b82]">{q.waitingLabel}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-admin">
                    Open {q.label}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {feed.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-bold text-[#1A0A53]">Latest arrivals</h2>
          <ul className="mt-4 divide-y divide-[#eef2f8] overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white">
            {feed.map((f) => {
              const Icon = f.item.icon;
              return (
                <li key={f.id}>
                  <Link
                    href={f.item.href}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#f8fafd] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#002144] sm:px-5"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#1A0A53]">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[#1A0A53]">{f.who}</span>
                      <span className="block truncate text-xs text-[#5b6b82]">
                        {f.item.label} · {f.detail}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-[#94a3b8]">{formatDate(f.createdAt)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {clear.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-bold text-[#1A0A53]">All clear</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {clear.map((q) => {
              const Icon = q.icon;
              return (
                <li key={q.href}>
                  <Link
                    href={q.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#e4e9f2] bg-white px-3.5 py-2 text-sm text-[#5b6b82] transition-colors hover:border-[#cfd9e8] hover:text-[#1A0A53] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
                  >
                    <Icon className="size-4 text-[#94a3b8]" />
                    {q.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
