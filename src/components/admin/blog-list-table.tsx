"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Star, Pencil, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { deletePostAction, togglePublishAction } from "@/app/admin/(dashboard)/blog/actions";

type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  is_featured: boolean;
  created_at: string;
};

export function BlogListTable({ posts }: { posts: Post[] }) {
  const [pending, startTransition] = useTransition();

  if (posts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-10 text-center text-sm text-[#94a3b8]">
        No posts yet — create your first one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#e4e9f2] bg-white px-5 py-4"
        >
          {post.is_featured && <Star className="size-4 shrink-0 fill-[#0fade8] text-[#0fade8]" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#06234d]">{post.title}</p>
            <p className="truncate text-xs text-[#94a3b8]">
              /{post.slug} {post.category && `· ${post.category}`}
            </p>
          </div>

          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => togglePublishAction(post.id, post.slug, !post.published))}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
              post.published ? "bg-[#e8f9ff] text-[#0489c2]" : "bg-[#f6f8fc] text-[#94a3b8]",
            )}
          >
            {post.published ? "Published" : "Draft"}
          </button>

          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-[#f6f8fc]"
            aria-label="View on site"
          >
            <ExternalLink className="size-4" />
          </Link>
          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-[#f6f8fc]"
            aria-label="Edit"
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete "${post.title}"? This can't be undone.`)) {
                startTransition(() => deletePostAction(post.id, post.slug));
              }
            }}
            className="shrink-0 rounded-lg p-2 text-[#5b6b82] hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label="Delete"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
