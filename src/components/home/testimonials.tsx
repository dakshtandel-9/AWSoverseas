"use client";

import { motion, type Variants } from "framer-motion";
import { Star, ShieldCheck, ThumbsUp, Users } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Data = { title: string; description: string };

const REVIEWS = [
  {
    name: "James Harrington",
    role: "Head of Procurement",
    company: "NovaTex Industries",
    initials: "JH",
    color: "#01214a",
    rating: 5,
    quote:
      "AWSOverseas handled our entire sea freight corridor from Shanghai to Rotterdam without a single delay. Customs clearance was seamless — their team knew exactly what documentation was needed.",
  },
  {
    name: "Priya Mehta",
    role: "Import Manager",
    company: "SilkRoute Garments",
    initials: "PM",
    color: "#0a6ab5",
    rating: 5,
    quote:
      "We switched from our previous forwarder after constant shipment delays. AWSOverseas delivered our textile cargo 3 days ahead of schedule and the live tracking kept us informed every step of the way.",
  },
  {
    name: "David Okonkwo",
    role: "CEO",
    company: "Apex Global Trade",
    initials: "DO",
    color: "#054ba8",
    rating: 5,
    quote:
      "The best logistics partner we've worked with. Transparent pricing, zero hidden fees, and a 24/7 support team that actually picks up the phone. Our repeat business speaks for itself.",
  },
];

const SIGNALS = [
  { Icon: Star,       metric: "4.9/5",  label: "Client rating"     },
  { Icon: ThumbsUp,   metric: "98%",    label: "Repeat customers"  },
  { Icon: ShieldCheck,metric: "0",      label: "Cargo claims"      },
  { Icon: Users,      metric: "500+",   label: "Active clients"    },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Testimonials({ data, eyebrow }: { data: Data; eyebrow: string }) {
  return (
    <Section tone="soft" spacing="lg" className="relative overflow-hidden">
      {/* Radial background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(215,40,70,0.07) 0%, transparent 65%)",
        }}
      />

      <SectionHeading eyebrow={eyebrow} title={data.title} subtitle={data.description} />

      {/* Review cards */}
      <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } }}
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.10)] ring-1 ring-[#e4e9f2] transition-shadow duration-300 hover:shadow-[0_8px_32px_-4px_rgba(4,22,47,0.16)] hover:ring-[#d72846]/30"
          >
            {/* Left accent stripe */}
            <span className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 rounded-l-3xl bg-gradient-to-b from-[#01214a] to-[#d72846] transition-transform duration-300 group-hover:scale-y-100" />

            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: r.rating }).map((_, s) => (
                <Star key={s} className="size-4 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[#2a3a52]">
              "{r.quote}"
            </blockquote>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3">
              {/* Avatar */}
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                style={{ background: r.color }}
              >
                {r.initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#01214a]">{r.name}</p>
                <p className="truncate text-[12px] text-[#5b6b82]">
                  {r.role} · {r.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust metrics bar */}
      <motion.div
        className="relative mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#e4e9f2] shadow-soft sm:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.3 }}
      >
        {SIGNALS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5 bg-white px-6 py-6 text-center">
            <s.Icon className="size-5 text-[#d72846]" />
            <p className="font-heading text-2xl font-extrabold text-[#01214a]">{s.metric}</p>
            <p className="text-[12px] font-medium text-[#5b6b82]">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}
