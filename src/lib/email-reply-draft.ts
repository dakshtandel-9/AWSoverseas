import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { replySenderAddress } from "@/lib/email-senders";
import { SITE } from "@/lib/site";

/**
 * Turns one inbox submission into a half-written reply for /admin/email.
 *
 * The Reply button on a row carries only `source` and `id` in the URL, and
 * this reads the row back to build the draft. Putting the message in the query
 * string instead would work for a two-line reply and break on anything longer,
 * and it would let anyone who can reach the panel put words into a draft that
 * goes out under the company's name.
 *
 * Nothing here sends. The draft lands in the compose form for the operator to
 * finish, edit or throw away.
 */

export const REPLY_SOURCES = ["message", "enquiry", "quote", "warehouse"] as const;
export type ReplySource = (typeof REPLY_SOURCES)[number];

export type ReplyDraft = {
  source: ReplySource;
  /** Who it's going to, named in the banner above the form. */
  who: string;
  /** What they sent — "contact message", "quote enquiry" — for that same banner. */
  what: string;
  /** The queue it came from, so the banner can offer the way back. */
  backHref: string;
  to: string;
  subject: string;
  body: string;
  from: string;
};

type SourceConfig = { table: string; what: string; backHref: string };

const SOURCES: Record<ReplySource, SourceConfig> = {
  message: { table: "contact_submissions", what: "contact message", backHref: "/admin/messages" },
  enquiry: { table: "product_enquiries", what: "product enquiry", backHref: "/admin/enquiries" },
  quote: { table: "quote_submissions", what: "quote enquiry", backHref: "/admin/quotes" },
  warehouse: { table: "warehouse_bookings", what: "warehouse booking", backHref: "/admin/warehouse-bookings" },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isReplySource(value: string | undefined): value is ReplySource {
  return Boolean(value) && (REPLY_SOURCES as readonly string[]).includes(value!);
}

type Row = Record<string, unknown>;

function text(row: Row, key: string): string {
  const value = row[key];
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** "Dear Priya Shah," — or a neutral opener when the form was sent without a name. */
function salutation(name: string): string {
  return name ? `Dear ${name},` : "Dear Customer,";
}

/** Sign-off lines from a bulk sender, which have no business being quoted back. */
const FOOTER_LINE =
  /^\s*(unsubscribe|opt[\s-]?out|to unsubscribe|to stop receiving|if you (?:no longer|do not|don't)\b)/i;

/**
 * Cleans the sender's own words before the draft quotes them back.
 *
 * Whatever is quoted here leaves the building inside an email sent from
 * awsoverseas.com, published under the company's name. The contact form
 * collects marketing spam alongside real enquiries, and spam arrives carrying
 * tracking links and an unsubscribe footer — quoted verbatim, that puts
 * someone else's unsubscribe link in our outgoing mail. It reads as broken to
 * the recipient, and it teaches spam filters the wrong thing about this
 * domain.
 *
 * So links go and the words stay. Nothing is lost: the original is still on
 * the enquiry row in full, and the operator can paste anything they actually
 * need back into the draft.
 */
function sanitizeQuoted(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => !FOOTER_LINE.test(line))
    .map((line) =>
      line
        .replace(/\bhttps?:\/\/\S+/gi, "")
        .replace(/\bwww\.\S+/gi, "")
        .replace(/[ \t]{2,}/g, " ")
        .trimEnd(),
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * The block quoting back what they sent. It's what makes the draft worth
 * opening: the operator doesn't have to keep the enquiry on screen in another
 * tab to answer it, and the customer sees which of their enquiries this
 * answers. Empty fields drop out rather than printing "Phone: —".
 */
function recap(heading: string, rows: [string, string][], freeText: string): string {
  const quoted = sanitizeQuoted(freeText);
  const lines = rows.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`);
  if (lines.length === 0 && !quoted) return "";

  const block = [heading, ...lines].join("\n");
  return quoted ? `${block}\n\n${quoted}` : block;
}

/** The middle of every draft: the operator's slot, then the sign-off. */
function closing(prompt: string): string {
  return `${prompt}\n\nWarm regards,\nTeam ${SITE.name}`;
}

function buildDraft(source: ReplySource, row: Row): Omit<ReplyDraft, "source" | "what" | "backHref" | "from"> {
  const name = text(row, "full_name");
  const to = text(row, "email");
  const on = formatDate(text(row, "created_at"));

  if (source === "enquiry") {
    const product = text(row, "product_name");
    return {
      who: name || to,
      to,
      subject: product ? `Re: your enquiry about ${product}` : "Re: your product enquiry",
      body: [
        salutation(name),
        product
          ? `Thank you for your enquiry about ${product}. Here's where we've got to:`
          : "Thank you for your product enquiry. Here's where we've got to:",
        closing("[Write your reply here — pricing, availability, lead time.]"),
        recap(
          `Your enquiry${on ? `, ${on}` : ""}:`,
          [
            ["Product", product],
            ["Quantity or quality", text(row, "requested_quantity")],
          ],
          text(row, "message"),
        ),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (source === "quote") {
    const origin = text(row, "origin_country");
    const destination = text(row, "destination_country");
    const route = origin && destination ? `${origin} to ${destination}` : "";
    return {
      who: name || to,
      to,
      subject: route ? `Re: your shipping enquiry — ${route}` : "Re: your shipping enquiry",
      body: [
        salutation(name),
        route
          ? `Thank you for your shipping enquiry from ${route}. Here's where we've got to:`
          : "Thank you for your shipping enquiry. Here's where we've got to:",
        closing("[Write your quote here — rate, transit time, what it covers.]"),
        recap(
          `Your enquiry${on ? `, ${on}` : ""}:`,
          [
            ["Service", text(row, "service_type")],
            ["Shipment type", text(row, "shipment_type")],
            ["Route", route ? route.replace(" to ", " → ") : ""],
            ["Tracking number", text(row, "tracking_number")],
          ],
          "",
        ),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  if (source === "warehouse") {
    const type = text(row, "warehouse_type");
    return {
      who: name || to,
      to,
      subject: "Re: your warehouse booking request",
      body: [
        salutation(name),
        type
          ? `Thank you for your ${type.toLowerCase()} storage request. Here's where we've got to:`
          : "Thank you for your warehouse booking request. Here's where we've got to:",
        closing("[Write your reply here — availability, rate, how long we can hold it.]"),
        recap(
          `Your request${on ? `, ${on}` : ""}:`,
          [
            ["Warehouse type", type],
            ["Address", text(row, "address")],
          ],
          text(row, "notes"),
        ),
      ]
        .filter(Boolean)
        .join("\n\n"),
    };
  }

  const service = text(row, "service_required");
  return {
    who: name || to,
    to,
    subject: service ? `Re: your message about ${service.toLowerCase()}` : `Re: your message to ${SITE.name}`,
    body: [
      salutation(name),
      `Thank you for getting in touch with ${SITE.name}.`,
      closing("[Write your reply here.]"),
      recap(
        `Your message${on ? `, ${on}` : ""}:`,
        [
          ["Company", text(row, "company_name")],
          ["About", service],
        ],
        text(row, "message"),
      ),
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}

/**
 * Reads the submission and returns the draft, or null when there's nothing to
 * reply to — a bad id, a deleted row, or a submission with no email address on
 * it. The compose page falls back to a blank form in every one of those cases,
 * so a stale Reply link never dead-ends.
 */
export async function getReplyDraft(source: ReplySource, id: string): Promise<ReplyDraft | null> {
  if (!isSupabaseConfigured() || !UUID.test(id)) return null;

  const config = SOURCES[source];
  const { data } = await supabaseAdmin().from(config.table).select("*").eq("id", id).maybeSingle();
  if (!data) return null;

  const draft = buildDraft(source, data as Row);
  if (!draft.to) return null;

  return {
    source,
    what: config.what,
    backHref: config.backHref,
    from: replySenderAddress(),
    ...draft,
  };
}
