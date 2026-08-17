import "server-only";

/**
 * The brand banner carried by every transactional email.
 *
 * It rides along as an inline attachment (Content-ID) rather than a remote
 * `<img src="https://…">`: Outlook and most desktop clients block remote images
 * until the reader clicks "download pictures", and a banner nobody sees isn't
 * worth sending. Referenced from the HTML as `<img src="cid:…">`.
 *
 * The artwork lives on Cloudinary at a stable public_id and is requested
 * through a scaling transform, so replacing it is an overwrite upload to
 * `awsoversea/email/banner` plus a version bump in the URL below (the version
 * is what busts the CDN cache). 1120px wide is 2x the 560px email body, and
 * `q_auto:good` keeps it near 100KB — small enough to attach to every message.
 */
export const EMAIL_BANNER = {
  /** Arbitrary, stable, and referenced by `shell()` — changing it breaks the img. */
  cid: "aws-overseas-banner",
  filename: "aws-overseas.jpg",
  contentType: "image/jpeg",
  /** Shown in place of the image while pictures are blocked, so it has to read as a sentence. */
  alt: "AWS OVERSEAS impex — your trusted global trade partner",
  url: "https://res.cloudinary.com/dwethh3fq/image/upload/c_scale,f_jpg,q_auto:good,w_1120/v1786938294/awsoversea/email/banner.jpg",
} as const;

/** Held for the life of the server instance — the artwork only changes on deploy. */
let cachedBase64: string | null = null;

/**
 * The banner's bytes as base64, or null if they couldn't be fetched.
 *
 * Deliberately fetched here instead of handing the provider a URL to pull:
 * a provider that can't retrieve the image rejects the whole send, and a
 * missing banner must never cost someone their registration confirmation.
 * A failure isn't cached, so the next send retries.
 */
export async function emailBannerBase64(): Promise<string | null> {
  if (cachedBase64) return cachedBase64;

  try {
    const response = await fetch(EMAIL_BANNER.url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`responded ${response.status}`);
    cachedBase64 = Buffer.from(await response.arrayBuffer()).toString("base64");
    return cachedBase64;
  } catch (error) {
    console.error("[email] couldn't load the banner image — sending without it", error);
    return null;
  }
}
