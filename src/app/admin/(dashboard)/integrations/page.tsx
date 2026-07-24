import { getMarketingIntegrations } from "@/lib/marketing-integrations";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { IntegrationsForm } from "@/components/admin/integrations-form";
import { IntegrationsGuide } from "@/components/admin/integrations-guide";

export default async function AdminIntegrationsPage() {
  const integrations = await getMarketingIntegrations();

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
        SEO &amp; Analytics
      </p>
      <h1 className="mt-2 text-2xl font-bold text-[#002144] sm:text-3xl">Marketing integrations</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
        Connect Google Analytics, Search Console, Tag Manager, Microsoft Clarity, Meta Pixel, Bing
        Webmaster Tools, and Google Ads conversion tracking. Each one only needs its ID pasted below —
        the website injects the right code automatically, and changes go live immediately. The
        step-by-step guide for every service is further down this page.
      </p>

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
