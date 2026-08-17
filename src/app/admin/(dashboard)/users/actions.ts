"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { accountApprovedEmail } from "@/lib/email-templates";

function revalidateUsers() {
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function approveUserAction(id: string) {
  const db = supabaseAdmin();
  // `.select()` returns the approved row so the confirmation email has a name
  // and address without a second round trip. The `neq` guard makes the update
  // a no-op for an already-approved account, so a double-click on Approve
  // returns no row and sends no second email.
  const { data } = await db
    .from("user_profiles")
    .update({ status: "approved" })
    .eq("id", id)
    .neq("status", "approved")
    .select("email, first_name, last_name")
    .maybeSingle();

  if (data?.email && isEmailConfigured()) {
    const { email, first_name: firstName, last_name: lastName } = data;
    try {
      after(async () => {
        await sendEmail({ to: email, ...accountApprovedEmail({ firstName, lastName }) });
      });
    } catch {
      // `after` needs a request scope. Skipping the notice beats failing the
      // approval — the account is already approved either way.
    }
  }

  revalidateUsers();
}

export async function rejectUserAction(id: string) {
  const db = supabaseAdmin();
  await db.from("user_profiles").update({ status: "rejected" }).eq("id", id);
  revalidateUsers();
}

/** Removes the auth user entirely; the profile row cascades via its FK. */
export async function deleteUserAction(id: string) {
  const db = supabaseAdmin();
  await db.auth.admin.deleteUser(id);
  revalidateUsers();
}
