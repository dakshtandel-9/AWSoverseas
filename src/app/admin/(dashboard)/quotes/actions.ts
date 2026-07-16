"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { creditReferrerForSource } from "@/lib/wallet";
import { createTrackingNumber, type ShipmentStatus } from "@/lib/tracking";

export type CreateQuoteState = { success?: boolean; error?: string; trackingNumber?: string };

/**
 * Admin creates a quote request on behalf of a specific customer. Contact
 * details are snapshotted from the user's profile (like a self-submitted
 * quote), a tracking number is generated, and it shows up in that user's
 * profile dashboard (queried by user_id).
 */
export async function createQuoteForUserAction(
  _prevState: CreateQuoteState,
  formData: FormData,
): Promise<CreateQuoteState> {
  const userId = String(formData.get("user-id") ?? "").trim();
  const serviceType = String(formData.get("service-type") ?? "").trim();
  const shipmentType = String(formData.get("shipment-type") ?? "").trim();
  const originCountry = String(formData.get("origin-country") ?? "").trim();
  const destinationCountry = String(formData.get("destination-country") ?? "").trim();
  const estimatedDate = String(formData.get("estimated-date") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!userId) return { error: "Pick a customer to create this quote for." };
  if (!serviceType || !shipmentType || !originCountry || !destinationCountry) {
    return { error: "Fill in service type, shipment type, and both countries." };
  }

  const db = supabaseAdmin();

  const { data: profile } = await db
    .from("user_profiles")
    .select("first_name, last_name, email, phone, company_name")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return { error: "That customer no longer exists." };

  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  const trackingNumber = await createTrackingNumber();

  // Mirror the promoted columns into `raw` too, matching a self-submitted quote.
  const raw: Record<string, string> = {
    "service-type": serviceType,
    "shipment-type": shipmentType,
    "origin-country": originCountry,
    "destination-country": destinationCountry,
    "full-name": fullName,
    "company-name": profile.company_name ?? "",
    "email-address": profile.email,
    "phone-number": profile.phone,
  };
  if (estimatedDate) raw["estimated-shipment-date"] = estimatedDate;
  if (description) raw["cargo-description"] = description;

  const { error } = await db.from("quote_submissions").insert({
    service_type: serviceType,
    shipment_type: shipmentType,
    origin_country: originCountry,
    destination_country: destinationCountry,
    full_name: fullName,
    company_name: profile.company_name ?? "",
    email: profile.email,
    phone: profile.phone,
    raw,
    user_id: userId,
    tracking_number: trackingNumber,
    // Admin-created, so it's already "seen".
    is_read: true,
  });

  if (error) {
    return { error: "Something went wrong creating the quote. Please try again." };
  }

  revalidatePath("/admin/quotes");
  revalidatePath("/profile");
  return { success: true, trackingNumber };
}

export async function markQuoteReadAction(id: string, isRead: boolean) {
  const db = supabaseAdmin();
  await db.from("quote_submissions").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin/quotes");
}

export async function deleteQuoteAction(id: string) {
  const db = supabaseAdmin();
  await db.from("quote_submissions").delete().eq("id", id);
  revalidatePath("/admin/quotes");
}

/** Advances a shipment's stage and records the milestone that drives it. */
export async function addShipmentMilestoneAction(
  quoteId: string,
  status: ShipmentStatus,
  location: string,
  note: string,
) {
  const db = supabaseAdmin();
  await db.from("shipment_milestones").insert({ quote_id: quoteId, status, location, note });
  await db.from("quote_submissions").update({ shipment_status: status }).eq("id", quoteId);
  revalidatePath("/admin/quotes");
}

/** Grants the referrer of this quote's submitter a wallet credit. */
export async function creditQuoteReferrerAction(quoteId: string, amount: number, reason: string) {
  const result = await creditReferrerForSource("quote", quoteId, amount, reason);
  revalidatePath("/admin/quotes");
  return result;
}
