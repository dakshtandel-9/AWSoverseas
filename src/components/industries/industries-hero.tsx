"use client";

import { motion } from "framer-motion";
import { ArrowRight, Headset } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
};

type Stat = { number: string; label: string };

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Continues the "manifest" register introduced on the About page — this time
 * as a classification header, since Industries is fundamentally a schedule of
 * cargo sectors. The stat block reuses overview.stats (already on this page's
 * JSON) rather than inventing numbers.
 */
export function IndustriesHero({ data, stats }: { data: Data; stats: Stat[] }) {
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length * 0.5);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section className="relative overflow-hidden bg-[#000c1a] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 82% 8%, rgba(172,32,56,0.16) 0%, transparent 60%), radial-gradient(45% 40% at 6% 100%, rgba(3,62,141,0.42) 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex items-center gap-4 border-b border-white/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e05c72]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#d72846]" />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-white/35 sm:block">
            CARGO&nbsp;CLASSIFICATION&nbsp;/&nbsp;ALL&nbsp;SECTORS
          </span>
        </motion.div>

        <div className="mt-10 max-w-3xl">
          <motion.h1
            className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]"
            style={{ color: "#ffffff" }}
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
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
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
              className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium text-white/90 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(255,255,255,0.14)";
                el.style.boxShadow = "0 0 0 1px rgba(172,32,56,0.4), 0 4px 20px rgba(172,32,56,0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(255,255,255,0.08)";
                el.style.boxShadow = "none";
              }}
            >
              <Headset className="size-4" />
              {data.secondaryButton}
            </a>
          </motion.div>
        </div>

        {/* Classification stats — reuses overview.stats */}
        <motion.dl
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.36, ease }}
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-[#000c1a] px-6 py-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                {s.label}
              </dt>
              <dd className="mt-1.5 font-heading text-2xl font-extrabold text-white sm:text-3xl">
                <Counter value={s.number} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
