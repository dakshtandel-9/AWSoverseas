import type { Metadata } from "next";
import { blog, metaFrom } from "@/lib/content";
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
  url: "https://awsoversea.com/blog",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_JSONLD) }}
      />

      <BlogHero data={blog.hero} />
      <FeaturedArticle data={blog.featuredArticle} />
      <BlogGrid
        data={blog.blogGrid}
        posts={blog.blogGrid.posts}
        categories={blog.categories.items}
      />
      <BlogNewsletter data={blog.newsletter} />
    </>
  );
}
