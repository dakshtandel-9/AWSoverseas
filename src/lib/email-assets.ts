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
 * public/email/banner.jpg — replacing the artwork is an overwrite of that
 * file. Pre-sized to 1120px (2x the 560px email body) and already compressed
 * to ~115KB; there's no on-the-fly transform to redo.
 */
export const EMAIL_BANNER = {
  /** Shown in place of the image while pictures are blocked, so it has to read as a sentence. */
  alt: "AWS OVERSEAS impex — your trusted global trade partner",
  url: absoluteUrl("/email/banner.jpg"),
} as const;
