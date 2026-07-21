"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Step = { step: string; title: string; description: string };
type Data = { title: string; steps: Step[] };

export function HowItWorks({ data }: { data: Data; eyebrow?: string }) {
  // Mark the step whose title contains "transit" or "Transit" as active
  const ACTIVE_STEP = data.steps.findIndex((s) =>
    s.title.toLowerCase().includes("transit"),
  );
  const activeIdx = ACTIVE_STEP >= 0 ? ACTIVE_STEP : 2;

  return (
    <Section tone="soft" spacing="lg">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Left — heading, sticky */}
        <Reveal direction="up">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b6b82]">Process</p>
            <h2 className="mt-3 text-3xl font-bold text-[#002144] sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {data.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5b6b82]">
              {data.steps[0]?.description && data.steps[data.steps.length - 1]?.description
                ? `From ${data.steps[0].title.toLowerCase()} to ${data.steps[data.steps.length - 1].title.toLowerCase()} — every step is tracked, documented, and communicated.`
                : "Every step is tracked, documented, and communicated."}
            </p>

            {/* Mini legend */}
            <div className="mt-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-[#5b6b82]">
                <CheckCircle2 className="size-4 text-maroon-admin" />
                Completed
              </div>
              <div className="flex items-center gap-3 text-sm text-[#d97706]">
                <span className="size-4 rounded-full bg-[#f59e0b]" />
                In progress
              </div>
              <div className="flex items-center gap-3 text-sm text-[#5b6b82]">
                <span className="size-4 rounded-full border-2 border-[#c8d5e8]" />
                Upcoming
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right — vertical timeline */}
        <ol className="relative flex flex-col">
          {/* Vertical connector line */}
          <div className="absolute left-[22px] top-0 h-full w-0.5 bg-[#e4e9f2]" aria-hidden />
          {/* Filled line — up to and including the active step */}
          <motion.div
            className="absolute left-[22px] top-0 w-0.5 origin-top bg-gradient-to-b from-[#9e4953] to-[#f59e0b]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: `${(activeIdx / (data.steps.length - 1)) * 100}%` }}
          />

          {data.steps.map((s, i) => {
            const isDone = i < activeIdx;
            const isActive = i === activeIdx;
            return (
              <motion.li
                key={s.step}
                className="relative flex gap-8 pb-12 last:pb-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Node */}
                <div className="relative z-10 mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="size-[46px] rounded-full bg-white text-maroon-admin shadow-[0_0_0_4px_#f6f8fc]" />
                  ) : isActive ? (
                    <div className="relative">
                      <motion.span
                        className="absolute inset-0 rounded-full bg-[#f59e0b]"
                        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                      <span className="relative flex size-[46px] items-center justify-center rounded-full bg-[#f59e0b] font-heading text-sm font-extrabold text-white shadow-[0_0_0_4px_#f6f8fc]">
                        {s.step}
                      </span>
                    </div>
                  ) : (
                    <span className="flex size-[46px] items-center justify-center rounded-full border-2 border-[#e4e9f2] bg-white font-heading text-sm font-bold text-[#5b6b82] shadow-[0_0_0_4px_#f6f8fc]">
                      {s.step}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  {isActive && (
                    <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fffbeb] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#d97706]">
                      <span className="size-1.5 animate-pulse rounded-full bg-[#f59e0b]" />
                      Active
                    </span>
                  )}
                  <h3
                    className="text-lg font-bold"
                    style={{ color: isActive ? "#d97706" : isDone ? "#002144" : "#2a3a52" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">{s.description}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
