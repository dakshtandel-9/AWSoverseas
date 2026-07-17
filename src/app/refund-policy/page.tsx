import type { Metadata } from "next";
import { refundPolicy, metaFrom } from "@/lib/content";
import { LegalHero } from "@/components/legal/legal-hero";
import { LegalDocument } from "@/components/legal/legal-document";
import { LegalCta } from "@/components/legal/legal-cta";

export const metadata: Metadata = metaFrom(refundPolicy.meta, "/refund-policy");

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: refundPolicy.meta?.title,
  description: refundPolicy.meta?.description,
  url: "https://awsoverseas.com/refund-policy",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <LegalHero data={refundPolicy.hero} lastUpdated={refundPolicy.lastUpdated} />
      <LegalDocument sections={refundPolicy.sections} />
      <LegalCta />
    </>
  );
}
