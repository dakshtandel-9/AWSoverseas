/**
 * Set by `proxy.ts` on the request it rewrites to /maintenance, so that page can
 * tell a rewrite apart from someone typing the URL in while the site is live.
 *
 * Its own module rather than an export from `proxy.ts`: a page importing the
 * proxy would drag the whole Supabase session-refresh path into its bundle.
 */
export const MAINTENANCE_HEADER = "x-aws-maintenance";
