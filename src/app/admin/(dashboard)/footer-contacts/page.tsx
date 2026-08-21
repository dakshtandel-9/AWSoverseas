import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { FooterContactsBoard } from "@/components/admin/footer-contacts-board";
import { listAdminFooterContacts } from "@/lib/footer-contacts";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminFooterContactsPage() {
  const configured = isSupabaseConfigured();
  const contacts = configured ? await listAdminFooterContacts() : [];

  return (
    <div>
      <AdminPageHeader href="/admin/footer-contacts" />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <FooterContactsBoard contacts={contacts} />
    </div>
  );
}
