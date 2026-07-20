"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

type Highlight = { label: string; value: string };
type Data = {
  badge: string;
  title: string;
  description: string;
  button: string;
  highlights: Highlight[];
};

const ease = [0.16, 1, 0.3, 1] as const;

/** Home teaser for /referral-rewards — a dark receipt-style band, echoing the page's own hero. */
export function ReferralTeaser({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#CFE8FF] px-8 py-14 shadow-[0_32px_96px_-24px_rgba(5,32,58,0.25)] sm:px-14 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(55% 60% at 90% 10%, rgba(172,32,56,0.12) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
              backgroundSize: "auto, 44px 44px, 44px 44px",
            }}
          />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d72846]/30 bg-[#d72846]/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#e05c72]">
                <Gift className="size-3.5" />
                {data.badge}
              </span>

              <h2
                className="mt-6 text-balance text-3xl font-bold leading-[1.1] sm:text-4xl"
                style={{ color: "#01214a" }}
              >
                {data.title}
              </h2>

              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/60">
                {data.description}
              </p>

              <div className="mt-8">
                <Button href="/referral-rewards" size="lg" variant="secondary">
                  {data.button} <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3">
              {data.highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  className="flex min-w-[220px] items-center justify-between gap-6 rounded-xl bg-ink/5 px-5 py-3.5 ring-1 ring-ink/10"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease }}
                >
                  <span className="text-xs text-ink/55">{h.label}</span>
                  <span className="font-mono text-sm font-bold text-[#e05c72]">{h.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
