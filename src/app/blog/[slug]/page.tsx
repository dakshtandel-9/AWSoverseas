import type { Metadata } from "next";
import { blog, singleBlog, metaFrom } from "@/lib/content";
import { slugify } from "@/lib/cn";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

type Post = { title: string; category?: string; readTime?: string; excerpt?: string };

const posts: Post[] = [
  ...(blog.featuredArticle ? [blog.featuredArticle as Post] : []),
  ...((blog.blogGrid?.posts ?? []) as Post[]),
];

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

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => slugify(p.title) === slug);

  return (
    <PagePlaceholder
      badge={post?.category ?? "Article"}
      title={post?.title ?? singleBlog.banner?.title ?? "Article"}
      subtitle={post?.excerpt ?? singleBlog.article?.intro}
    />
  );
}
