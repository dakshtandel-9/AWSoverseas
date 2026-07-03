import type { Metadata } from "next";
import { shipmentTracking, metaFrom } from "@/lib/content";
import { TrackingHero } from "@/components/tracking/tracking-hero";
import { TrackingResult } from "@/components/tracking/tracking-result";
import { TrackingAppCta } from "@/components/tracking/tracking-app-cta";

export const metadata: Metadata = metaFrom(shipmentTracking.meta, "/tracking");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <>
      <TrackingHero
        data={shipmentTracking.hero}
        form={shipmentTracking.trackingForm}
        button={shipmentTracking.trackButton}
      />
      {ref && <TrackingResult reference={ref} />}
      <TrackingAppCta data={shipmentTracking.appCTA} />
    </>
  );
}
