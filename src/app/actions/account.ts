"use server";

import { cookies } from "next/headers";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { registrationReceivedEmail } from "@/lib/email-templates";
import { supabaseServer } from "@/lib/supabase/server-client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { REF_CODE_COOKIE } from "@/lib/referral-cookie";
import {
  getAccount,
  getAuthUser,
  isUsernameTaken,
  suggestAvailableUsername,
  USERNAME_RE,
  type AccountStatus,
  type IdType,
} from "@/lib/account";

export type ProfileFormState = { error?: string };

/**
 * Tells a customer their details reached the verification queue, after the
 * response has gone out — a slow mail server must never hold up the redirect
 * to /profile, and a failed send must never lose a submitted profile.
 */
function queueRegistrationEmail(email: string, firstName: string, lastName: string): void {
  if (!email || !isEmailConfigured()) return;

  try {
    after(async () => {
      await sendEmail({ to: email, ...registrationReceivedEmail({ firstName, lastName }) });
    });
  } catch {
    // `after` needs a request scope. If this ever runs outside one, skipping
    // the confirmation beats failing the submission.
  }
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
  }
  redirect("/");
}

/** Live availability check for the username field (signed-in users only). */
export async function checkUsernameAction(username: string): Promise<{ available: boolean }> {
  const user = await getAuthUser();
  if (!user) return { available: false };

  const candidate = username.trim().toLowerCase();
  if (!USERNAME_RE.test(candidate)) return { available: false };
  return { available: !(await isUsernameTaken(candidate, user.id)) };
}

/** Returns the first free username derived from the given names. */
export async function suggestUsernameAction(
  firstName: string,
  lastName: string,
): Promise<{ username: string }> {
  const user = await getAuthUser();
  if (!user) return { username: "" };
  return { username: await suggestAvailableUsername(firstName, lastName, user.id) };
}

export async function completeProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const account = await getAccount();
  if (!account) return { error: "Your session expired — please sign in again." };

  const firstName = String(formData.get("first-name") ?? "").trim();
  const lastName = String(formData.get("last-name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const companyName = String(formData.get("company-name") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  // Every country picks between two document types — India between Aadhaar
  // and passport, everyone else between passport and national ID — so the
  // country decides which pair is valid and the customer picks within it.
  const isIndia = country === "India";
  const postedIdType = formData.get("id-type");
  const idType: IdType = isIndia
    ? postedIdType === "aadhaar"
      ? "aadhaar"
      : "passport"
    : postedIdType === "national_id"
      ? "national_id"
      : "passport";
  const idNumber = String(formData.get("id-number") ?? "").trim();
  const referralCode = String(formData.get("referral-code") ?? "").trim().toUpperCase();

  const idLabel = { passport: "passport", aadhaar: "Aadhaar", national_id: "national ID" }[idType];

  if (!firstName || !lastName) return { error: "Please enter your first and last name." };
  if (!USERNAME_RE.test(username)) {
    return { error: "Usernames are 3–30 characters: lowercase letters, numbers, dots, dashes or underscores." };
  }
  if (!phone) return { error: "Please enter your phone number." };
  if (!country) return { error: "Please select your country." };
  if (!idNumber) return { error: `Please enter your ${idLabel} number.` };

  if (await isUsernameTaken(username, account.user.id)) {
    return { error: `The username "${username}" is already taken — try another.` };
  }

  const db = supabaseAdmin();
  const { profile } = account;

  // A referral code can only be attached on the first submission — changing
  // your referrer later would let referral credit be reassigned.
  let referredBy = profile.referred_by;
  if (profile.status === "incomplete" && !referredBy && referralCode) {
    if (referralCode === profile.referral_code) {
      return { error: "You can't use your own referral code." };
    }
    const { data: referrer } = await db
      .from("user_profiles")
      .select("id")
      .eq("referral_code", referralCode)
      .maybeSingle();
    if (!referrer) return { error: "That referral code doesn't match any account — check it and try again." };
    referredBy = referrer.id;
  }

  // Approved accounts keep their status on edits, unless the ID details
  // actually changed — identity verification must be re-reviewed any time
  // the ID number (or which document type) changes. New and rejected
  // accounts always (re)enter the admin verification queue.
  const idChanged = idType !== profile.id_type || idNumber !== profile.id_number;
  const status: AccountStatus = profile.status === "approved" && !idChanged ? "approved" : "pending";

  const { error } = await db
    .from("user_profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      username,
      phone,
      company_name: companyName,
      country,
      id_type: idType,
      id_number: idNumber,
      referred_by: referredBy,
      status,
    })
    .eq("id", account.user.id);

  if (error) {
    if (error.code === "23505") return { error: `The username "${username}" is already taken — try another.` };
    return { error: "Something went wrong saving your details. Please try again." };
  }

  // Confirm the submission by email, but only on the way *into* the review
  // queue — resubmitting while already pending shouldn't send a second copy.
  if (status === "pending" && profile.status !== "pending") {
    queueRegistrationEmail(profile.email, firstName, lastName);
  }

  // Clear the invite-link cookie now that its code has done its job (or the
  // user chose not to use it) — it shouldn't linger and pre-fill a future,
  // unrelated account on the same browser.
  (await cookies()).delete(REF_CODE_COOKIE);

  revalidatePath("/profile");
  revalidatePath("/admin/users");
  redirect("/profile");
}
