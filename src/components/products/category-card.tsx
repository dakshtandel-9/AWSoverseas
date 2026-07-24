"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ImageOff } from "lucide-react";
import type { PublicCategory } from "@/lib/category-data";

export function CategoryCard({ category, index }: { category: PublicCategory; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 9) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/products/${category.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white transition-colors duration-300 hover:border-[#9e4953]/50"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#eef3fb]">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
              <ImageOff className="size-8" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="text-lg font-bold text-[#002144]">{category.name}</h3>
          {category.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[#5b6b82]">{category.description}</p>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-maroon-admin">
            Explore
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
