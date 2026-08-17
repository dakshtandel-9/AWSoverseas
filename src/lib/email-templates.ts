import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/site-url";
import { EMAIL_BANNER } from "@/lib/email-assets";
import type { EmailMessage } from "@/lib/email";

/**
 * Transactional email bodies. Written as inline-styled tables because email
 * clients strip <style> blocks and ignore most modern CSS — none of the
 * site's Tailwind tokens survive the trip, so the brand colors are spelled
 * out here as literals.
 */

const INK = "#1A0A53";
const ACCENT = "#861B28";
const MUTED = "#5b6b82";
const LINE = "#e4e9f2";
const SURFACE_SOFT = "#f6f8fc";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/**
 * Animated route strip under the masthead: one continuous journey along a
 * single route line at constant speed, where the mode changes by thirds. The
 * truck runs the first third, then hands straight over to the plane at that
 * exact point, then the ship takes the last third — the three service lines as
 * one shipment. Nothing eases or pauses, and a second copy of the vehicle runs
 * one band ahead so the lap wraps with no empty beat.
 *
 * Painted in a watercolour light blue as of 2026-08-17, replacing the original
 * brand maroon at the client's request — each vehicle carries a soft wash that
 * pools darker at its base, over a lighter tint of the same blue for the line.
 *
 * An animated GIF is the only thing that moves in an inbox: email clients
 * strip CSS animation, JS and SVG alike. Outlook on Windows shows the first
 * frame only, so the loop opens with the truck already on the route.
 *
 * Rebuild with scripts/build-email-strip.py, re-upload to the same Cloudinary
 * public_id, and update the version in this URL. It's hosted rather than
 * inlined because email images need absolute URLs and most clients strip
 * data: URIs.
 */
const ROUTE_STRIP = "https://res.cloudinary.com/dwethh3fq/image/upload/v1786947036/awsoversea/email/route-strip.gif";

/** Names come from customer input, so they reach the template unescaped. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Wraps body markup in the shared masthead/footer shell.
 *
 * The brand banner sits *below* the message rather than above it: it's a 2:1
 * image, so at the 560px body width it's 280px tall, and leading with it would
 * push "your account has been approved" off the first screen on a phone. After
 * the sign-off it reads as a signature instead of an obstacle. The bytes are
 * attached by `sendEmail` — see EMAIL_BANNER.
 */
