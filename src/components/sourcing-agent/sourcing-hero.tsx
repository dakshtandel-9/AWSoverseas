"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Data = {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/** Manifest header register, framed as a local-partner desk rather than a document. */
export function SourcingHero({ data }: { data: Data }) {
  return (
    <section className="relative overflow-hidden bg-[#C4DFFD] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 88% 0%, rgba(15,173,232,0.18) 0%, transparent 60%), radial-gradient(45% 40% at 4% 100%, rgba(3,62,141,0.12) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
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
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0a87ad]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#0fade8]" />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-[#002144]/40 sm:block">
            LOCAL&nbsp;PARTNER&nbsp;/&nbsp;INDIA
          </span>
        </motion.div>

        <div className="mt-10 flex flex-col items-center text-center">
          <motion.h1
            className="max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]"
            style={{ color: "#002144" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            {data.title}{" "}
            <span
              style={{
                background: "linear-gradient(110deg, #0a87ad 0%, #0fade8 55%, #0a87ad 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {data.titleHighlight}
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#002144]/65 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <Button href="/quote" size="lg" variant="secondary">
              {data.primaryButton} <ArrowRight className="size-4" />
            </Button>
            <Button href="/contact" size="lg" variant="ghost" className="text-[#002144] hover:bg-[#002144]/10">
              {data.secondaryButton}
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
