import type { Metadata } from "next";
import { partnerWithUs, metaFrom } from "@/lib/content";
import { PartnerHero } from "@/components/partner/partner-hero";
import { PartnerBenefits } from "@/components/partner/partner-benefits";
import { PartnerRoster } from "@/components/partner/partner-roster";
import { PartnerProcess } from "@/components/partner/partner-process";
import { PartnerApplyForm } from "@/components/partner/partner-apply-form";
import { PartnerFaq } from "@/components/partner/partner-faq";

export const metadata: Metadata = metaFrom(partnerWithUs.meta, "/partner");

export default function Page() {
  return (
    <>
      <PartnerHero data={partnerWithUs.hero} />
      <PartnerBenefits data={partnerWithUs.benefits} />
      <PartnerRoster data={partnerWithUs.partnershipTypes} />
      <PartnerProcess data={partnerWithUs.process} />
      <PartnerApplyForm data={partnerWithUs.applyForm} />
      <PartnerFaq data={partnerWithUs.faq} />
    </>
  );
}
