"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;
const MOSS = "#2F6B4F";

/**
 * Signature "impact ledger" hero — a shipment icon routing along two dashed
 * paths to two stamped consignees (Climate / Community). Extends the site's
 * existing manifest/document-header language rather than switching into a
 * generic green eco-page look; the one new color (stamp-ink moss) appears
 * only inside the routing diagram.
 */
export function SustainabilityHero({ data }: { data: Data }) {
  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 85% 6%, rgba(47,107,79,0.14) 0%, transparent 60%), radial-gradient(45% 40% at 6% 100%, rgba(3,62,141,0.2) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex items-center gap-4 border-b border-ink/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span
            className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: MOSS }}
          >
            <span className="size-1.5 animate-pulse rounded-full" style={{ background: MOSS }} />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-ink/35 sm:block">
            ROUTED&nbsp;/&nbsp;TWO&nbsp;CONSIGNEES
          </span>
        </motion.div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          <div>
            <motion.h1
              className="font-heading text-4xl font-extrabold leading-[1.03] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]"
              style={{ color: "#1A0A53" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14, ease }}
            >
              {data.title}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease }}
            >
              {data.subtitle}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <a
                href="#how-it-works"
                className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium text-white shadow-soft transition-all duration-300"
                style={{ background: MOSS }}
              >
                {data.primaryButton}
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <Button href="/contact" size="lg" variant="outline">
                {data.secondaryButton} <ArrowRight className="size-4" />
              </Button>
            </motion.div>
          </div>

          {/* Signature: split-manifest routing diagram */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-ink/12 bg-white/50 px-6 py-7 backdrop-blur-sm"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.34, ease }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
              Consignment routing
            </p>
            <svg
              viewBox="0 0 260 140"
              className="mt-4 w-full"
              role="img"
              aria-label="One shipment routes to two consignees: Climate Action and Community Initiatives"
            >
              <circle cx="30" cy="70" r="7" fill="#002144" />
              <path
                d="M 37 70 C 90 70, 90 28, 150 28"
                stroke="#9e4953"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
              <path
                d="M 37 70 C 90 70, 90 112, 150 112"
                stroke={MOSS}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
              <g transform="translate(150,28)">
                <rect x="0" y="-14" width="102" height="28" rx="14" fill="#902d39" opacity="0.1" />
                <circle cx="14" cy="0" r="4" fill="#902d39" />
                <text x="26" y="4" fontSize="9" fontFamily="ui-monospace, monospace" fill="#902d39" fontWeight="700" letterSpacing="0.3">
                  CLIMATE ACTION
                </text>
              </g>
              <g transform="translate(150,112)">
                <rect x="0" y="-14" width="102" height="28" rx="14" fill={MOSS} opacity="0.1" />
                <circle cx="14" cy="0" r="4" fill={MOSS} />
                <text x="26" y="4" fontSize="9" fontFamily="ui-monospace, monospace" fill={MOSS} fontWeight="700" letterSpacing="0.3">
                  COMMUNITY
                </text>
              </g>
            </svg>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/35">
              Every order · split two ways
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
