"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type ContactFormState = { success?: boolean; error?: string };

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const fullName = String(formData.get("full-name") ?? "").trim();
  const companyName = String(formData.get("company-name") ?? "").trim();
  const email = String(formData.get("email-address") ?? "").trim();
  const phone = String(formData.get("phone-number") ?? "").trim();
  const serviceRequired = String(formData.get("service-required") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!fullName || !email || !phone || !message) {
    return { error: "Please fill in all required fields." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "This form isn't connected yet. Please try again later." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("contact_submissions").insert({
    full_name: fullName,
    company_name: companyName,
    email,
    phone,
    service_required: serviceRequired,
    message,
  });

  if (error) {
    return { error: "Something went wrong sending your message. Please try again." };
  }

  return { success: true };
}
