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
 * Rebuild with scripts/build-email-strip.py and overwrite public/email/route-strip.gif.
 * It's hosted rather than inlined because email images need absolute URLs and
 * most clients strip data: URIs.
 *
 * Served from this app's own /public rather than Cloudinary (moved 2026-08-17,
 * see [[awsoversea-cloudinary-disabled]]) — Cloudinary delivery started
 * returning 401 mid-outage even after the account itself came back, which
 * blanked this image and the email banner in every inbox. Both assets are now
 * plain static files with no third-party dependency to fail again.
 */
const ROUTE_STRIP = absoluteUrl("/email/route-strip.gif");

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
 * loaded from Cloudinary — see EMAIL_BANNER.
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
            <img src="${EMAIL_BANNER.url}" width="560" height="280" alt="${EMAIL_BANNER.alt}" style="display:block;width:100%;max-width:560px;height:auto;border:0;">
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
      ${paragraph("One step is left: add your details so you can start requesting quotes and sending enquiries.")}
      ${button(setupUrl, "Complete your profile")}
      ${paragraph(
        "Include your ID number while you're there — if we need a copy of the document itself, we'll email you to request it.",
      )}
      <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
      <p style="margin:2px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;font-weight:700;color:${INK};">Team ${SITE.name}</p>
    </td></tr>
  `);

  const text = `Your ${SITE.name} account is ready.

One step is left: add your details so you can start requesting quotes and
sending enquiries.

Complete your profile:
${setupUrl}

Include your ID number while you're there — if we need a copy of the document
itself, we'll email you to request it.

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
  const adminUrl = absoluteUrl("/admin/enquiries");

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

/**
 * Turns bare typed text into HTML: blank lines become paragraphs, single
 * newlines become line breaks, and pasted links become clickable. Everything
 * is escaped first, because this text comes out of a textarea — the operator
 * writing `<3` must not open a tag, and the panel must not become a way to
 * inject markup into mail sent under the company's name.
 */
function typedTextToHtml(body: string, linkColor: string, paragraphStyle: string): string {
  const linkify = (escaped: string) =>
    escaped.replace(/\bhttps?:\/\/[^\s<]+/g, (match) => {
      // Sentences end in punctuation and URLs usually don't, so trailing
      // punctuation is left outside the link rather than broken into it.
      const href = match.replace(/[.,;:!?)\]]+$/, "");
      return `<a href="${href}" style="color:${linkColor};text-decoration:underline;">${href}</a>${match.slice(href.length)}`;
    });

  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p style="${paragraphStyle}">${linkify(escapeHtml(block)).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export type ComposedEmailInput = {
  subject: string;
  /** Exactly what was typed in the compose box at /admin/email. */
  body: string;
  /** The mailbox this is going out from, named in the sign-off so a reply has an obvious home. */
  fromAddress: string;
  /** False sends the words on their own, with no masthead, banner or brand colors. */
  branded: boolean;
  /** Who to sign as, and how to reach them. */
  signature: SignatureDetails;
};

/**
 * An email written by hand in the admin panel rather than triggered by
 * something a customer did.
 *
 * Two shapes, because the same panel sends both kinds of mail. Branded wraps
 * the text in the masthead/banner shell every transactional email uses and
 * closes with the full signature card, for a newsletter or an announcement.
 * Plain sends the words with a small typed sign-off, which is what a one-line
 * reply to a customer should look like — a masthead and a logo over "Yes, we
 * can ship that on Tuesday" reads as marketing, and marketing is what gets
 * filtered.
 *
 * Both name the sending mailbox. Replies go to whichever address sent the
 * message, and that address is a real Hostinger mailbox.
 */
export function composedEmail({
  subject,
  body,
  fromAddress,
  branded,
  signature,
}: ComposedEmailInput): Omit<EmailMessage, "to"> {
  const html = branded
    ? shell(
        `<tr><td style="padding:32px 32px 8px 32px;">
          ${typedTextToHtml(body, INK, `margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};`)}
        </td></tr>
        ${signatureRowHtml(signature)}`,
        `Sent by ${escapeHtml(fromAddress)} &middot;
          <a href="${absoluteUrl("/")}" style="color:${INK};text-decoration:underline;">awsoverseas.com</a>`,
      )
    : `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    ${typedTextToHtml(body, INK, `margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};`)}
    ${plainSignatureHtml(signature)}
  </div>
</body>
</html>`;

  const text = `${body.replace(/\r\n/g, "\n").trim()}

--
${signatureText(signature)}`;

  return { subject, html, text };
}

/**
 * Served from R2, not from this app's /public.
 *
 * A sent email keeps fetching this URL for as long as anyone still has the
 * message, and mail goes out from a laptop as often as from production. A
 * /public file only exists once the site is deployed, so every email sent
 * before that deploy lands with a broken image that can never heal — which is
 * exactly what happened on 2026-08-28. R2 is live the moment the build script
 * uploads, and it already serves every other public media file here.
 *
 * Rebuild and republish with scripts/build-email-signature-assets.mjs. The
 * object is immutable with a one-year cache, so new artwork means a new -v2
 * name and this constant updated — never an overwrite.
 */
const SIGNATURE_LOGO = "https://pub-fa1ef292bcde465ba3398848ee354c68.r2.dev/email/signature-logo-v1.png";

