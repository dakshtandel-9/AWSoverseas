import { getMarketingIntegrationsFresh } from "@/lib/marketing-integrations";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { IntegrationsForm } from "@/components/admin/integrations-form";
import { IntegrationsGuide } from "@/components/admin/integrations-guide";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminIntegrationsPage() {
  const integrations = await getMarketingIntegrationsFresh();

  return (
    <div>
      <AdminPageHeader href="/admin/seo" />

      {!isSupabaseConfigured() && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <IntegrationsForm integrations={integrations} />
      <IntegrationsGuide />
    </div>
  );
}
