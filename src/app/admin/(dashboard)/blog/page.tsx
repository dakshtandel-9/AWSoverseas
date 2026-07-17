import Link from "next/link";
import { Plus } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { SetupNotice } from "@/components/admin/setup-notice";
import { BlogListTable } from "@/components/admin/blog-list-table";

export default async function AdminBlogPage() {
  const configured = isSupabaseConfigured();
  const posts = configured
    ? (
        await supabaseAdmin()
          .from("blog_posts")
          .select("id, slug, title, category, published, is_featured, created_at")
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Content</p>
          <h1 className="mt-2 text-2xl font-bold text-[#01214a] sm:text-3xl">Blog posts</h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#01214a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#011938]"
        >
          <Plus className="size-4" />
          New post
        </Link>
      </div>

      {!configured && (
        <div className="mt-6">
          <SetupNotice />
        </div>
      )}

      <div className="mt-8">
        <BlogListTable posts={posts} />
      </div>
    </div>
  );
}
