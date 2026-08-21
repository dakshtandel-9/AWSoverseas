import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { OfficeBoard } from "@/components/admin/office-board";
import { listAdminOfficeGroups } from "@/lib/office-locations";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminOfficesPage() {
  const configured = isSupabaseConfigured();
  const groups = configured ? await listAdminOfficeGroups() : [];

  return (
    <div>
      <AdminPageHeader href="/admin/offices" />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <OfficeBoard groups={groups} />
    </div>
  );
}
