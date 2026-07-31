"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

type ListBlock = { title: string; items: string[] };
type Data = {
  eyebrow: string;
  title: string;
  description: string;
  whoCanJoin: ListBlock;
  whatsIncluded: ListBlock;
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/** Audience and benefits are two parallel sets, not a sequence, so both lists stay unnumbered. */
export function ReferralBecomePartner({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} subtitle={data.description} />

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {[data.whoCanJoin, data.whatsIncluded].map((block, i) => (
          <motion.div
            key={block.title}
            className="rounded-2xl border border-[#e4e9f2] bg-white p-8"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
          >
            <h3 className="text-lg font-bold text-[#1A0A53]">{block.title}</h3>
            <ul className="mt-5 flex flex-col gap-4">
              {block.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[#5b6b82]">
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-maroon-admin" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      >
        <Button href="/partner" size="lg" variant="secondary">
          {data.primaryButton} <ArrowRight className="size-4" />
        </Button>
        <Button href="/contact" size="lg" variant="ghost" className="text-[#1A0A53] hover:bg-[#002144]/10">
          {data.secondaryButton}
        </Button>
      </motion.div>
    </Section>
  );
}
