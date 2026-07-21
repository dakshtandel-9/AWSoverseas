"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Compact document-header register shared by all four legal pages — same
 * mono/rule vocabulary as About's "manifest" hero, cut down since the job
 * here is to state what the document is and get out of the way, not narrate.
 */
export function LegalHero({ data, lastUpdated }: { data: Data; lastUpdated: string }) {
  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] pb-14 pt-32 sm:pb-16 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(50% 45% at 88% 0%, rgba(171, 31, 61,0.1) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e05c72]">
            <span className="size-1.5 rounded-full bg-[#d6274c]" />
            {data.badge}
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-ink/35">
            REV.&nbsp;{lastUpdated}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-ink/35 sm:block">
            DOCUMENT&nbsp;/&nbsp;WORLDWIDE
          </span>
        </motion.div>

        <motion.h1
          className="mt-8 font-heading text-4xl font-extrabold leading-[1.03] tracking-[-0.03em] sm:text-5xl"
          style={{ color: "#002144" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {data.title}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60 sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
        >
          {data.subtitle}
        </motion.p>
      </Container>
    </section>
  );
}
