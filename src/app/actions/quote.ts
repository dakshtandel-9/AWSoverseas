"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type QuoteFormState = { success?: boolean; error?: string };

export async function submitQuoteAction(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const serviceType = String(formData.get("service-type") ?? "").trim();
  const shipmentType = String(formData.get("shipment-type") ?? "").trim();
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

  // Every submitted field, keyed by its form `name` — keeps the full payload
  // even though only a subset is promoted to typed columns for the admin list.
  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const db = supabaseAdmin();
  const { error } = await db.from("quote_submissions").insert({
    service_type: serviceType,
    shipment_type: shipmentType,
    origin_country: originCountry,
    destination_country: destinationCountry,
    full_name: fullName,
    company_name: companyName,
    email,
    phone,
    raw,
  });

  if (error) {
    return { error: "Something went wrong submitting your request. Please try again." };
  }

  return { success: true };
}
