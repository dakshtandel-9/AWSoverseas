/**
 * The site's permanent public address. Every absolute URL the site emits —
 * canonicals, og:url, JSON-LD, sitemap, robots — is built from here, so the
 * domain is written down exactly once.
 *
 * This module deliberately imports nothing: `site.ts` reads content and
 * `content.ts` needs these URLs, so a shared leaf module keeps the two from
 * forming an import cycle.
 */

/** Canonical origin, no trailing slash. */
export const SITE_URL = "https://awsoverseas.com";

/** Absolute URL for a site-relative path. `absoluteUrl("/about")` → `https://awsoverseas.com/about` */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Fallback preview image for pages that don't set their own. */
export const OG_IMAGE = "/brand/hero.png";
