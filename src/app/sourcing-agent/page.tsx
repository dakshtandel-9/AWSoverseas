import type { Metadata } from "next";
import { sourcingAgent, metaFrom } from "@/lib/content";
import { SourcingHero } from "@/components/sourcing-agent/sourcing-hero";
import { SourcingProcess } from "@/components/sourcing-agent/sourcing-process";
import { SourcingBenefits } from "@/components/sourcing-agent/sourcing-benefits";

export const metadata: Metadata = metaFrom(sourcingAgent.meta, "/sourcing-agent");

export default function Page() {
  return (
    <>
      <SourcingHero data={sourcingAgent.hero} />
      <SourcingProcess data={sourcingAgent.process} />
      <SourcingBenefits data={sourcingAgent.benefits} />
    </>
  );
}
