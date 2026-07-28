"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

type Inbound = { name: string; code: string };

type Data = {
  eyebrow: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  videoAlt: string;
  points: string[];
  inboundLabel: string;
  inbound: Inbound[];
  outboundLabel: string;
  outbound: { title: string; meta: string };
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

// Centres of the 3-up card grid, offset for its 20px (sm:gap-5) gutters —
// where the inbound drop lines hang from.
const EDGE_INSET = "calc(16.6667% - 6.667px)";
const DROPS = [EDGE_INSET, "50%", "calc(83.3333% + 6.667px)"];

/**
 * Warehousing band — a dark break between the light coverage and process
 * sections. The signature is the merge diagram: three separate factory loads
 * converging into a single outbound shipment, which is the actual service
 * (multi-supplier consolidation), not decoration.
 */
export function WarehouseConsolidation({ data }: { data: Data }) {
  const reduceMotion = useReducedMotion();
  const line = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { scaleY: 0 },
          whileInView: { scaleY: 1 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.4, delay, ease },
        };

  return (
    <section className="relative overflow-hidden bg-[#00101f] py-24 sm:py-32">
      {/* Ambient glow — maroon top-left, navy bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(70% 55% at 12% 0%, rgba(158,73,83,0.22) 0%, transparent 62%), radial-gradient(55% 45% at 96% 100%, rgba(3,62,141,0.30) 0%, transparent 60%)",
        }}
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          {/* Video panel */}
          <Reveal direction="right">
            <div className="relative overflow-hidden rounded-[28px] shadow-[0_30px_90px_-45px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.12]">
              <video
                className="aspect-[16/10] w-full object-cover"
                src={data.video}
                poster={data.poster}
                autoPlay={!reduceMotion}
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={data.videoAlt}
              />
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,16,31,0) 55%, rgba(0,16,31,0.55) 100%)",
                }}
              />
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal direction="up" delay={0.1}>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--text-maroon-light)" }}
            >
              {data.eyebrow}
            </p>
            <h2
              className="mt-3 text-3xl font-bold sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
              style={{ color: "#ffffff" }}
            >
              {data.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/55">{data.description}</p>

            <ul className="mt-8 border-t border-white/10">
              {data.points.map((point) => (
                <li key={point} className="border-b border-white/10 py-3.5 text-sm text-white/75">
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Button href="/services/warehousing" variant="secondary" size="lg">
                {data.primaryButton} <ArrowRight className="size-4" />
              </Button>
              <Link
                href="/quote"
                className="text-sm font-medium text-white/70 underline decoration-white/25 underline-offset-[6px] transition-colors duration-200 hover:text-white hover:decoration-[#f59e0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4953]"
              >
                {data.secondaryButton}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* ── Merge diagram: many inbound loads → one outbound shipment ── */}
        <Reveal direction="up" delay={0.12}>
          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:mt-20 sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              {data.inboundLabel}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-5">
              {data.inbound.map((item, i) => (
                <motion.div
                  key={item.code}
                  className="rounded-2xl border border-white/10 bg-[#04182c] px-5 py-4"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                >
                  <p className="text-sm font-semibold text-white/90">{item.name}</p>
                  <p className="mt-1 text-[11px] font-medium tracking-[0.12em] text-white/40">
                    {item.code}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Connector — three drops joined by a bar, then one line down. */}
            <div className="relative hidden h-16 sm:block" aria-hidden>
              {DROPS.map((left, i) => (
                <motion.span
                  key={left}
                  className="absolute top-0 h-[45%] w-px origin-top bg-white/20"
                  style={{ left }}
                  {...line(0.25 + i * 0.06)}
                />
              ))}
              <motion.span
                className="absolute top-[45%] h-px origin-center bg-white/20"
                style={{ left: EDGE_INSET, right: EDGE_INSET }}
                initial={reduceMotion ? undefined : { scaleX: 0 }}
                whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: 0.45, ease }}
              />
              <motion.span
                className="absolute left-1/2 top-[45%] h-[55%] w-px origin-top"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.2), #f59e0b)" }}
                {...line(0.7)}
              />
              <ChevronDown className="absolute bottom-[-9px] left-1/2 size-[18px] -translate-x-1/2 text-[#f59e0b]" />
            </div>

            {/* Mobile connector — the stack is already vertical, so one line does it. */}
            <div className="relative h-10 sm:hidden" aria-hidden>
              <span className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-white/20 to-[#f59e0b]" />
              <ChevronDown className="absolute bottom-[-9px] left-1/2 size-[18px] -translate-x-1/2 text-[#f59e0b]" />
            </div>

            <div className="mx-auto mt-4 max-w-md rounded-2xl border border-[#f59e0b]/35 bg-[#f59e0b]/[0.08] px-6 py-5 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f59e0b]/85">
                {data.outboundLabel}
              </p>
              <p className="mt-2 text-base font-bold" style={{ color: "#ffffff" }}>
                {data.outbound.title}
              </p>
              <p className="mt-1.5 text-[13px] font-medium text-[#f59e0b]">{data.outbound.meta}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
