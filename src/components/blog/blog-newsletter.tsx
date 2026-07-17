"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Section } from "@/components/ui/section";
import { NewsletterForm } from "@/components/forms/newsletter-form";

type Data = {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  privacyText?: string;
};

export function BlogNewsletter({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] bg-[#000c1a] px-8 py-14 text-center sm:px-14 sm:py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(50% 60% at 50% -10%, rgba(172,32,56,0.22) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-lg">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <Mail className="size-6 text-[#e05c72]" />
          </span>
          <h2 className="mt-6 text-3xl font-bold sm:text-4xl" style={{ color: "#ffffff" }}>
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60">
            {data.description}
          </p>
          <div className="mx-auto mt-8 flex justify-center">
            <NewsletterForm
              placeholder={data.placeholder}
              buttonText={data.buttonText}
              successText={data.successMessage}
              privacyText={data.privacyText}
            />
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
