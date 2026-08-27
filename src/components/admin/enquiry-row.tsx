"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { ShoppingBag } from "lucide-react";
import {
  markEnquiryReadAction,
  deleteEnquiryAction,
  moveEnquiryToOrderAction,
} from "@/app/admin/(dashboard)/orders/actions";
import { SubmissionRow } from "@/components/admin/submission-row";
import { ReplyByEmailButton } from "@/components/admin/reply-by-email-button";

type EnquiryLead = {
  id: string;
  product_id?: string | null;
  product_name: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  attachment_url?: string;
  requested_quantity?: string;
  is_read: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Two-step so a stray click can't move a lead — the confirm step names the
 * customer account the order will be attached to, since an enquiry can come
 * from a guest with no account at all.
 */
function MoveToOrderButton({ id, linkedCustomer }: { id: string; linkedCustomer: string | null }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#002144] px-3.5 py-1.5 text-xs font-semibold text-[#1A0A53] transition-colors hover:bg-[#eef3fb]"
      >
        <ShoppingBag className="size-3.5" />
        Move to Order
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-[#f6f8fc] px-3.5 py-2">
      <p className="text-xs text-[#5b6b82]">
        {linkedCustomer
          ? `Moves to Orders to be priced — ${linkedCustomer} will see it on their profile.`
          : "Moves to Orders to be priced. No customer account matches this email, so it stays admin-only."}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => moveEnquiryToOrderAction(id))}
          className="rounded-full btn-navy px-3.5 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50"
        >
          {pending ? "Moving…" : "Move to Order"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="text-xs font-semibold text-[#5b6b82] underline-offset-2 hover:underline disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Open product enquiry — a lead (possibly from a guest with no account), so
 * there's no pricing/approval flow here. The admin reviews it and either
 * follows up on the contact details or moves it over to Orders to price.
 */
export function EnquiryRow({
  item,
  linkedCustomer,
}: {
  item: EnquiryLead;
  linkedCustomer: string | null;
}) {
  return (
    <SubmissionRow
      title={item.full_name || "—"}
      subtitle={item.product_name}
      meta={item.phone || item.email}
      isRead={item.is_read}
      createdAt={formatDate(item.created_at)}
      onToggleRead={() => markEnquiryReadAction(item.id, !item.is_read)}
      onDelete={() => deleteEnquiryAction(item.id)}
      actions={
        <>
          <ReplyByEmailButton source="enquiry" id={item.id} email={item.email} />
          <MoveToOrderButton id={item.id} linkedCustomer={linkedCustomer} />
        </>
      }
      detail={
        <div className="grid gap-2">
          <p>
            <span className="font-semibold">Product:</span> {item.product_name}
            {!item.product_id && (
              <span className="ml-2 rounded-full bg-[#f8f1f2] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-maroon-admin">
                Not in catalog
              </span>
            )}
          </p>
          {item.requested_quantity && (
            <p>
              <span className="font-semibold">Quantity/quality:</span> {item.requested_quantity}
            </p>
          )}
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
          {item.message && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#1A0A53]">Message:</p>
              <p className="mt-1 whitespace-pre-wrap text-[#5b6b82]">{item.message}</p>
            </div>
          )}
          {item.attachment_url && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#1A0A53]">Attachment:</p>
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
