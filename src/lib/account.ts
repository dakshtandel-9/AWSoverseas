import "server-only";
import type { User } from "@supabase/supabase-js";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";
import { supabaseServer } from "@/lib/supabase/server-client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { grantSignupBonus } from "@/lib/wallet";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";

/**
 * "incomplete" — signed in, profile never submitted (bounced to setup).
 * "unverified" — details saved, ID upload skipped; the customer finishes it
 *   from their profile whenever they're ready.
 * "pending" — documents submitted, waiting on the admin review queue.
 */
export type AccountStatus = "incomplete" | "unverified" | "pending" | "approved" | "rejected";

/** Government ID used for verification — Indian customers choose Aadhaar or passport; everyone else chooses passport or national ID. */
export type IdType = "passport" | "aadhaar" | "national_id";

export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  phone: string;
  company_name: string;
  country: string;
  id_type: IdType;
  id_number: string;
  referral_code: string;
  referred_by: string | null;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export type Account = { user: User; profile: UserProfile };

/** Derives the product-enquiry gate state shown to the Enquiry modal from an account (or guest). */
export function enquiryAuthFor(account: Account | null): EnquiryAuth {
  if (!account) return { state: "guest" };
  // "unverified" falls through to the generic gate below — the form stays
  // reachable, and the notice points at /profile/setup to upload the ID.
  if (account.profile.status === "incomplete") return { state: "setup" };
  if (account.profile.status !== "approved") return { state: account.profile.status };
  return {
    state: "approved",
    firstName: account.profile.first_name,
    lastName: account.profile.last_name,
    email: account.profile.email,
    phone: account.profile.phone,
  };
}

/** The signed-in auth user from the session cookie, or null. */
export async function getAuthUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Signed-in user + their profile row. Creates the profile (with a fresh
 * referral code) on first call after signup, so callers can rely on it
 * existing. Returns null for guests or an unconfigured environment.
 */
export async function getAccount(): Promise<Account | null> {
  const user = await getAuthUser();
  if (!user) return null;

  const db = supabaseAdmin();
  const { data } = await db.from("user_profiles").select("*").eq("id", user.id).maybeSingle();
  if (data) return { user, profile: data as UserProfile };

  const profile = await createProfileForUser(user);
  return profile ? { user, profile } : null;
}

/** Unambiguous alphabets (no 0/O, 1/I/L) so codes survive being read aloud. */
const CODE_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_DIGITS = "23456789";

/** ASCII letters from name/email, uppercased, ambiguous chars (O/I/L) folded to nearby unambiguous ones. */
function nameLetters(...sources: string[]): string {
  const fold: Record<string, string> = { O: "Q", I: "J", L: "K" };
  return sources
    .join("")
    .toUpperCase()
    .normalize("NFKD")
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((c) => fold[c] ?? c)
    .join("");
}

/**
 * 6-char code: 4 letters + 2 digits, e.g. "DKSH47". The letters are drawn
 * from the user's name (falling back to their email) so the code reads as
 * personal; the 2 random digits provide enough entropy that collisions are
 * rare, and `createProfileForUser` re-rolls on the (still possible)
 * collision so every stored code stays unique.
 */
function generateReferralCode(firstName: string, lastName: string, email: string): string {
  const base = nameLetters(firstName, lastName) || nameLetters(email.split("@")[0] ?? "");
  let letters = base.slice(0, 4);
  if (letters.length < 4) {
    const bytes = crypto.getRandomValues(new Uint8Array(4 - letters.length));
    for (const b of bytes) letters += CODE_LETTERS[b % CODE_LETTERS.length];
  }

  let digits = "";
  const digitBytes = crypto.getRandomValues(new Uint8Array(2));
  for (const b of digitBytes) digits += CODE_DIGITS[b % CODE_DIGITS.length];

  return `${letters}${digits}`;
}

/**
 * Confirms the new account by email.
 *
 * Hung off the profile insert rather than the sign-up form because that insert
 * is the one thing that happens exactly once per account, server-side, on the
 * first request after sign-up — the browser's `signUp()` call can't be trusted
 * to fire an email, and retrying it would double-send.
 *
 * Awaited rather than deferred with `after()`, unlike every other email in this
 * app. That insert happens during the `/profile` render that immediately
 * redirects a brand-new user to `/profile/setup`, and an `after()` callback
 * registered by a render ending in `redirect()` never runs — measured, not
 * assumed: the callback was registered and simply never fired, so the welcome
 * email silently never sent. The cost is one bounded send on the first page
 * load of a new account, and `sendEmail` never throws.
 */
async function sendWelcomeEmail(email: string): Promise<void> {
  if (!email || !isEmailConfigured()) return;
  await sendEmail({ to: email, ...welcomeEmail() });
}

/** Insert the initial profile row, retrying on referral-code collisions. */
async function createProfileForUser(user: User): Promise<UserProfile | null> {
  const db = supabaseAdmin();
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const fullName = typeof meta.full_name === "string" ? meta.full_name.trim() : "";
  const [firstName = "", ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ");

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await db
      .from("user_profiles")
      .insert({
        id: user.id,
        email: user.email ?? "",
        first_name: firstName,
        last_name: lastName,
        referral_code: generateReferralCode(firstName, lastName, user.email ?? ""),
      })
      .select("*")
      .single();

    if (data) {
      await grantSignupBonus(user.id);
      await sendWelcomeEmail(user.email ?? "");
      return data as UserProfile;
    }
    // 23505 = unique violation. A duplicate id means a concurrent request
    // already created the row; a duplicate referral_code just needs a re-roll.
    if (error?.code === "23505" && error.message.includes("referral_code")) continue;
    if (error?.code === "23505") {
      const { data: existing } = await db.from("user_profiles").select("*").eq("id", user.id).maybeSingle();
      return (existing as UserProfile) ?? null;
    }
    return null;
  }
  return null;
}

export const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,29}$/;

/** "Daksh" + "Tandel" -> "daksh.tandel" (lowercase, ascii, dot-joined). */
export function usernameFromNames(firstName: string, lastName: string): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]/g, "");
  const first = clean(firstName);
  const last = clean(lastName);
  return [first, last].filter(Boolean).join(".");
}

export async function isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean> {
  const db = supabaseAdmin();
  let query = db.from("user_profiles").select("id").eq("username", username);
  if (excludeUserId) query = query.neq("id", excludeUserId);
  const { data } = await query.limit(1);
  return Boolean(data && data.length > 0);
}

/**
 * First available username derived from the names — tries the plain slug,
 * then numbered variants (daksh.tandel, daksh.tandel2, …).
 */
export async function suggestAvailableUsername(
  firstName: string,
  lastName: string,
  excludeUserId?: string,
): Promise<string> {
  const base = usernameFromNames(firstName, lastName) || "user";
  const padded = base.length < 3 ? base.padEnd(3, "0") : base;
  for (let i = 0; i < 30; i++) {
    const candidate = i === 0 ? padded : `${padded}${i + 1}`;
    if (!(await isUsernameTaken(candidate, excludeUserId))) return candidate;
  }
  return `${padded}${Date.now() % 10000}`;
}
