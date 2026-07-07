"use client";

import { markEnquiryReadAction, deleteEnquiryAction } from "@/app/admin/(dashboard)/enquiries/actions";
import { SubmissionRow } from "@/components/admin/submission-row";

type Enquiry = {
  id: string;
  product_name: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function EnquiryRow({ item }: { item: Enquiry }) {
  const createdAt = new Date(item.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <SubmissionRow
      title={item.full_name}
      subtitle={item.product_name}
      meta={item.phone}
      isRead={item.is_read}
      createdAt={createdAt}
      onToggleRead={() => markEnquiryReadAction(item.id, !item.is_read)}
      onDelete={() => deleteEnquiryAction(item.id)}
      detail={
        <div className="grid gap-2">
          <p>
            <span className="font-semibold">Product:</span> {item.product_name}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a href={`mailto:${item.email}`} className="text-[#0489c2] hover:underline">
              {item.email}
            </a>
          </p>
          {item.phone && (
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              <a href={`tel:${item.phone.replace(/\s+/g, "")}`} className="text-[#0489c2] hover:underline">
                {item.phone}
              </a>
            </p>
          )}
          {item.message && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#06234d]">Message:</p>
              <p className="mt-1 whitespace-pre-wrap text-[#5b6b82]">{item.message}</p>
            </div>
          )}
        </div>
      }
    />
  );
}
