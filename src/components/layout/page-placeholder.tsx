import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Temporary placeholder for routes not yet built in this pass. Uses the page's
 * own JSON hero copy so even the stub is content-driven, never hardcoded.
 */
export function PagePlaceholder({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Section spacing="lg" className="pt-36">
      <div className="mx-auto max-w-2xl text-center">
        {badge && (
          <div className="flex justify-center">
            <Badge>{badge}</Badge>
          </div>
        )}
        <h1 className="mt-6 text-4xl font-extrabold text-balance sm:text-5xl">
          <span className="text-gradient">{title}</span>
        </h1>
        {subtitle && <p className="mt-5 text-lg text-muted text-pretty">{subtitle}</p>}
        <p className="mt-8 inline-block rounded-full bg-surface-soft px-4 py-2 text-sm font-medium text-muted ring-1 ring-line">
          This page is being crafted in the next build pass.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Back to Home</Button>
          <Button href="/quote" variant="outline">
            Request a Quote
          </Button>
        </div>
      </div>
    </Section>
  );
}
