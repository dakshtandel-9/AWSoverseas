"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion, type QA } from "@/components/ui/accordion";
import { cn } from "@/lib/cn";

type CategoryItem = { title: string };
type Categories = { title: string; description: string; items: CategoryItem[] };
type AccordionData = { title: string; items: QA[] };

/**
 * Signature element: category chips filter the shared accordion in place.
 * "All" is derived (not in the JSON) since categories.items has no such
 * entry but the accordion should default to showing everything.
 */
export function FaqBrowser({
  categories,
  accordion,
}: {
  categories: Categories;
  accordion: AccordionData;
}) {
  const [active, setActive] = useState("All");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of accordion.items) {
      const category = item.category ?? "General";
      map.set(category, (map.get(category) ?? 0) + 1);
    }
    return map;
  }, [accordion.items]);

  const filtered = useMemo(
    () => (active === "All" ? accordion.items : accordion.items.filter((i) => i.category === active)),
    [accordion.items, active],
  );

  return (
    <Section spacing="lg">
      <SectionHeading eyebrow={categories.title} title={accordion.title} subtitle={categories.description} />

      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={() => setActive("All")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
            active === "All"
              ? "bg-[#01214a] text-white"
              : "bg-[#eef3fb] text-[#01214a] hover:bg-[#dce7f7]",
          )}
        >
          All Topics
        </button>
        {categories.items.map((cat) => (
          <button
            key={cat.title}
            type="button"
            onClick={() => setActive(cat.title)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
              active === cat.title
                ? "bg-[#01214a] text-white"
                : "bg-[#eef3fb] text-[#01214a] hover:bg-[#dce7f7]",
            )}
          >
            {cat.title}
            <span
              className={cn(
                "font-mono text-[11px]",
                active === cat.title ? "text-white/60" : "text-[#8e1b2e]/60",
              )}
            >
              {counts.get(cat.title) ?? 0}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-10 max-w-3xl"
      >
        {filtered.length > 0 ? (
          <Accordion items={filtered} key={active} />
        ) : (
          <p className="py-12 text-center text-sm text-[#5b6b82]">
            No questions in this category yet.
          </p>
        )}
      </motion.div>
    </Section>
  );
}
