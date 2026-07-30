"use client";

import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; description: string };

/** Narrative block — same register as About's Story, no numbered markers. */
export function WhyWeGiveBack({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <Reveal direction="up">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
            The Commitment
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#1A0A53] sm:text-4xl lg:text-[2.5rem]">
            {data.title}
          </h2>
          <p className="mt-6 text-base leading-[1.85] text-[#5b6b82]">{data.description}</p>
        </div>
      </Reveal>
    </Section>
  );
}
