"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type EnquiryFormState = { success?: boolean; error?: string };

export async function submitProductEnquiryAction(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const productId = String(formData.get("product-id") ?? "").trim();
  const productName = String(formData.get("product-name") ?? "").trim();
  const fullName = String(formData.get("full-name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!productName || !fullName || !email) {
    return { error: "Please fill in all required fields." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "This form isn't connected yet. Please try again later." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("product_enquiries").insert({
    product_id: productId || null,
    product_name: productName,
    full_name: fullName,
    email,
    phone,
    message,
  });

  if (error) {
    return { error: "Something went wrong submitting your enquiry. Please try again." };
  }

  return { success: true };
}
