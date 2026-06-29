import type { Metadata } from "next";
import { partnerWithUs, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(partnerWithUs.meta, "/partner");

export default function Page() {
  return (
    <PagePlaceholder
      badge={partnerWithUs.hero?.badge}
      title={partnerWithUs.hero?.title}
      subtitle={partnerWithUs.hero?.subtitle}
    />
  );
}
