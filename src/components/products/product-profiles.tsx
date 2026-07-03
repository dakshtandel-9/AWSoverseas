"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PRODUCT_ICONS } from "@/lib/icons";
import { Boxes } from "lucide-react";
import { cn } from "@/lib/cn";

type Profile = { title: string; description: string; services: string[]; icon?: string };

/**
 * All 11 commodities rendered as an expandable dossier list — same device as
 * Industries' profile accordion — since every product on this schedule has
 * a real description + handling-services block (no honest-gap split needed
 * here, unlike Industries' 5-of-8).
 */
export function ProductProfiles({ profiles }: { profiles: Profile[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section spacing="lg">
      <SectionHeading
        eyebrow="Commodity Profiles"
        title="How We Handle Each Commodity"
        subtitle="Open a profile to see the specific packing, documentation, and handling we run for that product."
        align="left"
      />

      <div className="mt-12 divide-y divide-[#e4e9f2] overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white">
        {profiles.map((p, i) => {
          const isOpen = open === i;
          const Icon = PRODUCT_ICONS[p.icon ?? ""] ?? Boxes;
          return (
            <div key={p.title}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-5 px-6 py-6 text-left transition-colors hover:bg-[#f6f8fc] sm:px-8"
              >
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                    isOpen ? "bg-[#033e8d] text-white" : "bg-[#eef3fb] text-[#033e8d]",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94a3b8]">
                    Commodity {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-0.5 text-lg font-bold text-[#06234d]">{p.title}</h3>
                </div>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full bg-[#eef3fb] text-[#033e8d] transition-transform duration-300",
                    isOpen && "rotate-45 bg-[#033e8d] text-white",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-8 px-6 pb-8 sm:grid-cols-[1.1fr_1fr] sm:px-8 sm:pl-[4.75rem]">
                      <p className="text-[15px] leading-relaxed text-[#5b6b82]">
                        {p.description}
                      </p>
                      <ul className="grid gap-2.5 sm:grid-cols-1">
                        {p.services.map((s) => (
                          <li key={s} className="flex items-center gap-2.5 text-sm text-[#2a3a52]">
                            <Check className="size-4 shrink-0 text-[#0fade8]" />
                            <span className="font-medium">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
