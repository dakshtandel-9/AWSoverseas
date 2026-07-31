"use client";

import {
  markWarehouseBookingReadAction,
  deleteWarehouseBookingAction,
} from "@/app/admin/(dashboard)/warehouse-bookings/actions";
import { SubmissionRow } from "@/components/admin/submission-row";

type WarehouseBooking = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  warehouse_type: string;
  notes: string;
  is_read: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** A warehouse booking request from the /quote page popup — a separate ask from shipment enquiries. */
export function WarehouseBookingRow({ item }: { item: WarehouseBooking }) {
  return (
    <SubmissionRow
      title={item.full_name || "—"}
      subtitle={item.warehouse_type}
      meta={item.phone || item.email}
      isRead={item.is_read}
      createdAt={formatDate(item.created_at)}
      onToggleRead={() => markWarehouseBookingReadAction(item.id, !item.is_read)}
      onDelete={() => deleteWarehouseBookingAction(item.id)}
      detail={
        <div className="grid gap-2">
          <p>
            <span className="font-semibold">Warehouse type:</span> {item.warehouse_type}
          </p>
          {item.email && (
            <p>
              <span className="font-semibold">Email:</span>{" "}
              <a href={`mailto:${item.email}`} className="text-maroon-admin hover:underline">
                {item.email}
              </a>
            </p>
          )}
          {item.phone && (
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              <a href={`tel:${item.phone.replace(/\s+/g, "")}`} className="text-maroon-admin hover:underline">
                {item.phone}
              </a>
            </p>
          )}
          {item.address && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#1A0A53]">Address:</p>
              <p className="mt-1 whitespace-pre-wrap text-[#5b6b82]">{item.address}</p>
            </div>
          )}
          {item.notes && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#1A0A53]">Additional details:</p>
              <p className="mt-1 whitespace-pre-wrap text-[#5b6b82]">{item.notes}</p>
            </div>
          )}
        </div>
      }
    />
  );
}
