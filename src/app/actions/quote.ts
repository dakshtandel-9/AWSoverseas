"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getAccount } from "@/lib/account";
import { createTrackingNumber } from "@/lib/tracking";
import { uploadEnquiryAttachment } from "@/lib/cloudinary";

export type QuoteFormState = { success?: boolean; error?: string; trackingNumber?: string };

export async function submitQuoteAction(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  // The page already gates this form, but never trust the client.
  const account = await getAccount();
  if (!account) {
    return { error: "Please sign in to request a quote." };
  }
  if (account.profile.status !== "approved") {
    return { error: "Your account is still being verified — quoting unlocks once it's approved." };
  }

  const serviceType = String(formData.get("service-type") ?? "").trim();
  const shipmentType = String(formData.get("shipment-type") ?? "").trim();

  // Both directions ask for the origin and destination country by name; the
  // Indian state on whichever side is domestic is a separate, optional field
  // that rides along in `raw` (origin-state / destination-state). Anything
  // other than a known direction is treated as export, matching the form's own
  // default.
  const direction = formData.get("direction") === "import" ? "import" : "export";

  const originCountry = String(formData.get("origin-country") ?? "").trim();
  const destinationCountry = String(formData.get("destination-country") ?? "").trim();
  const fullName = String(formData.get("full-name") ?? "").trim();
  const companyName = String(formData.get("company-name") ?? "").trim();
  const email = String(formData.get("email-address") ?? "").trim();
  const phone = String(formData.get("phone-number") ?? "").trim();

  if (!serviceType || !shipmentType || !originCountry || !destinationCountry || !fullName || !email || !phone) {
    return { error: "Please fill in all required fields." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "This form isn't connected yet. Please try again later." };
  }

  const shipmentImage = formData.get("shipment-image");
  let attachmentUrl = "";
  if (shipmentImage instanceof File && shipmentImage.size > 0) {
    try {
      attachmentUrl = await uploadEnquiryAttachment(shipmentImage);
    } catch {
      return { error: "Something went wrong uploading your image. Please try again." };
    }
  }

  // Every submitted field, keyed by its form `name` — keeps the full payload
  // even though only a subset is promoted to typed columns for the admin list.
  // Skip Next's internal "$ACTION_..." FormData entries (Server Action
  // binding metadata, not real form fields) and the file field itself (not
  // a string; its uploaded URL is stored in attachment_url instead).
  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) raw[key] = value;
  }

  const trackingNumber = await createTrackingNumber();

  const db = supabaseAdmin();
  const { error } = await db.from("quote_submissions").insert({
    service_type: serviceType,
    shipment_type: shipmentType,
    direction,
    origin_country: originCountry,
    destination_country: destinationCountry,
    full_name: fullName,
    company_name: companyName,
    email,
    phone,
    raw,
    attachment_url: attachmentUrl,
    user_id: account.user.id,
    tracking_number: trackingNumber,
  });

  if (error) {
    return { error: "Something went wrong submitting your request. Please try again." };
  }

  return { success: true, trackingNumber };
}
