import type { Metadata } from "next";
import { industries, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(industries.meta, "/industries");

export default function Page() {
  return (
    <PagePlaceholder
      badge={industries.hero?.badge}
      title={industries.hero?.title}
      subtitle={industries.hero?.subtitle}
    />
  );
}
