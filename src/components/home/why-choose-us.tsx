"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { iconFor } from "@/lib/icons";

type Item = { title: string; description: string };
type Data = { title: string; items: Item[] };

// Supporting metric per feature
const METRICS: Record<string, string> = {
  "Verified Manufacturers":       "500+ suppliers vetted",
  "Competitive Product Pricing":  "No hidden fees, ever",
  "Quality Assurance":            "Inspected before dispatch",
  "Export Expertise":             "Documentation filed daily",
  "International Shipping":       "99% on-time delivery",
  "Single Point of Contact":      "One team, start to finish",
};


export function WhyChooseUs({ data }: { data: Data; eyebrow?: string }) {
  return (
    <Section spacing="lg" className="relative overflow-hidden">
      {/* Background: grid + radial glow behind heading */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 30% 0%, rgba(158, 73, 83,0.06) 0%, transparent 65%), linear-gradient(to right, rgba(4,22,47,0.032) 1px, transparent 1px), linear-gradient(to bottom, rgba(4,22,47,0.032) 1px, transparent 1px)",
          backgroundSize: "auto, 48px 48px, 48px 48px",
        }}
      />

      {/* Heading */}
      <Reveal direction="up">
        <div className="relative max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b6b82]">Why aws overseas</p>
          <h2 className="mt-3 text-3xl font-bold text-[#002144] sm:text-4xl lg:text-[2.5rem]">
            {data.title}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-[#5b6b82]">
            Trusted by businesses worldwide for reliable, secure, and transparent shipping solutions.
          </p>
        </div>
      </Reveal>

      {/* Cards grid */}
      <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => {
          const Icon = iconFor(item.title);
          const metric = METRICS[item.title];
          const useAmber = i === 1 || i === 4;

          return (
            <motion.div
              key={item.title}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white p-7 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.08)] transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 22 },
              }}
              style={{ willChange: "transform" }}
            >
              {/* Left accent stripe */}
              <span className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-gradient-to-b from-[#002144] to-[#9e4953] transition-transform duration-300 group-hover:scale-y-100 rounded-l-3xl" />

              {/* Icon row */}
              <div className="flex items-start justify-between">
                <span
                  className="grid size-13 place-items-center rounded-xl shadow-[0_2px_8px_rgba(3,62,141,0.08)] transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: useAmber ? "#fffbeb" : "#eef3fb",
                    color: useAmber ? "#d97706" : "#002144",
                  }}
                >
                  <Icon className="size-6" />
                </span>
                {/* Accent dot — expands to glow on hover */}
                <motion.span
                  className="size-2.5 rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_8px_3px_rgba(144, 45, 57,0.45)]"
                  style={{ background: useAmber ? "#f59e0b" : "#9e4953" }}
                />
              </div>

              <h3 className="mt-5 text-base font-bold text-[#002144]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{item.description}</p>
              {metric && (
                <span
                  className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold"
                  style={{ color: useAmber ? "#d97706" : "#9e4953" }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: useAmber ? "#d97706" : "#9e4953" }}
                  />
                  {metric}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="relative mt-14 flex items-center justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.3 }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-base font-semibold text-[#002144]">Ready to ship globally?</p>
          <Link
            href="/quote"
            className="group inline-flex items-center gap-2 rounded-full bg-[#02224C] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#011a38] hover:shadow-[0_0_0_4px_rgba(144, 45, 57,0.18),0_8px_24px_rgba(3,62,141,0.35)]"
          >
            Request a Quote
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </Section>
  );
}
