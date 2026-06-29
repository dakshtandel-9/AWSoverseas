import type { Metadata } from "next";
import { faq, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(faq.meta, "/faq");

export default function Page() {
  return (
    <PagePlaceholder
      badge={faq.hero?.badge}
      title={faq.hero?.title}
      subtitle={faq.hero?.subtitle}
    />
  );
}
