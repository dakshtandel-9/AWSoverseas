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
const SITE_TAGLINE = "Global Shipping Beyond Borders";

const ROUTE_STRIP = absoluteUrl("/email/route-strip.gif");
const BANNER = { url: absoluteUrl("/email/banner.jpg"), alt: `${SITE_NAME} — your trusted global trade partner` };

/**
 * Rich HTML for the clipboard. Most webmail compose boxes (Hostinger's
 * included) are contentEditable surfaces that accept a pasted `text/html`
 * clipboard item and keep the formatting, the same way pasting from Word
 * does — so this is written as the same inline-styled table markup the
 * transactional sender uses, not a fragment meant for a <style> block.
 */
export function composeEmailTemplateHtml(): string {
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

  <tr><td style="padding:32px 32px 16px 32px;">
    <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">Dear [Name],</p>
    <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">[Write your message here.]</p>
    <p style="margin:24px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;color:${MUTED};">Warm regards,</p>
    <p style="margin:2px 0 0 0;font-family:${FONT};font-size:15px;line-height:1.7;font-weight:700;color:${INK};">Team ${SITE_NAME}</p>
  </td></tr>

  <tr><td style="font-size:0;line-height:0;border-top:1px solid ${LINE};">
    <a href="${absoluteUrl("/")}" style="display:block;">
      <img src="${BANNER.url}" width="560" height="280" alt="${BANNER.alt}" style="display:block;width:100%;max-width:560px;height:auto;border:0;">
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
export function composeEmailTemplateText(): string {
  return `Dear [Name],

[Write your message here.]

Warm regards,
Team ${SITE_NAME}

${SITE_NAME} · ${SITE_URL}`;
}
