"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Headset } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { iconFor } from "@/lib/icons";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * One cut of the manifest hero per service line — framed as the "consignment
 * note" behind a single tariff-schedule entry. A breadcrumb back to /services
 * replaces the wide document-header label, since this page is one level
 * deeper than the schedule itself. Icon comes from the shared iconFor map so
 * each of the 8 services gets a distinct mark without new content.
 */
export function ServiceHero({ data, stepCount }: { data: Data; stepCount: number }) {
  const Icon = iconFor(data.title);

  return (
    <section className="relative overflow-hidden bg-[#C4DFFD] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 82% 8%, rgba(144, 45, 57,0.14) 0%, transparent 60%), radial-gradient(45% 40% at 6% 100%, rgba(3,62,141,0.12) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex items-center gap-4 border-b border-[#002144]/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#002144]/55 transition-colors hover:text-maroon-admin"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            All Services
          </Link>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-[#002144]/40 sm:block">
            SERVICE&nbsp;RECORD&nbsp;/&nbsp;{String(stepCount).padStart(2, "0")}-STEP&nbsp;PROCESS
          </span>
        </motion.div>

        <div className="mt-10 flex max-w-3xl items-start gap-5">
          <motion.span
            className="mt-1.5 hidden shrink-0 grid size-14 place-items-center rounded-2xl bg-white/60 text-maroon-admin ring-1 ring-[#002144]/10 backdrop-blur-sm sm:grid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
          >
            <Icon className="size-6" />
          </motion.span>

          <div>
            <motion.span
              className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-[#9e4953]" />
              {data.badge}
            </motion.span>

            <motion.h1
              className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.2rem]"
              style={{ color: "#002144" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease }}
            >
              {data.title}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-[#002144]/65 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              {data.subtitle}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease }}
            >
              <Button href="/quote" size="lg" variant="secondary">
                {data.primaryButton} <ArrowRight className="size-4" />
              </Button>
              <a
                href="/contact"
                className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium text-[#002144]/90 transition-all duration-300"
                style={{
                  background: "rgba(1,33,74,0.06)",
                  border: "1px solid rgba(1,33,74,0.16)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(1,33,74,0.1)";
                  el.style.boxShadow = "0 0 0 1px rgba(144, 45, 57,0.4), 0 4px 20px rgba(144, 45, 57,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(1,33,74,0.06)";
                  el.style.boxShadow = "none";
                }}
              >
                <Headset className="size-4" />
                {data.secondaryButton}
              </a>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
