import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion, type QA } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; description: string };

export function FaqSection({
  data,
  items,
  eyebrow,
}: {
  data: Data;
  items: QA[];
  eyebrow: string;
}) {
  return (
    <Section tone="soft" spacing="lg">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow={eyebrow}
            title={data.title}
            subtitle={data.description}
            align="left"
          />
          <Link
            href="/faq"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900"
          >
            View all questions <ArrowRight className="size-4" />
          </Link>
        </div>
        <Reveal direction="left">
          <Accordion items={items.slice(0, 6)} />
        </Reveal>
      </div>
    </Section>
  );
}
