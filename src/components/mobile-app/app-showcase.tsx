"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Radar,
  PackagePlus,
  CloudUpload,
  Wallet,
  BellRing,
  Gift,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type Feature = { key: string; icon: LucideIcon; title: string; description: string; items: string[] };

/**
 * Signature interaction for this page: one phone, six tabs. Selecting a tab
 * swaps the phone's on-screen content and its feature checklist — the most
 * characteristic thing an app can do (unlike a static screenshot grid, which
 * is the templated answer and also has no real image assets to back it).
 */
export function AppShowcase({
  tracking,
  booking,
  documents,
  payments,
  notifications,
  referrals,
}: {
  tracking: { title: string; description: string; features: string[] };
  booking: { title: string; description: string; features: string[] };
  documents: { title: string; description: string; features: string[] };
  payments: { title: string; description: string; methods: string[]; features: string[] };
  notifications: { title: string; description: string; items: string[] };
  referrals: { title: string; description: string; benefits: string[] };
}) {
  const features: Feature[] = [
    { key: "tracking", icon: Radar, title: tracking.title, description: tracking.description, items: tracking.features },
    { key: "booking", icon: PackagePlus, title: booking.title, description: booking.description, items: booking.features },
    { key: "documents", icon: CloudUpload, title: documents.title, description: documents.description, items: documents.features },
    { key: "payments", icon: Wallet, title: payments.title, description: payments.description, items: [...payments.methods, ...payments.features] },
    { key: "notifications", icon: BellRing, title: notifications.title, description: notifications.description, items: notifications.items },
    { key: "referrals", icon: Gift, title: referrals.title, description: referrals.description, items: referrals.benefits },
  ];

  const [active, setActive] = useState(0);
  const current = features[active];

  return (
    <Section spacing="lg">
      <SectionHeading
        eyebrow="Inside the App"
        title="Everything You Need, One Tap Away"
        subtitle="Select a feature to see it come alive on the screen."
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:items-center">
        {/* Phone screen — swaps content per active feature */}
        <div className="relative mx-auto flex justify-center lg:order-2">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
            aria-hidden
            style={{ background: "rgba(171, 31, 61,0.16)" }}
          />
          <div className="relative aspect-[9/19] w-[260px] rounded-[2.6rem] bg-[#CFE8FF] p-2.5 shadow-[0_30px_60px_-20px_rgba(4,22,47,0.25)] ring-1 ring-ink/10">
            <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black/60" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-gradient-to-b from-[#f6f8fc] to-white">
              <div className="bg-[#CFE8FF] px-5 pb-5 pt-9 text-ink">
                <p className="text-[11px] text-ink/70">AWS Overseas</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={current.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-1 font-heading text-base font-bold"
                  >
                    {current.title}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="px-5 py-5">
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={current.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-2.5"
                  >
                    {current.items.slice(0, 5).map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 rounded-xl bg-[#f6f8fc] px-3.5 py-2.5 text-[11px] font-semibold text-[#002144] ring-1 ring-[#e4e9f2]"
                      >
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#fceef1] text-[#8d1a32]">
                          <Check className="size-3" />
                        </span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#002144] py-2.5 text-center text-xs font-semibold text-white">
                Open in App
              </div>
            </div>
          </div>
        </div>

        {/* Feature tab list */}
        <div className="flex flex-col gap-2 lg:order-1">
          {features.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                  isActive
                    ? "border-[#d6274c]/40 bg-[#eef3fb] shadow-[0_4px_16px_-6px_rgba(3,62,141,0.2)]"
                    : "border-[#e4e9f2] bg-white hover:border-[#c8d5e8] hover:bg-[#f6f8fc]",
                )}
              >
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                    isActive ? "bg-[#002144] text-white" : "bg-[#eef3fb] text-[#002144]",
                  )}
                >
                  <f.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "text-base font-bold transition-colors",
                      isActive ? "text-[#002144]" : "text-[#002144]",
                    )}
                  >
                    {f.title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-[#5b6b82]">{f.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
