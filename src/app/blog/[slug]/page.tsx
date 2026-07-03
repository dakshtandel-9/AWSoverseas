import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { singleBlog, metaFrom } from "@/lib/content";
import { getPublishedPosts, getPostBySlug, formatPublishDate } from "@/lib/blog-data";
import { ArticleBanner } from "@/components/blog/article-banner";
import { ArticleBody } from "@/components/blog/article-body";
import { RelatedPosts } from "@/components/blog/related-posts";
import { ArticleCta } from "@/components/blog/article-cta";

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return metaFrom(
    {
      title: post?.title ?? singleBlog.meta?.title,
      description: post?.excerpt ?? singleBlog.meta?.description,
    },
    `/blog/${slug}`,
  );
}

/**
 * Every post now has real stored slug/body content from Supabase — replaces
 * the old JSON-only page that special-cased the one post with a full article
 * (singleBlog.json) vs. six banner-only teasers.
 */
export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const posts = await getPublishedPosts();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const hasBody = post.sections.length > 0;

  const banner = {
    category: post.category || "Article",
    title: post.title,
    excerpt:
      post.excerpt ||
      "This article is being prepared. In the meantime, explore our other logistics guides below.",
    author: { name: post.author_name },
    publishDate: formatPublishDate(post.published_at),
    readTime: post.read_time || "—",
    imageUrl: post.image_url,
  };

  return (
    <>
      <ArticleBanner data={banner} />
      {hasBody && (
        <ArticleBody
          data={{
            tableOfContents: post.table_of_contents,
            sections: post.sections,
            tags: post.tags,
            share: singleBlog.article?.share ?? {
              title: "Share this article",
              platforms: ["Facebook", "LinkedIn", "X", "WhatsApp"],
            },
          }}
        />
      )}
      {related.length > 0 && (
        <RelatedPosts
          data={{
            title: singleBlog.relatedPosts?.title ?? "Related Articles",
            description: singleBlog.relatedPosts?.description ?? "",
            posts: related.map((p) => ({ slug: p.slug, title: p.title, category: p.category, imageUrl: p.image_url })),
          }}
        />
      )}
      <ArticleCta data={singleBlog.cta} />
    </>
  );
}
