import type { Metadata } from "next";
import { about, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(about.meta, "/about");

export default function Page() {
  return (
    <PagePlaceholder
      badge={about.hero?.badge}
      title={about.hero?.title}
      subtitle={about.hero?.subtitle}
    />
  );
}
