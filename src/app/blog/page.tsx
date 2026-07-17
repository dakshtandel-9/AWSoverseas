import type { Metadata } from "next";
import { blog, metaFrom } from "@/lib/content";
import { getPublishedPosts, formatPublishDate } from "@/lib/blog-data";
import { isSupabaseConfigured } from "@/lib/supabase/status";
import { BlogHero } from "@/components/blog/blog-hero";
import { FeaturedArticle } from "@/components/blog/featured-article";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogNewsletter } from "@/components/blog/blog-newsletter";

export const metadata: Metadata = metaFrom(blog.meta, "/blog");

const BLOG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: blog.meta?.title,
  description: blog.meta?.description,
  url: "https://awsoverseas.com/blog",
};

export default async function Page() {
  const posts = await getPublishedPosts();
  const featured = posts.find((p) => p.is_featured) ?? posts[0];
  const gridPosts = posts.filter((p) => p.slug !== featured?.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_JSONLD) }}
      />

      <BlogHero data={blog.hero} />

      {featured && (
        <FeaturedArticle
          data={{
            slug: featured.slug,
            title: featured.title,
            category: featured.category,
            readTime: featured.read_time,
            publishDate: formatPublishDate(featured.published_at),
            excerpt: featured.excerpt,
            button: blog.featuredArticle?.button ?? "Read Article",
            imageUrl: featured.image_url,
          }}
        />
      )}

      {!isSupabaseConfigured() && posts.length === 0 && (
        <p className="mx-auto max-w-2xl px-6 py-10 text-center text-sm text-[#94a3b8]">
          The blog isn&apos;t connected yet — set up Supabase and publish posts from the admin.
        </p>
      )}

      <BlogGrid
        data={blog.blogGrid}
        posts={gridPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          readTime: p.read_time,
          imageUrl: p.image_url,
        }))}
        categories={blog.categories.items}
      />
      <BlogNewsletter data={blog.newsletter} />
    </>
  );
}
