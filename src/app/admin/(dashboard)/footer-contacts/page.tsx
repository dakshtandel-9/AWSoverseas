import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { FooterContactsBoard } from "@/components/admin/footer-contacts-board";
import { listAdminFooterContacts } from "@/lib/footer-contacts";

export default async function AdminFooterContactsPage() {
  const configured = isSupabaseConfigured();
  const contacts = configured ? await listAdminFooterContacts() : [];

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Footer</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Footer contact columns</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6b82]">
        Shown below the nav links and above the copyright line on every page. Add as many columns as
        you need — the footer wraps them into rows, four per row on desktop. Changes go live
        immediately.
      </p>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <FooterContactsBoard contacts={contacts} />
    </div>
  );
}
