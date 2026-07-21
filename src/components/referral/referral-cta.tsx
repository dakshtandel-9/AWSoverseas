import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

type Data = {
  title: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
};

export function ReferralCta({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#05203a] px-8 py-14 text-center shadow-[0_32px_96px_-24px_rgba(5,32,58,0.6)] sm:px-14 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage: "radial-gradient(circle, #e05c72 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
            aria-hidden
            style={{ background: "rgba(158, 73, 83,0.22)" }}
          />

          <div className="relative mx-auto max-w-xl">
            <h2
              className="text-balance text-3xl font-bold leading-[1.15] sm:text-4xl"
              style={{ color: "#ffffff" }}
            >
              {data.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60">{data.description}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/login?next=/profile/referrals" size="lg" variant="secondary">
                {data.primaryButton} <ArrowRight className="size-4" />
              </Button>
              <Button href="/contact" size="lg" variant="ghost" className="text-white hover:bg-white/10">
                {data.secondaryButton}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
