"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

export function BlogHero({ data }: { data: Data }) {
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length * 0.5);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 85% 10%, rgba(172,32,56,0.12) 0%, transparent 60%), radial-gradient(45% 40% at 5% 100%, rgba(3,62,141,0.2) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-[#d72846]/30 bg-[#d72846]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#e05c72]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <BookOpen className="size-3.5" />
          {data.badge}
        </motion.span>

        <motion.h1
          className="mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.25rem]"
          style={{ color: "#01214a" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease }}
        >
          {line1}{" "}
          <span
            style={{
              background: "linear-gradient(110deg, #e05c72 0%, #d72846 55%, #e88797 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {line2}
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          {data.subtitle}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease }}
        >
          <a
            href="#articles"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-[#d72846] px-8 text-base font-semibold text-white shadow-[0_8px_24px_-6px_rgba(172,32,56,0.5)] transition-transform hover:-translate-y-0.5"
          >
            {data.primaryButton}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <Button href="/quote" size="lg" variant="outline" className="border-ink/20 bg-ink/8 text-ink hover:bg-ink/14">
            {data.secondaryButton}
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
