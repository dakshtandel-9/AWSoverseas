"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import {
  markEnquiryReadAction,
  deleteEnquiryAction,
  setEnquiryQuoteAction,
  rejectEnquiryAction,
  resetEnquiryStatusAction,
  creditEnquiryReferrerAction,
} from "@/app/admin/(dashboard)/enquiries/actions";
import { SubmissionRow } from "@/components/admin/submission-row";
import { CreditWalletForm, ReferralCreditBadge } from "@/components/admin/credit-wallet-form";
import { ViewProfileButton, type AdminUserProfile } from "@/components/admin/user-profile-modal";

export type AdminOrder = {
  id: string;
  product_name: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  quoted_price: number | null;
  quoted_quantity: string;
  quoted_weight_kg: number | null;
  delivery_date: string | null;
  quote_status: string;
  rejection_reason: string;
};

// Kept as a local alias so the many `item: Enquiry` annotations below read fine.
type Enquiry = AdminOrder;

const STATUS_BADGE: Record<string, string> = {
  awaiting_quote: "bg-[#eef3fb] text-[#002144]",
  quoted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  awaiting_quote: "Awaiting review",
  quoted: "Approved & quoted",
  rejected: "Rejected",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const fieldClasses =
  "w-full rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#002144] placeholder:text-[#94a3b8]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">{label}</span>
      {children}
    </label>
  );
}

function QuoteForm({ item }: { item: Enquiry }) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const price = Number(form.get("price"));
    const quantity = String(form.get("quantity") ?? "").trim();
    const weightRaw = String(form.get("weight") ?? "").trim();
    const weightKg = weightRaw ? Number(weightRaw) : null;
    const deliveryDate = String(form.get("delivery-date") ?? "");
    if (!price || price <= 0) return;
    startTransition(() => setEnquiryQuoteAction(item.id, price, quantity, weightKg, deliveryDate));
  }

  return (
    <div>
      <p className="text-sm font-semibold text-[#002144]">
        {item.quote_status === "quoted" ? "Update quote" : "Approve & send a quote"}
      </p>
      <form ref={formRef} onSubmit={onSubmit} className="mt-3 flex flex-wrap items-end gap-2.5">
        <div className="w-32">
          <Field label="Price ($)">
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="50000"
              defaultValue={item.quoted_price ?? ""}
              className={fieldClasses}
            />
          </Field>
        </div>
        <div className="w-28">
          <Field label="Quantity">
            <input name="quantity" placeholder="1000" defaultValue={item.quoted_quantity} className={fieldClasses} />
          </Field>
        </div>
        <div className="w-28">
          <Field label="Weight (kg)">
            <input
              name="weight"
              type="number"
              min="0"
              step="0.01"
              placeholder="500"
              defaultValue={item.quoted_weight_kg ?? ""}
              className={fieldClasses}
            />
          </Field>
        </div>
        <div>
          <Field label="Delivery date">
            <input
              name="delivery-date"
              type="date"
              defaultValue={item.delivery_date ?? ""}
              className={fieldClasses}
            />
          </Field>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg btn-navy px-3.5 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50"
        >
          {item.quote_status === "quoted" ? "Update quote" : "Approve & send"}
        </button>
      </form>
    </div>
  );
}

function RejectForm({ item }: { item: Enquiry }) {
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");

  return (
    <div>
      <p className="text-sm font-semibold text-[#002144]">Reject this order</p>
      <div className="mt-3 flex flex-wrap items-end gap-2.5">
        <div className="min-w-[220px] flex-1">
          <Field label="Reason (optional)">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Out of stock, MOQ not met, etc."
              className={fieldClasses}
            />
          </Field>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => rejectEnquiryAction(item.id, reason))}
          className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          Reject order
        </button>
      </div>
    </div>
  );
}

function DecisionPanel({ item }: { item: Enquiry }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 border-t border-[#e4e9f2] pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[item.quote_status] ?? STATUS_BADGE.awaiting_quote}`}
        >
          {STATUS_LABEL[item.quote_status] ?? "Awaiting review"}
        </span>
        {item.quote_status !== "awaiting_quote" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => resetEnquiryStatusAction(item.id))}
            className="text-xs font-semibold text-[#5b6b82] underline-offset-2 hover:underline disabled:opacity-50"
          >
            Reset to awaiting review
          </button>
        )}
      </div>

      {item.quote_status === "quoted" && (
        <p className="mt-2 text-xs text-[#5b6b82]">
          Currently quoted: ${item.quoted_price?.toLocaleString("en-US")}
          {item.quoted_quantity && ` · Qty ${item.quoted_quantity}`}
          {item.quoted_weight_kg != null && ` · ${item.quoted_weight_kg} kg`}
          {item.delivery_date && ` · Delivery by ${formatDate(item.delivery_date)}`}
        </p>
      )}
      {item.quote_status === "rejected" && item.rejection_reason && (
        <p className="mt-2 text-xs text-[#5b6b82]">Reason: {item.rejection_reason}</p>
      )}

      <div className="mt-4 flex flex-col gap-5">
        <QuoteForm item={item} />
        <RejectForm item={item} />
      </div>
    </div>
  );
}

/**
 * The status badge + Approve-&-send / Reject / Reset quote controls plus the
 * referral credit form for one order. Shared by the admin Orders row and the
 * "create order" modal so both edit an order the same way.
 */
export function OrderDecisionSection({
  item,
  referrerName,
  alreadyCredited,
}: {
  item: Enquiry;
  referrerName: string | null;
  alreadyCredited: { amount: number; count: number } | null;
}) {
  return (
    <>
      <DecisionPanel item={item} />
      <CreditWalletForm
        referrerName={referrerName}
        alreadyCredited={alreadyCredited}
        onCredit={(amount, reason) => creditEnquiryReferrerAction(item.id, amount, reason)}
      />
    </>
  );
}

export function EnquiryRow({
  item,
  referrerName,
  alreadyCredited,
  profile,
}: {
  item: Enquiry;
  referrerName: string | null;
  alreadyCredited: { amount: number; count: number } | null;
  profile: AdminUserProfile | null;
}) {
  const createdAt = formatDate(item.created_at);

  return (
    <SubmissionRow
      title={item.full_name}
      subtitle={item.product_name}
      meta={item.phone}
      badge={<ReferralCreditBadge referrerName={referrerName} alreadyCredited={alreadyCredited} />}
      isRead={item.is_read}
      createdAt={createdAt}
      onToggleRead={() => markEnquiryReadAction(item.id, !item.is_read)}
      onDelete={() => deleteEnquiryAction(item.id)}
      detail={
        <div className="grid gap-2">
          {profile && (
            <div className="flex justify-end">
              <ViewProfileButton profile={profile} />
            </div>
          )}
          <p>
            <span className="font-semibold">Product:</span> {item.product_name}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{""}
            <a href={`mailto:${item.email}`} className="text-maroon-admin hover:underline">
              {item.email}
            </a>
          </p>
          {item.phone && (
            <p>
              <span className="font-semibold">Phone:</span>{""}
              <a href={`tel:${item.phone.replace(/\s+/g, "")}`} className="text-maroon-admin hover:underline">
                {item.phone}
              </a>
            </p>
          )}
          {item.message && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#002144]">Message:</p>
              <p className="mt-1 whitespace-pre-wrap text-[#5b6b82]">{item.message}</p>
            </div>
          )}
          {item.attachment_url && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold text-[#002144]">Attachment:</p>
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
          <OrderDecisionSection
            item={item}
            referrerName={referrerName}
            alreadyCredited={alreadyCredited}
          />
        </div>
      }
    />
  );
}
