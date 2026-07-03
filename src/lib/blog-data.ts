import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  read_time: string;
  image_url: string;
  author_name: string;
  table_of_contents: string[];
  sections: { heading: string; content: string }[];
  tags: string[];
  is_featured: boolean;
  published: boolean;
  published_at: string;
};

const getCachedPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const db = supabasePublic();
    const { data } = await db
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return data ?? [];
  },
  ["blog-posts"],
  { tags: ["blog-posts"] },
);

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    return await getCachedPosts();
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function formatPublishDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}
