import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { REF_CODE_COOKIE } from "@/lib/referral-cookie";
import { MAINTENANCE_HEADER } from "@/lib/maintenance";

const REF_CODE_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days — long enough to sign in later and finish setup

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

/**
 * Paths that stay reachable while maintenance mode is on: the admin panel
 * (handled separately below, so the switch can be turned back off), the
 * maintenance page itself, and the small API routes it depends on.
 */
function isMaintenanceExempt(pathname: string): boolean {
  return pathname === "/maintenance" || pathname.startsWith("/api/");
}

/**
 * Routes that need the Supabase session cookie refreshed. This list used to be
 * the proxy's whole matcher; the matcher now covers every route (maintenance
 * mode has to gate all of them), so the refresh is scoped here instead.
 *
 * **Every page that reads the signed-in customer belongs on this list**, and
 * each entry covers everything nested under it. A page left off still renders,
 * but the moment the access token expires it renders as if the visitor were a
 * guest — a Server Component can't write the refreshed cookie itself — so
 * their name, email and phone quietly stop prefilling.
 */
const SESSION_REFRESH_PATHS = [
  "/", // Home — the referral popup only appears for signed-in customers.
  "/login",
  "/auth",
  "/profile",
  "/quote",
  "/products", // The catalog page and every category page under it.
  "/request-product",
  "/forgot-password",
  "/reset-password",
];

function needsSessionRefresh(pathname: string): boolean {
  return SESSION_REFRESH_PATHS.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  );
}

const MAINTENANCE_TTL_MS = 10_000;
let maintenanceFlag = { value: false, checkedAt: 0 };

/**
 * Reads the maintenance switch from `site_settings`. The proxy runs before the
 * React cache exists, so `updateTag("site-settings")` can't reach it — hence a
 * short in-memory TTL instead: flipping the switch in the admin panel takes
 * effect on the public site within {@link MAINTENANCE_TTL_MS}.
 *
 * Any failure keeps the last known value (false on a cold start), so a Supabase
 * blip can never be what takes the site down.
 */
async function isMaintenanceOn(): Promise<boolean> {
  const now = Date.now();
  if (now - maintenanceFlag.checkedAt < MAINTENANCE_TTL_MS) return maintenanceFlag.value;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;

  try {
    // Raw REST rather than supabase-js: one row, one column, no client to boot.
    const res = await fetch(`${url}/rest/v1/site_settings?id=eq.1&select=maintenance_mode`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return maintenanceFlag.value;
    const rows = (await res.json()) as { maintenance_mode?: boolean }[];
    maintenanceFlag = { value: rows?.[0]?.maintenance_mode === true, checkedAt: now };
  } catch {
    // Keep serving whatever the last successful read said.
  }
  return maintenanceFlag.value;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Admin first, and never gated by maintenance mode — this is where the
  // switch lives, so locking it behind the maintenance page would be a trap.
  if (pathname.startsWith("/admin")) {
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

  // Maintenance mode: serve the maintenance page for every public URL. A
  // rewrite rather than a redirect, so the visitor keeps the address they
  // asked for and lands on the real page once the switch goes off.
  if (!isMaintenanceExempt(pathname) && (await isMaintenanceOn())) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";
    maintenanceUrl.search = "";

    // The page redirects home when the switch is off, which would ping-pong
    // against this rewrite while the TTL cache above is still stale. This
    // header tells the page the rewrite sent it, so it renders instead.
    const headers = new Headers(request.headers);
    headers.set(MAINTENANCE_HEADER, "1");

    const response = NextResponse.rewrite(maintenanceUrl, { request: { headers } });
    response.headers.set("Retry-After", "3600");
    return response;
  }

  if (needsSessionRefresh(pathname)) {
    const response = await refreshSupabaseSession(request);

    // A shared referral link (/login?...&ref=CODE) drops the code in a cookie
    // so it survives the redirect chain and pre-fills the referral field at
    // profile setup, without needing the signup form itself to carry it.
    if (pathname === "/login") {
      const ref = searchParams.get("ref")?.trim().toUpperCase().slice(0, 20);
      if (ref) {
        response.cookies.set(REF_CODE_COOKIE, ref, {
          path: "/",
          maxAge: REF_CODE_TTL_SECONDS,
          sameSite: "lax",
          httpOnly: true,
        });
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Every route, so maintenance mode can gate the whole public site. Build
  // output and anything with a file extension (/favicon.ico, /brand/*.png,
  // /robots.txt) are excluded — they cost a proxy hop and gate nothing.
  // Which routes get the admin check, the maintenance gate, or a Supabase
  // session refresh is decided in `proxy()` above.
  matcher: ["/((?!_next/|__nextjs|.*\\.[^/]+$).*)"],
};
