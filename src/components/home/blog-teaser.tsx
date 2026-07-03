import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { CategoryArt } from "@/components/blog/category-art";

export type Post = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  imageUrl?: string;
  excerpt?: string;
};

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
          <StaggerItem key={post.slug} className="h-full">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line transition-shadow hover:shadow-lift"
            >
              <CategoryArt category={post.category} imageUrl={post.imageUrl} className="aspect-[16/10]" />
              <div className="flex flex-1 flex-col p-6">
                <span className="w-fit rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                  {post.category}
                </span>
                <h3 className="mt-3 font-bold text-ink text-lg group-hover:text-brand-700">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                )}
                <div className="mt-auto flex items-center justify-between pt-5 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" /> {post.readTime}
                  </span>
                  <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
