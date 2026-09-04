import { SITE_URL, absoluteUrl } from "@/lib/site-url";

/**
 * A blank starting point for emails written by hand in Hostinger webmail,
 * not sent through Resend. It mirrors the shell in email-templates.ts —
 * same masthead, route-strip motion graphic, banner, colors and fonts — so a
 * hand-sent email still reads as AWS OVERSEAS impex mail. Kept as a separate
 * client-safe module because email-templates.ts imports "server-only".
 */

const INK = "#1A0A53";
const MUTED = "#5b6b82";
const LINE = "#e4e9f2";
const SURFACE_SOFT = "#f6f8fc";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SITE_NAME = "AWS OVERSEAS impex";
const SITE_TAGLINE = "Global Trade Trusted Partners";

const ACCENT = "#861B28";
const ROUTE_STRIP = absoluteUrl("/email/route-strip.gif");
const BANNER = { url: absoluteUrl("/email/banner-v2.jpg"), alt: `${SITE_NAME} — import, export and shipping: supplier verification, customs clearance, warehousing and door-to-door delivery worldwide.` };
/** Same R2 object the sender uses — see the note on SIGNATURE_LOGO in email-templates.ts. */
const SIGNATURE_LOGO = "https://pub-fa1ef292bcde465ba3398848ee354c68.r2.dev/email/signature-logo-v1.png";
const SIGNATURE_LOGO_WIDTH = 120;

/**
 * Company details for the signature card. Passed in from the admin layout
 * rather than hardcoded, so this template and the one /admin/email sends both
 * read the office phone and address out of Site settings.
 */
export type ComposeTemplateDetails = { phone: string; address: string; email: string };

/** Mirrors signatureRowHtml in email-templates.ts, with placeholders where a real send has answers. */
function signatureRow(details: ComposeTemplateDetails): string {
  const line = (label: string, href: string, value: string) => `<tr>
    <td width="46" valign="top" style="width:46px;padding:0 10px 6px 0;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;line-height:1.9;color:#94a3b8;">${label}</td>
    <td valign="top" style="padding:0 0 6px 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUTED};">
      <a href="${href}" style="color:${MUTED};text-decoration:none;">${value}</a>
    </td>
  </tr>`;

  const contacts = [
    details.phone ? line("Phone", `tel:${details.phone.replace(/[^\d+]/g, "")}`, details.phone) : "",
    details.email ? line("Email", `mailto:${details.email}`, details.email) : "",
  ]
    .filter(Boolean)
    .join("");

  return `<tr><td style="padding:0 32px 28px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
      <tr>
        <td width="${SIGNATURE_LOGO_WIDTH}" valign="top" style="width:${SIGNATURE_LOGO_WIDTH}px;padding:24px 18px 0 0;">
          <img src="${SIGNATURE_LOGO}" width="${SIGNATURE_LOGO_WIDTH}" alt="${SITE_NAME}" style="display:block;width:${SIGNATURE_LOGO_WIDTH}px;max-width:${SIGNATURE_LOGO_WIDTH}px;height:auto;border:0;">
        </td>
        <td valign="top" style="border-left:2px solid ${LINE};padding:24px 0 0 18px;">
          <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.4;font-weight:700;color:${INK};">[Your name]</p>
          <p style="margin:2px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUTED};">[Your role]</p>
          <p style="margin:0;font-size:0;line-height:14px;">&nbsp;</p>
          <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.4;font-weight:700;color:${INK};">${SITE_NAME}</p>
          ${details.address ? `<p style="margin:4px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED};">${details.address}</p>` : ""}
          ${contacts ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">${contacts}</table>` : ""}
          <p style="margin:6px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.5;">
            <a href="${absoluteUrl("/")}" style="color:${ACCENT};text-decoration:none;font-weight:600;">awsoverseas.com</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>`;
}

/**
 * Rich HTML for the clipboard. Most webmail compose boxes (Hostinger's
 * included) are contentEditable surfaces that accept a pasted `text/html`
 * clipboard item and keep the formatting, the same way pasting from Word
 * does — so this is written as the same inline-styled table markup the
 * transactional sender uses, not a fragment meant for a <style> block.
 */
export function composeEmailTemplateHtml(details: ComposeTemplateDetails): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SURFACE_SOFT};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">

  <tr><td style="background:${INK};padding:24px 32px;">
    <div style="font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:0.02em;color:#ffffff;">${SITE_NAME}</div>
    <div style="font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#90c0fe;padding-top:6px;">${SITE_TAGLINE}</div>
  </td></tr>

  <tr><td style="font-size:0;line-height:0;">
    <img src="${ROUTE_STRIP}" width="560" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;">
  </td></tr>

  <tr><td style="padding:32px 32px 8px 32px;">
    <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">Dear [Name],</p>
    <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">[Write your message here.]</p>
    <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
  </td></tr>

  ${signatureRow(details)}

  <tr><td style="font-size:0;line-height:0;border-top:1px solid ${LINE};">
    <a href="${absoluteUrl("/")}" style="display:block;">
      <img src="${BANNER.url}" width="560" height="315" alt="${BANNER.alt}" style="display:block;width:100%;max-width:560px;height:auto;border:0;">
    </a>
  </td></tr>

  <tr><td style="background:${SURFACE_SOFT};border-top:1px solid ${LINE};padding:20px 32px;">
    <div style="font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">
      ${SITE_NAME} &middot; <a href="${SITE_URL}" style="color:${INK};text-decoration:underline;">awsoverseas.com</a>
    </div>
  </td></tr>

</table>
</td></tr>
</table>`;
}

/** Plain-text fallback for clipboards/editors that only accept text/plain. */
export function composeEmailTemplateText(details: ComposeTemplateDetails): string {
  return [
    "Dear [Name],",
    "",
    "[Write your message here.]",
    "",
    "Warm regards,",
    "",
    "--",
    "[Your name]",
    "[Your role]",
    SITE_NAME,
    details.address,
    details.phone,
    details.email,
    SITE_URL,
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
}
