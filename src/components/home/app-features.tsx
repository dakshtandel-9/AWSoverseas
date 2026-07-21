import { Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import { StoreButtons } from "@/components/ui/store-buttons";

type Data = {
  title: string;
  description: string;
  features: string[];
  playStoreButton: string;
  appStoreButton: string;
};

export function AppFeatures({ data, eyebrow }: { data: Data; eyebrow: string }) {
  return (
    <Section tone="ink" spacing="lg" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-50" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" aria-hidden />
      <div className="relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal direction="up">
            <Badge tone="light">{eyebrow}</Badge>
          </Reveal>
          <Reveal direction="up" delay={0.05}>
            <h2 className="mt-5 text-3xl font-bold text-balance sm:text-4xl" style={{ color: "#002144" }}>
              {data.title}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-ink/75 text-pretty">
              {data.description}
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.15}>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-ink/90">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-500/20 text-accent-300">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <StoreButtons
              className="mt-9"
              playLabel={data.playStoreButton}
              appLabel={data.appStoreButton}
            />
          </Reveal>
        </div>

        <Reveal direction="left" className="relative">
          <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/25 blur-3xl" />
          <div className="relative animate-float">
            <PhoneMockup />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
