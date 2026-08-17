import "server-only";
import { EMAIL_BANNER, emailBannerBase64 } from "@/lib/email-assets";

/**
 * Outbound transactional email, sent through Resend's HTTPS API.
 *
 * Resend is the only transport. There was an SMTP path signing in to the real
 * admin@awsoverseas.com mailbox at smtp.hostinger.com; it was removed on
 * 2026-08-17 because Hostinger cannot deliver this mail and never could:
 *
 *  - Hostinger relays outbound mail through MailChannels, which rejects every
 *    external recipient with `550 5.7.1 [PSFD] Blocked`.
 *  - The failure is invisible from here. Hostinger accepts the message with a
 *    `250 Ok: queued`, so the send is logged as a success, then bounces
 *    asynchronously. Mail to an @awsoverseas.com address delivers regardless,
 *    because same-domain mail is handled locally and never reaches the relay —
 *    so an SMTP test only means something if the recipient is external.
 *  - It also can't send as sales@ while authenticated as admin@:
 *    `553 5.7.1 Sender address rejected: not owned by user`.
 *
 * Keeping the branch was actively harmful: merely filling in SMTP_PASSWORD
 * silently switched every email onto the broken path.
 *
 * Hostinger still keeps the MX records and the mailboxes, so replies to
 * admin@ and sales@ land there as before. Only sending moved.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** True once Resend and a sender address are both configured. */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export type EmailMessage = {
  to: string;
  subject: string;
  /** Rendered HTML body. */
  html: string;
  /** Plain-text alternative — spam filters score messages without one much harder. */
  text: string;
  /** Overrides `EMAIL_FROM` for this message. See `salesFrom()`. */
  from?: string;
};

/**
 * Sender for the sales desk (enquiry replies), so those land in the sales
 * inbox rather than admin@. Falls back to the default sender when unset, which
 * keeps enquiries working rather than silently dropping them.
 *
 * Any address on the Resend-verified domain sends fine, but a customer hitting
 * Reply needs a real mailbox behind it — sales@ must exist in Hostinger.
 */
export function salesFrom(): string | undefined {
  return process.env.EMAIL_FROM_SALES || undefined;
}

/**
 * Where internal "someone just submitted something" alerts go. Falls back to
 * `EMAIL_FROM` (admin@awsoverseas.com), which is a real Hostinger mailbox — so
 * notifications land somewhere readable even if `EMAIL_ADMIN_NOTIFY` is never
 * set. Set it to route alerts to a different address or a shared inbox.
 */
export function adminNotifyTo(): string | undefined {
  return process.env.EMAIL_ADMIN_NOTIFY || process.env.EMAIL_FROM || undefined;
}

/**
 * Sends one message and reports whether Resend accepted it.
 *
 * Never throws: email is always a side effect of something more important (an
 * account was created, a profile was submitted for review), so a dead mail
 * provider must not fail that work.
 *
 * "Accepted" is not "delivered" — Resend queues the message and the recipient's
 * server can still bounce it afterwards (a mistyped address, a full mailbox).
 * Those outcomes only show up in the Resend dashboard, never here.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  try {
    // Null when the artwork couldn't be fetched — the message still goes out,
    // showing the image's alt text where the banner would have been.
    const banner = await emailBannerBase64();

    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from ?? process.env.EMAIL_FROM,
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        // `content_id` is what embeds the banner in the body, matching the
        // `src="cid:…"` in the HTML, rather than listing it as a download.
        attachments: banner
          ? [
              {
                content: banner,
                filename: EMAIL_BANNER.filename,
                content_type: EMAIL_BANNER.contentType,
                content_id: EMAIL_BANNER.cid,
              },
            ]
          : undefined,
      }),
      // The welcome email is awaited during a page render, so an unresponsive
      // provider would otherwise hold up the redirect into profile setup.
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
    }

    // Logged on success too: a send that silently works looks identical in the
    // logs to one that never fired, which makes "no email arrived" impossible
    // to diagnose — the message may simply have landed in the spam folder.
    console.log(`[email] resend sent "${message.subject}" to ${message.to}`);
    return true;
  } catch (error) {
    console.error(`[email] resend could not send "${message.subject}" to ${message.to}`, error);
    return false;
  }
}
