"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryArt } from "./category-art";
import { cn } from "@/lib/cn";

type Post = { slug: string; title: string; category: string; readTime: string; imageUrl?: string };
type CategoryItem = { title: string; slug: string };
type Data = { title: string; description: string };

/**
 * Category chips are a real client-side filter over the 6 posts rather than
 * decorative labels or links to archive pages that don't exist — a working
 * feature costs little more than static pills and reads as more considered.
 */
export function BlogGrid({
  data,
  posts,
  categories,
}: {
  data: Data;
  posts: Post[];
  categories: CategoryItem[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const postCategories = useMemo(() => new Set(posts.map((p) => p.category)), [posts]);
  const visibleCategories = categories.filter((c) => postCategories.has(c.title));

  const filtered = active ? posts.filter((p) => p.category === active) : posts;

  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Directory" title={data.title} subtitle={data.description} align="left" />

      {/* Category filter chips */}
      <div className="mt-8 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            active === null
              ? "bg-[#01214a] text-white"
              : "bg-white text-[#5b6b82] ring-1 ring-[#e4e9f2] hover:bg-[#eef3fb]",
          )}
        >
          All Articles
        </button>
        {visibleCategories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActive(c.title)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              active === c.title
                ? "bg-[#01214a] text-white"
                : "bg-white text-[#5b6b82] ring-1 ring-[#e4e9f2] hover:bg-[#eef3fb]",
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        key={active ?? "all"}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {filtered.map((post) => (
          <motion.div
            key={post.slug}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(4,22,47,0.22)]"
            >
              <CategoryArt category={post.category} imageUrl={post.imageUrl} className="h-44" />
              <div className="flex flex-1 flex-col p-5">
                <span className="w-fit rounded-full bg-[#eef3fb] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#01214a]">
                  {post.category}
                </span>
                <h3 className="mt-3 flex-1 text-base font-bold leading-snug text-[#01214a] transition-colors group-hover:text-[#01214a]">
                  {post.title}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8]">
                    <Clock className="size-3.5" />
                    {post.readTime}
                  </span>
                  <ArrowRight className="size-4 text-[#94a3b8] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#01214a]" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-[#5b6b82]">
            No articles in this category yet — check back soon.
          </p>
        )}
      </motion.div>
    </Section>
  );
}
