import type { Metadata } from "next";
import { services, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(services.meta, "/services");

export default function Page() {
  return (
    <PagePlaceholder
      badge={services.hero?.badge}
      title={services.hero?.title}
      subtitle={services.hero?.subtitle}
    />
  );
}
