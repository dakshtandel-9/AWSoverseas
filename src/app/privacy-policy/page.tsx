import type { Metadata } from "next";
import { privacyPolicy, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(privacyPolicy.meta, "/privacy-policy");

export default function Page() {
  return (
    <PagePlaceholder
      badge={privacyPolicy.hero?.badge}
      title={privacyPolicy.hero?.title}
      subtitle={privacyPolicy.hero?.subtitle}
    />
  );
}
