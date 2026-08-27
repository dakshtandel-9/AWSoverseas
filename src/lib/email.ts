import "server-only";

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
  /** One address, or several for a message the admin panel addresses to a group. */
  to: string | string[];
  subject: string;
  /** Rendered HTML body. */
  html: string;
  /** Plain-text alternative — spam filters score messages without one much harder. */
  text: string;
  /** Overrides `EMAIL_FROM` for this message. See `salesFrom()`. */
  from?: string;
  /** Visible to every recipient. */
  cc?: string[];
  /** Hidden from every recipient, including each other. */
  bcc?: string[];
  /** Overrides `EMAIL_REPLY_TO` for this message. */
  replyTo?: string;
};

/** What Resend did with one message. `id` is the handle to find it in the Resend dashboard. */
export type EmailResult = { ok: true; id: string } | { ok: false; error: string };

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
 * Resend puts the failure reason in a JSON `message`; anything else (a gateway
 * error page, an empty body) is reported by status code alone.
 */
function describeFailure(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string; error?: string };
    const message = parsed.message ?? parsed.error;
    if (message) return message;
  } catch {
    // Not JSON — fall through to the status line.
  }
  return `The email provider returned ${status}.`;
}

/**
 * Sends one message and reports what happened, in words a non-developer can
 * act on. Use this where a person is waiting on the result and needs to be
 * told when it fails — the admin compose form. Everything sent as a side
 * effect of other work should use `sendEmail` instead.
 *
 * Never throws, for the same reason `sendEmail` doesn't.
 *
 * "Accepted" is not "delivered" — Resend queues the message and the recipient's
 * server can still bounce it afterwards (a mistyped address, a full mailbox).
 * Those outcomes only show up in the Resend dashboard, never here.
 */
export async function sendEmailDetailed(message: EmailMessage): Promise<EmailResult> {
  if (!isEmailConfigured()) {
    return { ok: false, error: "Email isn't connected yet — RESEND_API_KEY and EMAIL_FROM are missing." };
  }

  const to = Array.isArray(message.to) ? message.to : [message.to];

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from ?? process.env.EMAIL_FROM,
        reply_to: message.replyTo || process.env.EMAIL_REPLY_TO || undefined,
        to,
        cc: message.cc?.length ? message.cc : undefined,
        bcc: message.bcc?.length ? message.bcc : undefined,
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
      // The welcome email is awaited during a page render, so an unresponsive
      // provider would otherwise hold up the redirect into profile setup.
      signal: AbortSignal.timeout(15_000),
    });

    const body = await response.text();

    if (!response.ok) {
      console.error(`[email] resend rejected "${message.subject}" for ${to.join(", ")}: ${response.status} ${body}`);
      return { ok: false, error: describeFailure(response.status, body) };
    }

    // Logged on success too: a send that silently works looks identical in the
    // logs to one that never fired, which makes "no email arrived" impossible
    // to diagnose — the message may simply have landed in the spam folder.
    console.log(`[email] resend sent "${message.subject}" to ${to.join(", ")}`);

    // Parsed defensively: the message is already sent, so an unexpected body
    // shape must not turn a success into a reported failure. Losing the id
    // only costs the link back to the Resend dashboard.
    let id = "";
    try {
      id = (JSON.parse(body) as { id?: string }).id ?? "";
    } catch {
      // Left blank.
    }

    return { ok: true, id };
  } catch (error) {
    console.error(`[email] resend could not send "${message.subject}" to ${to.join(", ")}`, error);
    return {
      ok: false,
      error:
        error instanceof DOMException && error.name === "TimeoutError"
          ? "The email provider didn't respond in time. Check the Resend dashboard before sending again — it may have gone out anyway."
          : "Couldn't reach the email provider. Check the connection and try again.",
    };
  }
}

/**
 * Sends one message and reports whether Resend accepted it.
 *
 * Never throws: email is always a side effect of something more important (an
 * account was created, a profile was submitted for review), so a dead mail
 * provider must not fail that work. That's also why the reason is only logged
 * — nobody is on the other end of this call to read it.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  return (await sendEmailDetailed(message)).ok;
}
