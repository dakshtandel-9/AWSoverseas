"use client";

import { useRef, useTransition } from "react";
import { markEnquiryReadAction, deleteEnquiryAction, setEnquiryQuoteAction } from "@/app/admin/(dashboard)/enquiries/actions";
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
  quoted_price: number | null;
  quoted_quantity: string;
  quoted_weight_kg: number | null;
  delivery_date: string | null;
  quote_status: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const fieldClasses =
  "w-full rounded-lg border border-[#e4e9f2] px-2.5 py-1.5 text-xs text-[#06234d] placeholder:text-[#94a3b8]";

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
    <div className="mt-4 border-t border-[#e4e9f2] pt-4">
      <p className="text-sm font-semibold text-[#06234d]">
        {item.quote_status === "quoted" ? "Update quote" : "Send a quote"}
      </p>
      {item.quote_status === "quoted" && (
        <p className="mt-1 text-xs text-[#5b6b82]">
          Currently quoted: ₹{item.quoted_price?.toLocaleString("en-IN")}
          {item.quoted_quantity && ` · Qty ${item.quoted_quantity}`}
          {item.quoted_weight_kg != null && ` · ${item.quoted_weight_kg} kg`}
          {item.delivery_date && ` · Delivery by ${formatDate(item.delivery_date)}`}
        </p>
      )}
      <form ref={formRef} onSubmit={onSubmit} className="mt-3 flex flex-wrap items-end gap-2.5">
        <div className="w-32">
          <Field label="Price (₹)">
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
          className="rounded-lg bg-[#033e8d] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#052f69] disabled:opacity-50"
        >
          {item.quote_status === "quoted" ? "Update quote" : "Send quote"}
        </button>
      </form>
    </div>
  );
}

export function EnquiryRow({ item }: { item: Enquiry }) {
  const createdAt = formatDate(item.created_at);

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
          <QuoteForm item={item} />
        </div>
      }
    />
  );
}
