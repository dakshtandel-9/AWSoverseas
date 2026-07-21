import "server-only";
import { BadgeCheck, CircleDot, ClipboardCheck, PackageCheck, PackageSearch, ShipWheel, type LucideIcon } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";

export type ShipmentStatus =
  | "verifying"
  | "pending"
  | "collected"
  | "customs_cleared"
  | "in_transit"
  | "delivered"
  | "rejected";

/** Linear pipeline shown as steps on the tracking page. "rejected" is a terminal
 * exception state handled separately, not a step in this sequence. */
export const SHIPMENT_STAGES: { value: ShipmentStatus; label: string; icon: LucideIcon }[] = [
  { value: "verifying", label: "Verifying", icon: ClipboardCheck },
  { value: "pending", label: "Pending pickup", icon: CircleDot },
  { value: "collected", label: "Collected", icon: PackageCheck },
  { value: "customs_cleared", label: "Customs cleared", icon: BadgeCheck },
  { value: "in_transit", label: "In transit", icon: ShipWheel },
  { value: "delivered", label: "Delivered", icon: PackageSearch },
];

/** Unambiguous alphabet (no 0/O, 1/I/L) so numbers survive being read aloud. */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateTrackingNumber(): string {
  let code = "";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  for (const b of bytes) code += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `AWO-${code.slice(0, 4)}-${code.slice(4)}`;
}

/** Reserve a fresh tracking number, retrying on the rare collision. */
export async function createTrackingNumber(): Promise<string> {
  const db = supabaseAdmin();
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateTrackingNumber();
    const { data } = await db
      .from("quote_submissions")
      .select("id")
      .eq("tracking_number", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  throw new Error("Could not generate a unique tracking number");
}

export type ShipmentMilestone = {
  id: string;
  status: ShipmentStatus;
  location: string;
  note: string;
  created_at: string;
};

export type ShipmentRecord = {
  tracking_number: string;
  shipment_status: ShipmentStatus;
  service_type: string;
  origin_country: string;
  destination_country: string;
  created_at: string;
  milestones: ShipmentMilestone[];
};

/** Public lookup by tracking number — no auth required, exact match only. */
export async function findShipmentByTrackingNumber(reference: string): Promise<ShipmentRecord | null> {
  const db = supabaseAdmin();
  const { data: quote } = await db
    .from("quote_submissions")
    .select("tracking_number, shipment_status, service_type, origin_country, destination_country, created_at, id")
    .eq("tracking_number", reference.trim().toUpperCase())
    .maybeSingle();

  if (!quote) return null;

  const { data: milestones } = await db
    .from("shipment_milestones")
    .select("id, status, location, note, created_at")
    .eq("quote_id", quote.id)
    .order("created_at", { ascending: true });

  return { ...quote, milestones: milestones ?? [] };
}
