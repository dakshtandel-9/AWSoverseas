import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { BlogCard, type Post } from "@/components/blog/blog-card";

type Data = { title: string; description: string; button: string };

export function BlogTeaser({
  data,
  posts,
  eyebrow,
}: {
  data: Data;
  posts: Post[];
  eyebrow: string;
}) {
  return (
    <Section spacing="lg">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={eyebrow} title={data.title} subtitle={data.description} align="left" />
        <Link
          href="/blog"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:border-brand-400 hover:bg-brand-50"
        >
          {data.button} <ArrowRight className="size-4" />
        </Link>
      </div>

      <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <StaggerItem key={post.title} className="h-full">
            <BlogCard post={post} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
