import type { Metadata } from "next";
import { blog, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(blog.meta, "/blog");

export default function Page() {
  return (
    <PagePlaceholder
      badge={blog.hero?.badge}
      title={blog.hero?.title}
      subtitle={blog.hero?.subtitle}
    />
  );
}