function shell(bodyHtml: string, footerNote?: string): string {
  const footer =
    footerNote ??
    `You received this because an account was registered with this address at
            <a href="${absoluteUrl("/")}" style="color:${INK};text-decoration:underline;">awsoverseas.com</a>.
            Reply to this email if that wasn't you.`;

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${SURFACE_SOFT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SURFACE_SOFT};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">

        <tr><td style="background:${INK};padding:24px 32px;">
          <div style="font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:0.02em;color:#ffffff;">${SITE.name}</div>
          <div style="font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#90c0fe;padding-top:6px;">${SITE.tagline}</div>
        </td></tr>

        <tr><td style="font-size:0;line-height:0;">
          <img src="${ROUTE_STRIP}" width="560" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;">
        </td></tr>

        ${bodyHtml}

        <tr><td style="font-size:0;line-height:0;border-top:1px solid ${LINE};">
          <a href="${absoluteUrl("/")}" style="display:block;">
            <img src="cid:${EMAIL_BANNER.cid}" width="560" alt="${EMAIL_BANNER.alt}" style="display:block;width:100%;max-width:560px;height:auto;border:0;">
          </a>
        </td></tr>

        <tr><td style="background:${SURFACE_SOFT};border-top:1px solid ${LINE};padding:20px 32px;">
          <div style="font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">
            ${footer}
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** One paragraph of body copy, at the shared measure and rhythm. */
function paragraph(text: string): string {
  return `<p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">${text}</p>`;
}

/** Maroon call-to-action button. */
function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 26px 0;"><tr>
    <td style="background:${ACCENT};border-radius:10px;">
      <a href="${href}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${label}</a>
    </td>
  </tr></table>`;
}

/**
 * Label/value rows for the internal notifications — a customer email is prose,
 * an ops alert is a set of fields someone scans in five seconds.
 */
function detailTable(rows: [label: string, value: string][]): string {
  const cells = rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `<tr>
        <td style="padding:7px 16px 7px 0;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:7px 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 22px 0;border-top:1px solid ${LINE};border-bottom:1px solid ${LINE};">${cells}</table>`;
}

/** Shared "Dear X," line — falls back when a name somehow isn't on the profile. */
function salutationFor(firstName: string, lastName: string): string {
  const name = [firstName, lastName].map((part) => part.trim()).filter(Boolean).join(" ");
  return name ? `Dear ${name},` : "Dear Customer,";
}

/**
 * Sent the moment the account itself exists — the profile row's creation on
 * the first request after sign-up, before any details have been filled in.
 *
 * There is deliberately no salutation: sign-up collects an email and a password
 * and nothing else, so a name doesn't exist yet and "Dear Customer," reads
 * worse than opening with the news. Its job is to confirm the account and point
 * at the one thing left to do.
 *
 * The copy here is mine, not the client's — swap it for their wording when they
 * supply some, the way the registration and enquiry emails already carry theirs.
 */
export function welcomeEmail(): Omit<EmailMessage, "to"> {
  const setupUrl = absoluteUrl("/profile/setup");

  const html = shell(`
    <tr><td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">Your ${escapeHtml(SITE.name)} account is ready.</p>
      ${paragraph(
        "One step is left: add your details so our team can verify you. Verification is what unlocks quote requests and product orders.",
      )}
      ${button(setupUrl, "Complete your profile")}
      ${paragraph(
        "You can upload your ID documents while you're there, or skip them and add them from your profile whenever you're ready.",
      )}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
      <p style="margin:2px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;font-weight:700;color:${INK};">Team ${SITE.name}</p>
    </td></tr>
  `);

  const text = `Your ${SITE.name} account is ready.

One step is left: add your details so our team can verify you. Verification is
what unlocks quote requests and product orders.

Complete your profile:
${setupUrl}

You can upload your ID documents while you're there, or skip them and add them
from your profile whenever you're ready.

Warm regards,
Team ${SITE.name}

You received this because an account was registered with this address at ${SITE.url}.`;

  return { subject: `Welcome to ${SITE.name}`, html, text };
}

export type RegistrationReceivedInput = {
  firstName: string;
  lastName: string;
};

/**
 * Sent when a customer submits their profile and ID for verification — the
 * `incomplete → pending` step, not the earlier signup. That's the moment the
 * copy below describes: details are in hand and the admin review queue at
 * /admin/users has picked them up.
 *
 * The wording is the client's own and is reproduced verbatim; only the name
 * is interpolated.
 */
export function registrationReceivedEmail({ firstName, lastName }: RegistrationReceivedInput): Omit<EmailMessage, "to"> {
  const salutation = salutationFor(firstName, lastName);

  const html = shell(`
    <tr><td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">${escapeHtml(salutation)}</p>
      ${paragraph(`Thank you for registering with ${SITE.name}.`)}
      ${paragraph(
        "We confirm that we have received your details successfully. Our team will review your submission, and you will be notified once the approval process is complete.",
      )}
      ${paragraph("We appreciate your interest in partnering with us and look forward to working together.")}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
      <p style="margin:2px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;font-weight:700;color:${INK};">Team ${SITE.name}</p>
    </td></tr>
  `);

  const text = `${salutation}

Thank you for registering with ${SITE.name}.

We confirm that we have received your details successfully. Our team will
review your submission, and you will be notified once the approval process is
complete.

We appreciate your interest in partnering with us and look forward to working
together.

Warm regards,
Team ${SITE.name}

You received this because an account was registered with this address at ${SITE.url}.`;

  return { subject: `We've received your registration — ${SITE.name}`, html, text };
}

export type EnquiryReceivedInput = {
  /** The enquiry form collects one combined name field, so there's no surname. */
  name: string;
};

/**
 * Acknowledges a product enquiry, sent from the sales desk rather than admin@.
 *
 * The wording is the client's own and is reproduced verbatim — including
 * "Thank you for registering", which they supplied for this email even though
 * an enquiry isn't a registration.
 */
