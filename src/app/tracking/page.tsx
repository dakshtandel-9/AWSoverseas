import type { Metadata } from "next";
import { shipmentTracking, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(shipmentTracking.meta, "/tracking");

export default function Page() {
  return (
    <PagePlaceholder
      badge={shipmentTracking.hero?.badge}
      title={shipmentTracking.hero?.title}
      subtitle={shipmentTracking.hero?.subtitle}
    />
  );
}
