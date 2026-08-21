import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { SubscriberRow } from "@/components/admin/subscriber-row";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminNewsletterPage() {
  const configured = isSupabaseConfigured();
  const items = configured
    ? (await supabaseAdmin().from("newsletter_subscribers").select("*").order("created_at", { ascending: false }))
        .data ?? []
    : [];

  return (
    <div>
      <AdminPageHeader
        href="/admin/newsletter"
        description={`Emails collected from the newsletter form in the site footer. ${items.length} subscriber${
          items.length === 1 ? "" : "s"
        }.`}
      />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {items.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No subscribers yet.
          </p>
        )}
        {items.map((item) => (
          <SubscriberRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
