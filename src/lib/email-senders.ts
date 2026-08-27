import "server-only";

/**
 * The From addresses the admin panel is allowed to send as.
 *
 * awsoverseas.com is verified as a whole domain in Resend, so *any* address on
 * it would be accepted by the API. That's exactly why this list exists: the
 * compose form must never send from an address typed into the browser, or the
 * panel becomes a spoofing tool for anyone who gets past the admin password.
 * The form posts an address, `resolveSender` looks it up here, and anything
 * that isn't on the list is refused before the send.
 *
 * Two rules for adding one:
 *  - The address must be on awsoverseas.com (the verified domain). Anything
 *    else is rejected by Resend at send time.
 *  - A real Hostinger mailbox has to exist behind it, because the recipient's
 *    Reply goes there. Hostinger still holds the MX records — only sending
 *    moved to Resend (see src/lib/email.ts).
 */

export type EmailSender = {
  /** Exactly what goes in the From header: `AWS OVERSEAS impex <sales@awsoverseas.com>`. */
  value: string;
  /** The bare address. The form's option value, and what the picker shows. */
  address: string;
  /** Display name in front of the address; empty when the env var is a bare address. */
  name: string;
};

/** `Display Name <address@host>`, the only other shape an env var can take. */
const ANGLE_ADDRESSED = /^\s*(.*?)\s*<\s*([^<>\s]+@[^<>\s]+)\s*>\s*$/;

function parseSender(raw: string): EmailSender | null {
  const value = raw.trim();
  if (!value) return null;

  const angled = ANGLE_ADDRESSED.exec(value);
  if (angled) {
    return { value, address: angled[2].toLowerCase(), name: angled[1].replace(/^"|"$/g, "").trim() };
  }

  // A bare address is fine too — it just arrives without a display name.
  if (!value.includes("@") || /\s/.test(value)) return null;
  return { value, address: value.toLowerCase(), name: "" };
}

/**
 * Every address the panel can send as, in picker order — the default sender
 * first, so the top of the dropdown is the one already used by every
 * transactional email.
 *
 * `EMAIL_FROM` and `EMAIL_FROM_SALES` are the two the site already sends from.
 * `EMAIL_FROM_EXTRA` adds any others, one per line or comma-separated:
 *
 *   EMAIL_FROM_EXTRA=AWS OVERSEAS impex <info@awsoverseas.com>
 *   AWS OVERSEAS impex <accounts@awsoverseas.com>
 *
 * A display name containing a comma has to go on its own line, since commas
 * separate entries.
 */
export function emailSenders(): EmailSender[] {
  const entries = [
    process.env.EMAIL_FROM,
    process.env.EMAIL_FROM_SALES,
    ...(process.env.EMAIL_FROM_EXTRA ?? "").split(/[,\n]/),
  ];

  const seen = new Set<string>();
  const senders: EmailSender[] = [];

  for (const entry of entries) {
    const sender = entry ? parseSender(entry) : null;
    if (!sender || seen.has(sender.address)) continue;
    seen.add(sender.address);
    senders.push(sender);
  }

  return senders;
}

/** The sender for an address, or null when it isn't one the panel may send as. */
export function resolveSender(address: string): EmailSender | null {
  const wanted = address.trim().toLowerCase();
  return emailSenders().find((sender) => sender.address === wanted) ?? null;
}

/**
 * The address a reply to an enquiry should come from — the sales desk when
 * it's configured, since that's already where enquiry acknowledgements are
 * sent from and where the customer expects the conversation to continue.
 * Falls back to the default sender so a reply is never left without a From.
 */
export function replySenderAddress(): string {
  const senders = emailSenders();
  const sales = process.env.EMAIL_FROM_SALES ? parseSender(process.env.EMAIL_FROM_SALES) : null;
  const match = sales ? senders.find((sender) => sender.address === sales.address) : undefined;
  return (match ?? senders[0])?.address ?? "";
}
