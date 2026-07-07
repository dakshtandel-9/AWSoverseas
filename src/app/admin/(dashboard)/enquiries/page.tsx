import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { EnquiryRow } from "@/components/admin/enquiry-row";

export default async function AdminEnquiriesPage() {
  const configured = isSupabaseConfigured();
  const items = configured
    ? (await supabaseAdmin().from("product_enquiries").select("*").order("created_at", { ascending: false })).data ?? []
    : [];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Requests</p>
      <h1 className="mt-2 text-2xl font-bold text-[#06234d] sm:text-3xl">Product enquiries</h1>
      <p className="mt-2 text-sm text-[#5b6b82]">Submissions from the Enquiry button on the Products page.</p>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {items.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No product enquiries yet.
          </p>
        )}
        {items.map((item) => (
          <EnquiryRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
