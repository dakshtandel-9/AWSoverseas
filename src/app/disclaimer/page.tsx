import type { Metadata } from "next";
import { disclaimer, metaFrom } from "@/lib/content";
import { LegalHero } from "@/components/legal/legal-hero";
import { LegalDocument } from "@/components/legal/legal-document";
import { LegalCta } from "@/components/legal/legal-cta";

export const metadata: Metadata = metaFrom(disclaimer.meta, "/disclaimer");

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: disclaimer.meta?.title,
  description: disclaimer.meta?.description,
  url: "https://awsoverseas.com/disclaimer",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <LegalHero data={disclaimer.hero} lastUpdated={disclaimer.lastUpdated} />
      <LegalDocument sections={disclaimer.sections} />
      <LegalCta />
    </>
  );
}
