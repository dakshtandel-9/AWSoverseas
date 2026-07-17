"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { CategoryArt } from "./category-art";

type Data = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishDate: string;
  excerpt: string;
  button: string;
  imageUrl?: string;
};

export function FeaturedArticle({ data }: { data: Data }) {
  const href = `/blog/${data.slug}`;

  return (
    <Section spacing="md" id="articles">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href={href}
          className="group grid overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)] transition-shadow duration-300 hover:shadow-[0_10px_30px_-12px_rgba(4,22,47,0.24)] lg:grid-cols-2"
        >
          <CategoryArt category={data.category} imageUrl={data.imageUrl} className="h-64 lg:h-auto" />
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#01214a]">
                {data.category}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wide text-[#94a3b8]">
                {data.publishDate}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold leading-snug text-[#01214a] transition-colors group-hover:text-[#01214a] sm:text-3xl">
              {data.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#5b6b82]">{data.excerpt}</p>
            <div className="mt-6 flex items-center gap-5">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#01214a]">
                {data.button}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-[#94a3b8]">
                <Clock className="size-3.5" />
                {data.readTime}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </Section>
  );
}
