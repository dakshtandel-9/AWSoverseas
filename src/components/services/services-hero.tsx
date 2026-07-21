"use client";

import { motion } from "framer-motion";
import { ArrowRight, Headset } from "lucide-react";
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

/**
 * Continues the manifest register (About's bill-of-lading, Industries'
 * classification schedule) — Services is the forwarder's tariff sheet, so the
 * document-header rule reads "TARIFF SCHEDULE" and the badge sits beside a
 * line-count instead of a sector count.
 */
export function ServicesHero({ data, lineCount }: { data: Data; lineCount: number }) {
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length * 0.55);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

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
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-admin">
            <span className="size-1.5 animate-pulse rounded-full bg-[#9e4953]" />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-[#002144]/40 sm:block">
            TARIFF&nbsp;SCHEDULE&nbsp;/&nbsp;{String(lineCount).padStart(2, "0")}&nbsp;SERVICE&nbsp;LINES
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
            {line1}{" "}
            <span
              style={{
                background: "linear-gradient(110deg, #902d39 0%, #9e4953 55%, #861b28 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {line2}
            </span>
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
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <Button href="/quote" size="lg" variant="secondary">
              {data.primaryButton} <ArrowRight className="size-4" />
            </Button>
            <a
              href="/contact"
              className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium text-[#002144]/90 transition-all duration-300"
              style={{
                background: "rgba(1,33,74,0.06)",
                border: "1px solid rgba(1,33,74,0.16)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(1,33,74,0.1)";
                el.style.boxShadow = "0 0 0 1px rgba(144, 45, 57,0.4), 0 4px 20px rgba(144, 45, 57,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(1,33,74,0.06)";
                el.style.boxShadow = "none";
              }}
            >
              <Headset className="size-4" />
              {data.secondaryButton}
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
