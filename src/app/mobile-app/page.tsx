import type { Metadata } from "next";
import { mobileApp, metaFrom } from "@/lib/content";
import { AppHero } from "@/components/mobile-app/app-hero";
import { AppShowcase } from "@/components/mobile-app/app-showcase";
import { ReferEarn } from "@/components/mobile-app/refer-earn";
import { DownloadBand } from "@/components/mobile-app/download-band";
import { AppFaq } from "@/components/mobile-app/app-faq";

export const metadata: Metadata = metaFrom(mobileApp.meta, "/mobile-app");

const APP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "AWSoversea",
  operatingSystem: "Android, iOS",
  applicationCategory: "BusinessApplication",
  description: mobileApp.meta?.description,
  offers: { "@type": "Offer", price: "0" },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_JSONLD) }}
      />

      <AppHero data={mobileApp.hero} />
      <AppShowcase
        tracking={mobileApp.shipmentTracking}
        booking={mobileApp.bookShipment}
        documents={mobileApp.uploadDocuments}
        payments={mobileApp.payments}
        notifications={mobileApp.notifications}
        referrals={mobileApp.referEarn}
      />
      <ReferEarn data={mobileApp.referEarn} />
      <DownloadBand data={mobileApp.download} />
      <AppFaq data={mobileApp.faq} />
    </>
  );
}
