import "server-only";

/**
 * The brand banner carried by every transactional email, hosted on Cloudinary
 * and loaded by URL.
 *
 * It was originally sent as an inline Content-ID attachment, on the theory that
 * bytes travelling with the message beat a remote image Outlook might block.
 * **Gmail wouldn't render it** — the recipient got a broken-image icon while the
 * route strip, a plain remote URL in the very same email, displayed fine. That
 * is the "inline images may be rejected by some clients, especially webmail"
 * caveat in Resend's own docs, and it made the banner worse than useless.
 *
 * A remote URL is the right trade here: Gmail proxies and shows it by default,
 * and the clients that do block remote images degrade to the alt text below
 * rather than a broken icon. It also drops ~100KB off every message.
 *
 * Replacing the artwork is an overwrite upload to `awsoversea/email/banner`
 * plus a version bump in the URL (the version is what busts the CDN cache).
 * 1120px is 2x the 560px email body; `q_auto:good` keeps it near 100KB.
 */
export const EMAIL_BANNER = {
  /** Shown in place of the image while pictures are blocked, so it has to read as a sentence. */
  alt: "AWS OVERSEAS impex — your trusted global trade partner",
  url: "https://res.cloudinary.com/dwethh3fq/image/upload/c_scale,f_jpg,q_auto:good,w_1120/v1786938294/awsoversea/email/banner.jpg",
} as const;
