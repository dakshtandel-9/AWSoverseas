import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { slugify } from "@/lib/cn";
import { iconFor } from "@/lib/icons";

export type Post = {
  title: string;
  category: string;
  readTime: string;
  image?: string;
  excerpt?: string;
};

/** Reusable article card with a generated gradient cover (no real images). */
export function BlogCard({ post, featured }: { post: Post; featured?: boolean }) {
  const Icon = iconFor(post.category);
  return (
    <Link
      href={`/blog/${slugify(post.title)}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-line transition-shadow hover:shadow-lift"
    >
      <div
        className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[16/10]"} bg-gradient-to-br from-brand-700 to-brand-950`}
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <Icon className="absolute right-5 top-5 size-12 text-white/25" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className={`font-bold text-ink ${featured ? "text-2xl" : "text-lg"} group-hover:text-brand-700`}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> {post.readTime}
          </span>
          <ArrowUpRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
