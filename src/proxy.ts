import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

const INCOMPLETE_PROFILE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const VERIFIED_SESSION_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

/**
 * Refreshes the customer's Supabase session cookie. Server Components
 * can't write cookies, so without this an expired access token would be
 * re-refreshed on every request until the refresh token gets revoked.
 *
 * Also enforces two session-age limits on top of Supabase's own refresh-token
 * lifetime: a signed-in user whose profile is still "incomplete" is signed
 * out 30 minutes after that sign-in if they haven't finished profile setup,
 * and any signed-in user is signed out 3 days after sign-in regardless of
 * activity. Session start time is derived from the access token's
 * `expires_at - expires_in` (its issued-at time) rather than a separate
 * timestamp, so no extra cookie/column is needed.
 */
async function refreshSupabaseSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.expires_at) {
      const issuedAtMs = (session.expires_at - session.expires_in) * 1000;
      const sessionAgeMs = Date.now() - issuedAtMs;

      if (sessionAgeMs > VERIFIED_SESSION_TTL_MS) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (sessionAgeMs > INCOMPLETE_PROFILE_TTL_MS) {
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (serviceKey) {
          const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
          const { data: profile } = await admin
            .from("user_profiles")
            .select("status")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.status === "incomplete") {
            await supabase.auth.signOut();
            return NextResponse.redirect(new URL("/login", request.url));
          }
        }
      }
    }
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return refreshSupabaseSession(request);
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Customer-auth routes: keep the Supabase session cookie fresh.
    "/login",
    "/auth/:path*",
    "/profile/:path*",
    "/quote",
    "/products",
    "/forgot-password",
    "/reset-password",
  ],
};
