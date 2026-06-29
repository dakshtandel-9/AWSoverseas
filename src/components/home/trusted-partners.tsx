"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { iconFor } from "@/lib/icons";

type Data = { title: string; description: string };

const INDUSTRY_BLURBS: Record<string, string> = {
  Manufacturing:     "Heavy cargo, raw materials & industrial equipment handled globally.",
  "Import & Export": "End-to-end cross-border trade with customs compliance covered.",
  eCommerce:         "Fast last-mile delivery and fulfilment for online sellers worldwide.",
  Retail:            "Stock replenishment and seasonal inventory moved on schedule.",
  Automotive:        "OEM parts, assemblies and finished vehicles shipped securely.",
  Pharmaceutical:    "Temperature-controlled, compliant handling for sensitive cargo.",
  Electronics:       "Anti-static, insured logistics for high-value electronic goods.",
  Textile:           "Fabric, garments and accessories from factory to shelf.",
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function TrustedPartners({
  data,
  partners,
}: {
  data: Data;
  partners: string[];
}) {
  return (
    <section className="border-b border-[#e4e9f2] bg-[#f6f8fc] py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b6b82]">
            Industries We Serve
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {data.description}
          </p>
        </div>

        {/* Card grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {partners.map((name) => {
            const Icon = iconFor(name);
            const blurb = INDUSTRY_BLURBS[name] ?? "Reliable logistics solutions tailored to your sector.";
            return (
              <motion.div key={name} variants={item}>
                <Link
                  href="/industries"
                  className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.10)] ring-1 ring-[#e4e9f2] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(4,22,47,0.06),0_30px_60px_-20px_rgba(4,22,47,0.22)] hover:ring-[#0fade8]/30"
                >
                  {/* Subtle accent line on hover */}
                  <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#033e8d] to-[#0fade8] transition-transform duration-300 ease-out group-hover:scale-x-100" />

                  {/* Icon */}
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-700 group-hover:text-white">
                    <Icon className="size-5" />
                  </span>

                  {/* Text */}
                  <div className="flex flex-1 flex-col gap-1.5">
                    <span className="font-heading text-[15px] font-bold text-ink">
                      {name}
                    </span>
                    <span className="text-[13px] leading-snug text-muted">
                      {blurb}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="size-4 self-end text-brand-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-700" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer link */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            Explore all industries <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
