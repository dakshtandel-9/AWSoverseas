"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Counter } from "@/components/ui/counter";

type Stat = { number: string; label: string };

const ease = [0.16, 1, 0.3, 1] as const;

export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-line bg-surface py-10 sm:py-12">
      <Container>
        <motion.dl
          className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 items-center justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-heading text-3xl font-extrabold text-brand-900 sm:text-4xl">
                <Counter value={s.number} />
              </dd>
              <p className="mt-1 text-sm font-medium text-muted">{s.label}</p>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
