import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { EMAIL_BANNER, emailBannerBase64 } from "@/lib/email-assets";

/**
 * Outbound transactional email.
 *
 * Two interchangeable transports, picked by whichever is configured:
 *
 *  1. **SMTP** (`SMTP_PASSWORD` set) — signs in to the real admin@awsoverseas.com
 *     mailbox at smtp.hostinger.com, so mail is sent by the same account that
 *     receives the replies.
 *  2. **Resend** (`RESEND_API_KEY` set) — an HTTPS API, no SMTP port involved.
 *
 * **Resend is the working transport; SMTP is not.** Hostinger relays outbound
 * mail through MailChannels, which rejects every external recipient with
 * `550 5.7.1 [PSFD] Blocked`. That failure is easy to miss: Hostinger accepts
 * the message with a `250 Ok: queued`, bounces asynchronously, and delivery to
 * an @awsoverseas.com address succeeds regardless because same-domain mail is
 * delivered locally and never reaches the relay. Any SMTP test must therefore
 * go to an *external* address to mean anything.
 *
 * The SMTP path is kept because it costs nothing and the block is Hostinger's
 * policy, not a permanent fact — if support ever lifts it, filling in
 * SMTP_PASSWORD switches back with no code change.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type Transport = "smtp" | "resend" | "none";

/** Which transport this environment is set up for. */
function activeTransport(): Transport {
  if (process.env.SMTP_PASSWORD && process.env.SMTP_USER && process.env.SMTP_HOST) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return "none";
}

/** True once a transport and a sender address are both configured. */
export function isEmailConfigured(): boolean {
  return activeTransport() !== "none" && Boolean(process.env.EMAIL_FROM);
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

/** Reused across sends so every email doesn't pay for a fresh TLS handshake. */
let cachedTransporter: Transporter | null = null;

function smtpTransporter(): Transporter {
  if (!cachedTransporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // Hostinger's 465 is implicit TLS; 587 upgrades with STARTTLS instead.
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
  }
  return cachedTransporter;
}

async function sendViaSmtp(message: EmailMessage, banner: string | null): Promise<void> {
  await smtpTransporter().sendMail({
    from: message.from ?? process.env.EMAIL_FROM,
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    // `cid` is what makes nodemailer mark the part inline and resolve the
    // matching `src="cid:…"` in the HTML.
    attachments: banner
      ? [
          {
            filename: EMAIL_BANNER.filename,
            content: Buffer.from(banner, "base64"),
            contentType: EMAIL_BANNER.contentType,
            cid: EMAIL_BANNER.cid,
          },
        ]
      : undefined,
  });
}

async function sendViaResend(message: EmailMessage, banner: string | null): Promise<void> {
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
      // Resend's equivalent of nodemailer's `cid`. Note it embeds the image in
      // the body rather than listing it as a downloadable file.
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
}

/**
 * Sends one message and reports whether it left. Never throws: email is
 * always a side effect of something more important (an account was created,
 * a profile was submitted for review), so a dead mail provider must not fail
 * that work.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const transport = activeTransport();
  if (transport === "none" || !process.env.EMAIL_FROM) return false;

  try {
    // Null when the artwork couldn't be fetched — the message still goes out,
    // showing the image's alt text where the banner would have been.
    const banner = await emailBannerBase64();
    if (transport === "smtp") await sendViaSmtp(message, banner);
    else await sendViaResend(message, banner);
    // Logged on success too: a send that silently works looks identical in the
    // logs to one that never fired, which makes "no email arrived" impossible
    // to diagnose — the message may simply have landed in the spam folder.
    console.log(`[email] ${transport} sent "${message.subject}" to ${message.to}`);
    return true;
  } catch (error) {
    console.error(`[email] ${transport} could not send "${message.subject}" to ${message.to}`, error);
    return false;
  }
}
