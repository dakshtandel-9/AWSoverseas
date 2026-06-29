import type { Metadata } from "next";
import { termsConditions, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(termsConditions.meta, "/terms");

export default function Page() {
  return (
    <PagePlaceholder
      badge={termsConditions.hero?.badge}
      title={termsConditions.hero?.title}
      subtitle={termsConditions.hero?.subtitle}
    />
  );
}