export function enquiryReceivedEmail({ name }: EnquiryReceivedInput): Omit<EmailMessage, "to"> {
  const salutation = salutationFor(name, "");

  const html = shell(`
    <tr><td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">${escapeHtml(salutation)}</p>
      ${paragraph(`Thank you for registering with ${SITE.name}.`)}
      ${paragraph(
        "We confirm that we have received your details successfully. Our team will review your submission, and you will be notified once the approval process is complete.",
      )}
      ${paragraph("We appreciate your interest.")}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
      <p style="margin:2px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;font-weight:700;color:${INK};">Team ${SITE.name}</p>
    </td></tr>
  `);

  const text = `${salutation}

Thank you for registering with ${SITE.name}.

We confirm that we have received your details successfully. Our team will
review your submission, and you will be notified once the approval process is
complete.

We appreciate your interest.

Warm regards,
Team ${SITE.name}

You received this because an enquiry was submitted with this address at ${SITE.url}.`;

  return { subject: `We've received your enquiry — ${SITE.name}`, html, text };
}

export type QuoteReceivedInput = {
  name: string;
  serviceType: string;
  route: string;
  trackingNumber: string;
};

/**
 * Acknowledges a submission from the /quote shipment form, sent from the sales
 * desk. Everything the customer reads calls it an **enquiry**, never a "quote
 * request" or a "quotation" — the client's wording. The code around it still
 * says quote (submitQuoteAction, quote_submissions, /admin/quotes), so the two
 * vocabularies meet here.
 *
 * Unlike a product enquiry this already has a tracking number by the time it
 * sends, so the reference is the point of the email — it's the one thing the
 * customer needs to keep.
 */
export function quoteReceivedEmail({
  name,
  serviceType,
  route,
  trackingNumber,
}: QuoteReceivedInput): Omit<EmailMessage, "to"> {
  const salutation = salutationFor(name, "");
  const trackingUrl = absoluteUrl(`/tracking?ref=${encodeURIComponent(trackingNumber)}`);

  const html = shell(`
    <tr><td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">${escapeHtml(salutation)}</p>
      ${paragraph(`Thank you for your enquiry with ${SITE.name}. We have received your shipment details and our team is reviewing them now.`)}
      ${detailTable([
        ["Reference", trackingNumber],
        ["Service", serviceType],
        ["Route", route],
      ])}
      ${paragraph("Keep the reference above — you can follow your shipment's progress with it at any time.")}
      ${button(trackingUrl, "Track this shipment")}
      ${paragraph("We'll come back to you shortly with pricing and next steps. If anything about the shipment changes in the meantime, simply reply to this email.")}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
      <p style="margin:2px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;font-weight:700;color:${INK};">Team ${SITE.name}</p>
    </td></tr>
  `);

  const text = `${salutation}

Thank you for your enquiry with ${SITE.name}. We have received your shipment
details and our team is reviewing them now.

Reference: ${trackingNumber}
Service:   ${serviceType}
Route:     ${route}

Keep the reference above — you can follow your shipment's progress with it at
any time:
${trackingUrl}

We'll come back to you shortly with pricing and next steps. If anything about
the shipment changes in the meantime, simply reply to this email.

Warm regards,
Team ${SITE.name}`;

  return { subject: `We've received your enquiry — ${trackingNumber}`, html, text };
}

export type QuoteNotificationInput = {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  serviceType: string;
  shipmentType: string;
  route: string;
  trackingNumber: string;
};

/**
 * The internal side of a /quote submission, same alert shape as the product
 * enquiry one. Qualified as a **shipment enquiry** rather than plain "enquiry"
 * only so the team can tell the two alerts apart in the inbox — a product
 * enquiry names a product, this one names a route.
 */
