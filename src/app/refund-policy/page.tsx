import type { Metadata } from "next";
import { refundPolicy, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(refundPolicy.meta, "/refund-policy");

export default function Page() {
  return (
    <PagePlaceholder
      badge={refundPolicy.hero?.badge}
      title={refundPolicy.hero?.title}
      subtitle={refundPolicy.hero?.subtitle}
    />
  );
}
