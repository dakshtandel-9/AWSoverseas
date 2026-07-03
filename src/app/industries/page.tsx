import type { Metadata } from "next";
import { industries, metaFrom } from "@/lib/content";
import { IndustriesHero } from "@/components/industries/industries-hero";
import { Overview } from "@/components/industries/overview";
import { IndustriesDirectory } from "@/components/industries/industries-directory";
import { IndustryProfiles } from "@/components/industries/industry-profiles";
import { IndustriesCta } from "@/components/industries/industries-cta";

export const metadata: Metadata = metaFrom(industries.meta, "/industries");

const PROFILES = [
  industries.manufacturing,
  industries.ecommerce,
  industries.pharmaceutical,
  industries.textile,
  industries.automotive,
].filter(Boolean);

const INDUSTRIES_JSONLD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: industries.meta?.title,
  description: industries.meta?.description,
  url: "https://awsoversea.com/industries",
  hasPart: industries.industriesGrid?.items?.map((item: { title: string }) => ({
    "@type": "Thing",
    name: item.title,
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(INDUSTRIES_JSONLD) }}
      />

      <IndustriesHero data={industries.hero} stats={industries.overview.stats} />
      <Overview data={industries.overview} />
      <IndustriesDirectory data={industries.industriesGrid} />
      <IndustryProfiles profiles={PROFILES} />
      <IndustriesCta data={industries.cta} />
    </>
  );
}
