import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryArt } from "./category-art";

type Post = { slug: string; title: string; category: string; imageUrl?: string };
type Data = { title: string; description: string; posts: Post[] };

export function RelatedPosts({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Keep Reading" title={data.title} subtitle={data.description} align="left" />
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {data.posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(4,22,47,0.22)]"
          >
            <CategoryArt category={post.category} imageUrl={post.imageUrl} className="h-36" />
            <div className="flex flex-1 flex-col p-5">
              <span className="w-fit rounded-full bg-[#eef3fb] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#033e8d]">
                {post.category}
              </span>
              <h3 className="mt-3 flex-1 text-sm font-bold leading-snug text-[#06234d] transition-colors group-hover:text-[#033e8d]">
                {post.title}
              </h3>
              <ArrowRight className="mt-4 size-4 self-end text-[#94a3b8] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#033e8d]" />
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
