"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server-client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { uploadPassportImage } from "@/lib/cloudinary";
import { getAccount, getAuthUser, isUsernameTaken, suggestAvailableUsername, USERNAME_RE } from "@/lib/account";

export type ProfileFormState = { error?: string };

export type PassportUploadState = { url?: string; error?: string };

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

export async function uploadPassportImageAction(
  _prevState: PassportUploadState,
  formData: FormData,
): Promise<PassportUploadState> {
  const user = await getAuthUser();
  if (!user) return { error: "Your session expired — please sign in again." };

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "Choose an image to upload." };
  if (!file.type.startsWith("image/")) return { error: "That file isn't an image." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image is too large (max 8MB)." };

  try {
    const url = await uploadPassportImage(file);
    return { url };
  } catch (err) {
    console.error("[uploadPassportImageAction] Cloudinary upload failed:", err);
    return { error: "Upload failed. Please try again." };
  }
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
  const passportNumber = String(formData.get("passport-number") ?? "").trim();
  const passportFrontUrl = String(formData.get("passport-front-url") ?? "").trim();
  const passportBackUrl = String(formData.get("passport-back-url") ?? "").trim();
  const referralCode = String(formData.get("referral-code") ?? "").trim().toUpperCase();

  if (!firstName || !lastName) return { error: "Please enter your first and last name." };
  if (!USERNAME_RE.test(username)) {
    return { error: "Usernames are 3–30 characters: lowercase letters, numbers, dots, dashes or underscores." };
  }
  if (!phone) return { error: "Please enter your phone number." };
  if (!passportNumber) return { error: "Please enter your passport number." };
  if (!passportFrontUrl || !passportBackUrl) {
    return { error: "Please upload both sides of your passport." };
  }

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

  // Approved accounts keep their status on edits, unless the passport
  // details actually changed — identity verification must be re-reviewed
  // any time the underlying documents change. New and rejected accounts
  // always (re)enter the admin verification queue.
  const passportChanged =
    passportNumber !== profile.passport_number ||
    passportFrontUrl !== profile.passport_front_url ||
    passportBackUrl !== profile.passport_back_url;
  const status = profile.status === "approved" && !passportChanged ? "approved" : "pending";

  const { error } = await db
    .from("user_profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      username,
      phone,
      company_name: companyName,
      passport_number: passportNumber,
      passport_front_url: passportFrontUrl,
      passport_back_url: passportBackUrl,
      referred_by: referredBy,
      status,
    })
    .eq("id", account.user.id);

  if (error) {
    if (error.code === "23505") return { error: `The username "${username}" is already taken — try another.` };
    return { error: "Something went wrong saving your details. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/admin/users");
  redirect("/profile");
}
