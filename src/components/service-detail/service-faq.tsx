import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion } from "@/components/ui/accordion";

type Item = { question: string; answer: string };
type Data = { title: string; items: Item[] };

export function ServiceFaq({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title={data.title} />
        <Accordion items={data.items} className="mt-10" />
      </div>
    </Section>
  );
}
