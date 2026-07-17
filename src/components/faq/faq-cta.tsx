"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

type Data = {
  title: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
};

/** Closing banner — quiet support hand-off, not a sales stamp (that device belongs to About/Services). */
export function FaqCta({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="ink" className="overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 60% at 85% 20%, rgba(172,32,56,0.18) 0%, transparent 60%)",
        }}
      />
      <motion.div
        className="relative mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#ffffff" }}>
          {data.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">{data.description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" size="lg" variant="secondary">
            {data.primaryButton} <ArrowRight className="size-4" />
          </Button>
          <Button href="/quote" size="lg" variant="ghost" className="text-white hover:bg-white/10">
            {data.secondaryButton}
          </Button>
        </div>
      </motion.div>
    </Section>
  );
}
