"use client";

import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; description: string };

export function Overview({ data }: { data: Data }) {
  return (
    <Section spacing="md">
      <Reveal direction="up">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
            Commodity Coverage
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#06234d] sm:text-4xl lg:text-[2.5rem]">
            {data.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#5b6b82]">
            {data.description}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
