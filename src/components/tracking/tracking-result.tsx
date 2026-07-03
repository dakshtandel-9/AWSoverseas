import Link from "next/link";
import { PackageSearch, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";

/**
 * No backend exists to look up a real shipment (per project convention —
 * forms validate/show success states only), so a submitted tracking number
 * gets an honest acknowledgment instead of fabricated live status, with a
 * path to the app (real tracking) or a human (Contact).
 */
export function TrackingResult({ reference }: { reference: string }) {
  return (
    <Section spacing="sm">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-[#e4e9f2] bg-white p-8 text-center shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
        <span className="grid size-12 place-items-center rounded-full bg-[#eef3fb] text-[#033e8d]">
          <PackageSearch className="size-6" />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
            Tracking Number
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-[#06234d]">{reference}</p>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-[#5b6b82]">
          For live status on this shipment, open it in the AWSoversea app or reach our team directly
          — both routes below get you the current details.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
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
