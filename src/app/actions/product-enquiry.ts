"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { getAccount } from "@/lib/account";
import { uploadEnquiryAttachment } from "@/lib/cloudinary";

export type RequestType = "enquiry" | "order";

export type EnquiryFormState = { success?: boolean; error?: string };

export async function submitProductEnquiryAction(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const requestType: RequestType =
    String(formData.get("request-type") ?? "enquiry") === "order" ? "order" : "enquiry";

  // Orders require a signed-in, approved account; open enquiries don't. The
  // modal already gates on the client, but never trust it.
  const account = await getAccount();
  if (requestType === "order") {
    if (!account) {
      return { error: "Please sign in to place an order." };
    }
    if (account.profile.status !== "approved") {
      return { error: "Your account is still being verified — orders unlock once it's approved." };
    }
  }

  const productId = String(formData.get("product-id") ?? "").trim();
  const productName = String(formData.get("product-name") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const attachment = formData.get("attachment");

  if (!productName || !name || !email || !phone) {
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
  const { error } = await db.from("product_enquiries").insert({
    request_type: requestType,
    product_id: productId || null,
    product_name: productName,
    first_name: name,
    last_name: "",
    full_name: name,
    email,
    phone,
    message,
    attachment_url: attachmentUrl,
    user_id: account?.user.id ?? null,
  });

  if (error) {
    return {
      error:
        requestType === "order"
          ? "Something went wrong placing your order. Please try again."
          : "Something went wrong submitting your enquiry. Please try again.",
    };
  }

  return { success: true };
}
