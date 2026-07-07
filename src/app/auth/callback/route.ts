import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase/server-client";
import { getAccount } from "@/lib/account";
import { isSupabaseConfigured } from "@/lib/supabase/status";

/** Only allow same-site relative redirect targets. */
function safeNext(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "";
}

/**
 * Landing point after an email confirmation link (token_hash + type from
 * Supabase's signup email) or an OAuth code exchange. Verifies the link,
 * makes sure the profile row exists (first signup), then routes by
 * profile state: new users go to profile setup, everyone else back to
 * where they started.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"));

  if (isSupabaseConfigured()) {
    const supabase = await supabaseServer();

    const { error } = tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : code
        ? await supabase.auth.exchangeCodeForSession(code)
        : { error: new Error("missing verification params") };

    if (!error) {
      const account = await getAccount();
      if (account && account.profile.status === "incomplete") {
        return NextResponse.redirect(`${origin}/profile/setup`);
      }
      return NextResponse.redirect(`${origin}${next || "/profile"}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
