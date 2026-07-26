"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { PublicCategory } from "@/lib/category-data";

const ease = [0.16, 1, 0.3, 1] as const;

export function CategoryHero({
  category,
  count,
  /** Root-first ancestors, excluding `category` itself. */
  trail = [],
  /** What `count` counts, so the meta line stays honest at every depth. */
  countLabel = "LISTED",
}: {
  category: PublicCategory;
  count: number;
  trail?: PublicCategory[];
  countLabel?: string;
}) {
  const parent = trail[trail.length - 1];
  return (
    <section className="relative overflow-hidden bg-[#C4DFFD] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 82% 8%, rgba(144, 45, 57,0.14) 0%, transparent 60%), radial-gradient(45% 40% at 6% 100%, rgba(3,62,141,0.12) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex items-center gap-4 border-b border-[#002144]/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <Link
            href={parent ? `/products/${parent.slug}` : "/products"}
            className="group inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#002144]/55 transition-colors hover:text-maroon-admin"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {parent ? parent.name : "All Categories"}
          </Link>

          {trail.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="hidden flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#002144]/40 md:flex"
            >
              <span aria-hidden>/</span>
              <Link href="/products" className="transition-colors hover:text-maroon-admin">
                Products
              </Link>
              {trail.map((step) => (
                <span key={step.id} className="flex items-center gap-1.5">
                  <span aria-hidden>/</span>
                  <Link href={`/products/${step.slug}`} className="transition-colors hover:text-maroon-admin">
                    {step.name}
                  </Link>
                </span>
              ))}
            </nav>
          )}

          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-[#002144]/40 sm:block">
            {count}&nbsp;{countLabel}
          </span>
        </motion.div>

        <div className="mt-10 max-w-3xl">
          <motion.h1
            className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]"
            style={{ color: "#002144" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            {category.name}
          </motion.h1>

          {category.description && (
            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-[#002144]/65 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              {category.description}
            </motion.p>
          )}
        </div>
      </Container>
    </section>
  );
}
