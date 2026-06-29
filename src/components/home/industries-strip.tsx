"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { iconFor } from "@/lib/icons";

type Data = { title: string; items: string[] };

export function IndustriesStrip({ data, eyebrow }: { data: Data; eyebrow: string }) {
  return (
    <Section tone="soft" spacing="lg">
      <div className="flex flex-col items-center gap-6">
        <SectionHeading eyebrow={eyebrow} title={data.title} align="center" />
      </div>

      <Stagger className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.items.map((name) => {
          const Icon = iconFor(name);
          return (
            <StaggerItem key={name}>
              <Link
                href="/industries"
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-900 group-hover:text-white">
                  <Icon className="size-6" />
                </span>
                <span className="font-semibold text-ink">{name}</span>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/industries"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
        >
          Explore all industries <ArrowRight className="size-4" />
        </Link>
      </motion.div>
    </Section>
  );
}
