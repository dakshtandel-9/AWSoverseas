import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { OfficeBoard } from "@/components/admin/office-board";
import { listAdminOfficeGroups } from "@/lib/office-locations";

export default async function AdminOfficesPage() {
  const configured = isSupabaseConfigured();
  const groups = configured ? await listAdminOfficeGroups() : [];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Contact page</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Offices</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
        The office directory below the map on the Contact page. Each group is a heading with its own
        row of office cards — India, international, or any grouping you add. Changes go live
        immediately.
      </p>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <OfficeBoard groups={groups} />
    </div>
  );
}
