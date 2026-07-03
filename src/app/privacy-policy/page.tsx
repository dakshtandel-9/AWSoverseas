import type { Metadata } from "next";
import { privacyPolicy, metaFrom } from "@/lib/content";
import { LegalHero } from "@/components/legal/legal-hero";
import { LegalDocument } from "@/components/legal/legal-document";
import { LegalCta } from "@/components/legal/legal-cta";

export const metadata: Metadata = metaFrom(privacyPolicy.meta, "/privacy-policy");

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: privacyPolicy.meta?.title,
  description: privacyPolicy.meta?.description,
  url: "https://awsoversea.com/privacy-policy",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <LegalHero data={privacyPolicy.hero} lastUpdated={privacyPolicy.lastUpdated} />
      <LegalDocument sections={privacyPolicy.sections} />
      <LegalCta />
    </>
  );
}
