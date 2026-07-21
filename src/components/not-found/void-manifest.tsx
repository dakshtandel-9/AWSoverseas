"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const ease = [0.16, 1, 0.3, 1] as const;

const REDIRECTS = [
  { label: "Home", href: "/", note: "Return to origin" },
  { label: "Track a shipment", href: "/tracking", note: "Query by reference" },
  { label: "Services", href: "/services", note: "View tariff schedule" },
  { label: "Contact", href: "/contact", note: "Reach dispatch" },
] as const;

/**
 * 404 rendered as a tracking query with no manifest on file — the
 * logistics-world equivalent of "page not found." Same document-header /
 * mono-field register as About/Legal/Tracking, inverted into a void state.
 * Signature: a scanline sweeps the barcode rule once on load, like a
 * scanner failing to read a code, then the exception log settles.
 */
export function VoidManifest() {
  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] py-28 sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 85% 0%, rgba(144, 45, 57,0.1) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b45309]">
            <span className="size-1.5 rounded-full bg-[#f59e0b]" />
            TRACKING EXCEPTION
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-ink/35">
            STATUS: NO&nbsp;RECORD
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-ink/35 sm:block">
            aws overseas&nbsp;/&nbsp;MANIFEST&nbsp;SCAN
          </span>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-20">
          {/* Void reference block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/35">
              Reference
            </p>
            <h1
              className="mt-2 font-heading text-[clamp(4.5rem,12vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]"
              style={{ color: "#002144" }}
            >
              404
            </h1>

            {/* Barcode scanline */}
            <div className="relative mt-6 h-9 w-full max-w-[280px] overflow-hidden">
              <div
                className="flex h-full items-end gap-[3px]"
                aria-hidden
              >
                {BARCODE_PATTERN.map((w, i) => (
                  <span
                    key={i}
                    className="bg-ink/25"
                    style={{ width: `${w}px`, height: i % 5 === 0 ? "100%" : "65%" }}
                  />
                ))}
              </div>
              <motion.div
                className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-transparent via-[#9e4953]/80 to-transparent"
                initial={{ x: "-2rem" }}
                animate={{ x: "280px" }}
                transition={{ duration: 1.1, delay: 0.6, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
              REF 000-000-404-VOID
            </p>
          </motion.div>

          {/* Exception log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            <h2
              className="font-heading text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: "#002144" }}
            >
              This shipment has no manifest on file.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/60">
              The page you scanned doesn&rsquo;t exist, moved, or was never routed.
              Nothing on your end has gone wrong &mdash; pick a destination below
              and we&rsquo;ll get you back on schedule.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/" variant="secondary" size="lg">
                Back to home
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="border-ink/20 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/5">
                Contact dispatch
              </Button>
            </div>

            {/* Redirect manifest */}
            <div className="mt-12 border-t border-ink/12 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/35">
                Redirect manifest
              </p>
              <ul className="mt-4 divide-y divide-ink/10">
                {REDIRECTS.map((r, i) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="group flex items-center justify-between gap-4 py-3.5 text-ink/80 transition-colors hover:text-ink"
                    >
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-[11px] text-ink/30">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-heading text-base font-semibold sm:text-lg">
                          {r.label}
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink/30 sm:block">
                          {r.note}
                        </span>
                        <span
                          className="text-maroon-admin transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden
                        >
                          &rarr;
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/** Deterministic pseudo-random bar widths for the barcode rule (stable across renders). */
const BARCODE_PATTERN = Array.from({ length: 46 }, (_, i) => {
  const hash = ((i * 2654435761) ^ (i * 40503)) >>> 0;
  return 1 + (hash % 3);
});
