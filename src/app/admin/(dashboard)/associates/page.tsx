import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { CityAgentsBoard } from "@/components/admin/city-agents-board";
import { listAdminCityAgents } from "@/lib/city-agents";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminCityAgentsPage() {
  const configured = isSupabaseConfigured();
  const agents = configured ? await listAdminCityAgents() : [];

  return (
    <div>
      <AdminPageHeader href="/admin/associates" />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <CityAgentsBoard agents={agents} />
    </div>
  );
}
