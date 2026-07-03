import type { Metadata } from "next";
import { services, metaFrom } from "@/lib/content";
import { ServicesHero } from "@/components/services/services-hero";
import { CapabilityStrip } from "@/components/services/capability-strip";
import { ServicesSchedule } from "@/components/services/services-schedule";
import { ServicesCta } from "@/components/services/services-cta";

export const metadata: Metadata = metaFrom(services.meta, "/services");

/**
 * Maps each services.json block to its individualService.json slug (the
 * source of truth for /services/[slug]) — seaFreight rolls up FCL/LCL here,
 * so it links to the sea-freight detail page rather than a third card.
 */
const SCHEDULE = [
  { ...services.airFreight, slug: "air-freight", code: "01" },
  { ...services.seaFreight, slug: "sea-freight", code: "02" },
  { ...services.importServices, slug: "import-services", code: "03" },
  { ...services.exportServices, slug: "export-services", code: "04" },
  { ...services.warehousing, slug: "warehousing", code: "05" },
  { ...services.customsClearance, slug: "customs-clearance", code: "06" },
].filter((item) => item.title);

const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Freight Forwarding & Logistics",
  provider: { "@type": "Organization", name: "AWSoversea" },
  areaServed: "Worldwide",
  name: services.meta?.title,
  description: services.meta?.description,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Logistics Services",
    itemListElement: SCHEDULE.map((item) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: item.title, description: item.description },
    })),
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSONLD) }}
      />

      <ServicesHero data={services.hero} lineCount={SCHEDULE.length} />
      <CapabilityStrip data={services.overview} />
      <ServicesSchedule items={SCHEDULE} />
      <ServicesCta data={services.cta} />
    </>
  );
}
