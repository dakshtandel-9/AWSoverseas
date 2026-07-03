"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { uploadBlogImage } from "@/lib/cloudinary";

export type BlogFormState = { error?: string; success?: boolean };

export type ImageUploadState = { url?: string; error?: string };

export async function uploadImageAction(
  _prevState: ImageUploadState,
  formData: FormData,
): Promise<ImageUploadState> {
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "That file isn't an image." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { error: "Image is too large (max 8MB)." };
  }

  try {
    const url = await uploadBlogImage(file);
    return { url };
  } catch (err) {
    console.error("[uploadImageAction] Cloudinary upload failed:", err);
    return { error: "Upload failed. Please try again." };
  }
}

function readIndexedList(formData: FormData, prefix: string): string[] {
  const count = Number(formData.get(`${prefix}_count`) ?? 0);
  const values: string[] = [];
  for (let i = 0; i < count; i++) {
    const value = String(formData.get(`${prefix}_${i}`) ?? "").trim();
    if (value) values.push(value);
  }
  return values;
}

function readSections(formData: FormData): { heading: string; content: string }[] {
  const count = Number(formData.get("section_count") ?? 0);
  const sections: { heading: string; content: string }[] = [];
  for (let i = 0; i < count; i++) {
    const heading = String(formData.get(`section_heading_${i}`) ?? "").trim();
    const content = String(formData.get(`section_content_${i}`) ?? "").trim();
    if (heading || content) sections.push({ heading, content });
  }
  return sections;
}

function readPostFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    read_time: String(formData.get("read_time") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    author_name: String(formData.get("author_name") ?? "").trim() || "AWSoversea Team",
    table_of_contents: readIndexedList(formData, "table_of_contents"),
    sections: readSections(formData),
    tags: readIndexedList(formData, "tags"),
    is_featured: formData.get("is_featured") === "true",
    published: formData.get("published") === "true",
  };
}

function revalidateBlog(slug?: string) {
  updateTag("blog-posts");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

async function clearExistingFeatured(excludeId?: string) {
  const db = supabaseAdmin();
  let query = db.from("blog_posts").update({ is_featured: false }).eq("is_featured", true);
  if (excludeId) query = query.neq("id", excludeId);
  await query;
}

export async function createPostAction(_prevState: BlogFormState, formData: FormData): Promise<BlogFormState> {
  const fields = readPostFields(formData);

  if (!fields.slug || !fields.title) {
    return { error: "Title and slug are required." };
  }

  const db = supabaseAdmin();

  if (fields.is_featured) await clearExistingFeatured();

  const { error } = await db.from("blog_posts").insert(fields);

  if (error) {
    return { error: error.code === "23505" ? "A post with this slug already exists." : "Couldn't create the post." };
  }

  revalidateBlog(fields.slug);
  redirect("/admin/blog");
}

export async function updatePostAction(
  id: string,
  _prevState: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  const fields = readPostFields(formData);

  if (!fields.slug || !fields.title) {
    return { error: "Title and slug are required." };
  }

  const db = supabaseAdmin();

  if (fields.is_featured) await clearExistingFeatured(id);

  const { error } = await db.from("blog_posts").update(fields).eq("id", id);

  if (error) {
    return { error: error.code === "23505" ? "A post with this slug already exists." : "Couldn't save the post." };
  }

  revalidateBlog(fields.slug);
  redirect("/admin/blog");
}

export async function deletePostAction(id: string, slug: string) {
  const db = supabaseAdmin();
  await db.from("blog_posts").delete().eq("id", id);
  revalidateBlog(slug);
}

export async function togglePublishAction(id: string, slug: string, published: boolean) {
  const db = supabaseAdmin();
  await db.from("blog_posts").update({ published }).eq("id", id);
  revalidateBlog(slug);
}
