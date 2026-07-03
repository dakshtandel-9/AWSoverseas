import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion, type QA } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; items: QA[] };

export function AppFaq({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Questions" title={data.title} />
      <Reveal direction="up" className="mx-auto mt-10 max-w-2xl">
        <Accordion items={data.items} />
      </Reveal>
    </Section>
  );
}
