"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

type Data = {
  title: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
};

/**
 * Closing CTA — bookends the verification-dossier hero. A "verified & ready"
 * stamp ties the page's trust metaphor together at the exit.
 */
export function AboutCta({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#CFE8FF] px-8 py-16 text-center shadow-[0_32px_96px_-24px_rgba(4,22,47,0.25)] sm:px-14 sm:py-20">
          {/* Blueprint grid + glow */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(50% 60% at 50% -10%, rgba(144, 45, 57,0.14) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
              backgroundSize: "auto, 44px 44px, 44px 44px",
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            {/* Cleared stamp */}
            <motion.span
              className="inline-flex -rotate-3 items-center gap-2 rounded-md border border-[#9e4953]/40 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#e05c72]"
              initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-[#9e4953]" />
              Verified & ready to source
            </motion.span>

            <h2
              className="mt-7 text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[3rem]"
              style={{ color: "#002144" }}
            >
              {data.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/60">
              {data.description}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button href="/quote" size="lg" variant="secondary">
                {data.primaryButton} <ArrowRight className="size-4" />
              </Button>
              <Button href="/contact" size="lg" variant="white">
                {data.secondaryButton}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
