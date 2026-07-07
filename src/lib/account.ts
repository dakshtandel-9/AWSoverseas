import "server-only";
import type { User } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server-client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type AccountStatus = "incomplete" | "pending" | "approved" | "rejected";

export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  phone: string;
  company_name: string;
  passport_number: string;
  passport_front_url: string;
  passport_back_url: string;
  referral_code: string;
  referred_by: string | null;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
};

export type Account = { user: User; profile: UserProfile };

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

/** Unambiguous alphabet (no 0/O, 1/I/L) so codes survive being read aloud. */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateReferralCode(): string {
  let code = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) code += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `AWS-${code}`;
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
        referral_code: generateReferralCode(),
      })
      .select("*")
      .single();

    if (data) return data as UserProfile;
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
