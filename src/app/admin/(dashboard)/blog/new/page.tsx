import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function AdminNewBlogPostPage() {
  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Content</p>
      <h1 className="mt-2 text-2xl font-bold text-[#06234d] sm:text-3xl">New blog post</h1>
      <BlogPostForm />
    </div>
  );
}
