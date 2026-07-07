import Link from "next/link";
import { PackageSearch, ArrowRight, MapPin } from "lucide-react";
import { Section } from "@/components/ui/section";
import { findShipmentByTrackingNumber, SHIPMENT_STAGES } from "@/lib/tracking";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function NotFound({ reference }: { reference: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-[#e4e9f2] bg-white p-8 text-center shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
      <span className="grid size-12 place-items-center rounded-full bg-[#eef3fb] text-[#033e8d]">
        <PackageSearch className="size-6" />
      </span>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Tracking Number</p>
        <p className="mt-1 font-mono text-lg font-bold text-[#06234d]">{reference}</p>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-[#5b6b82]">
        We couldn't find a shipment with that tracking number. Double-check it against your quote
        confirmation, or reach our team directly.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3fb] px-5 py-2.5 text-sm font-semibold text-[#033e8d] transition-colors hover:bg-[#e2ebf9]"
      >
        Contact Support
      </Link>
    </div>
  );
}

export async function TrackingResult({ reference }: { reference: string }) {
  const shipment = await findShipmentByTrackingNumber(reference);

  if (!shipment) {
    return (
      <Section id="tracking-result" spacing="sm" className="scroll-mt-24">
        <NotFound reference={reference} />
      </Section>
    );
  }

  const currentIndex = SHIPMENT_STAGES.findIndex((s) => s.value === shipment.shipment_status);

  return (
    <Section id="tracking-result" spacing="sm" className="scroll-mt-24">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#e4e9f2] bg-white p-8 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e9f2] pb-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Tracking Number</p>
            <p className="mt-1 font-mono text-lg font-bold text-[#06234d]">{shipment.tracking_number}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#94a3b8]">Route</p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#06234d]">
              <MapPin className="size-3.5 text-[#0489c2]" />
              {shipment.origin_country} → {shipment.destination_country}
            </p>
          </div>
        </div>

        <ol className="mt-6 flex flex-col gap-5">
          {SHIPMENT_STAGES.map((stage, i) => {
            const done = i <= currentIndex;
            const milestone = shipment.milestones.filter((m) => m.status === stage.value).at(-1);
            const StageIcon = stage.icon;
            return (
              <li key={stage.value} className="flex items-start gap-3.5">
                <span
                  className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${
                    done ? "bg-[#033e8d] text-white" : "bg-[#eef3fb] text-[#94a3b8]"
                  }`}
                >
                  <StageIcon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${done ? "text-[#06234d]" : "text-[#94a3b8]"}`}>
                    {stage.label}
                    {i === currentIndex && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        Live
                      </span>
                    )}
                  </p>
                  {milestone && (
                    <p className="mt-0.5 text-xs text-[#5b6b82]">
                      {[milestone.location, milestone.note].filter(Boolean).join(" — ") || undefined}
                      {milestone.location || milestone.note ? " · " : ""}
                      {formatDate(milestone.created_at)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 border-t border-[#e4e9f2] pt-6">
          <Link
            href="/mobile-app"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#033e8d] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#052f69]"
          >
            Open in App <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3fb] px-5 py-2.5 text-sm font-semibold text-[#033e8d] transition-colors hover:bg-[#e2ebf9]"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </Section>
  );
}
