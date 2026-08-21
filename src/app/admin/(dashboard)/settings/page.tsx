import { getSiteSettings } from "@/lib/site-settings";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { SettingsForm } from "@/components/admin/settings-form";
import { MaintenanceToggle } from "@/components/admin/maintenance-toggle";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader href="/admin/settings" />

      {!isSupabaseConfigured() && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <MaintenanceToggle enabled={settings.maintenanceMode} />

      <SettingsForm settings={settings} />
    </div>
  );
}
