import type { Metadata } from "next";
import { termsConditions, metaFrom } from "@/lib/content";
import { LegalHero } from "@/components/legal/legal-hero";
import { LegalDocument } from "@/components/legal/legal-document";
import { LegalCta } from "@/components/legal/legal-cta";

export const metadata: Metadata = metaFrom(termsConditions.meta, "/terms");

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: termsConditions.meta?.title,
  description: termsConditions.meta?.description,
  url: "https://awsoversea.com/terms",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <LegalHero data={termsConditions.hero} lastUpdated={termsConditions.lastUpdated} />
      <LegalDocument sections={termsConditions.sections} />
      <LegalCta />
    </>
  );
}
