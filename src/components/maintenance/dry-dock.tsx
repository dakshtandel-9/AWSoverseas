"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Maintenance page, told in the one artifact every ship carries: the load line
 * (Plimsoll) mark painted amidships, which says whether a vessel is legally
 * safe to sail. Here the water sits above the summer line — overloaded, not
 * cleared to sail — which is precisely what a site in maintenance is.
 *
 * Signature: that waterline, breathing slowly across the mark and never
 * settling below the limit. Everything else is the same document register the
 * 404 and the legal pages use — mono field labels, hairline rules, no cards.
 */
export function DryDock({
  phone,
  email,
  whatsappNumber,
}: {
  phone: string;
  email: string;
  whatsappNumber: string;
}) {
  const reduceMotion = useReducedMotion();

  // wa.me takes digits only, and the stored number may or may not carry a "+".
  const whatsappDigits = whatsappNumber.replace(/\D/g, "");

  const channels = [
    phone && { label: "Phone", value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    email && { label: "Email", value: email, href: `mailto:${email}` },
    whatsappDigits && {
      label: "WhatsApp",
      value: `+${whatsappDigits}`,
      href: `https://wa.me/${whatsappDigits}`,
    },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-[#000c1a] py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 45% at 78% 4%, rgba(245,158,11,0.10) 0%, transparent 62%), linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f59e0b]">
            <span className="size-1.5 rounded-full bg-[#f59e0b]" />
            Scheduled maintenance
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            Status: out&nbsp;of&nbsp;service
          </span>
          <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.18em] text-white/35 sm:block">
            AWS OVERSEAS impex&nbsp;/&nbsp;dry&nbsp;dock
          </span>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <LoadLineMark reduceMotion={!!reduceMotion} />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              Load line &mdash; not cleared to sail
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            <h1
              className="font-heading text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em]"
              style={{ color: "#ffffff" }}
            >
              The site is in dry&nbsp;dock.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
              AWS OVERSEAS impex is offline for scheduled maintenance. Quotes,
              tracking and the catalogue all come back the moment the work is
              signed off.
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-white/60">
              Shipments and enquiries already with us carry on as normal &mdash;
              this is the website only.
            </p>

            {channels.length > 0 && (
              <div className="mt-12 max-w-lg border-t border-white/12 pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">
                  Reach us directly
                </p>
                <ul className="mt-3 divide-y divide-white/10">
                  {channels.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-sm py-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e0b]"
                      >
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
                          {c.label}
                        </span>
                        <span className="font-heading text-base font-semibold text-white/85 transition-colors group-hover:text-white sm:text-lg">
                          {c.value}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/** Freeboard ladder marks, top to bottom. Summer (S) is the limit the disc's line marks. */
const LADDER = [
  { label: "TF", y: 84 },
  { label: "F", y: 106 },
  { label: "T", y: 128 },
  { label: "S", y: 150 },
  { label: "W", y: 172 },
  { label: "WNA", y: 194 },
] as const;

function LoadLineMark({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      viewBox="0 0 300 250"
      role="img"
      aria-label="A ship's load line mark with the waterline resting above the summer limit"
      className="w-[248px] max-w-full sm:w-[300px]"
    >
      <defs>
        {/* The water has to leave the frame, not stop at it, so both the body and
            the surface line fade out at the edges. userSpaceOnUse because a
            <line> has a zero-height bounding box. */}
        <linearGradient id="dd-water-body" gradientUnits="userSpaceOnUse" x1="-20" y1="0" x2="320" y2="0">
          <stop offset="0" stopColor="#035ed3" stopOpacity="0" />
          <stop offset="0.18" stopColor="#035ed3" stopOpacity="0.22" />
          <stop offset="0.82" stopColor="#035ed3" stopOpacity="0.22" />
          <stop offset="1" stopColor="#035ed3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dd-water-line" gradientUnits="userSpaceOnUse" x1="-20" y1="0" x2="320" y2="0">
          <stop offset="0" stopColor="#4092fc" stopOpacity="0" />
          <stop offset="0.18" stopColor="#4092fc" stopOpacity="0.75" />
          <stop offset="0.82" stopColor="#4092fc" stopOpacity="0.75" />
          <stop offset="1" stopColor="#4092fc" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Deck line */}
      <line x1="45" y1="40" x2="155" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="4" />
      <text
        x="45"
        y="26"
        fill="rgba(255,255,255,0.32)"
        fontSize="9"
        letterSpacing="1.6"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        DECK LINE
      </text>

      {/* Load line disc, with the classification letters split either side */}
      <circle cx="100" cy="150" r="36" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" />
      <line x1="45" y1="150" x2="155" y2="150" stroke="var(--text-maroon)" strokeWidth="3.5" />
      <text
        x="36"
        y="144"
        textAnchor="end"
        fill="rgba(255,255,255,0.45)"
        fontSize="13"
        letterSpacing="1.5"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        AW
      </text>
      <text
        x="164"
        y="144"
        fill="rgba(255,255,255,0.45)"
        fontSize="13"
        letterSpacing="1.5"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        SO
      </text>

      {/* Freeboard ladder */}
      <line x1="200" y1="76" x2="200" y2="202" stroke="rgba(255,255,255,0.45)" strokeWidth="3.5" />
      {LADDER.map(({ label, y }) => (
        <g key={label}>
          <line
            x1="200"
            y1={y}
            x2="232"
            y2={y}
            stroke={label === "S" ? "var(--text-maroon)" : "rgba(255,255,255,0.4)"}
            strokeWidth="3"
          />
          <text
            x="240"
            y={y + 3.5}
            fill={label === "S" ? "var(--text-maroon)" : "rgba(255,255,255,0.4)"}
            fontSize="10"
            letterSpacing="1.2"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            {label}
          </text>
        </g>
      ))}

      {/* Water — drawn over the mark so everything below the surface reads as submerged.
          It rises and falls but never clears the summer line. */}
      <motion.g
        initial={{ y: 0 }}
        animate={reduceMotion ? { y: 6 } : { y: [0, 12, 0] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <rect x="-20" y="136" width="340" height="180" fill="url(#dd-water-body)" />
        <line x1="-20" y1="136" x2="320" y2="136" stroke="url(#dd-water-line)" strokeWidth="1.5" />
        <line x1="-20" y1="143" x2="320" y2="143" stroke="url(#dd-water-line)" strokeWidth="1" opacity="0.28" />
      </motion.g>
    </svg>
  );
}
