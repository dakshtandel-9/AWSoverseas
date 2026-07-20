"use client";

import Image from "next/image";
import { markEnquiryReadAction, deleteEnquiryAction } from "@/app/admin/(dashboard)/enquiries/actions";
import { SubmissionRow } from "@/components/admin/submission-row";

type EnquiryLead = {
  id: string;
  product_name: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Open product enquiry — a lead (possibly from a guest with no account), so
 * there's no pricing/approval flow, just contact details to follow up on.
 */
export function EnquiryLeadRow({ item }: { item: EnquiryLead }) {
  return (
    <SubmissionRow
      title={item.full_name || "—"}
      subtitle={item.product_name}
      meta={item.phone}
      isRead={item.is_read}
      createdAt={formatDate(item.created_at)}
      onToggleRead={() => markEnquiryReadAction(item.id, !item.is_read)}
      onDelete={() => deleteEnquiryAction(item.id)}
      detail={
        <div className="grid gap-2">
          <p>
            <span className="font-semibold">Product:</span> {item.product_name}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a href={`mailto:${item.email}`} className="text-[#8e1b2e] hover:underline">
              {item.email}
            </a>
          </p>
          {item.phone && (
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              <a href={`tel:${item.phone.replace(/\s+/g, "")}`} className="text-[#8e1b2e] hover:underline">
                {item.phone}
              </a>
            </p>
          )}
          {item.message && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#01214a]">Message:</p>
              <p className="mt-1 whitespace-pre-wrap text-[#5b6b82]">{item.message}</p>
            </div>
          )}
          {item.attachment_url && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#01214a]">Attachment:</p>
              <a
                href={item.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block"
              >
                <Image
                  src={item.attachment_url}
                  alt="Enquiry attachment"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-lg border border-[#e4e9f2] object-cover"
                />
              </a>
            </div>
          )}
        </div>
      }
    />
  );
}
