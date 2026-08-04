import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { CityAgentsBoard } from "@/components/admin/city-agents-board";
import { listAdminCityAgents } from "@/lib/city-agents";

export default async function AdminCityAgentsPage() {
  const configured = isSupabaseConfigured();
  const agents = configured ? await listAdminCityAgents() : [];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Contact page</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Associates</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
        The photo tiles below the enquiry form on the Contact page. Each tile opens a card with the
        local associate&rsquo;s name, address, phone and email, and a link visitors can share straight to
        that card. Changes go live immediately.
      </p>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <CityAgentsBoard agents={agents} />
    </div>
  );
}
