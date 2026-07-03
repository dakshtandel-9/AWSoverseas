import type { Metadata } from "next";
import { blog, singleBlog, metaFrom } from "@/lib/content";
import { slugify } from "@/lib/cn";
import { ArticleBanner } from "@/components/blog/article-banner";
import { ArticleBody } from "@/components/blog/article-body";
import { RelatedPosts } from "@/components/blog/related-posts";
import { ArticleCta } from "@/components/blog/article-cta";

type Post = { title: string; category?: string; readTime?: string; excerpt?: string };

const posts: Post[] = [
  ...(blog.featuredArticle ? [blog.featuredArticle as Post] : []),
  ...((blog.blogGrid?.posts ?? []) as Post[]),
];

const FULL_ARTICLE_SLUG = slugify(singleBlog.banner?.title ?? "");

export function generateStaticParams() {
  return posts.map((p) => ({ slug: slugify(p.title) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => slugify(p.title) === slug);
  return metaFrom(
    {
      title: post?.title ?? singleBlog.meta?.title,
      description: post?.excerpt ?? singleBlog.meta?.description,
    },
    `/blog/${slug}`,
  );
}

/**
 * singleBlog.json only ships a full article body (sections/TOC/tags/share)
 * for ONE post — "How to Choose the Right International Shipping Method".
 * The other 6 slugs (from blog.json's featured + grid posts) render an
 * honest banner-only page with that post's real title/category/excerpt
 * instead of fabricating section content that doesn't exist in the JSON.
 */
export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => slugify(p.title) === slug);
  const hasFullArticle = slug === FULL_ARTICLE_SLUG;

  const banner = hasFullArticle
    ? singleBlog.banner
    : {
        category: post?.category ?? "Article",
        title: post?.title ?? singleBlog.banner.title,
        excerpt:
          post?.excerpt ??
          "This article is being prepared. In the meantime, explore our other logistics guides below.",
        author: singleBlog.banner.author,
        publishDate: "Coming Soon",
        readTime: post?.readTime ?? "—",
      };

  return (
    <>
      <ArticleBanner data={banner} />
      {hasFullArticle && <ArticleBody data={singleBlog.article} />}
      <RelatedPosts data={singleBlog.relatedPosts} />
      <ArticleCta data={singleBlog.cta} />
    </>
  );
}
