import "server-only";
import { absoluteUrl } from "@/lib/site-url";

/**
 * The brand banner carried by every transactional email, served from this
 * app's own /public rather than a third party.
 *
 * It was originally sent as an inline Content-ID attachment (bytes travelling
 * with the message), then moved to a Cloudinary-hosted URL when Gmail
 * wouldn't render the CID attachment — the "inline images may be rejected by
 * some clients, especially webmail" caveat in Resend's own docs. Then
 * Cloudinary itself went down (see [[awsoversea-cloudinary-disabled]]) and
 * blanked it a second time, including mid-outage after the account had
 * already been restored — delivery URLs kept 401ing regardless. A file this
 * app serves itself has no third party left to fail.
 *
 * public/email/banner-v2.jpg — replacing the artwork means adding the next
 * -vN file rather than overwriting this one: Gmail's image proxy caches by
 * URL, so an overwrite leaves the old artwork in inboxes (same reason the
 * hero video is versioned). Pre-sized to 1120px (2x the 560px email body)
 * and compressed to ~130KB; there's no on-the-fly transform to redo. The
 * artwork is 16:9, so it renders 315px tall at the 560px body width.
 */
export const EMAIL_BANNER = {
  /** Shown in place of the image while pictures are blocked, so it has to read as a sentence. */
  alt: "AWS OVERSEAS impex — import, export and shipping: supplier verification, customs clearance, warehousing and door-to-door delivery worldwide.",
  url: absoluteUrl("/email/banner-v2.jpg"),
} as const;
