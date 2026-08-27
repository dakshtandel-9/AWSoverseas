"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { sendEmailDetailed } from "@/lib/email";
import { composedEmail } from "@/lib/email-templates";
import { resolveSender } from "@/lib/email-senders";
import { getSiteSettings } from "@/lib/site-settings";

/** Resend accepts at most 50 addresses across To, CC and BCC combined. */
const MAX_RECIPIENTS = 50;

/** Deliberately loose — the recipient's mail server is the real judge of an address. */
const ADDRESS = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

export type SendEmailState = {
  error?: string;
  /** What went out, in the operator's own terms. */
  success?: string;
  /** Bumped on every successful send, so the form clears itself even after two identical ones. */
  sentAt?: number;
};

type ParsedAddresses = { addresses: string[]; invalid: string[] };

/**
 * Reads a typed recipient field. Commas, semicolons and newlines all separate
 * addresses, because operators paste from every direction — and an entry
 * pasted out of a mail client (`Priya Shah <priya@acme.com>`) keeps only the
 * address rather than being rejected as malformed.
 */
function parseAddresses(raw: string): ParsedAddresses {
  const seen = new Set<string>();
  const addresses: string[] = [];
  const invalid: string[] = [];

  for (const entry of raw.split(/[,;\n]/).map((part) => part.trim()).filter(Boolean)) {
    const angled = /<\s*([^<>\s]+)\s*>/.exec(entry);
    const address = (angled ? angled[1] : entry).toLowerCase();

    if (!ADDRESS.test(address)) {
      invalid.push(entry);
      continue;
    }
    if (seen.has(address)) continue;
    seen.add(address);
    addresses.push(address);
  }

  return { addresses, invalid };
}

/** "priya@acme.com" for one, "4 recipients" for a crowd. */
function describeRecipients(count: number, first: string): string {
  return count === 1 ? first : `${count} recipients`;
}

/**
 * Records the send — including a refused one, which is exactly what an
 * operator needs to find later. Never rethrows: the email has already gone
 * out by this point, so a missing log row must not be reported as a failure
 * to send.
 */
async function recordSend(row: Record<string, unknown>) {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabaseAdmin().from("sent_emails").insert(row);
    if (error) throw error;
  } catch (error) {
    console.error("[email] could not record the send in sent_emails", error);
  }
}

/**
 * Sends one hand-written email from /admin/email.
 *
 * The From address is looked up in the allowlist rather than trusted from the
 * form. Resend would accept any address on the verified domain, so without
 * that lookup the compose box would let anyone past the admin password send
 * mail as any name at awsoverseas.com.
 */
export async function sendAdminEmailAction(
  _prevState: SendEmailState,
  formData: FormData,
): Promise<SendEmailState> {
  const sender = resolveSender(String(formData.get("from") ?? ""));
  if (!sender) {
    return { error: "Pick one of the listed From addresses." };
  }

  const to = parseAddresses(String(formData.get("to") ?? ""));
  const cc = parseAddresses(String(formData.get("cc") ?? ""));
  const bcc = parseAddresses(String(formData.get("bcc") ?? ""));

  const malformed = [...to.invalid, ...cc.invalid, ...bcc.invalid];
  if (malformed.length > 0) {
    const shown = malformed.slice(0, 3).join(", ");
    const rest = malformed.length > 3 ? ` and ${malformed.length - 3} more` : "";
    return { error: `Not a valid email address: ${shown}${rest}.` };
  }

  if (to.addresses.length === 0) {
    return { error: "Add at least one address in To." };
  }

  const total = to.addresses.length + cc.addresses.length + bcc.addresses.length;
  if (total > MAX_RECIPIENTS) {
    return {
      error: `One email can go to ${MAX_RECIPIENTS} addresses at most, and this one has ${total}. Split it into smaller sends.`,
    };
  }

  const subject = String(formData.get("subject") ?? "").trim();
  if (!subject) {
    return { error: "Add a subject line." };
  }

  const body = String(formData.get("body") ?? "").trim();
  if (!body) {
    return { error: "Write a message before sending." };
  }

  const branded = formData.get("layout") !== "plain";

  // The company's own contact details come from Site settings rather than
  // being written into the template, so changing the office phone number in
  // one place updates every signature that goes out afterwards. The name and
  // role are the operator's, and blank is a valid answer — the signature then
  // leads with the company, which is what an announcement wants.
  const settings = await getSiteSettings();
  const signature = {
    name: String(formData.get("signed_by") ?? "").trim().slice(0, 80),
    role: String(formData.get("signed_role") ?? "").trim().slice(0, 80),
    email: sender.address,
    phone: settings.phones.find(Boolean) ?? "",
    address: settings.address,
  };

  const result = await sendEmailDetailed({
    ...composedEmail({ subject, body, fromAddress: sender.address, branded, signature }),
    from: sender.value,
    to: to.addresses,
    cc: cc.addresses,
    bcc: bcc.addresses,
    // Pinned to the sending mailbox so Reply always reaches the address the
    // recipient can see, whatever EMAIL_REPLY_TO happens to be set to.
    replyTo: sender.value,
  });

  await recordSend({
    from_address: sender.address,
    to_addresses: to.addresses,
    cc_addresses: cc.addresses,
    bcc_addresses: bcc.addresses,
    reply_to: sender.address,
    subject,
    body,
    branded,
    status: result.ok ? "sent" : "failed",
    provider_id: result.ok ? result.id : "",
    error: result.ok ? "" : result.error,
  });

  revalidatePath("/admin/email");

  if (!result.ok) {
    return { error: result.error };
  }

  return {
    success: `Sent from ${sender.address} to ${describeRecipients(total, to.addresses[0])}.`,
    sentAt: Date.now(),
  };
}
