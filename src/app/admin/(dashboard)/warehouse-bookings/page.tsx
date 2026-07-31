import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { WarehouseBookingRow } from "@/components/admin/warehouse-booking-row";

export default async function AdminWarehouseBookingsPage() {
  const configured = isSupabaseConfigured();
  const items = configured
    ? (
        await supabaseAdmin()
          .from("warehouse_bookings")
          .select("*")
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Requests</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Warehouse Bookings</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#5b6b82]">
        Storage requests from the &ldquo;Book a Warehouse&rdquo; popup on the Request a Quote page — a separate
        ask from the shipment enquiries below. Follow up by email or phone to confirm availability.
      </p>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {items.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No warehouse booking requests yet.
          </p>
        )}
        {items.map((item) => (
          <WarehouseBookingRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
