/**
 * Name of the cookie that carries a referral code from a shared link
 * (?ref=CODE on /login) through to profile setup, where it pre-fills the
 * "referral code" field. Kept dependency-free so it's safe to import from
 * both the edge proxy (src/proxy.ts) and server components/actions.
 */
export const REF_CODE_COOKIE = "aws_ref_code";
