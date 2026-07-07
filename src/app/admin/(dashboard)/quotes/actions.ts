"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { ShipmentStatus } from "@/lib/tracking";

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
