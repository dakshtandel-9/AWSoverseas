import type { Metadata } from "next";
import { referralRewards, metaFrom } from "@/lib/content";
import { ReferralHero } from "@/components/referral/referral-hero";
import { ReferralHowItWorks } from "@/components/referral/referral-how-it-works";
import { ReferralRules } from "@/components/referral/referral-rules";
import { ReferralWithdrawal } from "@/components/referral/referral-withdrawal";
import { ReferralCta } from "@/components/referral/referral-cta";
import { ReferralFaq } from "@/components/referral/referral-faq";

export const metadata: Metadata = metaFrom(referralRewards.meta, "/referral-rewards");

export default function ReferralRewardsPage() {
  return (
    <>
      <ReferralHero data={referralRewards.hero} />
      <ReferralHowItWorks data={referralRewards.howItWorks} />
      <ReferralRules data={referralRewards.rules} />
      <ReferralWithdrawal data={referralRewards.withdrawal} />
      <ReferralCta data={referralRewards.cta} />
      <ReferralFaq data={referralRewards.faq} />
    </>
  );
}
