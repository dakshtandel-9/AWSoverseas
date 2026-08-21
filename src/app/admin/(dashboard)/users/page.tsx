import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { UserRow, type AdminUser } from "@/components/admin/user-row";
import { AdminPageHeader } from "@/components/admin/page-header";

// The review queue must always show fresh signups — new users appear here
// without any admin action having run revalidatePath first.
async function getUsers(): Promise<AdminUser[]> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("user_profiles")
    .select("*, referrer:referred_by(first_name, last_name, username)")
    .order("created_at", { ascending: false });
  return (data as AdminUser[] | null) ?? [];
}

export default async function AdminUsersPage() {
  const configured = isSupabaseConfigured();
  const users = configured ? await getUsers() : [];

  const pending = users.filter((u) => u.status === "pending");
  const others = users.filter((u) => u.status !== "pending");

  return (
    <div>
      <AdminPageHeader href="/admin/users" />

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      {pending.length > 0 && (
        <>
          <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-amber-700">
            Awaiting review ({pending.length})
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {pending.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-[#5b6b82]">
        All users ({others.length})
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {others.length === 0 && configured && (
          <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
            {pending.length > 0 ? "Everyone else is in the review queue above." : "No user sign-ups yet."}
          </p>
        )}
        {others.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
