"use client";

import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CategoryArt } from "./category-art";

type Author = { name: string; avatar?: string };
type Banner = {
  category: string;
  title: string;
  excerpt: string;
  author: Author;
  publishDate: string;
  readTime: string;
  imageUrl?: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function ArticleBanner({ data }: { data: Banner }) {
  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] pb-14 pt-32 sm:pb-16 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 85% 10%, rgba(172,32,56,0.12) 0%, transparent 60%), radial-gradient(45% 40% at 5% 100%, rgba(3,62,141,0.2) 0%, transparent 60%)",
        }}
      />
      <Container className="relative max-w-3xl">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full bg-[#d72846]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#e05c72] ring-1 ring-[#d72846]/25"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {data.category}
        </motion.span>

        <motion.h1
          className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]"
          style={{ color: "#01214a" }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
        >
          {data.title}
        </motion.h1>

        <motion.p
          className="mt-5 text-base leading-relaxed text-ink/60 sm:text-lg"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16, ease }}
        >
          {data.excerpt}
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap items-center gap-5 border-t border-ink/10 pt-6 text-sm text-ink/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24 }}
        >
          <span className="inline-flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-ink/10">
              <User className="size-3.5" />
            </span>
            {data.author.name}
          </span>
          <span>{data.publishDate}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {data.readTime}
          </span>
        </motion.div>
      </Container>

      <Container className="relative mt-10 max-w-3xl">
        <CategoryArt category={data.category} imageUrl={data.imageUrl} className="h-56 rounded-2xl sm:h-72" />
      </Container>
    </section>
  );
}