/** Rendered width; the file is 300px so it stays sharp on a phone. */
const SIGNATURE_LOGO_WIDTH = 120;

export type SignatureDetails = {
  /** The person sending. Blank signs as the company alone, which is right for an announcement. */
  name: string;
  /** Job title under the name. Ignored without a name. */
  role: string;
  /** The mailbox this is going out from — the address a reply reaches. */
  email: string;
  /** Main company line, from Site settings. */
  phone: string;
  /** Office address, from Site settings. */
  address: string;
};

/**
 * One `label + value` line in the signature's contact list.
 *
 * The label is set in type rather than drawn as an icon on purpose. Most
 * clients block remote images until the reader allows them, and a blocked
 * 16px icon renders as a broken-image box beside every phone number — worse
 * than no icon at all. Tracked uppercase echoes the masthead's tagline, so it
 * reads as part of the same design rather than as a fallback.
 */
function contactLine(label: string, href: string, value: string): string {
  return `<tr>
    <td width="46" valign="top" style="width:46px;padding:0 10px 6px 0;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;line-height:1.9;color:#94a3b8;">${label}</td>
    <td valign="top" style="padding:0 0 6px 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUTED};">
      <a href="${href}" style="color:${MUTED};text-decoration:none;">${escapeHtml(value)}</a>
    </td>
  </tr>`;
}

/**
 * The signature block that closes a branded email: the wordmark, a rule, then
 * who sent it and how to reach them.
 *
 * Built as a two-column table because that's the only layout email clients all
 * agree on — no flexbox, no grid. The logo column is fixed and narrow so the
 * details still have room to wrap on a phone, where nothing collapses the
 * columns for us.
 *
 * Phone and email stack rather than sitting side by side. A single row of both
 * fits a desktop preview pane and overflows a 320px screen, and a signature
 * that scrolls sideways looks broken in a way a stacked one never does.
 */
export function signatureRowHtml(details: SignatureDetails): string {
  const person = details.name
    ? `<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.4;font-weight:700;color:${INK};">${escapeHtml(details.name)}</p>
       ${details.role ? `<p style="margin:2px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUTED};">${escapeHtml(details.role)}</p>` : ""}
       <p style="margin:0;font-size:0;line-height:14px;">&nbsp;</p>`
    : "";

  const contacts = [
    details.phone ? contactLine("Phone", `tel:${details.phone.replace(/[^\d+]/g, "")}`, details.phone) : "",
    details.email ? contactLine("Email", `mailto:${details.email}`, details.email) : "",
  ]
    .filter(Boolean)
    .join("");

  return `<tr><td style="padding:0 32px 28px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
      <tr>
        <td width="${SIGNATURE_LOGO_WIDTH}" valign="top" style="width:${SIGNATURE_LOGO_WIDTH}px;padding:24px 18px 0 0;">
          <a href="${absoluteUrl("/")}" style="display:block;">
            <img src="${SIGNATURE_LOGO}" width="${SIGNATURE_LOGO_WIDTH}" alt="${escapeHtml(SITE.name)}" style="display:block;width:${SIGNATURE_LOGO_WIDTH}px;max-width:${SIGNATURE_LOGO_WIDTH}px;height:auto;border:0;">
          </a>
        </td>
        <td valign="top" style="border-left:2px solid ${LINE};padding:24px 0 0 18px;">
          ${person}
          <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.4;font-weight:700;color:${INK};">${escapeHtml(SITE.name)}</p>
          ${details.address ? `<p style="margin:4px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED};">${escapeHtml(details.address)}</p>` : ""}
          ${contacts ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">${contacts}</table>` : ""}
          <p style="margin:6px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.5;">
            <a href="${absoluteUrl("/")}" style="color:${ACCENT};text-decoration:none;font-weight:600;">awsoverseas.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>`;
}

/** The same details for the plain-text alternative, where there's no logo to show. */
export function signatureText(details: SignatureDetails): string {
  return [
    details.name,
    details.name ? details.role : "",
    SITE.name,
    details.address,
    details.phone,
    details.email,
    SITE.url,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * The sign-off on a plain email: the same facts as the signature card, set as
 * small text with no logo, icons or rules. A plain email's whole promise is
 * that it looks like a person wrote it, and a logo card at the bottom breaks
 * that in one glance.
 */
export function plainSignatureHtml(details: SignatureDetails): string {
  const lines = [
    details.name
      ? `<span style="font-weight:700;color:${INK};">${escapeHtml(details.name)}</span>`
      : "",
    details.name && details.role ? escapeHtml(details.role) : "",
    `<span style="font-weight:700;color:${INK};">${escapeHtml(SITE.name)}</span>`,
    escapeHtml(details.address),
    details.phone
      ? `<a href="tel:${details.phone.replace(/[^\d+]/g, "")}" style="color:${MUTED};text-decoration:none;">${escapeHtml(details.phone)}</a>`
      : "",
    details.email
      ? `<a href="mailto:${details.email}" style="color:${MUTED};text-decoration:none;">${escapeHtml(details.email)}</a>`
      : "",
    `<a href="${absoluteUrl("/")}" style="color:${ACCENT};text-decoration:none;font-weight:600;">awsoverseas.com</a>`,
  ].filter(Boolean);

  return `<p style="margin:28px 0 0 0;padding-top:16px;border-top:1px solid ${LINE};font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED};">
    ${lines.join("<br>")}
  </p>`;
}
