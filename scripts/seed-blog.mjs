#!/usr/bin/env node
/**
 * One-off migration: seeds blog_posts in Supabase from the existing static
 * Content/blog.json + Content/singleBlog.json. Run once after the schema is
 * applied: `node --env-file=.env scripts/seed-blog.mjs`
 *
 * The 1 full article (singleBlog.json) seeds with real sections/TOC/tags.
 * The 6 teaser posts (blog.json's featuredArticle + blogGrid.posts) seed
 * published with only title/category/excerpt/image — no fabricated body.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "..", "Content");

function readJson(name) {
  return JSON.parse(readFileSync(path.join(contentDir, name), "utf-8"));
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (e.g. run with --env-file=.env).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const blog = readJson("blog.json");
const singleBlog = readJson("singleBlog.json");

const fullArticleSlug = slugify(singleBlog.banner.title);

const teaserPosts = [
  ...(blog.featuredArticle ? [{ ...blog.featuredArticle, isFeatured: true }] : []),
  ...(blog.blogGrid?.posts ?? []),
];

const rows = teaserPosts.map((post) => {
  const slug = slugify(post.title);
  const isFullArticle = slug === fullArticleSlug;

  return {
    slug,
    title: post.title,
    category: post.category ?? "",
    excerpt: post.excerpt ?? "",
    read_time: post.readTime ?? "",
    image_url: post.image ?? "",
    author_name: singleBlog.banner?.author?.name ?? "AWSoversea Team",
    table_of_contents: isFullArticle ? singleBlog.article.tableOfContents : [],
    sections: isFullArticle ? singleBlog.article.sections : [],
    tags: isFullArticle ? singleBlog.article.tags : [],
    is_featured: Boolean(post.isFeatured),
    published: true,
  };
});

const { data, error } = await db.from("blog_posts").upsert(rows, { onConflict: "slug" }).select("slug");

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${data.length} post(s):`);
for (const row of data) console.log(`  - ${row.slug}`);
