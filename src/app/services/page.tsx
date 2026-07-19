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
 * Sourcing leads the schedule (line 01) since it happens before freight and
 * is an equal half of what AWSOverseas does, not an add-on at the end.
 */
const SCHEDULE = [
  // Sourcing happens before freight, and already has its own full page
  // (/sourcing-agent) — link there instead of forking the content into a
  // second /services/[slug] detail page.
  { ...services.sourcingAgent, href: "/sourcing-agent", code: "01" },
  { ...services.airFreight, href: "/services/air-freight", code: "02" },
  { ...services.seaFreight, href: "/services/sea-freight", code: "03" },
  { ...services.importServices, href: "/services/import-services", code: "04" },
  { ...services.exportServices, href: "/services/export-services", code: "05" },
  { ...services.warehousing, href: "/services/warehousing", code: "06" },
  { ...services.customsClearance, href: "/services/customs-clearance", code: "07" },
].filter((item) => item.title);

const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Product Sourcing & Freight Forwarding",
  provider: { "@type": "Organization", name: "AWSOverseas" },
  areaServed: "Worldwide",
  name: services.meta?.title,
  description: services.meta?.description,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Shipping Services",
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
