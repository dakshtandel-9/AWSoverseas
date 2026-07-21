import { PackageSearch } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { TrackingInput } from "@/components/forms/tracking-input";

type Data = { title: string; description: string; placeholder: string; button: string };

export function TrackingPreview({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#CFE8FF] px-6 py-14 text-ink shadow-lift sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" aria-hidden />
          <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-accent-400/25 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-ink/8 ring-1 ring-ink/15">
              <PackageSearch className="size-8 text-maroon-admin" />
            </span>
            <h2 className="mt-6 text-3xl font-bold text-balance sm:text-4xl" style={{ color: "#002144" }}>{data.title}</h2>
            <p className="mt-4 text-ink/70 text-pretty">{data.description}</p>
            <div className="mx-auto mt-8 max-w-xl">
              <TrackingInput tone="light" placeholder={data.placeholder} buttonText={data.button} />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
