"use client";

import { useActionState, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { slugify } from "@/lib/cn";
import { createPostAction, updatePostAction, type BlogFormState } from "@/app/admin/(dashboard)/blog/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";

type Section = { heading: string; content: string };

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  read_time: string;
  image_url: string;
  author_name: string;
  table_of_contents: string[];
  sections: Section[];
  tags: string[];
  is_featured: boolean;
  published: boolean;
};

const inputClasses =
  "w-full rounded-xl border border-[#e4e9f2] bg-white px-4 py-3 text-sm text-[#06234d] placeholder:text-[#94a3b8] outline-none transition-colors focus:border-[#0fade8] focus:ring-2 focus:ring-[#0fade8]/20";

const initialState: BlogFormState = {};

export function BlogPostForm({ post }: { post?: BlogPostRecord }) {
  const action = post ? updatePostAction.bind(null, post.id) : createPostAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [toc, setToc] = useState<string[]>(post?.table_of_contents?.length ? post.table_of_contents : [""]);
  const [sections, setSections] = useState<Section[]>(
    post?.sections?.length ? post.sections : [{ heading: "", content: "" }],
  );
  const [tags, setTags] = useState<string[]>(post?.tags?.length ? post.tags : [""]);
  const [imageUrl, setImageUrl] = useState(post?.image_url ?? "");

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Rendered outside the post-save <form> — HTML forbids nested <form>
          elements, and this upload has its own independent server action. */}
      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#06234d]">Cover image</h2>
        <div className="mt-5">
          <ImageUploadField value={imageUrl} onUploaded={setImageUrl} />
        </div>
      </section>

      <form action={formAction} className="flex flex-col gap-8">
        <input type="hidden" name="image_url" value={imageUrl} />
        <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#06234d]">Post details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#06234d]">Title *</label>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#06234d]">Slug *</label>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={cn(inputClasses, "font-mono text-xs")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">Category</label>
            <input name="category" defaultValue={post?.category ?? ""} className={inputClasses} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#06234d]">Read time</label>
            <input name="read_time" defaultValue={post?.read_time ?? ""} placeholder="6 min" className={inputClasses} />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#06234d]">Author name</label>
            <input
              name="author_name"
              defaultValue={post?.author_name ?? "AWSoversea Team"}
              className={inputClasses}
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm font-semibold text-[#06234d]">Excerpt</label>
            <textarea
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              rows={3}
              className={cn(inputClasses, "resize-none")}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-[#e4e9f2] pt-5">
          <label className="flex items-center gap-2 text-sm font-medium text-[#06234d]">
            <input type="checkbox" name="published" value="true" defaultChecked={post?.published ?? true} className="size-4 accent-[#033e8d]" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-[#06234d]">
            <input type="checkbox" name="is_featured" value="true" defaultChecked={post?.is_featured ?? false} className="size-4 accent-[#033e8d]" />
            Featured article (only one at a time)
          </label>
        </div>
      </section>

      <RepeatableList
        title="Table of contents"
        values={toc}
        onChange={setToc}
        name="table_of_contents"
        placeholder="Section heading"
      />

      <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#06234d]">Article body</h2>
          <button
            type="button"
            onClick={() => setSections((s) => [...s, { heading: "", content: "" }])}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e9f2] px-3 py-1.5 text-xs font-semibold text-[#0489c2] hover:border-[#0fade8]"
          >
            <Plus className="size-3.5" /> Add section
          </button>
        </div>
        <div className="mt-5 flex flex-col gap-5">
          {sections.map((section, i) => (
            <div key={i} className="rounded-xl border border-[#e4e9f2] p-4">
              <div className="flex items-center justify-between gap-3">
                <input
                  name={`section_heading_${i}`}
                  value={section.heading}
                  onChange={(e) =>
                    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, heading: e.target.value } : s)))
                  }
                  placeholder="Heading"
                  className={cn(inputClasses, "font-semibold")}
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setSections((prev) => prev.filter((_, idx) => idx !== i))}
                    className="shrink-0 rounded-lg p-2 text-[#94a3b8] hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove section"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
              <textarea
                name={`section_content_${i}`}
                value={section.content}
                onChange={(e) =>
                  setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, content: e.target.value } : s)))
                }
                placeholder="Content"
                rows={4}
                className={cn(inputClasses, "mt-3 resize-none")}
              />
            </div>
          ))}
          <input type="hidden" name="section_count" value={sections.length} />
        </div>
      </section>

      <RepeatableList title="Tags" values={tags} onChange={setTags} name="tags" placeholder="Air Freight" />

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-2 rounded-lg bg-[#e8f9ff] px-3 py-2 text-sm font-medium text-[#0489c2]" role="status">
          <Check className="size-4" />
          Saved.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#033e8d] px-8 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#052f69] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? "Saving…" : post ? "Save changes" : "Create post"}
        </button>
      </div>
      </form>
    </div>
  );
}

function RepeatableList({
  title,
  values,
  onChange,
  name,
  placeholder,
}: {
  title: string;
  values: string[];
  onChange: (v: string[]) => void;
  name: string;
  placeholder: string;
}) {
  return (
    <section className="rounded-2xl border border-[#e4e9f2] bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#06234d]">{title}</h2>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#e4e9f2] px-3 py-1.5 text-xs font-semibold text-[#0489c2] hover:border-[#0fade8]"
        >
          <Plus className="size-3.5" /> Add
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {values.map((value, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              name={`${name}_${i}`}
              value={value}
              onChange={(e) => onChange(values.map((v, idx) => (idx === i ? e.target.value : v)))}
              placeholder={placeholder}
              className={inputClasses}
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                className="shrink-0 rounded-lg p-2 text-[#94a3b8] hover:bg-red-50 hover:text-red-600"
                aria-label="Remove"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ))}
        <input type="hidden" name={`${name}_count`} value={values.length} />
      </div>
    </section>
  );
}
