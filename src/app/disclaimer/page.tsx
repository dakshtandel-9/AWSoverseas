import type { Metadata } from "next";
import { disclaimer, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(disclaimer.meta, "/disclaimer");

export default function Page() {
  return (
    <PagePlaceholder
      badge={disclaimer.hero?.badge}
      title={disclaimer.hero?.title}
      subtitle={disclaimer.hero?.subtitle}
    />
  );
}
