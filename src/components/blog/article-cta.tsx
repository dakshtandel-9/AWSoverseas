import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

type Data = { title: string; description: string; primaryButton: string; secondaryButton: string };

export function ArticleCta({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#04162f] px-8 py-14 text-center sm:px-14 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(50% 60% at 50% -10%, rgba(15,173,232,0.22) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#ffffff" }}>
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60">
            {data.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/quote" size="lg" variant="secondary">
              {data.primaryButton} <ArrowRight className="size-4" />
            </Button>
            <Button href="/contact" size="lg" variant="white">
              {data.secondaryButton}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
