"use client";

import { motion, type Variants } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Data = { title: string; description: string };

const REGIONS = [
  { name: "Asia Pacific",   hubs: ["Shanghai", "Singapore", "Dubai"],          countries: 32, ports: 80,  accent: "#9e4953" },
  { name: "Europe",         hubs: ["Rotterdam", "Hamburg", "London"],           countries: 45, ports: 120, accent: "#f59e0b" },
  { name: "North America",  hubs: ["Los Angeles", "New York", "Toronto"],       countries: 8,  ports: 40,  accent: "#9e4953" },
  { name: "South America",  hubs: ["São Paulo", "Buenos Aires"],                countries: 12, ports: 28,  accent: "#f59e0b" },
  { name: "Africa",         hubs: ["Lagos", "Nairobi", "Johannesburg"],         countries: 22, ports: 35,  accent: "#9e4953" },
  { name: "Middle East",    hubs: ["Dubai", "Riyadh", "Abu Dhabi"],             countries: 14, ports: 30,  accent: "#f59e0b" },
];

const STATS = [
  { number: "100+",  label: "Countries" },
  { number: "500+",  label: "Trade Routes" },
  { number: "6",     label: "Continents" },
  { number: "24/7",  label: "Support" },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function GlobalCoverage({ data }: { data: Data; eyebrow?: string }) {
  return (
    <Section tone="ink" spacing="lg" className="overflow-hidden">
      {/* Ambient radial glows */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 50% at 10% 10%, rgba(158, 73, 83,0.18) 0%, transparent 60%), radial-gradient(50% 40% at 90% 90%, rgba(3,62,141,0.35) 0%, transparent 55%)",
        }}
      />
      {/* Dot-grid world map watermark */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle, rgba(1,33,74,0.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">

        {/* ── Left: copy + stats + button ── */}
        <div className="flex flex-col justify-center">
          <Reveal direction="up">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e05c72]/70">
              Sourcing & Delivery Network
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-[2.5rem] lg:leading-tight" style={{ color: "#002144" }}>
              {data.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/60">
              {data.description}
            </p>
          </Reveal>

          {/* Stats grid */}
          <Reveal direction="up" delay={0.12}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5 rounded-2xl bg-white/60 px-5 py-4 ring-1 ring-ink/8">
                  <span className="font-heading text-2xl font-extrabold text-ink">{s.number}</span>
                  <span className="text-[12px] font-medium text-ink/50">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <div className="mt-10">
              <Button href="/services" variant="white" size="lg">
                Explore Sourcing & Shipping <ArrowRight className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>

        {/* ── Right: region cards ── */}
        <motion.div
          className="flex flex-col gap-3"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {REGIONS.map((region, i) => (
            <motion.div
              key={region.name}
              custom={i}
              variants={cardVariants}
              className="group overflow-hidden rounded-2xl bg-white/60 ring-1 ring-ink/8 transition-all duration-300 hover:bg-white/80 hover:ring-ink/15"
              whileHover={{ x: 4, transition: { type: "spring", stiffness: 300, damping: 24 } }}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Pulsing dot */}
                <span className="relative flex size-2.5 shrink-0">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: region.accent }}
                  />
                  <span
                    className="relative inline-flex size-2.5 rounded-full"
                    style={{ background: region.accent }}
                  />
                </span>

                <span className="font-semibold text-ink">{region.name}</span>

                {/* Country + port count — visible on hover */}
                <span className="ml-1 hidden text-[11px] text-ink/40 transition-all duration-200 group-hover:text-ink/70 sm:block">
                  {region.countries} countries · {region.ports}+ ports
                </span>

                {/* Hub pills */}
                <div className="ml-auto flex flex-wrap justify-end gap-1.5">
                  {region.hubs.map((hub) => (
                    <span
                      key={hub}
                      className="rounded-md bg-ink/8 px-2 py-0.5 text-[11px] font-medium text-ink/50 transition-colors duration-200 group-hover:bg-ink/14 group-hover:text-ink/80"
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </Section>
  );
}
