import type { Metadata } from "next";
import { sustainability, metaFrom } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";
import { SustainabilityHero } from "@/components/sustainability/sustainability-hero";
import { WhyWeGiveBack } from "@/components/sustainability/why-we-give-back";
import { Pillars } from "@/components/sustainability/pillars";
import { GivingProcess } from "@/components/sustainability/giving-process";
import { Transparency } from "@/components/sustainability/transparency";
import { SustainabilityCta } from "@/components/sustainability/sustainability-cta";

export const metadata: Metadata = metaFrom(sustainability.meta, "/sustainability");

const SUSTAINABILITY_JSONLD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: sustainability.meta?.title,
  description: sustainability.meta?.description,
  url: absoluteUrl("/sustainability"),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SUSTAINABILITY_JSONLD) }}
      />

      <SustainabilityHero data={sustainability.hero} />
      <WhyWeGiveBack data={sustainability.commitment} />
      <Pillars data={sustainability.pillars} />
      <GivingProcess data={sustainability.process} />
      <Transparency data={sustainability.transparency} />
      <SustainabilityCta data={sustainability.cta} />
    </>
  );
}
