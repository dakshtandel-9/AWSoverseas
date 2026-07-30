"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server-client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { uploadIdDocumentImage } from "@/lib/cloudinary";
import { getAccount, getAuthUser, isUsernameTaken, suggestAvailableUsername, USERNAME_RE, type IdType } from "@/lib/account";

export type ProfileFormState = { error?: string };

export type IdDocumentUploadState = { url?: string; error?: string };

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

export async function uploadIdDocumentImageAction(
  _prevState: IdDocumentUploadState,
  formData: FormData,
): Promise<IdDocumentUploadState> {
  const user = await getAuthUser();
  if (!user) return { error: "Your session expired — please sign in again." };

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "Choose an image to upload." };
  if (!file.type.startsWith("image/")) return { error: "That file isn't an image." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image is too large (max 8MB)." };

  try {
    const url = await uploadIdDocumentImage(file);
    return { url };
  } catch (err) {
    console.error("[uploadIdDocumentImageAction] Cloudinary upload failed:", err);
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
  const country = String(formData.get("country") ?? "").trim();
  // India verifies with Aadhaar or PAN instead of a passport — the country
  // decides which document set applies, and (for India) the customer picks
  // which of the two they're submitting.
  const isIndia = country === "India";
  const idType: IdType = isIndia ? (formData.get("id-type") === "pan" ? "pan" : "aadhaar") : "passport";
  const idNumber = String(formData.get("id-number") ?? "").trim();
  const idFrontUrl = String(formData.get("id-front-url") ?? "").trim();
  const idBackUrl = String(formData.get("id-back-url") ?? "").trim();
  const referralCode = String(formData.get("referral-code") ?? "").trim().toUpperCase();

  const idLabel = { passport: "passport", aadhaar: "Aadhaar", pan: "PAN card" }[idType];

  if (!firstName || !lastName) return { error: "Please enter your first and last name." };
  if (!USERNAME_RE.test(username)) {
    return { error: "Usernames are 3–30 characters: lowercase letters, numbers, dots, dashes or underscores." };
  }
  if (!phone) return { error: "Please enter your phone number." };
  if (!country) return { error: "Please select your country." };
  if (!idNumber) return { error: `Please enter your ${idLabel} number.` };
  if (!idFrontUrl || !idBackUrl) {
    return { error: `Please upload both sides of your ${idLabel}.` };
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

  // Approved accounts keep their status on edits, unless the ID details
  // actually changed — identity verification must be re-reviewed any time
  // the underlying documents (or which document type) change. New and
  // rejected accounts always (re)enter the admin verification queue.
  const idChanged =
    idType !== profile.id_type ||
    idNumber !== profile.id_number ||
    idFrontUrl !== profile.id_front_url ||
    idBackUrl !== profile.id_back_url;
  const status = profile.status === "approved" && !idChanged ? "approved" : "pending";

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
      id_front_url: idFrontUrl,
      id_back_url: idBackUrl,
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
