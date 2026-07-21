"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; description: string };

/**
 * Company story. The narrative genuinely describes a progression (a buyer's
 * order moves from sourcing to verification to delivery), so a light typed
 * rail of stages is honest here — order carries meaning. Every other section
 * on the page deliberately avoids numbered markers because those lists are
 * not sequences.
 */
const STAGES = [
  {
    marker: "Sourcing",
    title: "The right manufacturer, found",
    body: "We match your requirement against a supplier network built on real factory relationships across India's manufacturing hubs — not a directory listing.",
  },
  {
    marker: "Verification",
    title: "Quality confirmed before it ships",
    body: "Every order is inspected against agreed standards at the source, with export documentation prepared correctly the first time.",
  },
  {
    marker: "Delivery",
    title: "A partnership, not a transaction",
    body: "From a first sourcing enquiry to recurring export orders, buyers work with the same team — and the same trusted suppliers — every time.",
  },
];

export function Story({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Left — heading + narrative, sticky */}
        <Reveal direction="up">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
              Our Story
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#002144] sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {data.title}
            </h2>
            <p className="mt-6 text-base leading-[1.85] text-[#5b6b82]">
              {data.description}
            </p>
          </div>
        </Reveal>

        {/* Right — typed stage rail */}
        <ol className="relative flex flex-col">
          <div
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-[#dfe6f1]"
            aria-hidden
          />
          <motion.div
            className="absolute left-[7px] top-2 w-px origin-top bg-gradient-to-b from-[#002144] to-[#9e4953]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: "calc(100% - 1rem)" }}
            aria-hidden
          />

          {STAGES.map((s, i) => (
            <motion.li
              key={s.marker}
              className="relative flex gap-7 pb-12 pl-0 last:pb-0"
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-white bg-[#002144] shadow-[0_0_0_4px_#eef3fb]"
                style={i === STAGES.length - 1 ? { background: "#9e4953" } : undefined}
                aria-hidden
              />
              <div className="min-w-0">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#861b28]">
                  {s.marker}
                </span>
                <h3 className="mt-1.5 text-lg font-bold text-[#002144]">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#5b6b82]">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
