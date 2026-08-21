import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { MessageRow } from "@/components/admin/message-row";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminMessagesPage() {
  const configured = isSupabaseConfigured();
  const items = configured
    ? (await supabaseAdmin().from("contact_submissions").select("*").order("created_at", { ascending: false })).data ?? []
    : [];

  return (
    <div>
      <AdminPageHeader href="/admin/messages" />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {items.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No messages yet.
          </p>
        )}
        {items.map((item) => (
          <MessageRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
