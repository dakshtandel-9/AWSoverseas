"use server";

import { after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getAccount } from "@/lib/account";
import { uploadEnquiryAttachment } from "@/lib/cloudinary";
import { isEmailConfigured, salesFrom, sendEmail } from "@/lib/email";
import { enquiryReceivedEmail } from "@/lib/email-templates";

export type EnquiryFormState = { success?: boolean; error?: string };

/**
 * Public submissions are always enquiries — no account needed, and no way to
 * create an order from here. Orders exist only once an admin moves an enquiry
 * over on the admin Enquiries page (or places one from the Orders page).
 */
export async function submitProductEnquiryAction(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  // Only used to stamp the row with a user id when the visitor happens to be
  // signed in, so a later order carries through to their profile.
  const account = await getAccount();

  const productId = String(formData.get("product-id") ?? "").trim();
  const productName = String(formData.get("product-name") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const requestedQuantity = String(formData.get("requested-quantity") ?? "").trim();
  const attachment = formData.get("attachment");

  // The "Request a Product" page (no product_id, product-name typed by the
  // visitor) only needs a way to respond — email OR phone, not both — since
  // everything else on that page is explicitly optional. The catalog
  // enquiry/order modal still requires both, matching its existing fields.
  const hasContact = productId ? Boolean(email && phone) : Boolean(email || phone);
  if (!productName || !name || !hasContact) {
    return { error: "Please fill in all required fields." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "This form isn't connected yet. Please try again later." };
  }

  let attachmentUrl = "";
  if (attachment instanceof File && attachment.size > 0) {
    try {
      attachmentUrl = await uploadEnquiryAttachment(attachment);
    } catch {
      return { error: "Something went wrong uploading your image. Please try again." };
    }
  }

  const db = supabaseAdmin();
  const row = {
    request_type: "enquiry",
    product_id: productId || null,
    product_name: productName,
    first_name: name,
    last_name: "",
    full_name: name,
    email,
    phone,
    message,
    attachment_url: attachmentUrl,
    requested_quantity: requestedQuantity,
    user_id: account?.user.id ?? null,
  };

  let { error } = await db.from("product_enquiries").insert(row);

  // The product list on the page can go stale (e.g. it was deleted or
  // deactivated after the visitor loaded it) — product_id is a foreign key,
  // so that shows up as a constraint violation. product_name is kept as a
  // snapshot precisely to survive this; retry without the dangling id
  // instead of failing the whole submission.
  if (error?.code === "23503" && row.product_id) {
    ({ error } = await db.from("product_enquiries").insert({ ...row, product_id: null }));
  }

  if (error) {
    console.error("[product-enquiry] insert failed:", error);
    return { error: "Something went wrong submitting your enquiry/inquiry. Please try again." };
  }

  // Acknowledge from the sales desk, after the response has gone out. The
  // email is optional on the Request a Product page (phone alone is enough
  // there), so there's often no address to reply to.
  if (email && isEmailConfigured()) {
    try {
      after(async () => {
        await sendEmail({ to: email, from: salesFrom(), ...enquiryReceivedEmail({ name }) });
      });
    } catch {
      // `after` needs a request scope. Skipping the acknowledgement beats
      // failing a submission that is already safely stored.
    }
  }

  return { success: true };
}
