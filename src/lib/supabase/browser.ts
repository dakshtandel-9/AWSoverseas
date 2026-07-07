import { createBrowserClient } from "@supabase/ssr";

/**
 * Cookie-session Supabase client (anon key) for Client Components — used
 * for email/password sign-in and sign-up, and to show the signed-in state in
 * the navbar. Returns null when Supabase env vars aren't set so public
 * pages keep rendering in an unconfigured checkout of the site.
 */
export function supabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createBrowserClient(url, key);
}
