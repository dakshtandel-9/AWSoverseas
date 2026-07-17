import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { BlogPostForm, type BlogPostRecord } from "@/components/admin/blog-post-form";

export default async function AdminEditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabaseAdmin().from("blog_posts").select("*").eq("id", id).single();

  if (!data) notFound();

  const post: BlogPostRecord = {
    id: data.id,
    slug: data.slug,
    title: data.title,
    category: data.category,
    excerpt: data.excerpt,
    read_time: data.read_time,
    image_url: data.image_url,
    author_name: data.author_name,
    table_of_contents: data.table_of_contents ?? [],
    sections: data.sections ?? [],
    tags: data.tags ?? [],
    is_featured: data.is_featured,
    published: data.published,
  };

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Content</p>
      <h1 className="mt-2 text-2xl font-bold text-[#01214a] sm:text-3xl">Edit blog post</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
