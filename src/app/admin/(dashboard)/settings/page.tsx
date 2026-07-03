import { getSiteSettings } from "@/lib/site-settings";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Site Settings</p>
      <h1 className="mt-2 text-2xl font-bold text-[#06234d] sm:text-3xl">Contact details</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
        These numbers, this email and this address appear across the live site — in the footer, the Contact page,
        and every WhatsApp link. Changes here go live immediately.
      </p>

      {!isSupabaseConfigured() && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <SettingsForm settings={settings} />
    </div>
  );
}
