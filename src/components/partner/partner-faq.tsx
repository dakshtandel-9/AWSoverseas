import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Accordion, type QA } from "@/components/ui/accordion";

type Data = { title: string; items: QA[] };

/** Flat Q&A list — reuses the shared Accordion directly, no category grouping needed. */
export function PartnerFaq({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Questions" title={data.title} />
      <div className="mx-auto mt-12 max-w-3xl">
        <Accordion items={data.items} />
      </div>
    </Section>
  );
}
