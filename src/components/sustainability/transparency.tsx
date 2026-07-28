"use client";

import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; description: string };

const MOSS = "#2F6B4F";

/** Quiet closing note — sets up the CTA's partnership invite honestly. */
export function Transparency({ data }: { data: Data }) {
  return (
    <Section spacing="md">
      <Reveal direction="up">
        <div
          className="mx-auto max-w-2xl rounded-2xl border-l-4 bg-[#f6f8fc] px-7 py-8 text-center sm:px-10"
          style={{ borderColor: MOSS }}
        >
          <h3 className="text-lg font-bold text-[#002144] sm:text-xl">{data.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5b6b82]">{data.description}</p>
        </div>
      </Reveal>
    </Section>
  );
}
