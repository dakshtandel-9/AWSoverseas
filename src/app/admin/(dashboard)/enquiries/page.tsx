import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { EnquiryRow } from "@/components/admin/enquiry-row";
import { AdminPageHeader } from "@/components/admin/page-header";

type Lead = { id: string; email: string; user_id: string | null };

/**
 * Names the customer account each enquiry would attach to if moved to Orders,
 * mirroring moveEnquiryToOrderAction: the account that submitted it, else one
 * with a matching email. Guests match nothing and are absent from the map.
 */
async function getLinkedCustomers(leads: Lead[]): Promise<Record<string, string>> {
  const userIds = [...new Set(leads.map((l) => l.user_id).filter((id): id is string => Boolean(id)))];
  const emails = [...new Set(leads.filter((l) => !l.user_id).map((l) => l.email.trim().toLowerCase()).filter(Boolean))];
  if (userIds.length === 0 && emails.length === 0) return {};

  const db = supabaseAdmin();
  const [byId, byEmail] = await Promise.all([
    userIds.length
      ? db.from("user_profiles").select("id, first_name, last_name").in("id", userIds)
      : { data: [] },
    emails.length
      ? db
          .from("user_profiles")
          .select("id, first_name, last_name, email")
          .in("email", emails)
          .neq("status", "incomplete")
      : { data: [] },
  ]);

  const nameById: Record<string, string> = {};
  for (const p of byId.data ?? []) nameById[p.id] = `${p.first_name} ${p.last_name}`.trim();

  const nameByEmail: Record<string, string> = {};
  for (const p of (byEmail.data as { first_name: string; last_name: string; email: string }[] | null) ?? []) {
    nameByEmail[p.email.toLowerCase()] = `${p.first_name} ${p.last_name}`.trim();
  }

  const result: Record<string, string> = {};
  for (const lead of leads) {
    const name = lead.user_id
      ? nameById[lead.user_id]
      : nameByEmail[lead.email.trim().toLowerCase()];
    if (name) result[lead.id] = name;
  }
  return result;
}

export default async function AdminEnquiriesPage() {
  const configured = isSupabaseConfigured();
  const items = configured
    ? (
        await supabaseAdmin()
          .from("product_enquiries")
          .select("*")
          .eq("request_type", "enquiry")
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  const linkedCustomers = await getLinkedCustomers(items as Lead[]);

  return (
    <div>
      <AdminPageHeader href="/admin/enquiries" />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {items.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            No product enquiries yet.
          </p>
        )}
        {items.map((item) => (
          <EnquiryRow
            key={item.id}
            item={item}
            linkedCustomer={linkedCustomers[item.id] ?? null}
          />
        ))}
      </div>
    </div>
  );
}