export function quoteNotificationEmail({
  name,
  email,
  phone,
  companyName,
  serviceType,
  shipmentType,
  route,
  trackingNumber,
}: QuoteNotificationInput): Omit<EmailMessage, "to"> {
  const adminUrl = absoluteUrl("/admin/quotes");

  const html = shell(
    `
    <tr><td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 20px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">A new shipment enquiry just came in through the website.</p>
      ${detailTable([
        ["Reference", trackingNumber],
        ["Service", serviceType],
        ["Shipment", shipmentType],
        ["Route", route],
        ["From", name],
        ["Company", companyName],
        ["Email", email],
        ["Phone", phone],
      ])}
      ${button(adminUrl, "Open in the admin panel")}
    </td></tr>
  `,
    `Sent to the team because a shipment enquiry was submitted at
     <a href="${absoluteUrl("/")}" style="color:${INK};text-decoration:underline;">awsoverseas.com</a>.`,
  );

  const text = `A new shipment enquiry just came in through the website.

Reference: ${trackingNumber}
Service:   ${serviceType}
Shipment:  ${shipmentType}
Route:     ${route}
From:      ${name}
Company:   ${companyName || "—"}
Email:     ${email}
Phone:     ${phone}

Open in the admin panel:
${adminUrl}`;

  return { subject: `New shipment enquiry: ${route}`, html, text };
}

export type EnquiryNotificationInput = {
  name: string;
  email: string;
  phone: string;
  productName: string;
  quantity: string;
  message: string;
};

/**
 * The internal side of an enquiry: tells the team a lead just landed, so nobody
 * has to keep the admin panel open to find out. Goes to `adminNotifyTo()`, not
 * the customer, and carries the contact details inline so it can be actioned
 * from a phone without signing in.
 */
export function enquiryNotificationEmail({
  name,
  email,
  phone,
  productName,
  quantity,
  message,
}: EnquiryNotificationInput): Omit<EmailMessage, "to"> {
  const adminUrl = absoluteUrl("/admin/enquiries-open");

  const html = shell(
    `
    <tr><td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 20px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">A new enquiry just came in through the website.</p>
      ${detailTable([
        ["Product", productName],
        ["From", name],
        ["Email", email],
        ["Phone", phone],
        ["Quantity", quantity],
        ["Message", message],
      ])}
      ${button(adminUrl, "Open in the admin panel")}
    </td></tr>
  `,
    `Sent to the team because an enquiry was submitted at
     <a href="${absoluteUrl("/")}" style="color:${INK};text-decoration:underline;">awsoverseas.com</a>.`,
  );

  const text = `A new enquiry just came in through the website.

Product:  ${productName}
From:     ${name}
Email:    ${email || "—"}
Phone:    ${phone || "—"}
Quantity: ${quantity || "—"}
Message:  ${message || "—"}

Open in the admin panel:
${adminUrl}`;

  return { subject: `New enquiry: ${productName}`, html, text };
}

export type AccountApprovedInput = {
  firstName: string;
  lastName: string;
};

/**
 * Sent when an admin approves a pending account at /admin/users. This is the
 * follow-up the registration email promises ("you will be notified once the
 * approval process is complete"), so its wording deliberately echoes that
 * sentence back.
 */
export function accountApprovedEmail({ firstName, lastName }: AccountApprovedInput): Omit<EmailMessage, "to"> {
  const salutation = salutationFor(firstName, lastName);
  const profileUrl = absoluteUrl("/profile");

  const html = shell(`
    <tr><td style="padding:32px 32px 16px 32px;">
      <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">${escapeHtml(salutation)}</p>
      ${paragraph(`We are pleased to inform you that your account with ${SITE.name} has been approved.`)}
      ${paragraph(
        "Your verification is complete. You can now sign in to request quotes and place orders directly through your account.",
      )}
      ${button(profileUrl, "Sign in to your account")}
      ${paragraph(
        "Thank you for choosing to partner with us. If you have any questions about shipping, customs or sourcing, simply reply to this email and our team will assist you.",
      )}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
      <p style="margin:2px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;font-weight:700;color:${INK};">Team ${SITE.name}</p>
    </td></tr>
  `);

  const text = `${salutation}

We are pleased to inform you that your account with ${SITE.name} has been
approved.

Your verification is complete. You can now sign in to request quotes and place
orders directly through your account:
${profileUrl}

Thank you for choosing to partner with us. If you have any questions about
shipping, customs or sourcing, simply reply to this email and our team will
assist you.

Warm regards,
Team ${SITE.name}

You received this because an account was registered with this address at ${SITE.url}.`;

  return { subject: `Your account has been approved — ${SITE.name}`, html, text };
}
