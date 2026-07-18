"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type NewsletterFormState = { success?: boolean; error?: string };

export async function subscribeNewsletterAction(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "This form isn't connected yet. Please try again later." };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("newsletter_subscribers").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { success: true };
    }
    return { error: "Something went wrong subscribing. Please try again." };
  }

  return { success: true };
}
