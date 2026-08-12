"use client";

import Image from "next/image";
import { markQuoteReadAction, deleteQuoteAction, creditQuoteReferrerAction } from "@/app/admin/(dashboard)/quotes/actions";
import { SubmissionRow } from "@/components/admin/submission-row";
import { ShipmentStatusPanel } from "@/components/admin/shipment-status-panel";
import { CreditWalletForm, ReferralCreditBadge } from "@/components/admin/credit-wallet-form";
import { ViewProfileButton, type AdminUserProfile } from "@/components/admin/user-profile-modal";

type Quote = {
  id: string;
  service_type: string;
  shipment_type: string;
  /** "export" (Indian state → foreign country) or "import" (the reverse). Older rows predate the column. */
  direction: string | null;
  origin_country: string;
  destination_country: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  raw: Record<string, string>;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  tracking_number: string | null;
  shipment_status: string;
};

type Milestone = { id: string; status: string; location: string; note: string; created_at: string };

// Keys already shown above the fold, so the raw payload doesn't repeat them.
// The whole route — both countries and the state on each side — is promoted
// into the detail body, so all four read together rather than split across the
// header subtitle and the raw list.
const PROMOTED_KEYS = new Set([
  "service-type",
  "shipment-type",
  "direction",
  "origin-country",
  "origin-state",
  "destination-country",
  "destination-state",
  "full-name",
  "company-name",
  "email-address",
  "phone-number",
]);

function toLabel(key: string) {
  return key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function QuoteRow({
  item,
  milestones,
  referrerName,
  alreadyCredited,
  profile,
}: {
  item: Quote;
  milestones: Milestone[];
  referrerName: string | null;
  alreadyCredited: { amount: number; count: number } | null;
  profile: AdminUserProfile | null;
}) {
  const createdAt = new Date(item.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const extraFields = Object.entries(item.raw ?? {}).filter(([key, value]) => !PROMOTED_KEYS.has(key) && value);

  return (
    <SubmissionRow
      title={item.full_name}
      subtitle={`${item.origin_country} → ${item.destination_country}`}
      meta={[item.direction === "import" ? "Import" : "Export", item.service_type]
        .filter(Boolean)
        .join(" · ")}
      badge={<ReferralCreditBadge referrerName={referrerName} alreadyCredited={alreadyCredited} />}
      isRead={item.is_read}
      createdAt={createdAt}
      onToggleRead={() => markQuoteReadAction(item.id, !item.is_read)}
      onDelete={() => deleteQuoteAction(item.id)}
      detail={
        <div className="grid gap-2">
          {profile && (
            <div className="flex justify-end">
              <ViewProfileButton profile={profile} />
            </div>
          )}
          {item.company_name && (
            <p>
              <span className="font-semibold">Company:</span> {item.company_name}
            </p>
          )}
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            <a href={`tel:${item.phone.replace(/\s+/g, "")}`} className="text-maroon-admin hover:underline">
              {item.phone}
            </a>
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <a href={`mailto:${item.email}`} className="text-maroon-admin hover:underline">
              {item.email}
            </a>
          </p>
          <p>
            <span className="font-semibold">Shipment type:</span> {item.shipment_type}
          </p>
          <p>
            <span className="font-semibold">Origin country:</span> {item.origin_country}
          </p>
          {/* A state only exists where the submitter's country had one to pick. */}
          {item.raw?.["origin-state"] && (
            <p>
              <span className="font-semibold">Origin state:</span> {item.raw["origin-state"]}
            </p>
          )}
          <p>
            <span className="font-semibold">Destination country:</span> {item.destination_country}
          </p>
          {item.raw?.["destination-state"] && (
            <p>
              <span className="font-semibold">Destination state:</span> {item.raw["destination-state"]}
            </p>
          )}
          {extraFields.length > 0 && (
            <div className="mt-2 grid gap-1.5 border-t border-[#e4e9f2] pt-3">
              {extraFields.map(([key, value]) => (
                <p key={key} className="text-[#5b6b82]">
                  <span className="font-semibold text-[#1A0A53]">{toLabel(key)}:</span> {value}
                </p>
              ))}
            </div>
          )}
          {item.attachment_url && (
            <div className="mt-2 border-t border-[#e4e9f2] pt-3">
              <p className="font-semibold">Shipment image:</p>
              <a href={item.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                <Image
                  src={item.attachment_url}
                  alt="Shipment"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-lg border border-[#e4e9f2] object-cover"
                />
              </a>
            </div>
          )}

          <ShipmentStatusPanel
            quoteId={item.id}
            trackingNumber={item.tracking_number}
            currentStatus={item.shipment_status}
            milestones={milestones}
          />

          <CreditWalletForm
            referrerName={referrerName}
            alreadyCredited={alreadyCredited}
            onCredit={(amount, reason) => creditQuoteReferrerAction(item.id, amount, reason)}
          />
        </div>
      }
    />
  );
}
