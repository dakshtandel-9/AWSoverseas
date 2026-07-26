"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { Container } from "@/components/ui/container";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  note: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Shortest cut of the manifest header register, matching QuoteHero — this
 * page's only job is to get a visitor into the form below, so it skips the
 * stat block and secondary CTA.
 */
export function RequestProductHero({ data }: { data: Data }) {
  return (
    <section className="relative overflow-hidden bg-[#C4DFFD] pb-14 pt-32 sm:pb-16 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 88% 0%, rgba(144, 45, 57,0.14) 0%, transparent 60%), radial-gradient(45% 40% at 4% 100%, rgba(3,62,141,0.12) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
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
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-admin">
            <span className="size-1.5 animate-pulse rounded-full bg-[#9e4953]" />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-[#002144]/40 sm:block">
            NO&nbsp;ACCOUNT&nbsp;NEEDED
          </span>
        </motion.div>

        <div className="mt-10 max-w-2xl">
          <motion.h1
            className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.1rem]"
            style={{ color: "#002144" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            {data.title}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-[#002144]/65 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            className="mt-7 inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium text-[#002144]/80"
            style={{
              background: "rgba(1,33,74,0.06)",
              border: "1px solid rgba(1,33,74,0.16)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <PackageSearch className="size-4 shrink-0" />
            {data.note}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
